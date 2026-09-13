'use client';

import { motion } from 'motion/react';
import { Money } from '@/components/money';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS } from '@/core/portfolio';
import type { AllocationSlice } from '@/core/returns';
import { formatPercent } from '@/lib/format';

const BAR: Record<AllocationSlice['category'], string> = {
  renda_fixa: 'bg-sky-500',
  acoes: 'bg-emerald-500',
  fiis: 'bg-amber-500',
  etfs: 'bg-violet-500',
  fi_infra: 'bg-teal-500',
  fundos: 'bg-indigo-500',
  cripto: 'bg-orange-500',
};

// #region list
/** Distribuição por classe: uma barra por categoria, animada pelo Motion. */
export function AllocationList({ allocation }: { allocation: AllocationSlice[] }) {
  if (allocation.length === 0) {
    return <p className="text-sm text-slate-500">Sem posições para distribuir.</p>;
  }

  return (
    <ul data-allocation className="grid gap-3">
      {allocation.map((slice) => (
        <li key={slice.category} data-category={slice.category} className="grid gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <Badge tone={slice.category}>{CATEGORY_LABELS[slice.category]}</Badge>
            <span className="tabular-nums">
              <Money value={slice.value} /> · {formatPercent(slice.share)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden>
            <motion.div className={`h-full rounded-full ${BAR[slice.category]}`} initial={{ width: 0 }} animate={{ width: `${slice.share * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
// #endregion
