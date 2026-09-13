import { formatBRL, formatPct } from './portfolio.js';
import { matrixByYear, monthlyPct, withDividends } from './returns.js';

// #region cells
function cellClass(pct) {
  const base = 'py-2 px-1 text-center whitespace-nowrap';
  if (pct === null) return `${base} text-slate-400 dark:text-slate-600`;
  return pct >= 0
    ? `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium`
    : `${base} bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-medium`;
}

const DIVIDEND_SUB = 'text-[10px] text-purple-600 dark:text-purple-400 font-semibold';
const PLAIN_SUB = 'text-[10px] text-slate-500';

function renderYear({ year, cells, yearlyPct, globalPct, globalBrl }, includeDividends) {
  const tr = document.createElement('tr');
  tr.dataset.year = year;
  const months = cells
    .map((row) => {
      const pct = row ? monthlyPct(row) : null;
      // Mes sem dado: traco sem cor, nunca 0%.
      if (pct === null) {
        return `<td class="${cellClass(pct)}">—</td>`;
      }
      const subClass = row.dividend_brl > 0 && includeDividends ? DIVIDEND_SUB : PLAIN_SUB;
      const body = `${formatPct(pct)}<br/><span class="${subClass}">${formatBRL(Number(row.return_brl))}</span>`;
      return `<td class="${cellClass(pct)}">${body}</td>`;
    })
    .join('');

  const yearlyBrl = cells.reduce((sum, row) => sum + (row ? Number(row.return_brl) : 0), 0);
  const yearlyHasDividends = cells.some((row) => row && row.dividend_brl > 0);
  const yearlySubClass = yearlyHasDividends && includeDividends ? DIVIDEND_SUB : PLAIN_SUB;
  const yearlyBody =
    yearlyPct === null
      ? '—'
      : `${formatPct(yearlyPct)}<br/><span class="${yearlySubClass}">${formatBRL(yearlyBrl)}</span>`;

  const globalSubClass =
    includeDividends && (globalBrl > 0 || yearlyHasDividends) ? DIVIDEND_SUB : PLAIN_SUB;
  const globalBody =
    globalPct === null
      ? '—'
      : `${formatPct(globalPct)}<br/><span class="${globalSubClass}">${formatBRL(globalBrl ?? 0)}</span>`;

  tr.innerHTML = `<td class="py-2 px-1.5 font-bold text-left text-slate-900 dark:text-white whitespace-nowrap">${year}</td>${months}<td data-yearly class="${cellClass(yearlyPct)} font-bold px-1.5">${yearlyBody}</td><td data-global class="${cellClass(globalPct)} font-bold px-1.5">${globalBody}</td>`;
  return tr;
}
// #endregion

// #region render
/**
 * Preenche o `<tbody data-matrix>` e o aviso `[data-matrix-empty]` de um card de
 * matriz. `rows` tem a forma da view monthly_returns; com `includeDividends`, os
 * proventos do mes (mapa 'AAAA-MM' -> valor) entram no valor e no retorno.
 */
export function renderReturnsMatrix(
  rows,
  { includeDividends = false, dividendsByMonth = new Map(), root = document } = {}
) {
  const adjusted = includeDividends ? withDividends(rows, dividendsByMonth) : rows;
  const years = matrixByYear(adjusted);
  root
    .querySelector('[data-matrix]')
    ?.replaceChildren(...years.map((y) => renderYear(y, includeDividends)));
  const empty = root.querySelector('[data-matrix-empty]');
  if (empty) empty.hidden = years.length > 0;
  return years;
}
// #endregion
