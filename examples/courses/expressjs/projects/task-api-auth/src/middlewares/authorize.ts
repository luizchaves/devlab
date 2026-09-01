import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';

// #region role
/**
 * Autorizacao por papel: decide *o que* o autenticado pode fazer.
 *
 * Usa 403 (autenticado, mas sem permissao), nunca 401 — que significaria
 * "identifique-se primeiro".
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new HttpError(401, 'Token de acesso ausente');
    }

    if (!roles.includes(req.auth.role ?? '')) {
      throw new HttpError(403, 'Sem permissao para esta operacao');
    }

    next();
  };
}
// #endregion
