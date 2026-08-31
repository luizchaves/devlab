import { Router } from 'express';

import * as authController from '#controllers/auth-controller.ts';
import * as avatarController from '#controllers/avatar-controller.ts';
import { upload } from '#config/upload.ts';
import { authenticate } from '#middlewares/authenticate.ts';
import { rateLimit } from '#middlewares/rate-limit.ts';
import { requireJson } from '#middlewares/require-json.ts';
import { validate } from '#middlewares/validate.ts';
import { signinSchema, signupSchema } from '#schemas/auth.ts';

const router = Router();

// #region routes
// As duas primeiras sao publicas por definicao: quem ainda nao tem token
// precisa de alguma porta de entrada.
router.post('/signup', requireJson, validate(signupSchema), authController.signup);

// #region strict-limit
// O login e a rota de forca bruta por excelencia: cinco tentativas por minuto,
// contra as cem do teto global.
router.post(
  '/signin',
  rateLimit('signin', 5, 60_000),
  requireJson,
  validate(signinSchema),
  authController.signin
);
// #endregion

router.get('/me', authenticate, authController.me);

// Publica: quem clica no link do e-mail ainda nao tem token.
router.get('/verify', authController.verify);

// #region avatar
// `upload.single` recebe o campo do formulario multipart e grava o arquivo
// antes de o controller rodar.
router.post('/me/avatar', authenticate, upload.single('avatar'), avatarController.store);
// #endregion
// #endregion

export default router;
