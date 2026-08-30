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

export default { create };
