import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Broker from '@/models/Broker.ts';

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };

    return res.json(await Broker.read(name ? { name } : undefined));
  } catch (error) {
    throw new HttpError('Unable to read brokers', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    return res.json(await Broker.readById(req.params.id));
  } catch (error) {
    throw new HttpError('Broker not found', 404);
  }
}

export default { read, readById };
