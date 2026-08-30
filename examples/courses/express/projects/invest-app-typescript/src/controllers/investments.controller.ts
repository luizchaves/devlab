import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Investment from '@/models/Investment.ts';
import type { InvestmentInput } from '@/types/Investment.d.ts';

async function create(req: Request, res: Response) {
  try {
    const investment = req.body as InvestmentInput;

    const createdInvestment = await Investment.create(investment);

    return res.status(201).json(createdInvestment);
  } catch {
    throw new HttpError('Unable to create investment', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };

    const investments = name
      ? await Investment.read('name', name)
      : await Investment.read();

    return res.json(investments);
  } catch {
    throw new HttpError('Unable to read investments', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const investment = await Investment.readById(id);

    return res.json(investment);
  } catch {
    throw new HttpError('Investment not found', 404);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  // A leitura vem antes da escrita para separar os dois erros: recurso que nao
  // existe e 404; corpo invalido e 400. Sem ela, o `catch` unico devolveria
  // 400 para os dois casos.
  await Investment.readById(id).catch(() => {
    throw new HttpError('Investment not found', 404);
  });

  try {
    const investment = req.body as InvestmentInput;

    const updatedInvestment = await Investment.update({ ...investment, id });

    return res.json(updatedInvestment);
  } catch {
    throw new HttpError('Unable to update investment', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    await Investment.remove(id);

    return res.sendStatus(204);
  } catch {
    throw new HttpError('Investment not found', 404);
  }
}

export default { create, read, readById, update, remove };
