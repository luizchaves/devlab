import { Router } from 'express';

import PingController from '@/controllers/pings.controller.ts';
import { validate } from '@/middlewares/validate.ts';
import { readPingsSchema } from '@/schemas/ping.schema.ts';

const router = Router();

router.get('/hosts/:id/pings', validate(readPingsSchema), PingController.readByHost);

export default router;
