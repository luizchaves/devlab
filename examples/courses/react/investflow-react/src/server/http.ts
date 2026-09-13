import type { ZodError } from 'zod';
import { toResponse } from './session';

// #region helpers
/** Corpo JSON validado por um schema Zod; erro de forma vira 400 com os campos. */
export function validationResponse(error: ZodError): Response {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    fieldErrors[key] ??= issue.message;
  }
  return Response.json({ error: 'Dados inválidos.', fieldErrors }, { status: 400 });
}

/** Envolve o handler: qualquer `HttpError` ou falha inesperada vira resposta JSON. */
export function handle<T extends unknown[]>(fn: (...args: T) => Promise<Response>) {
  return async (...args: T): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      return toResponse(error);
    }
  };
}
// #endregion
