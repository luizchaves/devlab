/** Erro com status HTTP, lancado pelos controllers. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Executa quando nenhuma rota respondeu a requisicao. */
export function notFound(req, res, next) {
  next(new HttpError(404, `Rota nao encontrada: ${req.method} ${req.originalUrl}`));
}

/**
 * Middleware de erro: reconhecido pelo Express por ter quatro parametros.
 * Precisa ser registrado depois de todas as rotas.
 */
export function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;

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
