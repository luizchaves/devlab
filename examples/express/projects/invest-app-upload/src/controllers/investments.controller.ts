import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Investment from '@/models/Investment.ts';
import type { InvestmentInput } from '@/types/Investment.d.ts';

async function create(req: Request, res: Response) {
  try {
    const investment = req.body as InvestmentInput;

    // O dono vem do token, nunca do corpo da requisicao.
    const createdInvestment = await Investment.create({ ...investment, userId: req.userId });

    return res.status(201).json(createdInvestment);
  } catch (error) {
    throw new HttpError('Unable to create investment', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };

    const investments = await Investment.read({ name, userId: req.userId });

    return res.json(investments);
  } catch (error) {
    throw new HttpError('Unable to read investments', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const investment = await Investment.readById(id, req.userId);

    return res.json(investment);
  } catch (error) {
    throw new HttpError('Investment not found', 404);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const investment = req.body as InvestmentInput;
    const { id } = req.params;

    const updatedInvestment = await Investment.update({ ...investment, id, userId: req.userId });

    return res.json(updatedInvestment);
  } catch (error) {
    throw new HttpError('Unable to update investment', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    await Investment.remove(id, req.userId);

    return res.sendStatus(204);
  } catch (error) {
    throw new HttpError('Investment not found', 404);
  }
}

export default { create, read, readById, update, remove };
