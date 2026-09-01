import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Tag from '@/models/Tag.ts';
import type { TagInput } from '@/types/Tag.d.ts';

async function create(req: Request, res: Response) {
  try {
    const createdTag = await Tag.create(req.body as TagInput);

    return res.status(201).json(createdTag);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new HttpError('Tag already exists', 409);
    }

    throw new HttpError('Unable to create tag', 400);
  }
}

async function read(req: Request, res: Response) {
  const { name } = req.query as { name?: string };

  return res.json(await Tag.read({ name }));
}

export default { create, read };
