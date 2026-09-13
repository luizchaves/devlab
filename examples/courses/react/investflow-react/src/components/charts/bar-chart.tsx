'use client';

import { formatMoney } from '@/lib/format';
import { usePreferences } from '@/store/preferences';

export type BarPoint = { month: string; buys: number; sells: number };

// #region chart
/** Barras por mês: compras para cima em verde, vendas em rosa (CA09.13). */
export function BarChart({ points, width = 720, height = 220 }: { points: BarPoint[]; width?: number; height?: number }) {
  const hideValues = usePreferences((s) => s.hideValues);
  const money = (v: number) => (hideValues ? '••••••' : formatMoney(v));
  const max = Math.max(...points.flatMap((p) => [p.buys, p.sells]), 0) || 1;
  const paddingLeft = 64;
  const paddingBottom = 28;
  const paddingTop = 12;
  const innerWidth = width - paddingLeft - 16;
  const innerHeight = height - paddingTop - paddingBottom;
  const slot = innerWidth / Math.max(points.length, 1);
  const bar = Math.max(4, Math.min(28, slot * 0.35));
  const label = (month: string) => `${month.slice(5, 7)}/${month.slice(2, 4)}`;

  if (points.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700">Sem movimentações na janela.</p>;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full text-slate-500" role="img" aria-label="Aportes e resgates por mês">
      {[0, 0.5, 1].map((t) => {
        const y = height - paddingBottom - t * innerHeight;
        return (
          <g key={t}>
            <line x1={paddingLeft} x2={width - 16} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.15} />
            <text x={paddingLeft - 6} y={y + 4} fontSize={10} textAnchor="end" fill="currentColor">
              {money(t * max)}
            </text>
          </g>
        );
      })}
      {points.map((p, i) => {
        const x = paddingLeft + i * slot + slot / 2;
        const hb = (p.buys / max) * innerHeight;
        const hs = (p.sells / max) * innerHeight;
        return (
          <g key={p.month} data-month={p.month}>
            <rect x={x - bar - 1} y={height - paddingBottom - hb} width={bar} height={hb} rx={2} fill="#059669">
              <title>{`Compras ${label(p.month)}: ${money(p.buys)}`}</title>
            </rect>
            <rect x={x + 1} y={height - paddingBottom - hs} width={bar} height={hs} rx={2} fill="#e11d48">
              <title>{`Vendas ${label(p.month)}: ${money(p.sells)}`}</title>
            </rect>
            <text x={x} y={height - 10} fontSize={10} textAnchor="middle" fill="currentColor">
              {label(p.month)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
// #endregion
