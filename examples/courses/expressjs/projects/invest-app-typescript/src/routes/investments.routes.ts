import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import InvestmentController from '@/controllers/investments.controller.ts';

const router = Router();

router.post('/investments', requireJson, InvestmentController.create);
router.get('/investments', InvestmentController.read);
router.get('/investments/:id', InvestmentController.readById);
router.put('/investments/:id', requireJson, InvestmentController.update);
router.delete('/investments/:id', InvestmentController.remove);

export default router;
