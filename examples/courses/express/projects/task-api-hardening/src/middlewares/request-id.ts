import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

// #region request-id
/**
 * Da a cada requisicao um identificador proprio.
 *
 * E ele que permite juntar, num log de milhoes de linhas, todas as entradas de
 * uma unica requisicao — e devolver ao cliente algo que ele possa citar num
 * relato de erro.
 */
export function requestId(req: Request, res: Response, next: NextFunction) {
  // Respeita o id do proxy, quando houver: assim o rastro atravessa servicos.
  req.id = req.get('x-request-id') ?? randomUUID();

  // Definido antes do handler: os cabecalhos ainda nao foram enviados.
  res.set('X-Request-Id', req.id);

  next();
}
// #endregion
