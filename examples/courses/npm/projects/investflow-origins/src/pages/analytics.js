import './private.js';
import { calculateDividends } from '../lib/dividends.js';
import { renderLineChart } from '../lib/line-chart.js';
import { CATEGORY_LABELS, formatBRL, formatPct, totals } from '../lib/portfolio.js';
import { getQueryParam, setQueryParams } from '../lib/query-params.js';
import { renderReturnsMatrix } from '../lib/returns-matrix.js';
import { supabase } from '../lib/supabase-client.js';
import { allocationByCategory, monthlyReturns } from '../services/analytics.js';
import { listAssets } from '../services/assets.js';
import { listAllDividends } from '../services/dividends.js';
import { getLatestUsdRate, listMonthlyUsdRates } from '../services/exchange.js';
import {
  attachCumulativeDividends,
  fillContinuousMonths,
  filterMovementMonths,
  portfolioEvolution,
  toSeries,
  totalsByMonth,
} from '../services/origins.js';

// Estado global da página inicializado da query string
let currentTimelineMode = getQueryParam('mode', 'continuous');
let currentTimelineRange = getQueryParam('range', 'all');
let includeDividends = getQueryParam('dividends', 'false') === 'true';

function syncUrlParams() {
  setQueryParams(
    {
      mode: currentTimelineMode,
      range: currentTimelineRange,
      dividends: includeDividends ? 'true' : null,
    },
    {
      mode: 'continuous',
      range: 'all',
      dividends: 'false',
    }
  );
}

// 1. Carrega dados de proventos e taxas cambiais
const [{ data: assets }, { data: allDivs }, { data: latestRateData }, { data: monthlyRatesData }] =
  await Promise.all([listAssets(), listAllDividends(), getLatestUsdRate(), listMonthlyUsdRates()]);

const latestUsdRate = Number(latestRateData?.rate) || 1;
const usdRateMap = new Map((monthlyRatesData ?? []).map((r) => [r.month, Number(r.rate)]));

const divsByAsset = new Map();
for (const d of allDivs ?? []) {
  if (!divsByAsset.has(d.asset_id)) divsByAsset.set(d.asset_id, []);
  divsByAsset.get(d.asset_id).push(d);
}

const allReceivedDividends = [];
for (const asset of assets ?? []) {
  if (asset.category !== 'renda_fixa') {
    const divs = divsByAsset.get(asset.id) ?? [];
    const calc = calculateDividends(asset.transactions ?? [], divs, {
      isUsd: asset.currency === 'USD',
      rateMap: usdRateMap,
      latestRate: latestUsdRate,
    });
    allReceivedDividends.push(...calc.items);
  }
}

const dividendsByMonth = new Map();
for (const item of allReceivedDividends) {
  const m = (item.paymentDate || item.exDate || '').slice(0, 7);
  if (m) {
    dividendsByMonth.set(m, (dividendsByMonth.get(m) ?? 0) + Number(item.total));
  }
}

const totalDividendsReceived = allReceivedDividends.reduce(
  (acc, item) => acc + Number(item.total),
  0
);

// 1.1 KPIs da carteira: lucro e rentabilidade seguem o filtro de proventos
function renderKpis() {
  const kpi = (name, text) => {
    const el = document.querySelector(`[data-kpi="${name}"]`);
    if (el) el.textContent = text;
  };
  const t = totals(assets ?? [], { usdRate: latestUsdRate });
  kpi('value', formatBRL(t.value));
  kpi('cost', formatBRL(t.cost));

  const diff = t.value - t.cost + (includeDividends ? totalDividendsReceived : 0);
  const pct = t.cost ? diff / t.cost : null;
  const colorClass =
    diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
  kpi('unrealizedLabel', includeDividends ? 'Lucro c/ Proventos' : 'Lucro / Rendimento');
  const unrealizedEl = document.querySelector('[data-kpi="unrealized"]');
  if (unrealizedEl) {
    unrealizedEl.textContent = formatBRL(diff);
    unrealizedEl.className = `mt-2 text-2xl font-bold ${colorClass}`;
  }
  const returnPctEl = document.querySelector('[data-kpi="returnPct"]');
  if (returnPctEl) {
    returnPctEl.textContent = formatPct(pct);
    returnPctEl.className = `mt-1 text-xs font-medium ${colorClass}`;
  }

  const ltmStart = new Date();
  ltmStart.setFullYear(ltmStart.getFullYear() - 1);
  const ltmKey = ltmStart.toISOString().slice(0, 7);
  const ltm = [...dividendsByMonth.entries()]
    .filter(([month]) => month >= ltmKey)
    .reduce((acc, [, v]) => acc + v, 0);
  kpi('dividends', formatBRL(totalDividendsReceived));
  kpi('dividendsLtm', `${formatBRL(ltm)} nos últimos 12 meses`);
}

// 2. Renderização da Matriz de Rendimentos
const { data: rawRows } = await monthlyReturns();

function drawMatrix() {
  renderReturnsMatrix(rawRows ?? [], { includeDividends, dividendsByMonth });
}

// 3. Distribuição por Classe
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

// 4. Gráfico de Evolução (Aportes vs Valor)
const { data: evolution } = await portfolioEvolution();
let cachedTotals = totalsByMonth(evolution ?? []);

const { data: txList } = await supabase.from('transactions').select('transaction_date');
const movementMonths = new Set((txList ?? []).map((t) => t.transaction_date.slice(0, 7)));

cachedTotals = attachCumulativeDividends(cachedTotals, allReceivedDividends);

function updateTimelineButtons() {
  const btnGroup = document.querySelector('[data-timeline-group]');
  if (btnGroup) {
    const buttons = btnGroup.querySelectorAll('button[data-timeline-mode]');
    for (const btn of buttons) {
      const isActive = btn.dataset.timelineMode === currentTimelineMode;
      if (isActive) {
        btn.className =
          'px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition';
      } else {
        btn.className =
          'px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
      }
    }
  }

  const rangeGroup = document.querySelector('[data-timeline-range-group]');
  if (rangeGroup) {
    const rangeButtons = rangeGroup.querySelectorAll('button[data-timeline-range]');
    for (const btn of rangeButtons) {
      const isActive = btn.dataset.timelineRange === currentTimelineRange;
      if (isActive) {
        btn.className =
          'px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition';
      } else {
        btn.className =
          'px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
      }
    }
  }

  const dividendsGroup = document.querySelector('[data-dividends-toggle-group]');
  if (dividendsGroup) {
    const dividendsButtons = dividendsGroup.querySelectorAll('button[data-dividends-include]');
    for (const btn of dividendsButtons) {
      const isActive = btn.dataset.dividendsInclude === String(includeDividends);
      if (isActive) {
        btn.className =
          'px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition';
      } else {
        btn.className =
          'px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
      }
    }
  }
}

function drawEvolution() {
  const container = document.querySelector('[data-evolution]');
  if (!cachedTotals.length) {
    container.replaceChildren('Sem cotação registrada ainda.');
    return;
  }
  let seriesRows =
    currentTimelineMode === 'continuous'
      ? fillContinuousMonths(cachedTotals)
      : filterMovementMonths(cachedTotals, movementMonths);

  if (currentTimelineRange === 'ytd') {
    const currentYear = new Date().getFullYear();
    seriesRows = seriesRows.filter((r) => r.month >= `${currentYear}-01`);
  } else if (currentTimelineRange === '2y') {
    const now = new Date();
    const twoYearsAgoYear = now.getFullYear() - 2;
    const currentMonthNum = String(now.getMonth() + 1).padStart(2, '0');
    seriesRows = seriesRows.filter((r) => r.month >= `${twoYearsAgoYear}-${currentMonthNum}`);
  }

  container.replaceChildren(
    renderLineChart(toSeries(seriesRows, { includeDividends }), { format: formatBRL })
  );
  updateTimelineButtons();
}

document.querySelector('[data-timeline-group]')?.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-timeline-mode]');
  if (!btn) return;
  currentTimelineMode = btn.dataset.timelineMode;
  syncUrlParams();
  drawEvolution();
});

document.querySelector('[data-timeline-range-group]')?.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-timeline-range]');
  if (!btn) return;
  currentTimelineRange = btn.dataset.timelineRange;
  syncUrlParams();
  drawEvolution();
});

document.querySelector('[data-dividends-toggle-group]')?.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-dividends-include]');
  if (!btn) return;
  includeDividends = btn.dataset.dividendsInclude === 'true';
  syncUrlParams();
  renderKpis();
  drawMatrix();
  drawEvolution();
});

renderKpis();
drawMatrix();
drawEvolution();
