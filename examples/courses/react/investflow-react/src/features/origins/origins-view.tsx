'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Treemap } from '@/components/charts/treemap';
import { Money } from '@/components/money';
import { Segmented } from '@/components/ui/toggle';
import { DIMENSION_LABELS, groupBy, type OriginDimension, type OriginRow } from '@/core/origins';
import { api } from '@/lib/http';
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
        <Segmented label="Recorte" attribute="data-dimension" value={dimension} onChange={setDimension} options={DIMENSIONS.map((d) => ({ value: d, label: DIMENSION_LABELS[d] }))} />
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
