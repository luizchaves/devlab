import './private.js';
import { renderFlowsChart } from '../lib/bar-chart.js';
import { closeDialogOnBackdropClick } from '../lib/dialog.js';
import {
  calculateDividends,
  dividendYieldOnCost,
  isDividendEligibleAsset,
  totalReturn,
} from '../lib/dividends.js';
import { validateReceipt } from '../lib/file-validation.js';
import { showError } from '../lib/form.js';
import { renderLineChart } from '../lib/line-chart.js';
import {
  CATEGORY_BADGES,
  CATEGORY_LABELS,
  formatBRL,
  formatCurrency,
  formatDate,
  formatPct,
  formatUSD,
  investmentDuration,
  monthlyFlows,
  summarize,
  summarizeInBRL,
  truncateText,
} from '../lib/portfolio.js';
import { getQueryParam, setQueryParams } from '../lib/query-params.js';
import { QUOTED_CATEGORIES, getAsset, updateAsset } from '../services/assets.js';

import { renderReturnsMatrix } from '../lib/returns-matrix.js';
import { monthlyReturnsFromEvolution } from '../lib/returns.js';
import { fetchAndSyncDividends, getDividends } from '../services/dividends.js';
import { getLatestUsdRate, listMonthlyUsdRates } from '../services/exchange.js';
import {
  attachCumulativeDividends,
  fillContinuousMonths,
  filterMovementMonths,
  portfolioEvolution,
  toSeries,
  totalsByMonth,
} from '../services/origins.js';
import { recordQuote, updateQuotes } from '../services/quotes.js';
import { receiptUrl, uploadReceipt } from '../services/receipts.js';
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../services/transactions.js';

const searchParams = new URLSearchParams(window.location.search);
const idOrTicker =
  searchParams.get('ticker') ||
  searchParams.get('id') ||
  searchParams.get('code') ||
  window.location.search.replace(/^\?/, '').split('&')[0];
const section = document.querySelector('[data-asset]');
const notFound = document.querySelector('[data-not-found]');
const dialog = document.querySelector('[data-transaction-dialog]');
const form = document.querySelector('[data-transaction-form]');
const formTitle = document.querySelector('[data-transaction-form-title]');
const variableFields = form.querySelector('[data-variable-fields]');
const fixedFields = form.querySelector('[data-fixed-fields]');
const yieldRateField = form.querySelector('[data-yield-rate-field]');
const totalRedemptionField = form.querySelector('[data-total-redemption-field]');

const priceDialog = document.querySelector('[data-price-dialog]');
const priceForm = document.querySelector('[data-price-form]');
const toast = document.querySelector('[data-toast]');

const field = (name) => document.querySelector(`[data-field="${name}"]`);
const kpi = (name) => document.querySelector(`[data-kpi="${name}"]`);

let currentAsset = null;
let currentUsdRate = 1;
let currentUsdRateMap = new Map();

closeDialogOnBackdropClick(dialog);
closeDialogOnBackdropClick(priceDialog);

function isBalanceAsset(asset) {
  return asset?.category === 'renda_fixa' || asset?.category === 'fundos';
}

// #region render
function renderTransactions(asset) {
  const isBalance = isBalanceAsset(asset);
  const isUsd = asset.currency === 'USD';
  const rows = [...asset.transactions].sort((a, b) =>
    a.transaction_date.localeCompare(b.transaction_date)
  );
  let position = 0;
  let netQuantity = 0;
  let netTotal = 0;

  const trs = rows.map((t) => {
    const qty = Number(t.quantity);
    const price = Number(t.price);
    const total = qty * price;
    const isUpdate = t.type === 'update';
    const sign = t.type === 'buy' ? 1 : t.type === 'sell' ? -1 : 0;
    position = isUpdate ? qty : position + sign * qty;
    netQuantity += sign * qty;
    netTotal += sign * total;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition';
    const typeBadge =
      t.type === 'buy'
        ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Compra</span>'
        : t.type === 'sell'
          ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">Venda</span>'
          : '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">Atualização</span>';

    const priceDisplay = isBalance ? '—' : isUsd ? formatUSD(price) : formatBRL(price);
    const totalDisplay = isBalance ? formatBRL(total) : isUsd ? formatUSD(total) : formatBRL(total);

    const receiptButton = t.receipt_path
      ? `<button type="button" data-receipt="${t.receipt_path}" class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg><span>Ver anexo</span></button>`
      : '<span class="text-slate-400 text-xs">—</span>';

    tr.innerHTML = `
      <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${formatDate(t.transaction_date)}</td>
      <td class="py-3 px-4">${typeBadge}</td>
      <td class="py-3 px-4 text-right font-mono">${isBalance ? formatBRL(total) : qty.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
      <td class="py-3 px-4 text-right font-mono">${priceDisplay}</td>
      <td class="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">${totalDisplay}</td>
      <td class="py-3 px-4 text-right font-mono font-semibold">${isBalance ? formatBRL(position) : position.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
      <td class="py-3 px-4 text-center">${receiptButton}</td>
      <td class="py-3 px-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1.5">
          <button type="button" data-edit-transaction="${t.id}" class="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            <span>Editar</span>
          </button>
          <button type="button" data-delete-transaction="${t.id}" class="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 px-2 py-1 text-xs font-medium text-rose-700 dark:text-rose-400 shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/50 transition">
            <svg class="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            <span>Excluir</span>
          </button>
        </div>
      </td>`;
    return tr;
  });

  document.querySelector('[data-transactions]').replaceChildren(...trs);
  document.querySelector('[data-empty]').hidden = rows.length > 0;

  // Rodapé: saldo líquido (aportes menos resgates) e posição final
  const footer = document.querySelector('[data-transactions-footer]');
  if (footer) {
    footer.hidden = rows.length === 0;
    const formatMoney = isBalance || !isUsd ? formatBRL : formatUSD;
    footer.innerHTML =
      rows.length === 0
        ? ''
        : `
      <tr>
        <td class="py-3 px-4 font-bold" colspan="2">Total líquido (${rows.length})</td>
        <td class="py-3 px-4 text-right font-mono">${isBalance ? formatBRL(netTotal) : netQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
        <td class="py-3 px-4"></td>
        <td class="py-3 px-4 text-right font-bold font-mono">${formatMoney(netTotal)}</td>
        <td class="py-3 px-4 text-right font-mono font-semibold">${isBalance ? formatBRL(position) : position.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
        <td class="py-3 px-4" colspan="2"></td>
      </tr>`;
  }
  const countElem = document.querySelector('[data-transactions-count]');
  if (countElem) {
    if (rows.length > 0) {
      countElem.hidden = false;
      countElem.textContent = `${rows.length} ${rows.length === 1 ? 'lançamento' : 'lançamentos'}`;
    } else {
      countElem.hidden = true;
      countElem.textContent = '';
    }
  }
}

async function render() {
  const [{ data: asset }, { data: latestRateData }, { data: monthlyRatesData }] = await Promise.all(
    [getAsset(idOrTicker), getLatestUsdRate(), listMonthlyUsdRates()]
  );

  // null cobre "nao existe" e "nao e seu": o RLS nao deixa distinguir os dois.
  if (!asset) {
    notFound.hidden = false;
    section.hidden = true;
    return;
  }

  currentAsset = asset;
  document.title = `InvestFlow - ${asset.ticker || asset.name}`;
  currentUsdRate = Number(latestRateData?.rate) || 1;
  currentUsdRateMap = new Map((monthlyRatesData ?? []).map((r) => [r.month, Number(r.rate)]));

  const isBalance = isBalanceAsset(asset);
  const isDividendEligible = isDividendEligibleAsset(asset);
  const isUsd = asset.currency === 'USD';
  const s = summarize(asset, { usdRate: currentUsdRate });

  field('name').textContent = asset.name;
  field('ticker').textContent = isBalance ? '' : asset.ticker;

  const currencyBadge = isUsd ? '<span class="badge-usd">USD</span>' : '';
  field('title-badges').innerHTML =
    `<span class="${CATEGORY_BADGES[asset.category]}">${CATEGORY_LABELS[asset.category]}</span>${currencyBadge}`;
  field('broker').textContent = asset.broker?.name ?? '—';
  field('issuer').textContent = asset.issuer ?? '—';

  const dividendsToggleContainer = document.querySelector('[data-dividends-toggle-container]');
  if (dividendsToggleContainer) dividendsToggleContainer.hidden = !isDividendEligible;
  const currencyToggleContainer = document.querySelector('[data-currency-toggle-container]');
  if (currencyToggleContainer) currencyToggleContainer.hidden = !isUsd;
  if (!isUsd) chartCurrency = 'BRL';
  if (!isDividendEligible) {
    includeDividends = false;
    syncUrlParams();
  }

  const duration = investmentDuration(asset.transactions);
  if (kpi('duration')) kpi('duration').textContent = duration.text;
  if (kpi('durationSub')) kpi('durationSub').textContent = duration.subtitle;

  const currentPrice = asset.current_price == null ? null : Number(asset.current_price);
  kpi('quantity').textContent = isBalance
    ? '—'
    : s.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 });

  if (isBalance) {
    kpi('averagePrice').textContent = '—';
    kpi('currentPrice').textContent = '—';
  } else if (isUsd) {
    kpi('averagePrice').innerHTML =
      `<div>${formatBRL(s.averagePrice * currentUsdRate)}</div><div class="text-xs text-slate-400 font-normal mt-0.5">${formatUSD(s.averagePrice)}</div>`;
    kpi('currentPrice').innerHTML =
      currentPrice != null
        ? `<div>${formatBRL(currentPrice * currentUsdRate)}</div><div class="text-xs text-slate-400 font-normal mt-0.5">${formatUSD(currentPrice)}</div>`
        : '—';
  } else {
    kpi('averagePrice').textContent = formatBRL(s.averagePrice);
    kpi('currentPrice').textContent = formatBRL(currentPrice);
  }

  if (isUsd) {
    kpi('cost').innerHTML =
      `<div>${formatBRL(s.costBRL)}</div><div class="text-xs text-slate-400 font-normal mt-0.5">${formatUSD(s.cost)}</div>`;
    const valBRL = s.valueBRL != null ? s.valueBRL : s.costBRL;
    const valUSD = s.value != null ? s.value : s.cost;
    kpi('value').innerHTML =
      `<div>${formatBRL(valBRL)}</div><div class="text-xs text-slate-400 font-normal mt-0.5">${formatUSD(valUSD)}</div>`;
  } else {
    kpi('cost').textContent = formatBRL(s.costBRL);
    kpi('value').textContent = formatBRL(s.valueBRL != null ? s.valueBRL : s.costBRL);
  }

  // Em USD, o resultado principal e em reais (cambio de cada compra) e o
  // secundario e na moeda do ativo, no mesmo arranjo do KPI "Valor atual".
  const brl = isUsd
    ? summarizeInBRL(asset, { rateMap: currentUsdRateMap, latestRate: currentUsdRate })
    : s;
  const signed = (value, format) => `${value >= 0 ? '+' : '−'}${format(Math.abs(value))}`;
  const gainLine = (pct, gain, format) =>
    gain == null
      ? formatPct(pct)
      : `${formatPct(pct)} <span class="font-semibold">(${signed(gain, format)})</span>`;
  const returnElem = kpi('returnPct');
  returnElem.innerHTML = isUsd
    ? `<div>${gainLine(brl.returnPct, brl.unrealized, formatBRL)}</div><div class="text-xs text-slate-400 font-normal mt-0.5">${gainLine(s.returnPct, s.unrealized, formatUSD)} em USD</div>`
    : gainLine(s.returnPct, s.unrealizedBRL, formatBRL);
  returnElem.className = `mt-2 text-2xl font-bold ${
    brl.returnPct == null
      ? 'text-slate-400 dark:text-slate-500'
      : brl.returnPct >= 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'
  }`;
  kpi('realized').textContent = `Realizado: ${formatBRL(s.realizedBRL)}`;

  renderTransactions(asset);
  await renderEvolution();
  await renderDividends(asset);
  switchTab(currentTab);
  section.hidden = false;
  notFound.hidden = true;
}

// #region tabs
let currentTab = getQueryParam('tab', 'transactions');

function switchTab(tabName) {
  const targetTab =
    tabName === 'dividends' && !isDividendEligibleAsset(currentAsset) ? 'transactions' : tabName;
  currentTab = targetTab;
  syncUrlParams();

  for (const btn of document.querySelectorAll('[data-tab-btn]')) {
    const isActive = btn.dataset.tabBtn === targetTab;
    if (isActive) {
      btn.className =
        'inline-flex items-center gap-2 py-3.5 px-1 sm:px-2 text-sm font-semibold border-b-2 border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 transition';
    } else {
      btn.className =
        'inline-flex items-center gap-2 py-3.5 px-1 sm:px-2 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition';
    }
  }
  for (const panel of document.querySelectorAll('[data-tab-panel]')) {
    panel.hidden = panel.dataset.tabPanel !== targetTab;
  }
}

for (const btn of document.querySelectorAll('[data-tab-btn]')) {
  btn.addEventListener('click', () => switchTab(btn.dataset.tabBtn));
}
// #endregion

// #region dividends
async function renderDividends(asset) {
  const dividendsTabBtn = document.querySelector('[data-tab-btn="dividends"]');
  const totalReturnCard = document.querySelector('[data-kpi-card="totalReturn"]');

  if (!isDividendEligibleAsset(asset)) {
    if (dividendsTabBtn) dividendsTabBtn.hidden = true;
    if (totalReturnCard) totalReturnCard.hidden = true;
    switchTab('transactions');
    return;
  }
  if (dividendsTabBtn) dividendsTabBtn.hidden = false;
  if (totalReturnCard) totalReturnCard.hidden = false;

  const { data: divs } = await getDividends(asset.id);
  const isUsd = asset.currency === 'USD';
  const result = calculateDividends(asset.transactions, divs ?? [], {
    isUsd,
    rateMap: currentUsdRateMap,
    latestRate: currentUsdRate,
  });

  const s = summarize(asset, { usdRate: currentUsdRate });
  const totalRet = totalReturn({
    cost: s.costBRL,
    value: s.valueBRL != null ? s.valueBRL : s.costBRL,
    realized: s.realizedBRL,
    totalDividends: result.totalReceived,
  });

  const totalReturnElem = kpi('totalReturnPct');
  const totalReturnSubElem = kpi('totalReturnSub');
  if (totalReturnElem) {
    totalReturnElem.textContent = formatPct(totalRet.returnPct);
    totalReturnElem.className = `mt-2 text-2xl font-bold ${
      totalRet.returnPct == null
        ? 'text-slate-400 dark:text-slate-500'
        : totalRet.returnPct >= 0
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-rose-600 dark:text-rose-400'
    }`;
  }
  if (totalReturnSubElem) {
    totalReturnSubElem.innerHTML = `<span class="text-slate-500 dark:text-slate-400 font-normal">Proventos:</span> <strong class="font-bold text-purple-700 dark:text-purple-300">${formatBRL(result.totalReceived)}</strong>`;
  }

  const totalElem = document.querySelector('[data-dividends-total]');
  const badgeElem = document.querySelector('[data-dividends-badge]');
  const rowsElem = document.querySelector('[data-dividends-rows]');
  const emptyElem = document.querySelector('[data-dividends-empty]');

  if (totalElem) totalElem.textContent = formatBRL(result.totalReceived);

  if (badgeElem) {
    badgeElem.hidden = false;
    badgeElem.textContent = `${result.count} ${result.count === 1 ? 'provento' : 'proventos'}`;
  }

  if (rowsElem) {
    const trs = result.items.map((item) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition';
      const exDateFormatted = formatDate(item.exDate);
      const paymentDateFormatted = formatDate(item.paymentDate);
      const rateDisplay = isUsd ? formatUSD(item.rate) : formatBRL(item.rate);
      const totalDisplay = isUsd
        ? `<div>${formatBRL(item.totalBRL)}</div><div class="text-[10px] text-slate-400 font-normal">${formatUSD(item.totalUSD)}</div>`
        : formatBRL(item.total);

      tr.innerHTML = `
        <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${exDateFormatted}</td>
        <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${paymentDateFormatted}</td>
        <td class="py-3 px-4 text-right font-mono">${item.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
        <td class="py-3 px-4 text-right font-mono">${rateDisplay}</td>
        <td class="py-3 px-4 text-right font-bold text-purple-700 dark:text-purple-300 font-mono">${totalDisplay}</td>
      `;
      return tr;
    });

    rowsElem.replaceChildren(...trs);
  }

  const footerElem = document.querySelector('[data-dividends-footer]');
  if (footerElem) {
    footerElem.hidden = result.items.length === 0;
    const totalUSD = isUsd ? result.items.reduce((acc, item) => acc + item.totalUSD, 0) : null;
    const totalDisplay = isUsd
      ? `<div>${formatBRL(result.totalReceived)}</div><div class="text-[10px] text-slate-400 font-normal">${formatUSD(totalUSD)}</div>`
      : formatBRL(result.totalReceived);
    footerElem.innerHTML =
      result.items.length === 0
        ? ''
        : `
      <tr>
        <td class="py-3 px-4 font-bold" colspan="4">Total (${result.count} ${result.count === 1 ? 'provento' : 'proventos'})</td>
        <td class="py-3 px-4 text-right font-bold text-purple-700 dark:text-purple-300 font-mono">${totalDisplay}</td>
      </tr>`;
  }

  if (emptyElem) {
    emptyElem.hidden = result.items.length > 0;
  }
}

document.querySelector('[data-sync-dividends]')?.addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="w-3.5 h-3.5 text-slate-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"/></svg>
    Sincronizando...
  `;
  try {
    if (isDividendEligibleAsset(currentAsset)) {
      await fetchAndSyncDividends(currentAsset);
      await renderDividends(currentAsset);
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
});
// #endregion

// #region evolution
let currentTimelineMode = getQueryParam('mode', 'continuous');
let currentTimelineRange = getQueryParam('range', 'all');
let includeDividends = getQueryParam('dividends', 'false') === 'true';
// Moeda do grafico: so faz diferenca em ativo em USD (a view entrega tudo em BRL)
let chartCurrency = getQueryParam('currency', 'BRL') === 'USD' ? 'USD' : 'BRL';
let cachedEvolutionRows = [];
// Linhas da matriz de rentabilidade (forma da view monthly_returns) e proventos por mes
let cachedMonthlyReturns = [];
let assetDividendsByMonth = new Map();

function syncUrlParams() {
  const isTickerParam =
    searchParams.has('ticker') ||
    (!searchParams.has('id') && currentAsset?.ticker && currentAsset.category !== 'renda_fixa');
  const assetParam = isTickerParam
    ? { ticker: currentAsset?.ticker || searchParams.get('ticker') }
    : { id: currentAsset?.id || searchParams.get('id') };

  setQueryParams(
    {
      ...assetParam,
      tab: currentTab === 'dividends' ? 'dividends' : null,
      mode: currentTimelineMode,
      range: currentTimelineRange,
      dividends: includeDividends ? 'true' : null,
      currency: chartCurrency === 'USD' ? 'USD' : null,
    },
    {
      tab: 'transactions',
      mode: 'continuous',
      range: 'all',
      dividends: 'false',
      currency: 'BRL',
    }
  );
}

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

  const currencyGroup = document.querySelector('[data-currency-toggle-group]');
  if (currencyGroup) {
    for (const btn of currencyGroup.querySelectorAll('button[data-chart-currency]')) {
      const isActive = btn.dataset.chartCurrency === chartCurrency;
      btn.className = isActive
        ? 'px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition'
        : 'px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
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

/**
 * Detecta liquidações totais de posição dentro do mesmo mês e insere pontos
 * onde a posição zerou (invested = 0, value = 0) antes da recompra, para que
 * a linha do gráfico mostre a queda até zero.
 */
function injectLiquidationPoints(rows, transactions) {
  if (!transactions?.length || !rows?.length) return rows;

  const sortedTxs = [...transactions].sort((a, b) => {
    const cmp = a.transaction_date.localeCompare(b.transaction_date);
    if (cmp !== 0) return cmp;
    if (a.type === 'sell' && b.type === 'buy') return -1;
    if (a.type === 'buy' && b.type === 'sell') return 1;
    if (a.type === 'update' && b.type !== 'update') return 1;
    if (a.type !== 'update' && b.type === 'update') return -1;
    return 0;
  });

  const liquidations = [];
  let pos = 0;
  for (let i = 0; i < sortedTxs.length; i++) {
    const t = sortedTxs[i];
    if (t.type === 'update') {
      pos = Number(t.quantity);
      continue;
    }
    const sign = t.type === 'buy' ? 1 : -1;
    const prevPos = pos;
    pos += sign * Number(t.quantity);
    if (prevPos > 0.000001 && pos <= 0.000001) {
      pos = 0;
      liquidations.push({
        date: t.transaction_date,
        monthKey: t.transaction_date.slice(0, 7),
      });
    }
  }

  if (!liquidations.length) return rows;

  const result = [];
  for (const row of rows) {
    const rowMonth = row.month.slice(0, 7);
    const liqInMonth = liquidations.find((l) => l.monthKey === rowMonth);

    if (liqInMonth && (Number(row.invested) > 0.000001 || Number(row.value) > 0.000001)) {
      // Houve liquidação e recompra no mesmo mês: insere o ponto zerado
      result.push({
        month: `${liqInMonth.date} (liq)`,
        invested: 0,
        value: 0,
        dividendsAcc: row.dividendsAcc ?? 0,
        dividendsAccUSD: row.dividendsAccUSD ?? 0,
      });
    }
    result.push(row);
  }

  return result;
}

/**
 * Constrói a série de fluxos por evento para o gráfico de barras, garantindo
 * que liquidações registrem o resgate e que o aportado acumulado zere antes
 * de qualquer nova recompra.
 */
function buildAssetEventFlows(asset, { inUsd = false, rateMap = new Map(), latestRate = 1 } = {}) {
  const sorted = [...(asset?.transactions ?? [])].sort((a, b) => {
    const cmp = a.transaction_date.localeCompare(b.transaction_date);
    if (cmp !== 0) return cmp;
    if (a.type === 'sell' && b.type === 'buy') return -1;
    if (a.type === 'buy' && b.type === 'sell') return 1;
    if (a.type === 'update' && b.type !== 'update') return 1;
    if (a.type !== 'update' && b.type === 'update') return -1;
    return 0;
  });

  let currentPos = 0;
  let currentCumulative = 0;
  const flows = [];

  for (const t of sorted) {
    if (t.type === 'update') {
      currentPos = Number(t.quantity);
      currentCumulative =
        Number(t.quantity) *
        Number(t.price) *
        (inUsd ? 1 : Number(rateMap.get(t.transaction_date.slice(0, 7))) || latestRate);
      continue;
    }
    const isBuy = t.type === 'buy';
    const qty = Number(t.quantity);
    const price = Number(t.price);
    const month = t.transaction_date.slice(0, 7);
    const rate = inUsd ? 1 : Number(rateMap.get(month)) || latestRate;
    const amount = qty * price * rate;
    const flow = isBuy ? amount : -amount;
    const prevPos = currentPos;
    currentPos += isBuy ? qty : -qty;

    if (currentPos <= 0.000001) {
      currentPos = 0;
      currentCumulative = 0;
    } else if (isBuy && (prevPos <= 0.000001 || currentCumulative === 0)) {
      currentCumulative = amount;
    } else {
      currentCumulative = Math.max(0, currentCumulative + flow);
    }

    flows.push({
      month: t.transaction_date,
      flow,
      cumulative: currentCumulative,
    });
  }

  return flows;
}

function drawEvolution() {
  const container = document.querySelector('[data-evolution]');
  if (!cachedEvolutionRows.length) {
    container.replaceChildren('Sem cotação registrada para este ativo ainda.');
    return;
  }

  // A view entrega tudo em reais pelo cambio do mes; em USD, desfaz essa
  // conversao mes a mes para mostrar o ativo na moeda de origem.
  const inUsd = chartCurrency === 'USD' && currentAsset?.currency === 'USD';
  const rateOf = (month) => Number(currentUsdRateMap.get(month.slice(0, 7))) || currentUsdRate;
  const toChartCurrency = (amount, month) =>
    amount == null ? null : inUsd ? Number(amount) / rateOf(month) : Number(amount);
  const format = inUsd ? formatUSD : formatBRL;

  // Na escala por eventos cada coluna e um evento de movimentacao: barras do
  // aporte/resgate e do aportado acumulado, mostrando a zeragem na liquidacao.
  if (currentTimelineMode === 'events') {
    const allFlows = buildAssetEventFlows(currentAsset, {
      inUsd,
      rateMap: currentUsdRateMap,
      latestRate: currentUsdRate,
    });
    let filteredFlows = allFlows;
    if (currentTimelineRange === 'ytd') {
      const currentYear = new Date().getFullYear();
      filteredFlows = filteredFlows.filter((f) => f.month >= `${currentYear}-01-01`);
    } else if (currentTimelineRange === '2y') {
      const now = new Date();
      const twoYearsAgoYear = now.getFullYear() - 2;
      const currentMonthNum = String(now.getMonth() + 1).padStart(2, '0');
      filteredFlows = filteredFlows.filter(
        (f) => f.month >= `${twoYearsAgoYear}-${currentMonthNum}-01`
      );
    }
    container.replaceChildren(renderFlowsChart(filteredFlows, { format }));
  } else {
    let rows = fillContinuousMonths(cachedEvolutionRows);
    rows = injectLiquidationPoints(rows, currentAsset?.transactions);

    if (currentTimelineRange === 'ytd') {
      const currentYear = new Date().getFullYear();
      rows = rows.filter((r) => r.month >= `${currentYear}-01`);
    } else if (currentTimelineRange === '2y') {
      const now = new Date();
      const twoYearsAgoYear = now.getFullYear() - 2;
      const currentMonthNum = String(now.getMonth() + 1).padStart(2, '0');
      rows = rows.filter((r) => r.month >= `${twoYearsAgoYear}-${currentMonthNum}`);
    }

    const chartRows = rows.map((r) => ({
      ...r,
      invested: toChartCurrency(r.invested, r.month),
      value: toChartCurrency(r.value, r.month),
      dividendsAcc: inUsd ? r.dividendsAccUSD : r.dividendsAcc,
    }));
    container.replaceChildren(
      renderLineChart(toSeries(chartRows, { includeDividends }), { format })
    );
  }
  updateTimelineButtons();
}

function drawMatrix() {
  const root = document.querySelector('[data-returns-matrix]');
  if (!root) return;
  renderReturnsMatrix(cachedMonthlyReturns, {
    includeDividends,
    dividendsByMonth: assetDividendsByMonth,
    root,
  });
}

async function renderEvolution() {
  const { data } = await portfolioEvolution(currentAsset.id);
  let rows = totalsByMonth(data ?? []);
  cachedMonthlyReturns = monthlyReturnsFromEvolution(rows, {
    flowsByMonth: monthlyFlows(currentAsset, {
      rateMap: currentUsdRateMap,
      latestRate: currentUsdRate,
    }),
  });
  assetDividendsByMonth = new Map();

  if (isDividendEligibleAsset(currentAsset)) {
    const { data: divs } = await getDividends(currentAsset.id);
    const isUsd = currentAsset?.currency === 'USD';
    // Com isUsd, `total` vem em reais (cambio do mes) e `totalUSD` na moeda de origem
    const calc = calculateDividends(currentAsset?.transactions ?? [], divs ?? [], {
      isUsd,
      rateMap: currentUsdRateMap,
      latestRate: currentUsdRate,
    });
    rows = attachCumulativeDividends(rows, calc.items);
    if (isUsd) {
      const usdItems = calc.items.map((item) => ({ ...item, total: item.totalUSD }));
      const usdRows = attachCumulativeDividends(rows, usdItems);
      rows = rows.map((r, i) => ({ ...r, dividendsAccUSD: usdRows[i].dividendsAcc }));
    }
    for (const item of calc.items) {
      const m = (item.paymentDate || item.exDate || '').slice(0, 7);
      if (m) assetDividendsByMonth.set(m, (assetDividendsByMonth.get(m) ?? 0) + Number(item.total));
    }
  }

  cachedEvolutionRows = rows;
  drawEvolution();
  drawMatrix();
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
  drawEvolution();
  drawMatrix();
});

document.querySelector('[data-currency-toggle-group]')?.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-chart-currency]');
  if (!btn) return;
  chartCurrency = btn.dataset.chartCurrency === 'USD' ? 'USD' : 'BRL';
  syncUrlParams();
  drawEvolution();
});

// #endregion
// #endregion

// #region create / edit transaction
function updateTransactionFields() {
  const isBuy = form.elements.type.value === 'buy';
  const isUpdate = form.elements.type.value === 'update';

  if (totalRedemptionField) {
    totalRedemptionField.hidden = isBuy;
  }
  if ((isBuy || isUpdate) && form.elements.isTotalRedemption) {
    form.elements.isTotalRedemption.checked = false;
  }

  variableFields.hidden = isUpdate;
  fixedFields.hidden = !isUpdate;
  form.elements.quantity.required = !isUpdate;
  form.elements.price.required = !isUpdate;
  if (form.elements.amount) form.elements.amount.required = isUpdate;
  if (yieldRateField) yieldRateField.hidden = true;
}
form.elements.type.addEventListener('change', updateTransactionFields);

form.elements.isTotalRedemption?.addEventListener('change', (e) => {
  if (e.target.checked && currentAsset) {
    const s = summarize(currentAsset);
    const available = Math.max(0, s.quantity);
    form.elements.quantity.value = available > 0 ? available : '';
  }
});

function openTransactionDialog(transaction = null) {
  form.reset();
  form.dataset.mode = transaction ? 'edit' : 'create';
  form.dataset.transactionId = transaction?.id ?? '';
  formTitle.textContent = transaction ? 'Editar lançamento' : 'Registrar lançamento';

  const isUsd = currentAsset?.currency === 'USD';
  const priceUnitLabel = form.querySelector('[data-price-unit-label]');
  if (priceUnitLabel) {
    priceUnitLabel.textContent = `Preço unitário (${isUsd ? 'US$' : 'R$'})`;
  }

  form.elements.type.value = transaction?.type ?? 'buy';
  form.elements.transactionDate.value =
    transaction?.transaction_date ?? new Date().toISOString().slice(0, 10);

  form.elements.quantity.value = transaction?.quantity ?? '';
  form.elements.price.value = transaction?.price ?? '';
  if (form.elements.amount) {
    form.elements.amount.value =
      transaction?.type === 'update'
        ? String(Number(transaction.quantity) * Number(transaction.price))
        : '';
  }

  updateTransactionFields();
  showError(form, '');
  dialog.showModal();
}

for (const btn of document.querySelectorAll('[data-new-transaction]')) {
  btn.addEventListener('click', () => openTransactionDialog());
}

form.querySelector('[data-close]').addEventListener('click', () => dialog.close());

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = form.elements.receipt.files[0];
  const invalid = file ? validateReceipt(file) : null;
  if (invalid) return showError(form, invalid);

  const isUpdate = form.elements.type.value === 'update';
  const quantity = isUpdate
    ? Number(form.elements.amount.value)
    : Number(form.elements.quantity.value) ||
      (form.elements.amount ? Number(form.elements.amount.value) : 0);
  const price = isUpdate ? 1 : Number(form.elements.price.value) || 1;

  const payload = {
    assetId: currentAsset.id,
    type: form.elements.type.value,
    quantity,
    price,
    transactionDate: form.elements.transactionDate.value,
  };

  let transaction = null;
  let error = null;

  if (form.dataset.mode === 'edit') {
    const res = await updateTransaction(form.dataset.transactionId, payload);
    transaction = res.data;
    error = res.error;
  } else {
    const res = await createTransaction(payload);
    transaction = res.data;
    error = res.error;
  }

  // 23514: violacao de CHECK (quantidade zero, preco negativo).
  if (error?.code === '23514') return showError(form, 'Quantidade e preco precisam ser positivos');
  if (error) return showError(form, error.message);

  if (file && transaction) {
    const { error: uploadError } = await uploadReceipt({
      userId: transaction.user_id,
      transactionId: transaction.id,
      file,
    });
    if (uploadError)
      return showError(form, `Lancamento salvo, mas o comprovante falhou: ${uploadError.message}`);
  }

  dialog.close();
  await render();
});
// #endregion

// #region price update
const priceFixedField = priceForm.querySelector('[data-price-fixed-field]');
const priceVariableField = priceForm.querySelector('[data-price-variable-field]');

function openPriceDialog() {
  priceForm.reset();
  priceForm.elements.quoteDate.value = new Date().toISOString().slice(0, 10);

  const isFixed = isBalanceAsset(currentAsset);
  const isUsd = currentAsset?.currency === 'USD';
  const quoteUnitLabel = priceForm.querySelector('[data-quote-unit-label]');
  if (quoteUnitLabel) {
    quoteUnitLabel.textContent = `Cotação Unitária (${isUsd ? 'US$' : 'R$'})`;
  }

  if (priceFixedField) priceFixedField.hidden = !isFixed;
  if (priceVariableField) priceVariableField.hidden = isFixed;

  if (isFixed) {
    const s = summarize(currentAsset);
    const currentVal = s.value != null ? s.value : s.cost;
    priceForm.elements.currentBalance.value = currentVal > 0 ? currentVal.toFixed(2) : '';
    priceForm.elements.currentPrice.value = '';
  } else {
    priceForm.elements.currentPrice.value = currentAsset?.current_price ?? '';
    priceForm.elements.currentBalance.value = '';
  }

  const err = priceForm.querySelector('[data-price-error]');
  if (err) err.hidden = true;
  priceDialog.showModal();
}

/**
 * Ativo com ticker cotado (bolsa ou cripto) busca a cotacao no provedor; os
 * demais (renda fixa etc.) abrem o dialogo manual. Se o provedor nao devolver o
 * ticker, o dialogo manual entra como alternativa.
 */
async function refreshQuote(btn) {
  if (!currentAsset || !QUOTED_CATEGORIES.includes(currentAsset.category)) {
    openPriceDialog();
    return;
  }

  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"/></svg>
    Buscando...
  `;
  try {
    const { data, error } = await updateQuotes({ assetId: currentAsset.id });
    const fetched = !error && data?.updated > 0;
    if (fetched) {
      await render();
      return;
    }
    // Sem cotacao no provedor: deixa o usuario informar o valor a mao
    openPriceDialog();
    const err = priceForm.querySelector('[data-price-error]');
    if (err) {
      err.hidden = false;
      err.textContent = `Nao foi possivel buscar a cotacao de ${currentAsset.ticker}. Informe o valor manualmente.`;
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

for (const btn of document.querySelectorAll('[data-update-price]')) {
  btn.addEventListener('click', () => refreshQuote(btn));
}

priceForm.querySelector('[data-close-price]')?.addEventListener('click', () => priceDialog.close());

priceForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const isFixed = isBalanceAsset(currentAsset);
  const quoteDate = priceForm.elements.quoteDate.value || new Date().toISOString().slice(0, 10);
  let newPrice = 0;

  if (isFixed) {
    const newBalance = Number(priceForm.elements.currentBalance.value);
    if (Number.isNaN(newBalance) || newBalance < 0) {
      const err = priceForm.querySelector('[data-price-error]');
      err.hidden = false;
      err.textContent = 'Informe um saldo / valor válido (maior ou igual a zero)';
      return;
    }
    const { error } = await updateAsset(currentAsset.id, {
      name: currentAsset.name,
      category: currentAsset.category,
      issuer: currentAsset.issuer,
      brokerName: currentAsset.broker?.name,
      currentPrice: null,
    });

    if (error) {
      const err = priceForm.querySelector('[data-price-error]');
      err.hidden = false;
      err.textContent = error.message;
      return;
    }

    const { error: transactionError } = await createTransaction({
      assetId: currentAsset.id,
      type: 'update',
      quantity: newBalance,
      price: 1,
      transactionDate: quoteDate,
    });

    if (transactionError) {
      const err = priceForm.querySelector('[data-price-error]');
      err.hidden = false;
      err.textContent = transactionError.message;
      return;
    }

    priceDialog.close();
    await render();
    return;
  }

  newPrice = Number(priceForm.elements.currentPrice.value);
  if (Number.isNaN(newPrice) || newPrice < 0) {
    const err = priceForm.querySelector('[data-price-error]');
    err.hidden = false;
    err.textContent = 'Informe uma cotação válida (maior ou igual a zero)';
    return;
  }

  const { error } = await updateAsset(currentAsset.id, {
    name: currentAsset.name,
    category: currentAsset.category,
    issuer: currentAsset.issuer,
    brokerName: currentAsset.broker?.name,
    currentPrice: newPrice,
  });

  if (error) {
    const err = priceForm.querySelector('[data-price-error]');
    err.hidden = false;
    err.textContent = error.message;
    return;
  }

  // Grava a cotação no histórico para alimentar o gráfico de evolução mês a mês
  await recordQuote(currentAsset.id, newPrice, quoteDate);

  priceDialog.close();
  await render();
});
// #endregion

// #region table actions & receipt
document.querySelector('[data-transactions]').addEventListener('click', async (event) => {
  const editBtn = event.target.closest('[data-edit-transaction]');
  if (editBtn) {
    const tx = currentAsset.transactions.find((t) => t.id === editBtn.dataset.editTransaction);
    if (tx) openTransactionDialog(tx);
    return;
  }

  const deleteBtn = event.target.closest('[data-delete-transaction]');
  if (deleteBtn) {
    const confirmed = window.confirm('Excluir este lançamento?');
    if (!confirmed) return;

    const { error } = await deleteTransaction(deleteBtn.dataset.deleteTransaction);
    toast.hidden = !error;
    if (error) {
      toast.textContent = error.message;
      return;
    }
    await render();
    return;
  }

  const button = event.target.closest('[data-receipt]');
  if (!button) return;

  const { url, error } = await receiptUrl(button.dataset.receipt);
  toast.hidden = !error;
  if (error) {
    toast.textContent = 'Comprovante indisponivel';
    return;
  }

  window.open(url, '_blank', 'noopener');
});
// #endregion

await render();
