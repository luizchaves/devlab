'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BarChart } from '@/components/charts/bar-chart';
import { Money } from '@/components/money';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Segmented } from '@/components/ui/toggle';
import { monthlyMovements, movementKpis, movements } from '@/core/movements';
import type { AssetWithTransactions } from '@/core/portfolio';
import { useExchange } from '@/components/exchange-provider';
import { useAssets } from '@/features/portfolio/queries';
import { formatDate } from '@/lib/format';
import { useUrlState } from '@/lib/url-state';
import { MovementDialog } from './movement-dialog';
import { ReceiptLink } from './receipt-link';

// #region view
/** Aportes e resgates (CA09.12–CA09.15): KPIs, barras por mês e o extrato, com filtro e janela na URL. */
export function MovementsView({ initialAssets }: { initialAssets: AssetWithTransactions[] }) {
  const { data: assets = [] } = useAssets(initialAssets);
  const [{ asset, range }, setParams] = useUrlState({ asset: '', range: 'all' });
  const [open, setOpen] = useState(false);

  const { rateOf } = useExchange();
  const list = useMemo(() => movements(asset ? assets.filter((a) => a.id === asset) : assets, { rateOf }), [assets, asset, rateOf]);
  const kpis = useMemo(() => movementKpis(list), [list]);
  const bars = useMemo(() => monthlyMovements(list, range as 'all' | '2y' | '1y'), [list, range]);

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Aportes</h1>
          <p className="text-sm text-slate-500">Extrato de compras e vendas, com o fluxo por mês.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select data-filter-asset aria-label="Filtrar por ativo" className="w-auto min-w-40" value={asset} onChange={(e) => setParams({ asset: e.target.value })}>
            <option value="">Todos os ativos</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.ticker}
              </option>
            ))}
          </Select>
          <Button onClick={() => setOpen(true)} data-new-transaction disabled={assets.length === 0}>
            <Plus className="size-4" aria-hidden /> Novo lançamento
          </Button>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Aportado líquido">
          <Money value={kpis.netInvested} data-kpi="net-invested" />
        </Kpi>
        <Kpi label="Total de compras" className="text-emerald-600">
          <Money value={kpis.totalBuys} data-kpi="total-buys" />
        </Kpi>
        <Kpi label="Total de vendas" className="text-rose-600">
          <Money value={kpis.totalSells} data-kpi="total-sells" />
        </Kpi>
        <Kpi label="Lançamentos">
          <span data-kpi="count">{kpis.count === 1 ? '1 lançamento' : `${kpis.count} lançamentos`}</span>
        </Kpi>
      </dl>

      <div data-movements-chart className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Por mês</h2>
          <Segmented label="Janela" attribute="data-movements-range" value={range} onChange={(value) => setParams({ range: value })} options={[{ value: 'all', label: 'Tudo' }, { value: '2y', label: '2 anos' }, { value: '1y', label: 'Ano' }]} />
        </div>
        <BarChart points={bars} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase dark:bg-slate-800/50">
            <tr>
              <th className="px-3 py-2.5">Data</th>
              <th className="px-3 py-2.5">Ativo</th>
              <th className="px-3 py-2.5">Tipo</th>
              <th className="hidden px-3 py-2.5 text-right sm:table-cell">Qtd.</th>
              <th className="hidden px-3 py-2.5 text-right md:table-cell">Preço</th>
              <th className="px-3 py-2.5 text-right">Total</th>
              <th className="px-3 py-2.5 text-center">Anexo</th>
            </tr>
          </thead>
          <tbody data-movements-tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((m) => (
              <tr key={m.id} className="tabular-nums">
                <td className="px-3 py-2.5">{formatDate(m.transactionDate)}</td>
                <td className="px-3 py-2.5 font-semibold">{m.ticker}</td>
                <td className={m.type === 'buy' ? 'px-3 py-2.5 text-emerald-600' : 'px-3 py-2.5 text-rose-600'}>{m.type === 'buy' ? 'Compra' : 'Venda'}</td>
                <td className="hidden px-3 py-2.5 text-right sm:table-cell">{m.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
                <td className="hidden px-3 py-2.5 text-right md:table-cell">
                  <Money value={m.price} currency={m.currency} />
                </td>
                <td className="px-3 py-2.5 text-right font-semibold">
                  <Money value={m.total} />
                </td>
                <td className="px-3 py-2.5 text-center">{m.receiptPath && <ReceiptLink transactionId={m.id} receiptPath={m.receiptPath} />}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhuma movimentação ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && <MovementDialog open onOpenChange={setOpen} assets={assets} />}
    </section>
  );
}
// #endregion

function Kpi({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
      <dd className={`mt-2 text-lg font-bold sm:text-2xl ${className ?? ''}`}>{children}</dd>
    </div>
  );
}
