'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/toggle';
import { filterAssets, footerTotals, type AssetFilter } from '@/core/organize';
import { totals, type AssetWithTransactions } from '@/core/portfolio';
import { useUrlState } from '@/lib/url-state';
import { AssetFormDialog } from './asset-form-dialog';
import { AssetsTable } from './assets-table';
import { PortfolioKpis } from './portfolio-kpis';
import { useExchange } from '@/components/exchange-provider';
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
  const { latest: usdRate } = useExchange();
  const summary = useMemo(() => totals(assets, { usdRate }), [assets, usdRate]);

  // Filtro, ordenação e direção ficam na URL; o padrão some dela (CA08.17).
  const [view, setView] = useUrlState({ filter: 'active', sort: 'ticker', dir: 'asc', dividends: 'false' });
  const includeDividends = view.dividends === 'true';
  const visible = useMemo(() => filterAssets(assets, view.filter as AssetFilter), [assets, view.filter]);
  const footer = useMemo(() => footerTotals(visible, { includeDividends, usdRate }), [visible, includeDividends, usdRate]);

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

      <PortfolioKpis totals={summary} dividends={includeDividends ? footer?.dividends ?? 0 : 0} />

      <div className="flex flex-wrap gap-2">
        <Segmented
          label="Filtro"
          attribute="data-filter"
          value={view.filter as AssetFilter}
          onChange={(value) => setView({ filter: value })}
          options={[
            { value: 'active', label: 'Posições ativas' },
            { value: 'all', label: 'Todos os ativos' },
          ]}
        />
        <Segmented
          label="Proventos"
          attribute="data-dividends-include"
          value={view.dividends}
          onChange={(value) => setView({ dividends: value })}
          options={[
            { value: 'false', label: 'Sem proventos' },
            { value: 'true', label: 'Com proventos' },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <p data-empty className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700">
          {assets.length === 0 ? 'Nenhum ativo ainda. Cadastre o primeiro em “Novo ativo”.' : 'Nenhuma posição ativa. Veja “Todos os ativos”.'}
        </p>
      ) : (
        <AssetsTable
          assets={visible}
          usdRate={usdRate}
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
