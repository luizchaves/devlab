import './private.js';
import { renderLineChart } from '../lib/line-chart.js';
import { CATEGORY_LABELS, formatBRL, formatPct } from '../lib/portfolio.js';
import { matrixByYear, monthlyPct } from '../lib/returns.js';
import { allocationByCategory, monthlyReturns } from '../services/analytics.js';
import { portfolioEvolution, toSeries, totalsByMonth } from '../services/origins.js';

// #region matrix
function cellClass(pct) {
  if (pct === null) return 'py-3 px-2 text-slate-400 dark:text-slate-600';
  return pct >= 0
    ? 'py-3 px-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium'
    : 'py-3 px-2 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-medium';
}

function renderYear({ year, cells, yearlyPct }) {
  const tr = document.createElement('tr');
  tr.dataset.year = year;
  const months = cells
    .map((row) => {
      const pct = row ? monthlyPct(row) : null;
      // Mes sem dado: traco sem cor, nunca 0%.
      const body =
        pct === null
          ? '—'
          : `${formatPct(pct)}<br/><span class="text-[10px] text-slate-500">${formatBRL(Number(row.return_brl))}</span>`;
      return `<td class="${cellClass(pct)}">${body}</td>`;
    })
    .join('');
  tr.innerHTML = `<td class="py-3 px-2 font-bold text-left text-slate-900 dark:text-white">${year}</td>${months}<td data-yearly class="${cellClass(yearlyPct)} font-bold">${formatPct(yearlyPct)}</td>`;
  return tr;
}

const { data: rows } = await monthlyReturns();
const years = matrixByYear(rows ?? []);
document.querySelector('[data-matrix]').replaceChildren(...years.map(renderYear));
document.querySelector('[data-matrix-empty]').hidden = years.length > 0;
// #endregion

// #region allocation
const { data: allocation } = await allocationByCategory();
const total = (allocation ?? []).reduce((acc, a) => acc + Number(a.value), 0);
document.querySelector('[data-allocation]').replaceChildren(
  ...(allocation ?? []).map((a) => {
    const li = document.createElement('li');
    li.dataset.category = a.category;
    const share = total ? Number(a.value) / total : 0;
    li.innerHTML = `<div class="flex justify-between"><span>${CATEGORY_LABELS[a.category]}</span><span>${formatBRL(Number(a.value))} · ${formatPct(share).replace('+', '')}</span></div>
      <div class="h-2 rounded bg-slate-100 dark:bg-slate-800"><div class="h-2 rounded bg-emerald-500" style="width:${(share * 100).toFixed(1)}%"></div></div>`;
    return li;
  })
);
// #endregion

// #region evolution
// A serie da carteira e a soma das series por ativo, mes a mes.
const { data: evolution } = await portfolioEvolution();
const totals = totalsByMonth(evolution ?? []);
document
  .querySelector('[data-evolution]')
  .replaceChildren(
    totals.length
      ? renderLineChart(toSeries(totals), { format: formatBRL })
      : 'Sem cotação registrada ainda.'
  );
// #endregion
