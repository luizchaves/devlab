import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';

/**
 * Rejeita corpos que nao sejam JSON antes de chegarem ao controller.
 *
 * Sem isso, um `POST` com `Content-Type: text/plain` passa por
 * `express.json()` sem ser interpretado e o controller recebe `{}`.
 */
export function requireJson(req: Request, _res: Response, next: NextFunction) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type precisa ser application/json');
  }

  next();
}
