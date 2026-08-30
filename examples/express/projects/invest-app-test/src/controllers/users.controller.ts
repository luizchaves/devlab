import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import User from '@/models/User.ts';
import SendMail from '@/services/SendMail.ts';
import type { UserInput } from '@/types/User.d.ts';

async function create(req: Request, res: Response) {
  const { confirmationPassword, ...user } = req.body as UserInput & {
    confirmationPassword?: string;
  };

  try {
    const createdUser = await User.create(user);

    // Depois de gravar: nao faz sentido avisar sobre conta que falhou. O envio
    // e efeito colateral — um SMTP fora do ar nao pode impedir alguem de criar
    // conta, entao a falha e registrada e o cadastro segue.
    try {
      await SendMail.createNewUser(`${createdUser.email}`);
    } catch (mailError) {
      console.error('Falha ao enviar o e-mail de boas-vindas:', mailError);
    }

    return res.status(201).json(createdUser);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new HttpError('Email already exists', 409);
    }

    throw new HttpError('Unable to create user', 400);
  }
}

export default { create };
