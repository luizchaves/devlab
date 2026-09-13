'use client';

import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Money } from '@/components/money';
import { Button } from '@/components/ui/button';
import { receivedDividends, type AssetWithDividends } from '@/core/dividends';
import { useSyncDividends } from '@/features/portfolio/queries';
import { formatDate, formatMoney } from '@/lib/format';

// #region tab
/** Extrato de proventos do ativo (CA09.8): pelo `receivedDividends` de `core/dividends`. */
export function DividendsTab({ asset }: { asset: AssetWithDividends }) {
  const items = receivedDividends(asset);
  const total = items.reduce((sum, d) => sum + d.totalBRL, 0);
  const sync = useSyncDividends(asset.id);

  const run = async () => {
    try {
      const result = await sync.mutateAsync();
      if (result.message) toast.warning(result.message);
      else toast.success(`${result.count} evento(s) de provento sincronizado(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível sincronizar.');
    }
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">Tem direito ao provento quem estava posicionado antes da data ex.</p>
        <Button variant="secondary" size="sm" onClick={run} pending={sync.isPending} data-sync-dividends>
          <RefreshCw className="size-4" aria-hidden /> Sincronizar proventos
        </Button>
      </div>
      {items.length === 0 ? (
        <p data-dividends-empty className="rounded-2xl border border-dashed border-slate-300 px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
          Nenhum provento recebido ainda. Sincronize o histórico do provedor.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase dark:bg-slate-800/50">
              <tr>
                <th className="px-3 py-2.5">Data ex</th>
                <th className="hidden px-3 py-2.5 md:table-cell">Pagamento</th>
                <th className="px-3 py-2.5 text-right">Por cota</th>
                <th className="hidden px-3 py-2.5 text-right sm:table-cell">Cotas</th>
                <th className="px-3 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody data-dividends-rows className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((d) => (
                <tr key={d.id} className="tabular-nums">
                  <td className="px-3 py-2.5">{formatDate(d.exDate)}</td>
                  <td className="hidden px-3 py-2.5 md:table-cell">{formatDate(d.paymentDate)}</td>
                  <td className="px-3 py-2.5 text-right">{formatMoney(d.rate, asset.currency)}</td>
                  <td className="hidden px-3 py-2.5 text-right sm:table-cell">{d.quantity.toLocaleString('pt-BR')}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">
                    <Money value={d.total} currency={asset.currency} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot data-dividends-footer className="bg-slate-50 text-sm font-semibold dark:bg-slate-800/50">
              <tr>
                <td className="px-3 py-2.5" colSpan={2}>
                  Total recebido
                </td>
                <td className="hidden sm:table-cell" />
                <td className="hidden md:table-cell" />
                <td className="px-3 py-2.5 text-right tabular-nums text-purple-700 dark:text-purple-400">
                  <Money value={total} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
// #endregion
