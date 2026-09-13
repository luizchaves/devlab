'use client';

import { Money } from '@/components/money';
import type { PortfolioTotals } from '@/core/portfolio';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

// #region kpis
/** Os quatro números da carteira: valor, custo, resultado e posições ativas. */
export function PortfolioKpis({ totals }: { totals: PortfolioTotals }) {
  const positive = totals.unrealized >= 0;

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="Valor atual">
        <Money value={totals.value} data-kpi="value" />
      </Kpi>
      <Kpi label="Total investido">
        <Money value={totals.cost} data-kpi="cost" />
      </Kpi>
      <Kpi label={positive ? 'Lucro' : 'Prejuízo'} className={positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
        <Money value={totals.unrealized} data-kpi="unrealized" />
        <span className="mt-1 block text-xs font-medium" data-kpi="returnPct">
          {totals.returnPct == null ? '—' : formatPercent(totals.returnPct)}
        </span>
      </Kpi>
      <Kpi label="Ativos" className="text-indigo-600 dark:text-indigo-400">
        <span data-kpi="activeAssets">{totals.activeAssets}</span>
        <span className="mt-1 block text-xs font-medium text-slate-500">Posições ativas</span>
      </Kpi>
    </dl>
  );
}
// #endregion

function Kpi({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
      <dd className={cn('mt-2 text-2xl font-bold', className)}>{children}</dd>
    </div>
  );
}
