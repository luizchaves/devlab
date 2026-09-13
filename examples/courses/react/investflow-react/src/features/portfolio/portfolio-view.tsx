'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { filterAssets, footerTotals, type AssetFilter } from '@/core/organize';
import { totals, type AssetWithTransactions } from '@/core/portfolio';
import { cn } from '@/lib/cn';
import { useUrlState } from '@/lib/url-state';
import { AssetFormDialog } from './asset-form-dialog';
import { AssetsTable } from './assets-table';
import { PortfolioKpis } from './portfolio-kpis';
import { useAssets, useDeleteAsset, useUpdateQuotes } from './queries';

// #region view
/**
 * A carteira: começa com os dados que o Server Component já carregou
 * (`initialData`) e, a partir daí, o React Query mantém tudo atualizado.
 */
export function PortfolioView({ initialAssets }: { initialAssets: AssetWithTransactions[] }) {
  const { data: assets = [] } = useAssets(initialAssets);
  const remove = useDeleteAsset();
  const updateQuotes = useUpdateQuotes();
  const [dialog, setDialog] = useState<{ mode: 'create' } | { mode: 'edit'; asset: AssetWithTransactions } | null>(null);
  const [deleting, setDeleting] = useState<AssetWithTransactions | null>(null);
  const summary = useMemo(() => totals(assets), [assets]);

  // Filtro, ordenação e direção ficam na URL; o padrão some dela (CA08.17).
  const [view, setView] = useUrlState({ filter: 'active', sort: 'ticker', dir: 'asc' });
  const visible = useMemo(() => filterAssets(assets, view.filter as AssetFilter), [assets, view.filter]);
  const footer = useMemo(() => footerTotals(visible), [visible]);

  const refreshQuotes = async () => {
    try {
      const summary = await updateQuotes.mutateAsync({});
      const failed = summary.failed.map((f) => f.ticker);
      if (failed.length) toast.warning(`${summary.updated} atualizado(s); sem cotação: ${failed.join(', ')}.`);
      else toast.success(`${summary.updated} cotação(ões) atualizada(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível atualizar as cotações.');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success(`${deleting.ticker} excluído.`);
      setDeleting(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível excluir.');
    }
  };

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carteira</h1>
          <p className="text-sm text-slate-500">Seus ativos, posições e resultado.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Button variant="secondary" onClick={refreshQuotes} pending={updateQuotes.isPending} data-update-quotes>
            <RefreshCw className="size-4" aria-hidden /> Atualizar cotações
          </Button>
          <Button onClick={() => setDialog({ mode: 'create' })} data-new-asset>
            <Plus className="size-4" aria-hidden /> Novo ativo
          </Button>
        </div>
      </header>

      <PortfolioKpis totals={summary} />

      <div role="group" aria-label="Filtro" className="inline-flex w-fit rounded-lg border border-slate-200 p-0.5 text-xs dark:border-slate-700">
        {(
          [
            ['active', 'Posições ativas'],
            ['all', 'Todos os ativos'],
          ] as const
        ).map(([value, label]) => (
          <button key={value} type="button" data-filter={value} aria-pressed={view.filter === value} onClick={() => setView({ filter: value })} className={cn('min-h-9 rounded-md px-3 font-medium', view.filter === value ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p data-empty className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700">
          {assets.length === 0 ? 'Nenhum ativo ainda. Cadastre o primeiro em “Novo ativo”.' : 'Nenhuma posição ativa. Veja “Todos os ativos”.'}
        </p>
      ) : (
        <AssetsTable
          assets={visible}
          sorting={[{ id: view.sort, desc: view.dir === 'desc' }]}
          onSortingChange={(next) => setView({ sort: next[0]?.id ?? 'ticker', dir: next[0]?.desc ? 'desc' : 'asc' })}
          footer={footer}
          onEdit={(asset) => setDialog({ mode: 'edit', asset })}
          onDelete={setDeleting}
        />
      )}

      {dialog && (
        <AssetFormDialog
          key={dialog.mode === 'edit' ? dialog.asset.id : 'create'}
          open
          onOpenChange={(open) => !open && setDialog(null)}
          asset={dialog.mode === 'edit' ? dialog.asset : null}
        />
      )}

      <AlertDialog
        open={deleting != null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Excluir ${deleting?.ticker ?? ''}?`}
        description="Os lançamentos desse ativo também serão removidos. Essa ação não pode ser desfeita."
        pending={remove.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
// #endregion
