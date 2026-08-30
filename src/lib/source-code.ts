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

/**
 * Reposiciona `mark`, `ins` e `del` de um trecho parcial.
 *
 * Em um `<SourceCode>` com `lines`, `startLine` ou `region`, o autor escreve os
 * marcadores usando a numeracao do **arquivo original** — a mesma que aparece na
 * calha quando `preserveLineNumbers` esta ativo. O Expressive Code, porem, conta
 * as linhas a partir do inicio do trecho recebido. Esta funcao converte de uma
 * numeracao para a outra, descartando intervalos que ficam fora do trecho e
 * recortando os que so entram em parte. Marcadores de texto (strings livres,
 * regexes) passam intactos.
 */
export function offsetMarkers(
  value: MarkerProp | undefined,
  firstLineNumber: number,
  lineCount: number
): MarkerProp | undefined {
  if (value === undefined || firstLineNumber <= 1) return value;

  const shiftRange = (range: string): string | undefined => {
    const parts: string[] = [];

    for (const chunk of range.split(',')) {
      const bounds = chunk.split('-').map((n) => Number.parseInt(n, 10));
      if (bounds.some(Number.isNaN)) return range;

      const from = Math.max(1, (bounds[0] as number) - firstLineNumber + 1);
      const to = Math.min(lineCount, (bounds[1] ?? bounds[0] ?? 0) - firstLineNumber + 1);

      if (to < from || from > lineCount || to < 1) continue;

      parts.push(from === to ? `${from}` : `${from}-${to}`);
    }

    return parts.length > 0 ? parts.join(',') : undefined;
  };

  const shift = (item: MarkerDefinition): MarkerDefinition | undefined => {
    if (typeof item === 'number') {
      const line = item - firstLineNumber + 1;
      return line >= 1 && line <= lineCount ? (line as MarkerDefinition) : undefined;
    }

    if (typeof item === 'string' && LINE_RANGE.test(item)) {
      const shifted = shiftRange(item.replace(/\s+/g, ''));
      return shifted === undefined ? undefined : (shifted as MarkerDefinition);
    }

    if (item && typeof item === 'object' && 'range' in item && typeof item.range === 'string') {
      const shifted = shiftRange(item.range.replace(/\s+/g, ''));
      return shifted === undefined ? undefined : ({ ...item, range: shifted } as MarkerDefinition);
    }

    return item;
  };

  if (Array.isArray(value)) {
    const items = (value as readonly MarkerDefinition[])
      .map(shift)
      .filter((item): item is MarkerDefinition => item !== undefined);

    return items as MarkerProp;
  }

  return shift(value as MarkerDefinition) as MarkerProp | undefined;
}
