import { Router } from 'express';

import * as pingController from '#controllers/ping-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';
import { rateLimit } from '#middlewares/rate-limit.ts';
import { validate } from '#middlewares/validate.ts';
import { pingSchema } from '#schemas/ping.ts';

const router = Router();

// #region routes
/**
 * Uma rota que dispara um processo do sistema e cara e abusavel: ela ganha
 * autenticacao, validacao estrita do host e um limite proprio.
 */
router.get(
  '/ping',
  authenticate,
  rateLimit('ping', 10, 60_000),
  validate(pingSchema),
  pingController.show
);
// #endregion

export default router;
