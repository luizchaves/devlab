import { Router } from 'express';

import PingController from '@/controllers/pings.controller.ts';
import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';
import { validate } from '@/middlewares/validate.ts';
import { readPingsSchema } from '@/schemas/ping.schema.ts';

const router = Router();

router.get(
  '/hosts/:id/pings',
  isAuthenticated,
  validate(readPingsSchema),
  PingController.readByHost
);
router.post('/hosts/:id/pings', isAuthenticated, validate(readPingsSchema), PingController.check);

export default router;
