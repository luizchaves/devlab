/**
 * Erro de aplicacao que ja carrega o status HTTP da resposta.
 *
 * Controllers lancam `HttpError`; o `errorHandler` traduz para JSON. Qualquer
 * outro erro vira 500, porque nao foi previsto por nós.
 */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
