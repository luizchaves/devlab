import prisma from '@/database/database.ts';
import type { Broker } from '@/types/Broker.d.ts';

async function read(where?: { name?: string }): Promise<Broker[]> {
  const filters = where?.name ? { name: { contains: where.name } } : {};

  return await prisma.broker.findMany({ where: filters });
}

async function readById(id: string): Promise<Broker> {
  const broker = await prisma.broker.findUnique({ where: { id } });

  if (!broker) {
    throw new Error('Broker not found');
  }

  return broker;
}

export default { read, readById };
