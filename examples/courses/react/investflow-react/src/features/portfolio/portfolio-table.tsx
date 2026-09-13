'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/format';
import type { PortfolioAsset } from './types';

type PortfolioTableProps = {
  assets: PortfolioAsset[];
};

export function PortfolioTable({ assets }: PortfolioTableProps) {
  const [filter, setFilter] = useState('');
  const columns = useMemo<ColumnDef<PortfolioAsset>[]>(
    () => [
      { accessorKey: 'symbol', header: 'Ticker' },
      { accessorKey: 'name', header: 'Ativo' },
      { accessorKey: 'category', header: 'Categoria' },
      {
        accessorKey: 'quantity',
        header: 'Quantidade',
        cell: ({ row }) => row.original.quantity.toLocaleString('pt-BR'),
      },
      {
        id: 'value',
        header: 'Valor',
        cell: ({ row }) => (
          <span data-private-value>
            {formatCurrency(row.original.quantity * row.original.price, row.original.currency)}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: assets,
    columns,
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="space-y-3">
      <input
        className="h-10 w-full rounded-md border border-slate-300 px-3"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filtrar por ticker, nome ou categoria"
      />
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
