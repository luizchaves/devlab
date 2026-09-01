import { Router } from 'express';

import { prisma } from '#database/prisma.ts';

const router = Router();

const startedAt = Date.now();

// #region health
/**
 * Liveness: o processo esta de pe?
 *
 * Nao consulta o banco de proposito. Se o orquestrador chama isto a cada
 * segundo, uma consulta aqui vira carga constante — e, pior, uma queda do banco
 * derrubaria o processo que ainda estava saudavel.
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: (Date.now() - startedAt) / 1000 });
});
// #endregion

// #region ready
/**
 * Readiness: o servico consegue atender agora?
 *
 * Aqui a dependencia e checada — sem banco nao ha resposta util, e o
 * orquestrador deve tirar esta instancia do balanceador ate ela voltar.
 */
router.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({ status: 'ready', database: 'up' });
  } catch {
    res.status(503).json({ status: 'not-ready', database: 'down' });
  }
});
// #endregion

export default router;
