'use client';

import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Money } from '@/components/money';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { CATEGORY_LABELS, investmentDuration, summarize, type AssetWithTransactions, type TransactionFact } from '@/core/portfolio';
import { isQuotable } from '@/core/quotes';
import { useAsset, useDeleteTransaction, useUpdateQuotes } from '@/features/portfolio/queries';
import { cn } from '@/lib/cn';
import { formatDate, formatPercent } from '@/lib/format';
import { isDividendEligible, receivedDividends, summarizeWithDividends } from '@/core/dividends';
import { EvolutionChart } from '@/features/analytics/evolution-chart';
import { Segmented } from '@/components/ui/toggle';
import { useUrlState } from '@/lib/url-state';
import { DividendsTab } from './dividends-tab';
import type { EvolutionRow } from '@/core/evolution';
import { QuoteDialog } from './quote-dialog';
import { TransactionFormDialog } from './transaction-form-dialog';
import { TransactionsTable } from './transactions-table';

// #region detail
/** Tela do ativo (CA03.8): cabeçalho, KPIs da posição e o extrato de lançamentos. */
export type AssetEvolution = { evolution: EvolutionRow[]; movementMonths: string[] };

export function AssetDetail({ initialAsset, evolution }: { initialAsset: AssetWithTransactions; evolution: AssetEvolution }) {
  const { data: asset = initialAsset } = useAsset(initialAsset.id, initialAsset);
  const [txDialog, setTxDialog] = useState<{ open: boolean; transaction: TransactionFact | null }>({ open: false, transaction: null });
  const [deleting, setDeleting] = useState<TransactionFact | null>(null);
  const removeTransaction = useDeleteTransaction();
  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; warning: string | null }>({ open: false, warning: null });
  const updateQuotes = useUpdateQuotes();
  const position = useMemo(() => summarize(asset), [asset]);
  const eligible = isDividendEligible(asset.category);
  const withDividends = useMemo(() => summarizeWithDividends(asset), [asset]);
  const dividendItems = useMemo(() => receivedDividends(asset), [asset]);
  const [{ tab }, setTab] = useUrlState({ tab: 'ledger' });
  const duration = useMemo(() => investmentDuration(asset.transactions), [asset.transactions]);
  const positive = (position.unrealized ?? 0) >= 0;

  // Ativo cotado busca no provedor (CA08.9); sem resposta, ou ativo por saldo, abre o diálogo manual (CA08.10).
  const refreshQuote = async () => {
    if (!isQuotable(asset)) {
      setQuoteDialog({ open: true, warning: null });
      return;
    }
    try {
      const summary = await updateQuotes.mutateAsync({ assetId: asset.id });
      if (summary.updated > 0) {
        toast.success(`Cotação de ${asset.ticker} atualizada.`);
        return;
      }
    } catch {
      // cai no diálogo manual com o aviso
    }
    setQuoteDialog({ open: true, warning: `Não foi possível buscar a cotação de ${asset.ticker}. Informe o valor manualmente.` });
  };

  return (
    <section className="grid gap-6" data-asset>
      <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit')}>
        <ArrowLeft className="size-4" aria-hidden /> Carteira
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold">
            <span data-field="name" className="break-words">{asset.name}</span>
            <span data-field="ticker" className="text-xl font-normal text-slate-400">
              {asset.ticker}
            </span>
            <Badge tone={asset.category}>{CATEGORY_LABELS[asset.category]}</Badge>
            {asset.currency === 'USD' && <Badge>USD</Badge>}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Corretora: <strong data-field="broker">{asset.broker?.name ?? '—'}</strong> · Emissor:{' '}
            <strong data-field="issuer">{asset.issuer ?? '—'}</strong>
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Button variant="secondary" onClick={refreshQuote} pending={updateQuotes.isPending} data-update-price>
            <RefreshCw className="size-4" aria-hidden /> {isQuotable(asset) ? 'Atualizar cotação' : 'Atualizar saldo'}
          </Button>
          <Button onClick={() => setTxDialog({ open: true, transaction: null })} data-new-transaction>
            <Plus className="size-4" aria-hidden /> Novo lançamento
          </Button>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Tempo de investimento" sub={duration.subtitle} subAttribute="durationSub">
          <span data-kpi="duration">{duration.text}</span>
        </Kpi>
        <Kpi label="Quantidade">
          <span data-kpi="quantity">{position.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</span>
        </Kpi>
        <Kpi label="Preço médio">
          <Money value={position.averagePrice} currency={asset.currency} data-kpi="averagePrice" />
        </Kpi>
        <Kpi label="Cotação atual">
          <Money value={asset.currentPrice} currency={asset.currency} data-kpi="currentPrice" />
        </Kpi>
        <Kpi label="Total investido">
          <Money value={position.cost} currency={asset.currency} data-kpi="cost" />
        </Kpi>
        <Kpi label="Valor atual">
          <Money value={position.value} currency={asset.currency} data-kpi="value" />
        </Kpi>
        <Kpi label="Rentabilidade" className={positive ? 'text-emerald-600' : 'text-rose-600'} sub={`Realizado: ${position.realized.toLocaleString('pt-BR', { style: 'currency', currency: asset.currency })}`} subAttribute="realized">
          <span data-kpi="returnPct">{position.returnPct == null ? '—' : formatPercent(position.returnPct)}</span>
        </Kpi>
        {eligible && (
          <div data-kpi-card="totalReturn" className="min-w-0 rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 dark:border-purple-900 dark:bg-slate-900">
            <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Retorno total</dt>
            <dd className="mt-2 text-lg font-bold text-purple-700 sm:text-2xl dark:text-purple-400" data-kpi="totalReturnPct">
              {withDividends.returnPct == null ? '—' : formatPercent(withDividends.returnPct)}
            </dd>
            <dd className="mt-1 text-xs text-purple-600 dark:text-purple-400" data-kpi="totalReturnSub">
              Valorização + realizado + <Money value={withDividends.dividendsBRL} /> em proventos
            </dd>
          </div>
        )}
      </dl>

      <EvolutionChart evolution={evolution.evolution} movementMonths={evolution.movementMonths} />

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{tab === 'dividends' ? 'Proventos' : 'Lançamentos'}</h2>
          {eligible && (
            <Segmented
              label="Aba"
              attribute="data-tab-btn"
              value={tab}
              onChange={(value) => setTab({ tab: value })}
              options={[
                { value: 'ledger', label: 'Lançamentos' },
                { value: 'dividends', label: `Proventos (${dividendItems.length})` },
              ]}
            />
          )}
        </div>
        {tab === 'dividends' && eligible ? (
          <DividendsTab asset={asset} />
        ) : (
          <TransactionsTable
            transactions={asset.transactions}
            currency={asset.currency}
            onEdit={(transaction) => setTxDialog({ open: true, transaction })}
            onDelete={setDeleting}
          />
        )}
      </div>

      {txDialog.open && (
        <TransactionFormDialog
          key={txDialog.transaction?.id ?? 'new'}
          open
          onOpenChange={(next) => !next && setTxDialog({ open: false, transaction: null })}
          asset={asset}
          transaction={txDialog.transaction}
        />
      )}
      <AlertDialog
        open={deleting != null}
        onOpenChange={(next) => !next && setDeleting(null)}
        title="Excluir lançamento?"
        description={deleting ? `O lançamento de ${formatDate(deleting.transactionDate)} será removido e a posição recalculada.` : ''}
        pending={removeTransaction.isPending}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await removeTransaction.mutateAsync(deleting.id);
            toast.success('Lançamento excluído.');
            setDeleting(null);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível excluir.');
          }
        }}
      />
      <QuoteDialog open={quoteDialog.open} onOpenChange={(next) => setQuoteDialog((s) => ({ ...s, open: next }))} asset={asset} warning={quoteDialog.warning} />
    </section>
  );
}
// #endregion

function Kpi({ label, sub, subAttribute, className, children }: { label: string; sub?: string; subAttribute?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
      <dd className={cn('mt-2 text-lg font-bold sm:text-2xl', className)}>{children}</dd>
      {sub && (
        <dd className="mt-1 text-xs text-slate-500" data-kpi={subAttribute}>
          {sub}
        </dd>
      )}
    </div>
  );
}
