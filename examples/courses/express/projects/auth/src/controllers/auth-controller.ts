import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import * as User from '#models/user-model.ts';
import type { SignUpInput } from '#types/index.ts';
import { signJwt } from '#utils/jwt.ts';
import { verifyPassword } from '#utils/password.ts';

/** `POST /signup` — cadastro publico. */
export function signUp(req: Request, res: Response) {
  const { name, email, password } = (req.body ?? {}) as SignUpInput;

  if (!name || !email || !password) {
    throw new HttpError(422, 'Os campos "name", "email" e "password" sao obrigatorios');
  }

  if (password.length < 8) {
    throw new HttpError(422, 'A senha precisa ter ao menos 8 caracteres');
  }

  if (User.existsByEmail(email)) {
    throw new HttpError(409, 'E-mail ja cadastrado');
  }

  res.status(201).json(User.create({ name, email, password }));
}

/** `POST /signin` — troca credenciais por um token. */
export function signIn(req: Request, res: Response) {
  const { email, password } = (req.body ?? {}) as SignUpInput;

  if (!email || !password) {
    throw new HttpError(401, 'Credenciais invalidas');
  }

  const user = User.findByEmailWithPassword(email);

  // A mesma mensagem para e-mail inexistente e senha errada: responder
  // "usuario nao encontrado" entregaria a lista de e-mails cadastrados.
  if (!user || !verifyPassword(password, user.password)) {
    throw new HttpError(401, 'Credenciais invalidas');
  }

  const token = signJwt({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.json({ token });
}

/** `GET /me` — quem sou eu, segundo o token enviado. */
export function me(req: Request, res: Response) {
  const user = req.auth && User.findById(req.auth.sub);

  if (!user) {
    throw new HttpError(401, 'Token de acesso invalido');
  }

  res.json(user);
}
