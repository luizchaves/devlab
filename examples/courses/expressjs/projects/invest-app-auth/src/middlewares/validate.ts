import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

import HttpError from '@/errors/HttpError.ts';

/**
 * Recebe um schema e devolve um middleware. O schema valida as tres fontes de
 * dados de uma requisicao de uma vez, por isso cada um declara as chaves
 * `body`, `query` e/ou `params` que a rota realmente usa.
 */
export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw new HttpError('Validation error', 400, result.error.issues);
    }

    next();
  };
