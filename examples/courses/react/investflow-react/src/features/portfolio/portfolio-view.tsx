'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { totals, type AssetWithTransactions } from '@/core/portfolio';
import { AssetFormDialog } from './asset-form-dialog';
import { AssetsTable } from './assets-table';
import { PortfolioKpis } from './portfolio-kpis';
import { useAssets, useDeleteAsset } from './queries';

// #region view
/**
 * A carteira: começa com os dados que o Server Component já carregou
 * (`initialData`) e, a partir daí, o React Query mantém tudo atualizado.
 */
export function PortfolioView({ initialAssets }: { initialAssets: AssetWithTransactions[] }) {
  const { data: assets = [] } = useAssets(initialAssets);
  const remove = useDeleteAsset();
  const [dialog, setDialog] = useState<{ mode: 'create' } | { mode: 'edit'; asset: AssetWithTransactions } | null>(null);
  const [deleting, setDeleting] = useState<AssetWithTransactions | null>(null);
  const summary = useMemo(() => totals(assets), [assets]);

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
        <Button onClick={() => setDialog({ mode: 'create' })} data-new-asset>
          <Plus className="size-4" aria-hidden /> Novo ativo
        </Button>
      </header>

      <PortfolioKpis totals={summary} />

      {assets.length === 0 ? (
        <p data-empty className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700">
          Nenhum ativo ainda. Cadastre o primeiro em “Novo ativo”.
        </p>
      ) : (
        <AssetsTable assets={assets} onEdit={(asset) => setDialog({ mode: 'edit', asset })} onDelete={setDeleting} />
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
