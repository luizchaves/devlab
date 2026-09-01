import type { NextFunction, Request, Response } from 'express';

import { config } from '#config.ts';

// #region headers
/**
 * Os cabecalhos que o `helmet` define, escritos a mao.
 *
 * Nenhum deles protege o servidor: todos instruem o NAVEGADOR a se comportar de
 * forma mais restritiva com a resposta.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Impede o navegador de "adivinhar" o tipo do conteudo e executar JSON como HTML.
  res.set('X-Content-Type-Options', 'nosniff');

  // Proibe a pagina de ser embutida em iframe — defesa contra clickjacking.
  res.set('X-Frame-Options', 'DENY');

  // Nao vaza a URL completa desta API para sites de terceiros.
  res.set('Referrer-Policy', 'no-referrer');

  // Uma API JSON nao carrega script, estilo nem imagem: nega tudo.
  res.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

  // O Express anuncia a si mesmo por padrao; a versao ajuda quem procura CVE.
  res.removeHeader('X-Powered-By');

  // Exige HTTPS nas proximas visitas. So faz sentido servido por HTTPS.
  if (config.isProduction) {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}
// #endregion
