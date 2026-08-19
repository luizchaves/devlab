/**
 * Converte uma arvore de arquivos escrita em texto (formato `tree`, box-drawing
 * ou lista indentada) na estrutura `<ul><li>` que o `<FileTree>` nativo do
 * Starlight espera receber pelo slot.
 *
 * Isso mantem o visual, os icones e a acessibilidade do componente oficial,
 * mas permite escrever a arvore da forma como ela aparece no terminal.
 */

interface TreeEntry {
  depth: number;
  name: string;
}

/** `│   `, `├── `, `└── `, `- `, indentacao por espacos e tabs. */
const LINE_PATTERN = /^([ \t]*(?:[│|][ \t]*)*)((?:[├└][─-]+|[-*+])[ \t]+)?(.*)$/;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Suporta `**arquivo.js**` para destacar uma entrada, como no Starlight. */
function renderEntryName(name: string): string {
  const highlighted = name.match(/^\*\*(.+?)\*\*(.*)$/);

  if (highlighted) {
    return `<strong>${escapeHtml(highlighted[1] ?? '')}</strong>${escapeHtml(highlighted[2] ?? '')}`;
  }

  return escapeHtml(name);
}

function parseEntries(text: string): TreeEntry[] {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\t/g, '    '))
    .filter((line) => line.trim().length > 0);

  const indentStack: number[] = [];

  return lines.map((line) => {
    const match = line.match(LINE_PATTERN);
    // Colapsa o alinhamento visual entre o nome e o comentario da entrada.
    const name = (match?.[3] ?? line).trim().replace(/\s+/g, ' ');
    const column = line.length - (match?.[3] ?? line).length;

    while (indentStack.length > 0 && column < (indentStack[indentStack.length - 1] as number)) {
      indentStack.pop();
    }
    if (indentStack.length === 0 || column > (indentStack[indentStack.length - 1] as number)) {
      indentStack.push(column);
    }

    return { depth: indentStack.length - 1, name };
  });
}

/** Gera o HTML `<ul><li>…</li></ul>` aninhado a partir do texto da arvore. */
export function treeTextToHtml(text: string): string {
  const entries = parseEntries(text);

  if (entries.length === 0) return '';

  let html = '';
  let currentDepth = -1;

  for (const entry of entries) {
    if (entry.depth > currentDepth) {
      html += '<ul>'.repeat(entry.depth - currentDepth);
    } else {
      html += '</li>';
      while (currentDepth > entry.depth) {
        html += '</ul></li>';
        currentDepth -= 1;
      }
    }

    html += `<li>${renderEntryName(entry.name)}`;
    currentDepth = entry.depth;
  }

  html += '</li>';
  while (currentDepth > 0) {
    html += '</ul></li>';
    currentDepth -= 1;
  }

  return `${html}</ul>`;
}
