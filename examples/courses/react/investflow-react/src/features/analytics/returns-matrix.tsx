'use client';

import { Money } from '@/components/money';
import { matrixByYear, monthlyPct, type MonthlyReturn, type YearRow } from '@/core/returns';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// #region cell
function cellClass(pct: number | null) {
  if (pct === null) return 'text-slate-400 dark:text-slate-600';
  return pct >= 0
    ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
    : 'bg-rose-50 font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
}

/** Mês sem dado é traço sem cor, nunca 0% (CA06.1). */
function Cell({ pct, brl, highlight }: { pct: number | null; brl: number; highlight?: boolean }) {
  if (pct === null) return <td className={cn('px-1 py-2 text-center whitespace-nowrap', cellClass(null))}>—</td>;
  return (
    <td className={cn('px-1 py-2 text-center whitespace-nowrap', cellClass(pct))}>
      {formatPercent(pct)}
      <br />
      <Money value={brl} className={cn('text-[10px]', highlight ? 'font-semibold text-purple-600 dark:text-purple-400' : 'text-slate-500')} />
    </td>
  );
}
// #endregion

// #region matrix
/**
 * Matriz ano × mês com o acumulado do ano e o global. As colunas de meses
 * rolam na horizontal dentro do card em telas estreitas; ano e totais ficam.
 */
export function ReturnsMatrix({ rows, includeDividends = false }: { rows: MonthlyReturn[]; includeDividends?: boolean }) {
  const years: YearRow[] = matrixByYear(rows);

  if (years.length === 0) {
    return (
      <p data-matrix-empty className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
        A matriz aparece quando houver aportes e cotações registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50">
          <tr>
            <th className="sticky left-0 bg-slate-50 px-2 py-2 text-left dark:bg-slate-800">Ano</th>
            {MONTHS.map((m) => (
              <th key={m} className="px-1 py-2">
                {m}
              </th>
            ))}
            <th className="px-2 py-2">Ano</th>
            <th className="px-2 py-2">Global</th>
          </tr>
        </thead>
        <tbody data-matrix className="divide-y divide-slate-100 dark:divide-slate-800">
          {years.map((y) => (
            <tr key={y.year} data-year={y.year}>
              <td className="sticky left-0 bg-white px-2 py-2 font-bold whitespace-nowrap dark:bg-slate-900">{y.year}</td>
              {y.cells.map((row, i) => (
                <Cell key={i} pct={row ? monthlyPct(row) : null} brl={row?.returnBrl ?? 0} highlight={includeDividends && (row?.dividendBrl ?? 0) > 0} />
              ))}
              <Cell pct={y.yearlyPct} brl={y.yearlyBrl} />
              <Cell pct={y.globalPct} brl={y.globalBrl} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// #endregion
