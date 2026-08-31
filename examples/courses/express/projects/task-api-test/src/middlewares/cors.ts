import type { NextFunction, Request, Response } from 'express';

import { config } from '#config.ts';

// #region cors
/**
 * CORS em tres cabecalhos, sem o pacote `cors`.
 *
 * A politica de mesma origem e do navegador: quem decide se o JavaScript de
 * outra origem pode LER a resposta e o proprio navegador, com base no que o
 * servidor responde. `curl` ignora tudo isso — CORS nao e autenticacao.
 */
export function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('origin');

  // Lista de permitidos. `*` nunca, porque a API usa credenciais.
  if (origin && config.CORS_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Credentials', 'true');
    // Sem isto, um cache serve a resposta de uma origem para outra.
    res.set('Vary', 'Origin');
  }

  // #region preflight
  /**
   * O preflight: antes de um PUT ou de um POST com JSON, o navegador manda um
   * OPTIONS perguntando se pode. Responder 204 aqui encerra o ciclo — a rota
   * real nem chega a ser consultada.
   */
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.set('Access-Control-Max-Age', '86400');

    return res.status(204).end();
  }
  // #endregion

  next();
}
// #endregion
