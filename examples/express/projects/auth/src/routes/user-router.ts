import { Router } from 'express';

import * as userController from '#controllers/user-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';
import { requireRole } from '#middlewares/authorize.ts';

const router = Router();

router.get('/', authenticate, requireRole('admin'), userController.index);

export default router;
