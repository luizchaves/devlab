import { Router } from 'express';

import InvestmentController from '@/controllers/investments.controller.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { validate } from '@/middlewares/validate.ts';
import {
  createInvestmentSchema,
  readInvestmentByIdSchema,
  readInvestmentsSchema,
  removeInvestmentSchema,
  updateInvestmentSchema,
} from '@/schemas/investment.schema.ts';

const router = Router();

router.post(
  '/investments',
  requireJson,
  validate(createInvestmentSchema),
  InvestmentController.create,
);
router.get('/investments', validate(readInvestmentsSchema), InvestmentController.read);
router.get('/investments/:id', validate(readInvestmentByIdSchema), InvestmentController.readById);
router.put(
  '/investments/:id',
  requireJson,
  validate(updateInvestmentSchema),
  InvestmentController.update,
);
router.delete('/investments/:id', validate(removeInvestmentSchema), InvestmentController.remove);

export default router;
