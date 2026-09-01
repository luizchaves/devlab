import type { Request, Response, NextFunction } from 'express';

import HttpError from '@/errors/HttpError.ts';

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({ error: 'Content Not Found' });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Erros do multer (tamanho, quantidade, campo inesperado) sao erros de
  // entrada: o cliente mandou algo invalido, logo 400 e nao 500.
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof HttpError) {
    return res
      .status(err.code)
      .json({ error: err.message, ...(err.issues ? { issues: err.issues } : {}) });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};
