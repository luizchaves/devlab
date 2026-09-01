import prisma from '@/database/database.ts';
import type { Investment, InvestmentInput } from '@/types/Investment.d.ts';

/**
 * Substitui o JOIN escrito a mao da etapa anterior: pede ao Prisma que traga
 * `category` e `broker` resolvidos na mesma ida ao banco.
 */
const include = {
  category: true,
  broker: true,
};

async function create({
  name,
  value,
  interest,
  createdAt,
  categoryId,
  broker,
}: InvestmentInput): Promise<Investment> {
  if (!name || !value || !interest || !categoryId || !broker) {
    throw new Error('Unable to create investment');
  }

  return (await prisma.investment.create({
    data: {
      name,
      value,
      interest,
      ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
      category: { connect: { id: categoryId } },
      // A corretora e ligada pelo nome: existe, conecta; nao existe, cria.
      broker: { connectOrCreate: { where: { name: broker }, create: { name: broker } } },
    },
    include,
  })) as Investment;
}

async function read(where?: { name?: string }): Promise<Investment[]> {
  const filters = where?.name ? { name: { contains: where.name } } : {};

  return (await prisma.investment.findMany({ where: filters, include })) as Investment[];
}

async function readById(id: string): Promise<Investment> {
  const investment = await prisma.investment.findUnique({ where: { id }, include });

  if (!investment) {
    throw new Error('Investment not found');
  }

  return investment as Investment;
}

async function update({
  id,
  name,
  value,
  interest,
  createdAt,
  categoryId,
  broker,
}: InvestmentInput & { id?: string }): Promise<Investment> {
  if (!id || !name || !value || !interest || !categoryId || !broker) {
    throw new Error('Unable to update investment');
  }

  await readById(id);

  return (await prisma.investment.update({
    where: { id },
    data: {
      name,
      value,
      interest,
      ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
      category: { connect: { id: categoryId } },
      broker: { connectOrCreate: { where: { name: broker }, create: { name: broker } } },
    },
    include,
  })) as Investment;
}

async function remove(id: string): Promise<boolean> {
  await readById(id);

  await prisma.investment.delete({ where: { id } });

  return true;
}

export default { create, read, readById, update, remove };
