import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';

/** Executa quando nenhuma rota respondeu a requisicao. */
export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Rota nao encontrada: ${req.method} ${req.originalUrl}`));
}

/**
 * Middleware de erro: o Express o reconhece pelos quatro parametros.
 * Precisa ser registrado depois de todas as rotas.
 */
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = error instanceof HttpError ? error.status : 500;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    error: {
      status,
      message: status >= 500 ? 'Erro interno do servidor' : error.message,
    },
  });
}
