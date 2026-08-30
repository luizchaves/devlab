import { Router } from 'express';

import UserController from '@/controllers/users.controller.ts';
import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { validate } from '@/middlewares/validate.ts';
import { createUserSchema } from '@/schemas/user.schema.ts';

const router = Router();

// Rota publica: quem se cadastra ainda nao tem conta para se autenticar.
router.post('/users', requireJson, validate(createUserSchema), UserController.create);

// Rota privada: devolve o dono do token, e e a que o front usa para montar o
// cabecalho e a tela de perfil.
router.get('/users/me', isAuthenticated, UserController.readMe);

export default router;
