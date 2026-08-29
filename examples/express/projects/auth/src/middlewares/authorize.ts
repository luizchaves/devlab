import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import * as Investment from '#models/investment-model.ts';

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

/**
 * Autorizacao por propriedade: o recurso pertence a quem esta chamando?
 *
 * Responde 404 em vez de 403 para nao revelar que o id existe — um atacante
 * nao consegue enumerar investimentos alheios.
 */
export function requireInvestmentOwner(
  req: Request<{ id: string }>,
  _res: Response,
  next: NextFunction
) {
  const investment = Investment.findById(req.params.id);

  if (!investment || investment.userId !== req.auth?.sub) {
    throw new HttpError(404, 'Investimento nao encontrado');
  }

  next();
}
