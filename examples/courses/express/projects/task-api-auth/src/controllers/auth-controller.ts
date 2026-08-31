import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { validated } from '#middlewares/validate.ts';
import * as User from '#models/user-model.ts';
import { signinSchema, signupSchema } from '#schemas/auth.ts';
import { signJwt } from '#utils/jwt.ts';

// #region signup
export async function signup(req: Request, res: Response) {
  const { body } = validated(req, signupSchema);

  if (await User.findByEmail(body.email)) {
    throw new HttpError(409, 'E-mail ja cadastrado');
  }

  // O cadastro nao autentica: o usuario criado ainda precisa fazer login.
  res.status(201).json(await User.create(body));
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
