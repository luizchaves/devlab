import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { verifyJwt } from '#utils/jwt.ts';

// #region authenticate
/**
 * Autenticacao: descobre *quem* esta chamando.
 *
 * Le o cabecalho `Authorization: Bearer <token>`, valida a assinatura e guarda
 * o payload em `req.auth` para os middlewares e controllers seguintes.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Token de acesso ausente');
  }

  try {
    req.auth = verifyJwt(token);
  } catch {
    throw new HttpError(401, 'Token de acesso invalido ou expirado');
  }

  next();
}
// #endregion
