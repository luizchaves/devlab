import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import User from '@/models/User.ts';
import { signJwt } from '@/utils/jwt.ts';
import { verifyPassword } from '@/utils/password.ts';

async function signin(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await User.readByEmailWithPassword(email);

    // `verifyPassword` nao desfaz o hash: refaz o calculo com os parametros que
    // vieram dentro do proprio hash e compara em tempo constante.
    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const token = signJwt({ sub: user.id, name: user.name, email: user.email });

    return res.json({ auth: true, token });
  } catch {
    // Mesma resposta para e-mail inexistente e senha errada: diferenciar
    // entregaria a um atacante quais e-mails estao cadastrados.
    throw new HttpError('Invalid credentials', 401);
  }
}

export default { signin };
