import { Router } from 'express';

import * as investmentController from '#controllers/investment-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';
import { requireInvestmentOwner } from '#middlewares/authorize.ts';

const router = Router();

// Um `use` no topo protege todas as rotas abaixo — nao ha como esquecer uma.
router.use(authenticate);

router.get('/', investmentController.index);
router.post('/', investmentController.store);
router.delete('/:id', requireInvestmentOwner, investmentController.destroy);

export default router;
