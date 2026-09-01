/**
 * Erro de aplicacao que ja carrega o status HTTP da resposta.
 *
 * Controllers lancam `HttpError`; o `errorHandler` traduz para JSON. Qualquer
 * outro erro vira 500, porque nao foi previsto por nós.
 */
// #region class
export class HttpError extends Error {
  status: number;
  /** Detalhes por campo, preenchidos pela validacao. */
  issues?: unknown;

  constructor(status: number, message: string, issues?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.issues = issues;
  }
}
// #endregion
