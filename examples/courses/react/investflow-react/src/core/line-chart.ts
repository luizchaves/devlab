import type { Series } from './evolution';

// #region scale
export type ScaledPoint = { month: string; value: number | null; x: number; y: number | null };
export type ScaledSeries = Omit<Series, 'points'> & { points: ScaledPoint[] };

/**
 * Duas ou três séries no mesmo eixo de tempo. Um ponto com `value` nulo vira
 * lacuna na linha (o caminho é interrompido), e não zero (CA07.6).
 */
export function scalePoints(series: Series[], { width = 720, height = 260, paddingLeft = 56, paddingRight = 24, paddingTop = 36, paddingBottom = 32 } = {}) {
  const months = [...new Set(series.flatMap((s) => s.points.map((p) => p.month)))].sort();
  const values = series.flatMap((s) => s.points.map((p) => p.value)).filter((v): v is number => v != null);
  const max = Math.max(...values, 0) || 1;
  const innerWidth = Math.max(10, width - paddingLeft - paddingRight);
  const innerHeight = Math.max(10, height - paddingTop - paddingBottom);

  const xOf = (month: string) => paddingLeft + (months.indexOf(month) / Math.max(months.length - 1, 1)) * innerWidth;
  const yOf = (value: number) => height - paddingBottom - (value / max) * innerHeight;

  const scaled: ScaledSeries[] = series.map((s) => ({
    ...s,
    points: months.map((month) => {
      const p = s.points.find((q) => q.month === month);
      return { month, value: p?.value ?? null, x: xOf(month), y: p?.value == null ? null : yOf(p.value) };
    }),
  }));

  return { months, max, paddingLeft, paddingRight, paddingTop, paddingBottom, innerWidth, innerHeight, series: scaled };
}

/** `M x y L x y …` com um `M` novo depois de cada lacuna. */
export function pathOf(points: ScaledPoint[]): string {
  let d = '';
  let pen = false;
  for (const p of points) {
    if (p.y == null) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    pen = true;
  }
  return d.trim();
}
// #endregion
