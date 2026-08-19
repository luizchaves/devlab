/**
 * Converte o HTML renderizado de um slot de volta em texto puro.
 *
 * Necessario porque o MDX embrulha `{`...`}` em paragrafos e escapa entidades
 * antes de entregar o conteudo ao componente. O MDX tambem remove um nivel de
 * indentacao do bloco, por isso as paginas indentam o conteudo em 2 espacos e
 * aqui a indentacao comum restante e removida.
 */

/** Remove a indentacao comum de todas as linhas nao vazias. */
function dedent(text: string): string {
  const lines = text.split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);

  const minIndent = indents.length ? Math.min(...indents) : 0;
  return minIndent > 0 ? lines.map((line) => line.slice(minIndent)).join('\n') : text;
}

export function slotHtmlToText(html: string): string {
  const text = html
    .replace(/<\/(p|div|pre|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

  // Remove linhas vazias das bordas sem tocar na indentacao interna.
  return dedent(text.replace(/^\s*\n/, '').replace(/\n\s*$/, ''));
}
