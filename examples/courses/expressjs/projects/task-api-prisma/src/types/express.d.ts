// #region merge
/**
 * *Declaration merging*: reabre a interface `Request` do Express para declarar
 * o campo que o middleware `validate` acrescenta.
 *
 * Sem isto, `req.valid` nao existe para o TypeScript. O tipo e `unknown` de
 * proposito — quem sabe o formato e o schema, e o acessor `validated()` faz a
 * ponte entre os dois.
 */
declare global {
  namespace Express {
    interface Request {
      /** Dados ja validados e convertidos pelo middleware `validate`. */
      valid?: unknown;
    }
  }
}

export {};
// #endregion
