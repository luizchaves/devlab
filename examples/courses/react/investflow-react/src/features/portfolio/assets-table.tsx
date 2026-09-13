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
import { useMemo } from 'react';
import { Money } from '@/components/money';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isAssetActive } from '@/core/organize';
import { CATEGORY_LABELS, summarize, type AssetWithTransactions, type PortfolioTotals, type PositionSummary } from '@/core/portfolio';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

export type AssetRow = { asset: AssetWithTransactions; position: PositionSummary };

type AssetsTableProps = {
  assets: AssetWithTransactions[];
  sorting: SortingState;
  onSortingChange: (next: SortingState) => void;
  footer: PortfolioTotals | null;
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
      <Link href={`/assets/${row.original.asset.id}`} className="group block max-w-32 sm:max-w-none">
        <span className="block truncate font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white">
          {row.original.asset.ticker}
          {!isAssetActive(row.original.asset) && <Badge className="ml-2 align-middle">Encerrado</Badge>}
        </span>
        <span className="block truncate text-xs text-slate-500 sm:max-w-48">{row.original.asset.name}</span>
      </Link>
    ),
  }),
  helper.accessor((row) => row.asset.category, {
    id: 'category',
    header: 'Categoria',
    cell: ({ getValue }) => <Badge tone={getValue()}>{CATEGORY_LABELS[getValue()]}</Badge>,
    meta: { hideBelow: 'md' },
  }),
  helper.accessor((row) => row.asset.broker?.name ?? '', {
    id: 'broker',
    header: 'Corretora',
    cell: ({ getValue }) => <span className="text-slate-600 dark:text-slate-300">{getValue() || '—'}</span>,
    meta: { hideBelow: 'lg' },
  }),
  helper.accessor((row) => row.asset.issuer ?? '', {
    id: 'issuer',
    header: 'Emissor',
    cell: ({ getValue }) => <span className="text-slate-600 dark:text-slate-300">{getValue() || '—'}</span>,
    meta: { hideBelow: 'xl' },
  }),
  helper.accessor((row) => row.position.quantity, {
    id: 'quantity',
    header: 'Qtd.',
    cell: ({ getValue }) => getValue().toLocaleString('pt-BR', { maximumFractionDigits: 8 }),
    meta: { numeric: true, hideBelow: 'md' },
    sortDescFirst: true,
  }),
  helper.accessor((row) => row.position.averagePrice, {
    id: 'averagePrice',
    header: 'Preço médio',
    cell: ({ row }) => <Money value={row.original.position.averagePrice} currency={row.original.asset.currency} />,
    meta: { numeric: true, hideBelow: 'lg' },
    sortDescFirst: true,
  }),
  // Ativo sem cotação devolve `undefined` e vai para o fim em qualquer direção (CA08.14).
  helper.accessor((row) => row.asset.currentPrice ?? undefined, {
    id: 'currentPrice',
    header: 'Cotação',
    cell: ({ row }) => <Money value={row.original.asset.currentPrice} currency={row.original.asset.currency} />,
    meta: { numeric: true, hideBelow: 'sm' },
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  helper.accessor((row) => row.position.valueBRL ?? undefined, {
    id: 'value',
    header: 'Valor (R$)',
    cell: ({ row }) => <Money value={row.original.position.valueBRL} className="font-semibold" />,
    meta: { numeric: true },
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  helper.accessor((row) => row.position.returnPct ?? undefined, {
    id: 'returnPct',
    header: 'Rent.',
    cell: ({ row }) => {
      const pct = row.original.position.returnPct;
      if (pct == null) return <span className="text-slate-400">—</span>;
      return <span className={pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{formatPercent(pct)}</span>;
    },
    meta: { numeric: true },
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
];
// #endregion

/**
 * Colunas essenciais (ativo, valor, rentabilidade, ações) aparecem em qualquer
 * largura; as demais entram a partir do breakpoint de `hideBelow` (CA12.3).
 */
const HIDE_BELOW: Record<Breakpoint, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
};

const responsiveClass = (hideBelow?: Breakpoint) => (hideBelow ? HIDE_BELOW[hideBelow] : undefined);

// #region table
export function AssetsTable({ assets, sorting, onSortingChange, footer, onEdit, onDelete }: AssetsTableProps) {
  const data = useMemo<AssetRow[]>(() => assets.map((asset) => ({ asset, position: summarize(asset) })), [assets]);

  // Ordenação controlada de fora (vive na URL). `enableSortingRemoval: false`
  // faz o segundo clique inverter em vez de limpar (CA08.14).
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => onSortingChange(typeof updater === 'function' ? updater(sorting) : updater),
    enableSortingRemoval: false,
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
                const meta = header.column.columnDef.meta;
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    data-sort={header.column.id}
                    aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
                    className={cn('px-2 py-2.5 sm:px-3', meta?.numeric ? 'text-right' : 'text-left', responsiveClass(meta?.hideBelow))}
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
              <th className="px-1 py-2.5 text-center sm:px-3">Ações</th>
            </tr>
          ))}
        </thead>
        <tbody data-assets className="divide-y divide-slate-100 dark:divide-slate-800">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} data-ticker={row.original.asset.ticker} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cn('px-2 py-2.5 sm:px-3', cell.column.columnDef.meta?.numeric && 'text-right tabular-nums', responsiveClass(cell.column.columnDef.meta?.hideBelow))}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="px-1 py-2.5 text-center whitespace-nowrap sm:px-3">
                <Button variant="ghost" size="icon" className="size-9 md:size-10" aria-label={`Editar ${row.original.asset.ticker}`} onClick={() => onEdit(row.original.asset)}>
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 md:size-10" aria-label={`Excluir ${row.original.asset.ticker}`} onClick={() => onDelete(row.original.asset)}>
                  <Trash2 className="size-4 text-rose-600" aria-hidden />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot data-assets-footer className="bg-slate-50 text-sm font-semibold dark:bg-slate-800/50">
            <tr>
              <td className="px-2 py-2.5 sm:px-3" colSpan={table.getVisibleLeafColumns().findIndex((c) => c.id === 'value')}>
                Total das posições abertas
              </td>
              <td className="px-2 py-2.5 text-right tabular-nums sm:px-3">
                <Money value={footer.value} />
              </td>
              <td className={cn('px-2 py-2.5 text-right tabular-nums sm:px-3', (footer.returnPct ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                {footer.returnPct == null ? '—' : formatPercent(footer.returnPct)}
              </td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
// #endregion

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- assinatura exigida pela biblioteca
  interface ColumnMeta<TData, TValue> {
    numeric?: boolean;
    /** Esconde a coluna abaixo deste breakpoint do Tailwind. */
    hideBelow?: Breakpoint;
  }
}
