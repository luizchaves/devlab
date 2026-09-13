'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Money } from '@/components/money';
import type { AdminPayload, ServiceCheck } from '@/core/admin';
import { api } from '@/lib/http';
import { cn } from '@/lib/cn';

const CHECK_LABELS: Record<ServiceCheck, string> = {
  database: 'Banco de dados',
  storage: 'Storage',
  quotes: 'Cotações (24 h)',
  jobs: 'Rodadas',
};

// #region view
/** Painel do administrador: só agregados e status dos serviços (RNF05). */
export function AdminView({ initial }: { initial: AdminPayload }) {
  const { data = initial } = useQuery({ queryKey: ['admin'], queryFn: () => api<AdminPayload>('/api/admin/metrics'), initialData: initial, refetchInterval: 60_000 });

  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <p className="text-sm text-slate-500">Operação global: contas, patrimônio sob gestão e serviços.</p>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Kpi label="Contas ativas">
          <span data-metric="activeAccounts">{data.metrics.activeAccounts}</span>
        </Kpi>
        <Kpi label="Patrimônio sob gestão (AUM)">
          <Money value={data.metrics.aum} data-metric="aum" />
        </Kpi>
        <Kpi label="Última rodada de cotações">
          <span data-metric="lastQuoteRun" className="text-base">
            {data.metrics.lastQuoteRun ? new Date(data.metrics.lastQuoteRun).toLocaleString('pt-BR') : '—'}
          </span>
        </Kpi>
      </dl>

      <div>
        <h2 className="mb-3 text-lg font-bold">Status dos serviços</h2>
        <ul data-status className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {(Object.keys(CHECK_LABELS) as ServiceCheck[]).map((key) => {
            const up = data.checks[key];
            return (
              <li key={key} data-check={key} data-status={up ? 'up' : 'down'} className={cn('flex items-center gap-2 rounded-xl border px-3 py-3', up ? 'border-emerald-200 dark:border-emerald-900' : 'border-rose-200 dark:border-rose-900')}>
                {up ? <CheckCircle2 className="size-4 text-emerald-600" aria-hidden /> : <XCircle className="size-4 text-rose-600" aria-hidden />}
                <span>{CHECK_LABELS[key]}</span>
                <span className="sr-only">{up ? 'no ar' : 'fora'}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
// #endregion

function Kpi({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
      <dd className="mt-2 text-lg font-bold sm:text-2xl">{children}</dd>
    </div>
  );
}
