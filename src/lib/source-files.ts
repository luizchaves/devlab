/**
 * Leitura, em tempo de build, dos arquivos reais usados pela documentacao.
 *
 * Toda a leitura acontece atraves de `import.meta.glob` do Vite, ou seja:
 *
 * - roda no servidor/build, nunca no navegador;
 * - o conjunto de arquivos legiveis e fixado em tempo de build, portanto nao
 *   existe acesso arbitrario ao filesystem nem path traversal (`../../`);
 * - em `pnpm dev` o Vite invalida o modulo quando o arquivo real muda.
 */

/** Diretorios autorizados. Qualquer outro caminho e rejeitado. */
export const SOURCE_ROOTS = ['examples', 'src/examples'] as const;

const rawSources = import.meta.glob(
  [
    '/examples/**/*',
    '/src/examples/**/*',
    // Nunca exponha dependencias, artefatos de build ou segredos.
    '!/**/node_modules/**',
    '!/**/dist/**',
    '!/**/build/**',
    '!/**/generated/**',
    '!/**/.prisma/**',
    '!/**/.git/**',
    '!/**/.env',
    '!/**/.env.local',
    '!/**/.env.development',
    '!/**/.env.production',
    '!/**/*.{png,jpg,jpeg,gif,webp,avif,ico,pdf,zip,gz,woff,woff2,ttf,otf,eot,db,db-journal,sqlite,sqlite3,node,wasm}',
  ],
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

/** Todos os caminhos disponiveis, normalizados (sem barra inicial). */
export function listSourcePaths(): string[] {
  return Object.keys(rawSources)
    .map((key) => key.replace(/^\//, ''))
    .sort();
}

/**
 * Normaliza o `path` recebido de uma pagina e valida que ele aponta para um
 * diretorio autorizado. Aceita `examples/a.js`, `./examples/a.js` e
 * `/examples/a.js`.
 */
export function normalizeSourcePath(path: string): string {
  const input = String(path ?? '').trim();

  if (!input) {
    throw new Error('`path` e obrigatorio e deve apontar para um arquivo do projeto.');
  }

  const cleaned = input.replace(/^\.?\//, '').replace(/\\/g, '/');

  if (cleaned.split('/').includes('..')) {
    throw new Error(
      `Caminho invalido: "${input}". Segmentos "../" nao sao permitidos; use um caminho relativo a raiz do projeto.`
    );
  }

  const isAllowed = SOURCE_ROOTS.some((root) => cleaned === root || cleaned.startsWith(`${root}/`));

  if (!isAllowed) {
    throw new Error(
      `Caminho fora dos diretorios autorizados: "${input}". ` +
        `Use um arquivo dentro de: ${SOURCE_ROOTS.map((r) => `${r}/`).join(', ')}`
    );
  }

  return cleaned;
}

/** Le o conteudo de um arquivo autorizado. Lanca um erro descritivo se nao existir. */
export function readSourceFile(path: string): string {
  const normalized = normalizeSourcePath(path);
  const content = rawSources[`/${normalized}`];

  if (content === undefined) {
    const siblings = listSourcePaths()
      .filter((candidate) =>
        candidate.startsWith(`${normalized.split('/').slice(0, -1).join('/')}/`)
      )
      .slice(0, 12);

    throw new Error(
      `Arquivo nao encontrado: "${normalized}".` +
        (siblings.length
          ? `\n\nArquivos disponiveis no mesmo diretorio:\n- ${siblings.join('\n- ')}`
          : '')
    );
  }

  return content;
}

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  astro: 'astro',
  bash: 'bash',
  cjs: 'js',
  css: 'css',
  cts: 'ts',
  env: 'ini',
  example: 'ini',
  graphql: 'graphql',
  html: 'html',
  http: 'http',
  js: 'js',
  json: 'json',
  jsonc: 'jsonc',
  jsx: 'jsx',
  md: 'md',
  mdx: 'mdx',
  mjs: 'js',
  mts: 'ts',
  prisma: 'prisma',
  sh: 'bash',
  sql: 'sql',
  svg: 'xml',
  toml: 'toml',
  ts: 'ts',
  tsx: 'tsx',
  txt: 'plaintext',
  yaml: 'yaml',
  yml: 'yaml',
  zsh: 'bash',
};

const LANGUAGE_BY_FILENAME: Record<string, string> = {
  '.env.example': 'ini',
  '.gitignore': 'gitignore',
  dockerfile: 'dockerfile',
  makefile: 'makefile',
};

/** `examples/express-mvc/src/app.js` -> `app.js` */
export function inferFileName(path: string): string {
  const segments = normalizeSourcePath(path).split('/');
  return segments[segments.length - 1] ?? path;
}

/** `examples/express-mvc/src/app.js` -> `js` */
export function inferLanguage(path: string): string {
  const fileName = inferFileName(path);
  const byName = LANGUAGE_BY_FILENAME[fileName.toLowerCase()];
  if (byName) return byName;

  const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : undefined;
  if (!extension) return 'plaintext';

  return LANGUAGE_BY_EXTENSION[extension] ?? extension;
}

/** Marcadores `#region` / `#endregion` em qualquer sintaxe de comentario. */
const REGION_START = /#region\b[ \t]*(.*?)[ \t]*(?:\*\/|-->|\}\})?[ \t]*$/;
const REGION_END = /#endregion\b/;

function isRegionMarker(line: string): boolean {
  return REGION_START.test(line) || REGION_END.test(line);
}

/**
 * Extrai uma regiao nomeada delimitada por `#region <nome>` / `#endregion`.
 * Regioes aninhadas sao respeitadas e seus marcadores removidos da saida.
 *
 * `firstLineNumber` usa a numeracao do arquivo ja sem os marcadores, que e a
 * mesma exibida quando o arquivo inteiro e renderizado.
 */
export function extractRegion(
  code: string,
  region: string,
  path?: string
): { lines: string[]; firstLineNumber: number } {
  const allLines = code.split('\n');

  // Quantas linhas "reais" (sem marcadores) existem antes de cada indice.
  const linesBefore: number[] = [];
  let seen = 0;
  for (const line of allLines) {
    linesBefore.push(seen);
    if (!isRegionMarker(line)) seen += 1;
  }

  let depth = 0;
  let start = -1;

  for (let index = 0; index < allLines.length; index += 1) {
    const line = allLines[index] as string;
    const startMatch = line.match(REGION_START);

    if (startMatch) {
      if (depth === 0 && startMatch[1]?.trim() === region) {
        depth = 1;
        start = index + 1;
      } else if (depth > 0) {
        depth += 1;
      }
      continue;
    }

    if (REGION_END.test(line) && depth > 0) {
      depth -= 1;
      if (depth === 0) {
        return {
          lines: allLines.slice(start, index).filter((entry) => !isRegionMarker(entry)),
          firstLineNumber: (linesBefore[start] ?? 0) + 1,
        };
      }
    }
  }

  throw new Error(
    `Regiao "${region}" nao encontrada${path ? ` em "${path}"` : ''}. ` +
      'Delimite o trecho com `// #region ' +
      region +
      '` e `// #endregion`.'
  );
}

/** Remove a indentacao comum de um bloco de linhas. */
export function dedent(lines: string[]): string[] {
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);

  const minIndent = indents.length ? Math.min(...indents) : 0;
  return minIndent > 0 ? lines.map((line) => line.slice(minIndent)) : lines;
}

/** Interpreta `lines="5-18"`, `lines="5-"` ou `lines="12"`. */
export function parseLineRange(range: string): { startLine: number; endLine?: number } {
  const match = String(range)
    .trim()
    .match(/^(\d+)(?:\s*-\s*(\d+)?)?$/);

  if (!match) {
    throw new Error(`Valor invalido para \`lines\`: "${range}". Use "5-18", "5-" ou "5".`);
  }

  const startLine = Number(match[1]);
  const endLine = match[2] ? Number(match[2]) : /-\s*$/.test(range) ? undefined : startLine;

  return { startLine, endLine };
}

export interface LoadSourceOptions {
  path: string;
  region?: string | undefined;
  lines?: string | undefined;
  startLine?: number | undefined;
  endLine?: number | undefined;
  /** Remove a indentacao comum de trechos extraidos. Padrao: `true`. */
  dedent?: boolean | undefined;
}

export interface LoadedSource {
  /** Conteudo pronto para o Expressive Code. */
  code: string;
  /** Linguagem inferida a partir da extensao. */
  lang: string;
  /** Nome do arquivo inferido a partir do caminho. */
  fileName: string;
  /** Numero original da primeira linha do trecho (1-based). */
  firstLineNumber: number;
  /** `true` quando apenas parte do arquivo foi carregada. */
  isPartial: boolean;
}

/**
 * Carrega um arquivo real (ou um trecho dele) pronto para renderizacao.
 */
export function loadSource(options: LoadSourceOptions): LoadedSource {
  const { path, region, lines: lineRange, dedent: shouldDedent = true } = options;

  const normalized = normalizeSourcePath(path);
  const raw = readSourceFile(normalized).replace(/\r\n/g, '\n');

  let selected: string[];
  let firstLineNumber = 1;
  let isPartial = false;

  if (region) {
    const extracted = extractRegion(raw, region, normalized);
    selected = extracted.lines;
    firstLineNumber = extracted.firstLineNumber;
    isPartial = true;
  } else {
    const range = lineRange ? parseLineRange(lineRange) : undefined;
    const startLine = range?.startLine ?? options.startLine;
    const endLine = range?.endLine ?? options.endLine;
    const allLines = raw.split('\n').filter((line) => !isRegionMarker(line));

    if (startLine !== undefined || endLine !== undefined) {
      const from = Math.max(1, startLine ?? 1);
      const to = Math.min(allLines.length, endLine ?? allLines.length);

      if (from > allLines.length) {
        throw new Error(
          `Intervalo de linhas fora do arquivo "${normalized}" (${allLines.length} linhas).`
        );
      }

      selected = allLines.slice(from - 1, to);
      firstLineNumber = from;
      isPartial = true;
    } else {
      selected = allLines;
    }
  }

  if (isPartial && shouldDedent) {
    selected = dedent(selected);
  }

  // Remove linhas vazias nas bordas sem alterar a numeracao original.
  while (selected.length > 0 && selected[0]?.trim() === '') {
    selected.shift();
    firstLineNumber += 1;
  }
  while (selected.length > 0 && selected[selected.length - 1]?.trim() === '') {
    selected.pop();
  }

  return {
    code: selected.join('\n'),
    lang: inferLanguage(normalized),
    fileName: inferFileName(normalized),
    firstLineNumber,
    isPartial,
  };
}

/** Extensoes de imagem em texto que podem virar `data:` URI no `<HtmlPreview>`. */
const DATA_URI_MIME: Record<string, string> = {
  svg: 'image/svg+xml',
};

/**
 * Le um arquivo autorizado e devolve um `data:` URI, ou `undefined` se o tipo
 * nao for suportado. Usado para embutir imagens no preview em `srcdoc`, onde
 * caminhos relativos nao resolvem.
 */
export function readAssetDataUri(path: string): string | undefined {
  const normalized = normalizeSourcePath(path);
  const extension = normalized.split('.').pop()?.toLowerCase() ?? '';
  const mime = DATA_URI_MIME[extension];

  if (!mime) return undefined;

  const content = rawSources[`/${normalized}`];
  if (content === undefined) return undefined;

  return `data:${mime};base64,${Buffer.from(content, 'utf-8').toString('base64')}`;
}

/** Resolve um caminho relativo (`../img/logo.svg`) a partir de um arquivo. */
export function resolveRelative(fromFile: string, relative: string): string {
  const segments = normalizeSourcePath(fromFile).split('/').slice(0, -1);

  for (const part of relative.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') segments.pop();
    else segments.push(part);
  }

  return segments.join('/');
}
