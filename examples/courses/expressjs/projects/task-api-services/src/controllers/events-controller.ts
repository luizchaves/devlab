import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { subscribe } from '#services/events-service.ts';

// #region stream
/**
 * SSE e uma resposta HTTP que nunca termina.
 *
 * Os tres cabecalhos importam: o tipo diz ao navegador para usar EventSource,
 * o `no-cache` impede um proxy de guardar o fluxo, e o `keep-alive` mantem a
 * conexao aberta.
 */
export function stream(req: Request, res: Response) {
  if (!req.auth) throw new HttpError(401, 'Token de acesso ausente');

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    // Sem isto, um proxy pode segurar o fluxo esperando a resposta terminar.
    'X-Accel-Buffering': 'no',
  });

  res.flushHeaders();

  subscribe(req.auth.sub, res);

  // Um comentario a cada 15 s impede proxies de derrubarem a conexao ociosa.
  const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 15_000);

  res.on('close', () => clearInterval(keepAlive));
}
// #endregion
