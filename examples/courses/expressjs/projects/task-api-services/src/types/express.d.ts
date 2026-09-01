import type { JwtPayload } from '#utils/jwt.ts';

// #region merge
/**
 * *Declaration merging*: reabre a interface `Request` do Express para declarar
 * os campos que os nossos middlewares acrescentam.
 *
 * Sem isto, `req.valid` e `req.auth` seriam erro de compilacao — os tipos de
 * `express` nao conhecem nada alem do que o proprio framework preenche.
 */
declare global {
  namespace Express {
    interface Request {
      /** Dados ja validados e convertidos pelo middleware `validate`. */
      valid?: unknown;
      /** Payload do JWT, preenchido pelo middleware `authenticate`. */
      auth?: JwtPayload;
      /** Identificador da requisicao, preenchido pelo middleware `requestId`. */
      id?: string;
    }
  }
}
// #endregion

export {};
