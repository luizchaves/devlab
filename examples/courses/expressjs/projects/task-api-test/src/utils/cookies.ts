// #region parse
/**
 * Converte o cabecalho `Cookie` em um objeto, sem dependencia.
 *
 * O formato e `nome=valor; outro=valor`. O `cookie-parser` faz isto e mais
 * (cookies assinados), mas para ler o cabecalho bastam um `split` e o
 * `decodeURIComponent` — o mesmo criterio que dispensa `dotenv` e `bcrypt`.
 */
export function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};

  for (const pair of header?.split(';') ?? []) {
    const [name, ...rest] = pair.split('=');
    const key = name?.trim();

    if (!key) continue;

    try {
      cookies[key] = decodeURIComponent(rest.join('=').trim());
    } catch {
      // Valor com percent-encoding invalido: fica como veio, sem derrubar a requisicao.
      cookies[key] = rest.join('=').trim();
    }
  }

  return cookies;
}
// #endregion
