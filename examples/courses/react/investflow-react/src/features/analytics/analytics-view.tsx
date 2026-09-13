'use client';

import { useQuery } from '@tanstack/react-query';
import { Money } from '@/components/money';
import type { AnalyticsSummary } from '@/core/returns';
import { api } from '@/lib/http';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';
import { AllocationList } from './allocation-list';
import { EvolutionChart } from './evolution-chart';
import { ReturnsMatrix } from './returns-matrix';

export function useAnalytics(initialData: AnalyticsSummary) {
  return useQuery({ queryKey: ['analytics'], queryFn: () => api<AnalyticsSummary>('/api/analytics'), initialData });
}

// #region view
export function AnalyticsView({ initial }: { initial: AnalyticsSummary }) {
  const { data = initial } = useAnalytics(initial);
  const positive = data.totals.unrealized >= 0;

  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold">Rentabilidade</h1>
        <p className="text-sm text-slate-500">Retorno mês a mês, acumulado do ano e distribuição por classe.</p>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Valor atual">
          <Money value={data.totals.value} data-kpi="value" />
        </Kpi>
        <Kpi label="Total investido">
          <Money value={data.totals.cost} data-kpi="cost" />
        </Kpi>
        <Kpi label={positive ? 'Lucro' : 'Prejuízo'} className={positive ? 'text-emerald-600' : 'text-rose-600'}>
          <Money value={data.totals.unrealized} data-kpi="unrealized" />
          <span className="mt-1 block text-xs font-medium" data-kpi="returnPct">
            {data.totals.returnPct == null ? '—' : formatPercent(data.totals.returnPct)}
          </span>
        </Kpi>
        <Kpi label="Realizado">
          <Money value={data.totals.realized} data-kpi="realized" />
        </Kpi>
      </dl>

      <EvolutionChart evolution={data.evolution} movementMonths={data.movementMonths} />

      <div>
        <h2 className="mb-3 text-lg font-bold">Matriz de rentabilidade</h2>
        <ReturnsMatrix rows={data.monthlyReturns} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-bold">Distribuição por classe</h2>
        <AllocationList allocation={data.allocation} />
      </div>
    </section>
  );
}
// #endregion

function Kpi({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
      <dd className={cn('mt-2 text-lg font-bold sm:text-2xl', className)}>{children}</dd>
    </div>
  );
}
