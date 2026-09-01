// Amplia o `Request` do Express para carregar o dono da requisicao, preenchido
// pelo middleware `isAuthenticated` a partir do token.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
