import { Router } from 'express';

import BrokerController from '@/controllers/brokers.controller.ts';
import { validate } from '@/middlewares/validate.ts';
import { readBrokerByIdSchema, readBrokersSchema } from '@/schemas/broker.schema.ts';

const router = Router();

router.get('/brokers', validate(readBrokersSchema), BrokerController.read);
router.get('/brokers/:id', validate(readBrokerByIdSchema), BrokerController.readById);

export default router;
