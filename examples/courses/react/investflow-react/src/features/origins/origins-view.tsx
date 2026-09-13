'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Treemap } from '@/components/charts/treemap';
import { Money } from '@/components/money';
import { DIMENSION_LABELS, groupBy, type OriginDimension, type OriginRow } from '@/core/origins';
import { api } from '@/lib/http';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

const DIMENSIONS = Object.keys(DIMENSION_LABELS) as OriginDimension[];

// #region view
/** Carteira pela origem: o recorte troca no cliente, sem recarregar (CA07.2). */
export function OriginsView({ initialRows }: { initialRows: OriginRow[] }) {
  const { data: rows = initialRows } = useQuery({ queryKey: ['origins'], queryFn: () => api<{ rows: OriginRow[] }>('/api/origins').then((r) => r.rows), initialData: initialRows });
  const [dimension, setDimension] = useState<OriginDimension>('broker');
  const groups = groupBy(rows, dimension);
  const total = groups.reduce((a, g) => a + g.value, 0);

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Origem</h1>
          <p className="text-sm text-slate-500">A carteira agrupada por corretora, categoria ou emissor.</p>
        </div>
        <div role="group" aria-label="Recorte" className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs dark:border-slate-700">
          {DIMENSIONS.map((d) => (
            <button key={d} type="button" data-dimension={d} aria-pressed={d === dimension} onClick={() => setDimension(d)} className={cn('min-h-9 rounded-md px-3 font-medium', d === dimension ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
              {DIMENSION_LABELS[d]}
            </button>
          ))}
        </div>
      </header>

      <div data-treemap data-dimension={dimension} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <Treemap items={groups} />
      </div>

      <ul data-legend className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <li key={g.label} data-label={g.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
            <span className="truncate font-medium">{g.label}</span>
            <span className="tabular-nums text-slate-500">
              <Money value={g.value} /> · {formatPercent(total ? g.value / total : 0)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
// #endregion
