import type { NextFunction, Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import { verifyJwt } from '@/utils/jwt.ts';

export const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  const [, token] = req.headers.authorization?.split(' ') ?? [];

  if (!token) {
    throw new HttpError('Token required', 401);
  }

  try {
    const payload = verifyJwt(token);

    // A partir daqui qualquer rota sabe quem esta chamando, sem reler o header.
    req.userId = payload.sub;

    next();
  } catch (error) {
    throw new HttpError('Token invalid', 401);
  }
};
