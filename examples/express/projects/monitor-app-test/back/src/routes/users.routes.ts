import { Router } from 'express';

import UserController from '@/controllers/users.controller.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { validate } from '@/middlewares/validate.ts';
import { createUserSchema } from '@/schemas/user.schema.ts';

const router = Router();

// Rota publica: quem se cadastra ainda nao tem conta para se autenticar.
router.post('/users', requireJson, validate(createUserSchema), UserController.create);

export default router;
