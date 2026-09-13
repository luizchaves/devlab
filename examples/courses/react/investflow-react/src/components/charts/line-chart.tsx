'use client';

import type { Series } from '@/core/evolution';
import { pathOf, scalePoints } from '@/core/line-chart';
import { formatMoney } from '@/lib/format';
import { usePreferences } from '@/store/preferences';

// #region chart
/**
 * Gráfico de linhas em SVG: a escala vem de `core/line-chart.ts`. Um mês sem
 * valor interrompe a linha (CA07.6). Pontos são círculos com `<title>`.
 */
export function LineChart({ series, width = 720, height = 260 }: { series: Series[]; width?: number; height?: number }) {
  const hideValues = usePreferences((s) => s.hideValues);
  const money = (v: number) => (hideValues ? '••••••' : formatMoney(v));
  const paddingLeft = hideValues ? 60 : Math.ceil(Math.max(...[0, 0.5, 1].map((f) => money(f * Math.max(...series.flatMap((s) => s.points.map((p) => p.value ?? 0)), 1)).length)) * 6 + 14);
  const scaled = scalePoints(series, { width, height, paddingLeft });
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const label = (month: string) => `${month.slice(5, 7)}/${month.slice(2, 4)}`;
  const labelEvery = Math.max(1, Math.ceil(scaled.months.length / 8));

  if (scaled.months.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700">Sem meses com cotação para desenhar.</p>;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full text-slate-500" role="img" aria-label="Aportes e valor de mercado por mês">
      {ticks.map((t) => {
        const y = height - scaled.paddingBottom - t * scaled.innerHeight;
        return (
          <g key={t}>
            <line x1={scaled.paddingLeft} x2={width - scaled.paddingRight} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.15} />
            <text x={scaled.paddingLeft - 6} y={y + 4} fontSize={10} textAnchor="end" fill="currentColor">
              {money(t * scaled.max)}
            </text>
          </g>
        );
      })}
      {scaled.months.map((m, i) =>
        i % labelEvery === 0 || i === scaled.months.length - 1 ? (
          <text key={m} x={scaled.series[0].points[i].x} y={height - 10} fontSize={10} textAnchor="middle" fill="currentColor">
            {label(m)}
          </text>
        ) : null
      )}
      {scaled.series.map((s) => (
        <g key={s.name}>
          <path data-series={s.name} d={pathOf(s.points)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {s.points.map((p) =>
            p.y == null ? null : (
              <circle key={p.month} cx={p.x} cy={p.y} r={3.5} fill={s.color} stroke="#fff" strokeWidth={1.5}>
                <title>{`${s.name} · ${label(p.month)}: ${money(p.value ?? 0)}`}</title>
              </circle>
            )
          )}
        </g>
      ))}
      {scaled.series.map((s, i) => (
        <g key={`legend-${s.name}`} transform={`translate(${scaled.paddingLeft + i * 150}, 16)`}>
          <rect width={12} height={12} rx={3} fill={s.color} />
          <text x={16} y={10} fontSize={11} fill="currentColor">
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
// #endregion
