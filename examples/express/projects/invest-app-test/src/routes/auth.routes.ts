import { Router } from 'express';

import AuthController from '@/controllers/auth.controller.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { validate } from '@/middlewares/validate.ts';
import { signinSchema } from '@/schemas/auth.schema.ts';

const router = Router();

router.post('/signin', requireJson, validate(signinSchema), AuthController.signin);

export default router;
