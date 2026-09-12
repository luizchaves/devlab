import type { NextFunction, Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import { bearerSchema } from '@/schemas/auth.schema.ts';
import { verifyJwt } from '@/utils/jwt.ts';

export const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  // O schema confere a forma do cabecalho; o 401 e o mesmo de token ausente.
  const parsed = bearerSchema.safeParse({ headers: req.headers });

  if (!parsed.success) {
    throw new HttpError(parsed.error.issues[0]?.message ?? 'Token required', 401);
  }

  const token = parsed.data.headers.authorization.slice('Bearer '.length);

  try {
    // Assinatura e expiracao continuam sendo assunto do verifyJwt.
    const payload = verifyJwt(token);

    // A partir daqui qualquer rota sabe quem esta chamando, sem reler o header.
    req.userId = payload.sub;

    next();
  } catch {
    throw new HttpError('Token invalid', 401);
  }
};
