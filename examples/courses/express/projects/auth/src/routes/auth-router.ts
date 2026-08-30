import { Router } from 'express';

import * as authController from '#controllers/auth-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/me', authenticate, authController.me);

export default router;
