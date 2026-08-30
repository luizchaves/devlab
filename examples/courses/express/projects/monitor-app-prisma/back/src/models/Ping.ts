import prisma from '@/database/database.ts';
import type { Ping } from '@/types/Ping.d.ts';

/** Historico de medicoes de um host, da mais recente para a mais antiga. */
async function readByHost(hostId: string, limit = 50): Promise<Ping[]> {
  return await prisma.ping.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export default { readByHost };
