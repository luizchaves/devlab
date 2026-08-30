import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import User from '@/models/User.ts';
import type { UserInput } from '@/types/User.d.ts';

async function create(req: Request, res: Response) {
  const { confirmationPassword, ...user } = req.body as UserInput & {
    confirmationPassword?: string;
  };

  try {
    const createdUser = await User.create(user);

    return res.status(201).json(createdUser);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new HttpError('Email already exists', 409);
    }

    throw new HttpError('Unable to create user', 400);
  }
}

/** O perfil de quem esta chamando. O id vem do token, nunca da URL. */
async function readMe(req: Request, res: Response) {
  try {
    const user = await User.readById(`${req.userId}`);

    return res.json(user);
  } catch {
    throw new HttpError('User not found', 404);
  }
}

export default { create, readMe };
