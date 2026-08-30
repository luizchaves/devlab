import type { JwtPayload } from '#utils/jwt.ts';

/**
 * Extensao do `Request` do Express.
 *
 * Sem isso, `req.auth` seria um erro de compilacao: os tipos de `express` nao
 * conhecem os campos que os nossos middlewares acrescentam.
 */
declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}
