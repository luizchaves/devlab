import type { Request, Response, NextFunction } from 'express';

import HttpError from '@/errors/HttpError.ts';

export const requireJsonContentType = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // `startsWith`, e nao igualdade: o navegador manda
  // `application/json; charset=UTF-8`, que e o mesmo tipo com um parametro.
  if (!req.headers['content-type']?.startsWith('application/json')) {
    throw new HttpError('Content-Type must be application/json');
  }

  next();
};
