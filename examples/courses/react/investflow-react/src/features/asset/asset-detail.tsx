'use client';

import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Money } from '@/components/money';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { CATEGORY_LABELS, investmentDuration, summarize, type AssetWithTransactions } from '@/core/portfolio';
import { isQuotable } from '@/core/quotes';
import { useAsset, useUpdateQuotes } from '@/features/portfolio/queries';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';
import { QuoteDialog } from './quote-dialog';
import { TransactionFormDialog } from './transaction-form-dialog';
import { TransactionsTable } from './transactions-table';

// #region detail
/** Tela do ativo (CA03.8): cabeçalho, KPIs da posição e o extrato de lançamentos. */
export function AssetDetail({ initialAsset }: { initialAsset: AssetWithTransactions }) {
  const { data: asset = initialAsset } = useAsset(initialAsset.id, initialAsset);
  const [open, setOpen] = useState(false);
  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; warning: string | null }>({ open: false, warning: null });
  const updateQuotes = useUpdateQuotes();
  const position = useMemo(() => summarize(asset), [asset]);
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
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold">
            <span data-field="name">{asset.name}</span>
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
        <div className="flex gap-2">
          <Button variant="secondary" onClick={refreshQuote} pending={updateQuotes.isPending} data-update-price>
            <RefreshCw className="size-4" aria-hidden /> {isQuotable(asset) ? 'Atualizar cotação' : 'Atualizar saldo'}
          </Button>
          <Button onClick={() => setOpen(true)} data-new-transaction>
            <Plus className="size-4" aria-hidden /> Novo lançamento
          </Button>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Tempo de investimento" sub={duration.subtitle}>
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
        <Kpi label="Rentabilidade" className={positive ? 'text-emerald-600' : 'text-rose-600'} sub={`Realizado: ${position.realized.toLocaleString('pt-BR', { style: 'currency', currency: asset.currency })}`}>
          <span data-kpi="returnPct">{position.returnPct == null ? '—' : formatPercent(position.returnPct)}</span>
        </Kpi>
      </dl>

      <div>
        <h2 className="mb-3 text-lg font-bold">Lançamentos</h2>
        <TransactionsTable transactions={asset.transactions} currency={asset.currency} />
      </div>

      <TransactionFormDialog key={asset.transactions.length} open={open} onOpenChange={setOpen} asset={asset} />
      <QuoteDialog open={quoteDialog.open} onOpenChange={(next) => setQuoteDialog((s) => ({ ...s, open: next }))} asset={asset} warning={quoteDialog.warning} />
    </section>
  );
}
// #endregion

function Kpi({ label, sub, className, children }: { label: string; sub?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</dt>
      <dd className={cn('mt-2 text-2xl font-bold', className)}>{children}</dd>
      {sub && <dd className="mt-1 text-xs text-slate-500">{sub}</dd>}
    </div>
  );
}
