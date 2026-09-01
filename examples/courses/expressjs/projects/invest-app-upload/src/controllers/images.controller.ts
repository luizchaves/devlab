import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Image from '@/models/Image.ts';

function pathFromFile(req: Request) {
  if (!req.file) {
    throw new HttpError('Image file is required', 400);
  }

  return `/imgs/profile/${req.file.filename}`;
}

async function create(req: Request, res: Response) {
  const path = pathFromFile(req);

  try {
    const image = await Image.create({ userId: `${req.userId}`, path });

    return res.status(201).json(image);
  } catch {
    throw new HttpError('Unable to create image', 400);
  }
}

async function update(req: Request, res: Response) {
  const path = pathFromFile(req);

  try {
    const image = await Image.update({ userId: `${req.userId}`, path });

    return res.json(image);
  } catch {
    throw new HttpError('Unable to update image', 400);
  }
}

export default { create, update };
