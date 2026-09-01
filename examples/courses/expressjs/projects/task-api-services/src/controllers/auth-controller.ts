import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { validated } from '#middlewares/validate.ts';
import * as User from '#models/user-model.ts';
import { signinSchema, signupSchema } from '#schemas/auth.ts';
import { sendWelcome } from '#services/mail-service.ts';
import { signJwt } from '#utils/jwt.ts';

// #region signup
export async function signup(req: Request, res: Response) {
  const { body } = validated(req, signupSchema);

  if (await User.findByEmail(body.email)) {
    throw new HttpError(409, 'E-mail ja cadastrado');
  }

  const verifyToken = randomUUID();
  const user = await User.create({ ...body, verifyToken });

  // O envio nao e aguardado: o cadastro nao depende do SMTP estar de pe.
  sendWelcome(user.email, user.name, verifyToken);

  // O cadastro nao autentica: o usuario criado ainda precisa fazer login.
  res.status(201).json(user);
}
// #endregion

// #region verify
export async function verify(req: Request, res: Response) {
  const token = String(req.query.token ?? '');

  if (!(await User.verifyEmail(token))) {
    throw new HttpError(400, 'Token de verificacao invalido ou ja usado');
  }

  res.json({ status: 'verified' });
}
// #endregion

// #region signin
export async function signin(req: Request, res: Response) {
  const { body } = validated(req, signinSchema);
  const user = await User.authenticate(body.email, body.password);

  /**
   * A mesma mensagem para e-mail inexistente e senha errada.
   *
   * Distinguir os dois casos entrega ao atacante uma lista de e-mails
   * cadastrados — a resposta precisa ser indistinguivel.
   */
  if (!user) {
    throw new HttpError(401, 'Credenciais invalidas');
  }

  const token = signJwt({ sub: user.id, name: user.name, email: user.email, role: user.role });

  res.json({ token, user });
}
// #endregion

// #region me
export async function me(req: Request, res: Response) {
  const user = req.auth ? await User.findById(req.auth.sub) : undefined;

  if (!user) {
    throw new HttpError(401, 'Token de acesso invalido ou expirado');
  }

  res.json(user);
}
// #endregion
