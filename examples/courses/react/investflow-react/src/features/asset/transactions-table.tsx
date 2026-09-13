'use client';

import { Money } from '@/components/money';
import type { Currency, TransactionFact } from '@/core/portfolio';
import { formatDate } from '@/lib/format';

const TYPE_LABELS: Record<TransactionFact['type'], string> = { buy: 'Compra', sell: 'Venda', update: 'Saldo' };

// #region table
/**
 * Extrato em ordem cronológica, com a posição acumulada depois de cada
 * lançamento (CA03.9): o leitor vê a quantidade crescer aporte a aporte.
 */
export function TransactionsTable({ transactions, currency }: { transactions: TransactionFact[]; currency: Currency }) {
  const rows = [...transactions]
    .sort((a, b) => a.transactionDate.localeCompare(b.transactionDate))
    .reduce<(TransactionFact & { running: number })[]>((acc, t) => {
      const previous = acc.at(-1)?.running ?? 0;
      const running = t.type === 'update' ? t.quantity : previous + (t.type === 'buy' ? t.quantity : -t.quantity);
      acc.push({ ...t, running });
      return acc;
    }, []);

  if (rows.length === 0) {
    return (
      <p data-empty className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
        Nenhum lançamento ainda. Registre o primeiro aporte.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase dark:bg-slate-800/50">
          <tr>
            <th className="px-3 py-2.5">Data</th>
            <th className="px-3 py-2.5">Tipo</th>
            <th className="px-3 py-2.5 text-right">Quantidade</th>
            <th className="px-3 py-2.5 text-right">Preço</th>
            <th className="px-3 py-2.5 text-right">Total</th>
            <th className="px-3 py-2.5 text-right">Posição</th>
          </tr>
        </thead>
        <tbody data-transactions className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((t) => (
            <tr key={t.id} className="tabular-nums">
              <td className="px-3 py-2.5">{formatDate(t.transactionDate)}</td>
              <td className="px-3 py-2.5">
                <span className={t.type === 'sell' ? 'text-rose-600' : t.type === 'buy' ? 'text-emerald-600' : 'text-sky-600'}>{TYPE_LABELS[t.type]}</span>
              </td>
              <td className="px-3 py-2.5 text-right">{t.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
              <td className="px-3 py-2.5 text-right">
                <Money value={t.price} currency={currency} />
              </td>
              <td className="px-3 py-2.5 text-right">
                <Money value={t.quantity * t.price} currency={currency} />
              </td>
              <td className="px-3 py-2.5 text-right font-semibold">{t.running.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// #endregion
