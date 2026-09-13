import { prisma } from './prisma';

// #region find-or-create
/**
 * A corretora nasce quando um ativo a cita pela primeira vez (CA03.7). O
 * upsert sobre (userId, name) evita duas linhas para "XP" e "XP " na mesma
 * conta: o nome é normalizado antes.
 */
export async function findOrCreateBroker(userId: string, name: string) {
  const normalized = name.trim();
  if (!normalized) return null;

  return prisma.broker.upsert({
    where: { userId_name: { userId, name: normalized } },
    update: {},
    create: { userId, name: normalized },
    select: { id: true, name: true },
  });
}

export function listBrokers(userId: string) {
  return prisma.broker.findMany({ where: { userId }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
}
// #endregion
