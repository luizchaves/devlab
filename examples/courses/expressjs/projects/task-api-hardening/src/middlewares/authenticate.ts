import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { bearerSchema } from '#schemas/auth.ts';
import { verifyJwt } from '#utils/jwt.ts';

// #region authenticate
/**
 * Autenticacao: descobre *quem* esta chamando.
 *
 * O schema confere a *forma* do cabecalho `Authorization: Bearer <token>`;
 * `verifyJwt` confere a *confianca* (assinatura e expiracao). Os dois falham
 * com 401, e nao 422: cabecalho errado e "identifique-se", nao "dado invalido".
 * O schema e chamado aqui dentro, e nao como `validate(bearerSchema)` na rota,
 * para que nenhuma rota consiga esquecer a checagem.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const parsed = bearerSchema.safeParse({ headers: req.headers });

  if (!parsed.success) {
    throw new HttpError(401, parsed.error.issues[0]?.message ?? 'Token de acesso ausente');
  }

  const token = parsed.data.headers.authorization.slice('Bearer '.length);

  try {
    req.auth = verifyJwt(token);
  } catch {
    throw new HttpError(401, 'Token de acesso invalido ou expirado');
  }

  next();
}
// #endregion
