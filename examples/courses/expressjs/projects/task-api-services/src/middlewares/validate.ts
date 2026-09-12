import type { NextFunction, Request, Response } from 'express';
import type { ZodType, z } from 'zod';

import { HttpError } from '#errors/HttpError.ts';
import { parseCookies } from '#utils/cookies.ts';

// #region validate
/**
 * Recebe um schema e devolve um middleware — o mesmo padrao de fabrica de
 * `express.json()`.
 *
 * O schema valida as cinco fontes de dados de uma vez, por isso cada um declara
 * apenas as chaves (`body`, `query`, `params`, `headers`, `cookies`) que a rota
 * realmente usa. Cabecalho e cookie sao entrada nao confiavel tanto quanto o
 * corpo: chegam do cliente e podem vir forjados.
 */
export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
      cookies: parseCookies(req.headers.cookie),
    });

    if (!result.success) {
      throw new HttpError(422, 'Dados invalidos', result.error.issues);
    }

    req.valid = result.data;

    next();
  };
}
// #endregion

// #region validated
/**
 * Le o resultado da validacao com o tipo que o proprio schema descreve.
 *
 * `req.params` e `req.query` do Express sao sempre `string`; o schema converte
 * (`z.coerce`) e este acessor devolve os dados ja no tipo final, sem espalhar
 * conversao pelos controllers.
 */
export function validated<S extends ZodType>(req: Request, _schema: S): z.infer<S> {
  return req.valid as z.infer<S>;
}
// #endregion
