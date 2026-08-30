import prisma from '@/database/database.ts';
import type { Host, HostInput } from '@/types/Host.d.ts';

/**
 * Substitui o JOIN escrito a mao da etapa 6: pede ao Prisma que traga as tags
 * e as ultimas medicoes resolvidas na mesma ida ao banco.
 */
const include = {
  tags: true,
  pings: { orderBy: { createdAt: 'desc' }, take: 10 },
} as const;

/** Tag existente e conectada; tag nova nasce com uma cor neutra. */
function connectTags(tags: string[] = []) {
  return {
    connectOrCreate: tags.map((name) => ({
      where: { name },
      create: { name, color: '#64748b' },
    })),
  };
}

async function create({ name, address, tags, userId }: HostInput): Promise<Host> {
  if (!name || !address || !userId) {
    throw new Error('Unable to create host');
  }

  return (await prisma.host.create({
    data: { name, address, userId, tags: connectTags(tags) },
    include,
  })) as Host;
}

/**
 * `userId` nao e um filtro opcional: ele entra em toda consulta. E por isso
 * que um host de outra conta simplesmente nao existe para quem pergunta.
 */
async function read(where: { userId: string; name?: string; tag?: string }): Promise<Host[]> {
  const filters = {
    userId: where.userId,
    ...(where.name ? { name: { contains: where.name } } : {}),
    // O filtro por tag atravessa a tabela de juncao sem uma linha de SQL.
    ...(where.tag ? { tags: { some: { name: where.tag } } } : {}),
  };

  return (await prisma.host.findMany({ where: filters, include })) as Host[];
}

async function readById(id: string, userId: string): Promise<Host> {
  // `findFirst`, e nao `findUnique`: a chave da busca passa a ser o par id + dono.
  const host = await prisma.host.findFirst({ where: { id, userId }, include });

  if (!host) {
    throw new Error('Host not found');
  }

  return host as Host;
}

async function update({
  id,
  userId,
  name,
  address,
  tags,
}: HostInput & { id?: string }): Promise<Host> {
  if (!id || !userId || !name || !address) {
    throw new Error('Unable to update host');
  }

  await readById(id, userId);

  return (await prisma.host.update({
    where: { id },
    // `set: []` desfaz os vinculos antigos antes de gravar a nova lista.
    data: { name, address, tags: { set: [], ...connectTags(tags) } },
    include,
  })) as Host;
}

async function remove(id: string, userId: string): Promise<boolean> {
  await readById(id, userId);

  // `onDelete: Cascade` no schema apaga o historico de pings junto.
  await prisma.host.delete({ where: { id } });

  return true;
}

export default { create, read, readById, update, remove };
