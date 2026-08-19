import type { Code } from '@astrojs/starlight/components';
import type { ComponentProps } from 'astro/types';

/**
 * Props oficiais do `<Code>` do Expressive Code (incluindo as adicionadas por
 * plugins via declaration merging: `showLineNumbers`, `startLineNumber`,
 * `collapse`, `title`, `frame`, `mark`, `ins`, `del`, `wrap`, ...).
 */
export type ExpressiveCodeProps = ComponentProps<typeof Code>;

/** Props do `<SourceCode>`: tudo do Expressive Code + `path` e selecao de trecho. */
export type SourceCodeProps = Omit<ExpressiveCodeProps, 'code'> & {
  /** Caminho do arquivo, relativo a raiz do projeto (`examples/` ou `src/examples/`). */
  path: string;
  /** Carrega apenas a regiao nomeada delimitada por `#region` / `#endregion`. */
  region?: string | undefined;
  /** Intervalo de linhas, 1-based e inclusivo: `"5-18"`, `"5-"` ou `"12"`. */
  lines?: string | undefined;
  /** Alternativa a `lines`. Primeira linha do trecho (1-based, inclusiva). */
  startLine?: number | undefined;
  /** Alternativa a `lines`. Ultima linha do trecho (1-based, inclusiva). */
  endLine?: number | undefined;
  /** Remove a indentacao comum de trechos parciais. Padrao: `true`. */
  dedent?: boolean | undefined;
  /** Mantem a numeracao original do arquivo em trechos parciais. Padrao: `true`. */
  preserveLineNumbers?: boolean | undefined;
};

/** Um arquivo dentro de `<CodeTabs>`: props do `<SourceCode>` + rotulo da aba. */
export type CodeTabFile = SourceCodeProps & {
  /** Rotulo da aba. Padrao: nome do arquivo. */
  label?: string | undefined;
};

type MarkerProp = NonNullable<ExpressiveCodeProps['mark']>;
type MarkerDefinition = MarkerProp extends readonly (infer Item)[] ? Item : MarkerProp;

/** `"5"`, `"5-8"`, `"1,3-5"` — apenas numeros, hifens e virgulas. */
const LINE_RANGE = /^\s*\d+\s*(?:[-,]\s*\d+\s*)*$/;

function normalizeMarker(value: MarkerDefinition): MarkerDefinition {
  if (typeof value === 'string' && LINE_RANGE.test(value)) {
    return { range: value.replace(/\s+/g, '') } as MarkerDefinition;
  }

  return value;
}

/**
 * Normaliza `mark`, `ins` e `del` do `<SourceCode>`.
 *
 * No Expressive Code, uma string em `mark` e sempre um marcador de *texto* —
 * intervalos de linha precisam de numero ou de `{ range: '5-8' }`. Aqui, uma
 * string composta so por numeros, hifens e virgulas e interpretada como
 * intervalo de linhas, de modo que `mark="5-8"` funcione como no bloco de
 * codigo Markdown. Qualquer outra string continua sendo marcador de texto, e
 * numeros, regexes e objetos passam intactos.
 */
export function normalizeMarkers(value: MarkerProp | undefined): MarkerProp | undefined {
  if (value === undefined) return undefined;

  return Array.isArray(value)
    ? (value.map((item) => normalizeMarker(item as MarkerDefinition)) as MarkerProp)
    : normalizeMarker(value as MarkerDefinition);
}
