// #region logger
/**
 * Middleware de aplicacao: registra a requisicao e delega ao proximo.
 *
 * Sem a chamada a next() a requisicao trava aqui e o cliente espera ate o timeout.
 */
export function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
}
// #endregion
