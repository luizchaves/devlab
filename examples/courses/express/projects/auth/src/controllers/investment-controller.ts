import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import * as Investment from '#models/investment-model.ts';
import type { InvestmentInput } from '#types/index.ts';

/** O id vem do token, nunca do corpo: senao qualquer um cria para outro dono. */
function currentUserId(req: Request): string {
  if (!req.auth) {
    throw new HttpError(401, 'Token de acesso ausente');
  }

  return req.auth.sub;
}

export function index(req: Request, res: Response) {
  res.json(Investment.findAllByUser(currentUserId(req)));
}

export function store(req: Request, res: Response) {
  const { name, amount } = (req.body ?? {}) as InvestmentInput;

  if (!name || typeof amount !== 'number') {
    throw new HttpError(400, 'Os campos "name" e "amount" sao obrigatorios');
  }

  res.status(201).json(Investment.create({ name, amount, userId: currentUserId(req) }));
}

export function destroy(req: Request<{ id: string }>, res: Response) {
  // A posse ja foi conferida pelo middleware `requireInvestmentOwner`.
  Investment.remove(req.params.id);

  res.status(204).end();
}
