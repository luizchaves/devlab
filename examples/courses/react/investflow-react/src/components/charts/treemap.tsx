'use client';

import { motion } from 'motion/react';
import { fitText, layout, type TreemapItem } from '@/core/treemap';
import { formatMoney } from '@/lib/format';
import { usePreferences } from '@/store/preferences';

const PALETTE = ['#059669', '#2563eb', '#7c3aed', '#d97706', '#e11d48', '#0891b2', '#65a30d', '#9333ea'];
const WIDTH = 720;
const HEIGHT = 400;

// #region treemap
/**
 * Treemap em SVG: o layout vem de `core/treemap.ts`; aqui só desenha. Cada
 * bloco leva um `<title>` (tooltip nativo, acessível) e anima a entrada.
 */
export function Treemap({ items }: { items: TreemapItem[] }) {
  const hideValues = usePreferences((s) => s.hideValues);
  const rects = layout(items, WIDTH, HEIGHT);
  const total = rects.reduce((a, r) => a + r.value, 0);
  const money = (v: number) => (hideValues ? '••••••' : formatMoney(v));

  if (rects.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700">Sem posições para agrupar.</p>;
  }

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="Treemap da carteira">
      {rects.map((r, i) => {
        const pct = total ? (r.value / total) * 100 : 0;
        const twoLines = r.h >= 34;
        const labelSize = twoLines ? 12 : 10;
        const label = r.h >= 18 ? fitText(r.label, r.w - 12, labelSize) : '';
        const value = twoLines ? fitText(`${money(r.value)} (${pct.toFixed(1)}%)`, r.w - 12, 11) : '';
        return (
          <motion.g key={r.label} data-tile data-label={r.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
            <title>{`${r.label}: ${money(r.value)} (${pct.toFixed(1)}%)`}</title>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={PALETTE[i % PALETTE.length]} stroke="#fff" strokeWidth={2} rx={4} />
            {label && (
              <text x={r.x + 6} y={twoLines ? r.y + 20 : r.y + r.h / 2 + labelSize / 3} fill="#fff" fontSize={labelSize} fontWeight={600} pointerEvents="none">
                {label}
              </text>
            )}
            {value && (
              <text x={r.x + 6} y={r.y + 36} fill="#fff" fontSize={11} pointerEvents="none">
                {value}
              </text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
// #endregion
