import type { NextFunction, Request, Response } from 'express';

import { config } from '#config.ts';
import { HttpError } from '#errors/HttpError.ts';

// #region store
/**
 * Contador em memoria, por janela fixa.
 *
 * Suficiente para um processo unico. Com mais de uma instancia, cada uma conta
 * a sua parte e o limite efetivo vira N vezes maior — ai o contador precisa
 * morar num Redis.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function take(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };

    hits.set(key, fresh);

    return { allowed: true, remaining: max - 1, resetAt: fresh.resetAt };
  }

  current.count += 1;

  return {
    allowed: current.count <= max,
    remaining: Math.max(0, max - current.count),
    resetAt: current.resetAt,
  };
}
// #endregion

// #region middleware
/**
 * Middleware de fabrica: cada rota escolhe o proprio custo.
 *
 * O login merece um limite bem mais apertado que uma listagem — e por IP, nao
 * por usuario, porque quem tenta forca bruta ainda nao esta autenticado.
 *
 * Cada limitador tem um `name` proprio, e portanto um contador proprio.
 */
export function rateLimit(
  name = 'global',
  max = config.RATE_LIMIT_MAX,
  windowMs = config.RATE_LIMIT_WINDOW_MS
) {
  return (req: Request, res: Response, next: NextFunction) => {
    /**
     * O `name` isola os baldes.
     *
     * Sem ele, o limitador global e o do login somariam no mesmo contador e uma
     * requisicao a `/auth/signin` seria cobrada duas vezes — o limite de cinco
     * cairia para tres sem que ninguem entendesse por que.
     */
    const key = `${name}:${req.ip}:${req.baseUrl}${req.path}`;
    const { allowed, remaining, resetAt } = take(key, max, windowMs);
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

    res.set('RateLimit-Limit', String(max));
    res.set('RateLimit-Remaining', String(remaining));
    res.set('RateLimit-Reset', String(retryAfter));

    if (!allowed) {
      res.set('Retry-After', String(retryAfter));

      throw new HttpError(429, 'Muitas requisicoes. Tente novamente mais tarde.');
    }

    next();
  };
}
// #endregion

/** Usado pelos testes para comecar de um estado limpo. */
export function resetRateLimit() {
  hits.clear();
}
