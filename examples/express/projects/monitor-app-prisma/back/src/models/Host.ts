import prisma from '@/database/database.ts';
import type { Host, HostInput } from '@/types/Host.d.ts';

/**
 * Substitui o JOIN escrito a mao da etapa anterior: pede ao Prisma que traga
 * as tags e as ultimas medicoes resolvidas na mesma ida ao banco.
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

async function create({ name, address, tags }: HostInput): Promise<Host> {
  if (!name || !address) {
    throw new Error('Unable to create host');
  }

  return (await prisma.host.create({
    data: { name, address, tags: connectTags(tags) },
    include,
  })) as Host;
}

async function read(where?: { name?: string; tag?: string }): Promise<Host[]> {
  const filters = {
    ...(where?.name ? { name: { contains: where.name } } : {}),
    // O filtro por tag atravessa a tabela de juncao sem uma linha de SQL.
    ...(where?.tag ? { tags: { some: { name: where.tag } } } : {}),
  };

  return (await prisma.host.findMany({ where: filters, include })) as Host[];
}

async function readById(id: string): Promise<Host> {
  const host = await prisma.host.findUnique({ where: { id }, include });

  if (!host) {
    throw new Error('Host not found');
  }

  return host as Host;
}

async function update({ id, name, address, tags }: HostInput & { id?: string }): Promise<Host> {
  if (!id || !name || !address) {
    throw new Error('Unable to update host');
  }

  await readById(id);

  return (await prisma.host.update({
    where: { id },
    // `set: []` desfaz os vinculos antigos antes de gravar a nova lista.
    data: { name, address, tags: { set: [], ...connectTags(tags) } },
    include,
  })) as Host;
}

async function remove(id: string): Promise<boolean> {
  await readById(id);

  // `onDelete: Cascade` no schema apaga o historico de pings junto.
  await prisma.host.delete({ where: { id } });

  return true;
}

export default { create, read, readById, update, remove };
