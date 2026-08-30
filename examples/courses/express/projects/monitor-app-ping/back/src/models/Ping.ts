import prisma from '@/database/database.ts';
import { ping } from '@/lib/ping.ts';
import type { Ping } from '@/types/Ping.d.ts';

/** Historico de medicoes de um host, da mais recente para a mais antiga. */
async function readByHost(hostId: string, limit = 50): Promise<Ping[]> {
  return await prisma.ping.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Mede o host e grava o resultado. A medicao com falha tambem e gravada:
 * e a ausencia de resposta que descreve a indisponibilidade.
 */
async function check(hostId: string): Promise<Ping> {
  const host = await prisma.host.findUnique({ where: { id: hostId } });

  if (!host) {
    throw new Error('Host not found');
  }

  const { success, latency } = await ping(host.address);

  return await prisma.ping.create({ data: { hostId, success, latency } });
}

export default { readByHost, check };
