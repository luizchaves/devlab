import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import HttpError from '@/errors/HttpError.ts';
import { parseCookies } from '@/utils/cookies.ts';

/**
 * Recebe um schema e devolve um middleware. O schema valida as cinco fontes de
 * dados de uma requisicao de uma vez, por isso cada um declara apenas as chaves
 * (`body`, `query`, `params`, `headers`, `cookies`) que a rota realmente usa.
 * Cabecalho e cookie sao entrada nao confiavel tanto quanto o corpo.
 */
export const validate = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    cookies: parseCookies(req.headers.cookie),
  });

  if (!result.success) {
    throw new HttpError('Validation error', 400, result.error.issues);
  }

  next();
};
