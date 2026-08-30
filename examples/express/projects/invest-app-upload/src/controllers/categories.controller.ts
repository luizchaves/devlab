import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Category from '@/models/Category.ts';

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };

    return res.json(await Category.read(name ? { name } : undefined));
  } catch (error) {
    throw new HttpError('Unable to read categories', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    return res.json(await Category.readById(req.params.id));
  } catch (error) {
    throw new HttpError('Category not found', 404);
  }
}

export default { read, readById };
