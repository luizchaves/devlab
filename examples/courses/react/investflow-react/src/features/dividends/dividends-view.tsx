'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Money } from '@/components/money';
import { Select } from '@/components/ui/select';
import { Segmented } from '@/components/ui/toggle';
import { buildDividendsMatrix, dividendsSummary, topPayers, type DividendsSummary, type ReceivedDividend } from '@/core/dividends';
import { api } from '@/lib/http';
import { formatDate, formatPercent } from '@/lib/format';
import { useUrlState } from '@/lib/url-state';

export type DividendsPayload = { assets: { id: string; ticker: string; name: string }[]; items: ReceivedDividend[]; summary: DividendsSummary };

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// #region view
/** Página de proventos (CA09.6, CA09.7): KPIs, extrato ou matriz, maiores pagadores; filtro e vista na URL. */
export function DividendsView({ initial }: { initial: DividendsPayload }) {
  const { data = initial } = useQuery({ queryKey: ['dividends'], queryFn: () => api<DividendsPayload>('/api/dividends'), initialData: initial });
  const [{ asset, view }, setParams] = useUrlState({ asset: '', view: 'list' });

  const items = useMemo(() => (asset ? data.items.filter((d) => d.assetId === asset) : data.items), [data.items, asset]);
  // O filtro por ativo vale para KPIs e extrato ao mesmo tempo.
  const summary = useMemo(() => (asset ? dividendsSummary([], items) : data.summary), [asset, items, data.summary]);
  const matrix = useMemo(() => buildDividendsMatrix(items), [items]);
  const payers = useMemo(() => topPayers(data.items), [data.items]);

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Proventos</h1>
          <p className="text-sm text-slate-500">O que a carteira pagou, por mês e por ativo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select data-filter-asset aria-label="Filtrar por ativo" className="w-auto min-w-40" value={asset} onChange={(e) => setParams({ asset: e.target.value })}>
            <option value="">Todos os ativos</option>
            {data.assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.ticker}
              </option>
            ))}
          </Select>
          <Segmented label="Vista" attribute="data-dividends-view" value={view} onChange={(value) => setParams({ view: value })} options={[{ value: 'list', label: 'Extrato' }, { value: 'matrix', label: 'Matriz' }]} />
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Total recebido">
          <Money value={summary.total} data-kpi="total-dividends" />
        </Kpi>
        <Kpi label="Últimos 12 meses">
          <Money value={summary.lastTwelveMonths} data-kpi="ltm-dividends" />
        </Kpi>
        <Kpi label="Média mensal">
          <Money value={summary.monthlyAverage} data-kpi="avg-monthly" />
        </Kpi>
        <Kpi label="Yield on cost médio">
          <span data-kpi="avg-yoc">{summary.averageYieldOnCost == null ? '—' : formatPercent(summary.averageYieldOnCost)}</span>
        </Kpi>
      </dl>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {view === 'matrix' ? (
          <div data-dividends-matrix className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="sticky left-0 bg-slate-50 px-2 py-2 text-left dark:bg-slate-800">Ano</th>
                  {MONTHS.map((m) => (
                    <th key={m} className="px-1 py-2">
                      {m}
                    </th>
                  ))}
                  <th className="px-2 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {matrix.years.map((year) => (
                  <tr key={year}>
                    <td className="sticky left-0 bg-white px-2 py-2 font-bold dark:bg-slate-900">{year}</td>
                    {matrix.matrix[year].map((value, i) => (
                      <td key={i} className="px-1 py-2 text-center whitespace-nowrap tabular-nums">
                        {value ? <Money value={value} /> : <span className="text-slate-400">—</span>}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center font-semibold tabular-nums">
                      <Money value={matrix.yearTotals[year]} />
                    </td>
                  </tr>
                ))}
                {matrix.years.length === 0 && (
                  <tr>
                    <td colSpan={14} className="px-4 py-8 text-center text-sm text-slate-500">
                      Nenhum provento recebido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase dark:bg-slate-800/50">
                <tr>
                  <th className="px-3 py-2.5">Pagamento</th>
                  <th className="px-3 py-2.5">Ativo</th>
                  <th className="hidden px-3 py-2.5 text-right md:table-cell">Por cota</th>
                  <th className="hidden px-3 py-2.5 text-right sm:table-cell">Cotas</th>
                  <th className="px-3 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody data-dividends-tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((d) => (
                  <tr key={d.id} className="tabular-nums">
                    <td className="px-3 py-2.5">{formatDate(d.paymentDate)}</td>
                    <td className="px-3 py-2.5 font-semibold">{d.ticker}</td>
                    <td className="hidden px-3 py-2.5 text-right md:table-cell">{d.rate.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                    <td className="hidden px-3 py-2.5 text-right sm:table-cell">{d.quantity.toLocaleString('pt-BR')}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">
                      <Money value={d.totalBRL} />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      Nenhum provento recebido. Sincronize o histórico na tela de cada ativo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div data-top-dividends className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-lg font-bold">Maiores pagadores</h2>
          {payers.length === 0 ? (
            <p className="text-sm text-slate-500">Sem proventos ainda.</p>
          ) : (
            <ol className="grid gap-2 text-sm">
              {payers.map((p, i) => (
                <li key={p.assetId} className="flex items-center justify-between gap-3">
                  <span>
                    <span className="mr-2 text-slate-400">{i + 1}.</span>
                    <span className="font-semibold">{p.ticker}</span>
                  </span>
                  <Money value={p.total} className="tabular-nums" />
                </li>
              ))}
            </ol>
          )}
        </div>
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
