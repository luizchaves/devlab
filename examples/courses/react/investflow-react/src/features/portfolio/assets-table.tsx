'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Money } from '@/components/money';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_LABELS, summarize, type AssetWithTransactions, type PositionSummary } from '@/core/portfolio';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

export type AssetRow = { asset: AssetWithTransactions; position: PositionSummary };

type AssetsTableProps = {
  assets: AssetWithTransactions[];
  onEdit: (asset: AssetWithTransactions) => void;
  onDelete: (asset: AssetWithTransactions) => void;
};

const helper = createColumnHelper<AssetRow>();

// #region columns
/**
 * As colunas descrevem o que mostrar e como ordenar; o TanStack Table cuida
 * do modelo de linhas e do estado de ordenação. Ativo sem cotação vai para o
 * fim na ordenação por valor (CA08.14).
 */
const columns = [
  helper.accessor((row) => row.asset.ticker, {
    id: 'ticker',
    header: 'Ativo',
    cell: ({ row }) => (
      <Link href={`/assets/${row.original.asset.id}`} className="group block">
        <span className="font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white">{row.original.asset.ticker}</span>
        <span className="block max-w-48 truncate text-xs text-slate-500">{row.original.asset.name}</span>
      </Link>
    ),
  }),
  helper.accessor((row) => row.asset.category, {
    id: 'category',
    header: 'Categoria',
    cell: ({ getValue }) => <Badge tone={getValue()}>{CATEGORY_LABELS[getValue()]}</Badge>,
  }),
  helper.accessor((row) => row.asset.broker?.name ?? '', {
    id: 'broker',
    header: 'Corretora',
    cell: ({ getValue }) => <span className="text-slate-600 dark:text-slate-300">{getValue() || '—'}</span>,
  }),
  helper.accessor((row) => row.asset.issuer ?? '', {
    id: 'issuer',
    header: 'Emissor',
    cell: ({ getValue }) => <span className="text-slate-600 dark:text-slate-300">{getValue() || '—'}</span>,
  }),
  helper.accessor((row) => row.position.quantity, {
    id: 'quantity',
    header: 'Qtd.',
    cell: ({ getValue }) => getValue().toLocaleString('pt-BR', { maximumFractionDigits: 8 }),
    meta: { numeric: true },
  }),
  helper.accessor((row) => row.position.averagePrice, {
    id: 'averagePrice',
    header: 'Preço médio',
    cell: ({ row }) => <Money value={row.original.position.averagePrice} currency={row.original.asset.currency} />,
    meta: { numeric: true },
  }),
  helper.accessor((row) => row.asset.currentPrice ?? -Infinity, {
    id: 'currentPrice',
    header: 'Cotação',
    cell: ({ row }) => <Money value={row.original.asset.currentPrice} currency={row.original.asset.currency} />,
    meta: { numeric: true },
  }),
  helper.accessor((row) => row.position.valueBRL ?? -Infinity, {
    id: 'value',
    header: 'Valor (R$)',
    cell: ({ row }) => <Money value={row.original.position.valueBRL} className="font-semibold" />,
    meta: { numeric: true },
  }),
  helper.accessor((row) => row.position.returnPct ?? -Infinity, {
    id: 'returnPct',
    header: 'Rent.',
    cell: ({ row }) => {
      const pct = row.original.position.returnPct;
      if (pct == null) return <span className="text-slate-400">—</span>;
      return <span className={pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{formatPercent(pct)}</span>;
    },
    meta: { numeric: true },
  }),
];
// #endregion

// #region table
export function AssetsTable({ assets, onEdit, onDelete }: AssetsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'ticker', desc: false }]);
  const data = useMemo<AssetRow[]>(() => assets.map((asset) => ({ asset, position: summarize(asset) })), [assets]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase dark:bg-slate-800/50">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const numeric = Boolean(header.column.columnDef.meta?.numeric);
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
                    className={cn('px-3 py-2.5', numeric ? 'text-right' : 'text-left')}
                  >
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-white"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted === 'asc' ? <ArrowUp className="size-3" aria-hidden /> : sorted === 'desc' ? <ArrowDown className="size-3" aria-hidden /> : <ArrowUpDown className="size-3 opacity-40" aria-hidden />}
                    </button>
                  </th>
                );
              })}
              <th className="px-3 py-2.5 text-center">Ações</th>
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} data-ticker={row.original.asset.ticker} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cn('px-3 py-2.5', cell.column.columnDef.meta?.numeric && 'text-right tabular-nums')}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="px-3 py-2.5 text-center whitespace-nowrap">
                <Button variant="ghost" size="icon" aria-label={`Editar ${row.original.asset.ticker}`} onClick={() => onEdit(row.original.asset)}>
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Excluir ${row.original.asset.ticker}`} onClick={() => onDelete(row.original.asset)}>
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

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- assinatura exigida pela biblioteca
  interface ColumnMeta<TData, TValue> {
    numeric?: boolean;
  }
}
