'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Money } from '@/components/money';
import { Button } from '@/components/ui/button';
import type { Currency, TransactionFact } from '@/core/portfolio';
import { formatYield } from '@/core/yield';
import { ReceiptLink } from '@/features/movements/receipt-link';
import { formatDate } from '@/lib/format';

const TYPE_LABELS: Record<TransactionFact['type'], string> = { buy: 'Compra', sell: 'Venda', update: 'Saldo' };
const BALANCE_TYPE_LABELS: Record<TransactionFact['type'], string> = { buy: 'Aplicação', sell: 'Resgate', update: 'Saldo' };

// #region table
/**
 * Extrato em ordem cronológica, com a posição acumulada depois de cada
 * lançamento (CA03.9): o leitor vê a quantidade crescer aporte a aporte.
 */
type Props = {
  transactions: TransactionFact[];
  currency: Currency;
  /** Ativo por saldo: rótulos de aplicação/resgate e a coluna de rendimento (CA14.2). */
  byBalance?: boolean;
  onEdit: (transaction: TransactionFact) => void;
  onDelete: (transaction: TransactionFact) => void;
};

export function TransactionsTable({ transactions, currency, byBalance = false, onEdit, onDelete }: Props) {
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
          {/* Preço some abaixo de `md`; total e posição ficam, que é o que se lê no celular (CA12.3). */}
          <tr>
            <th className="px-3 py-2.5">Data</th>
            <th className="px-3 py-2.5">Tipo</th>
            {byBalance ? (
              <th className="hidden px-3 py-2.5 text-right md:table-cell">Rendimento</th>
            ) : (
              <>
                <th className="px-3 py-2.5 text-right">Quantidade</th>
                <th className="hidden px-3 py-2.5 text-right md:table-cell">Preço</th>
              </>
            )}
            <th className="px-3 py-2.5 text-right">{byBalance ? 'Valor' : 'Total'}</th>
            <th className="px-3 py-2.5 text-right">{byBalance ? 'Saldo' : 'Posição'}</th>
            <th className="px-3 py-2.5 text-center">Anexo</th>
            <th className="px-1 py-2.5 text-center sm:px-3">Ações</th>
          </tr>
        </thead>
        <tbody data-transactions className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((t) => (
            <tr key={t.id} className="tabular-nums">
              <td className="px-3 py-2.5">{formatDate(t.transactionDate)}</td>
              <td className="px-3 py-2.5">
                <span className={t.type === 'sell' ? 'text-rose-600' : t.type === 'buy' ? 'text-emerald-600' : 'text-sky-600'}>{(byBalance ? BALANCE_TYPE_LABELS : TYPE_LABELS)[t.type]}</span>
              </td>
              {byBalance ? (
                <td className="hidden px-3 py-2.5 text-right md:table-cell" data-yield-rate>
                  {t.yieldRate == null ? '—' : formatYield(t.yieldIndex, t.yieldRate)}
                </td>
              ) : (
                <>
                  <td className="px-3 py-2.5 text-right">{t.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
                  <td className="hidden px-3 py-2.5 text-right md:table-cell">
                    <Money value={t.price} currency={currency} />
                  </td>
                </>
              )}
              <td className="px-3 py-2.5 text-right">
                <Money value={t.quantity * t.price} currency={currency} />
              </td>
              <td className="px-3 py-2.5 text-right font-semibold">
                {byBalance ? <Money value={t.running} /> : t.running.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}
              </td>
              <td className="px-3 py-2.5 text-center">{t.receiptPath && <ReceiptLink transactionId={t.id} receiptPath={t.receiptPath} />}</td>
              <td className="px-1 py-2.5 text-center whitespace-nowrap sm:px-3">
                <Button variant="ghost" size="icon" className="size-9 md:size-10" aria-label={`Editar lançamento de ${formatDate(t.transactionDate)}`} data-edit-transaction onClick={() => onEdit(t)}>
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 md:size-10" aria-label={`Excluir lançamento de ${formatDate(t.transactionDate)}`} data-delete-transaction onClick={() => onDelete(t)}>
                  <Trash2 className="size-4 text-rose-600" aria-hidden />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// #endregion
