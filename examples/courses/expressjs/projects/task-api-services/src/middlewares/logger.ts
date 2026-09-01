import type { NextFunction, Request, Response } from 'express';

import { config } from '#config.ts';
import { countRequest, observeDuration } from '#telemetry.ts';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 } as const;

type Level = keyof typeof LEVELS;

// #region log
/**
 * Log estruturado: uma linha JSON por evento.
 *
 * Texto livre e legivel para uma pessoa e inutil para uma ferramenta. Em JSON,
 * "todos os 500 do usuario X na ultima hora" vira uma consulta, e nao um grep.
 */
export function log(level: Level, message: string, fields: Record<string, unknown> = {}) {
  if (LEVELS[level] < LEVELS[config.LOG_LEVEL]) return;

  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    message,
    ...fields,
  });

  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}
// #endregion

// #region middleware
/**
 * Registra a requisicao no evento `finish`, quando status e duracao ja existem.
 *
 * O cabecalho `Authorization` nunca entra no log: um token vazado em arquivo de
 * log e um token vazado.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

    countRequest(req.method, res.statusCode);
    observeDuration(durationMs);

    log(res.statusCode >= 500 ? 'error' : 'info', 'http_request', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(1)),
      userId: req.auth?.sub,
    });
  });

  next();
}
// #endregion
