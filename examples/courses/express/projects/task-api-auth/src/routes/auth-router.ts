import { Router } from 'express';

import * as authController from '#controllers/auth-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';
import { requireJson } from '#middlewares/require-json.ts';
import { validate } from '#middlewares/validate.ts';
import { signinSchema, signupSchema } from '#schemas/auth.ts';

const router = Router();

// #region routes
// As duas primeiras sao publicas por definicao: quem ainda nao tem token
// precisa de alguma porta de entrada.
router.post('/signup', requireJson, validate(signupSchema), authController.signup);
router.post('/signin', requireJson, validate(signinSchema), authController.signin);

router.get('/me', authenticate, authController.me);
// #endregion

export default router;
