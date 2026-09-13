import './private.js';
import { closeDialogOnBackdropClick } from '../lib/dialog.js';
import { calculateDividends, isDividendEligibleAsset } from '../lib/dividends.js';
import { showError } from '../lib/form.js';
import {
  CATEGORY_BADGES,
  CATEGORY_LABELS,
  formatBRL,
  formatCurrency,
  formatPct,
  formatUSD,
  summarize,
  totals,
} from '../lib/portfolio.js';
import { getQueryParam, setQueryParams } from '../lib/query-params.js';
import {
  QUOTED_CATEGORIES,
  createAsset,
  deleteAsset,
  listAssets,
  updateAsset,
} from '../services/assets.js';
import { listBrokers } from '../services/brokers.js';
import { listAllDividends } from '../services/dividends.js';
import { getLatestUsdRate, listMonthlyUsdRates } from '../services/exchange.js';
import { describeRun, updateQuotes } from '../services/quotes.js';

const tbody = document.querySelector('[data-assets]');
const empty = document.querySelector('[data-empty]');
const tableTitle = document.querySelector('[data-table-title]');
const dialog = document.querySelector('[data-asset-dialog]');
const form = document.querySelector('[data-asset-form]');
const formTitle = document.querySelector('[data-asset-form-title]');
const refresh = document.querySelector('[data-update-quotes]');
const toast = document.querySelector('[data-toast]');
let currentAssets = [];
let currentUsdRate = 1;
let currentFilter = getQueryParam('filter', 'active');
let sortKey = getQueryParam('sort', 'name');
let sortDirection = getQueryParam('dir', 'asc');
let includeDividends = getQueryParam('dividends', 'false') === 'true';
// Total de proventos recebidos (em BRL) por ativo, usado no lucro e na rentabilidade
let dividendsByAsset = new Map();

closeDialogOnBackdropClick(dialog);

function syncUrlParams() {
  setQueryParams(
    {
      filter: currentFilter,
      sort: sortKey,
      dir: sortDirection,
      dividends: includeDividends ? 'true' : null,
    },
    { filter: 'active', sort: 'name', dir: 'asc', dividends: 'false' }
  );
}

function dividendsOf(asset) {
  return includeDividends ? (dividendsByAsset.get(asset.id) ?? 0) : 0;
}

// #region with-dividends
/** Resumo do ativo com lucro e rentabilidade ajustados pelos proventos, quando ativados. */
function summarizeWithDividends(asset) {
  const s = summarize(asset, { usdRate: currentUsdRate });
  const dividendsBRL = dividendsOf(asset);
  const gainBRL = s.unrealizedBRL == null ? null : s.unrealizedBRL + dividendsBRL;
  const returnPct = gainBRL == null || s.costBRL === 0 ? null : gainBRL / s.costBRL;
  return { ...s, dividendsBRL, gainBRL, returnPct };
}
// #endregion

// #region organize
// Ativo sem lancamento conta como ativo (acabou de ser cadastrado); zerado e
// o que ja teve posicao e hoje esta em zero.
function isAssetActive(asset) {
  const s = summarize(asset);
  return s.quantity > 0.00000001 || (asset.transactions?.length ?? 0) === 0;
}

function isClosedAsset(asset) {
  const s = summarize(asset);
  return (asset.transactions?.length ?? 0) > 0 && s.quantity <= 0.00000001;
}

function isBalanceAsset(asset) {
  return asset.category === 'renda_fixa' || asset.category === 'fundos';
}

function filterAssets(assets, filter) {
  if (filter === 'all') return assets;
  return assets.filter(isAssetActive);
}

function sortAssets(assets, key, direction) {
  if (!key) return assets;

  const compare = (a, b) => {
    const sa = summarizeWithDividends(a);
    const sb = summarizeWithDividends(b);

    switch (key) {
      case 'name': {
        const valA = (a.name || a.ticker || '').toLowerCase();
        const valB = (b.name || b.ticker || '').toLowerCase();
        return direction === 'asc'
          ? valA.localeCompare(valB, 'pt-BR')
          : valB.localeCompare(valA, 'pt-BR');
      }
      case 'category': {
        const valA = (CATEGORY_LABELS[a.category] || a.category || '').toLowerCase();
        const valB = (CATEGORY_LABELS[b.category] || b.category || '').toLowerCase();
        return direction === 'asc'
          ? valA.localeCompare(valB, 'pt-BR')
          : valB.localeCompare(valA, 'pt-BR');
      }
      case 'broker': {
        const valA = (a.broker?.name || '').toLowerCase();
        const valB = (b.broker?.name || '').toLowerCase();
        return direction === 'asc'
          ? valA.localeCompare(valB, 'pt-BR')
          : valB.localeCompare(valA, 'pt-BR');
      }
      case 'quantity': {
        const valA = sa.quantity ?? 0;
        const valB = sb.quantity ?? 0;
        return direction === 'asc' ? valA - valB : valB - valA;
      }
      case 'averagePrice': {
        const valA = sa.isUsd ? (sa.averagePrice ?? 0) * currentUsdRate : (sa.averagePrice ?? 0);
        const valB = sb.isUsd ? (sb.averagePrice ?? 0) * currentUsdRate : (sb.averagePrice ?? 0);
        return direction === 'asc' ? valA - valB : valB - valA;
      }
      case 'currentPrice': {
        const valA =
          a.current_price != null
            ? Number(a.current_price) * (a.currency === 'USD' ? currentUsdRate : 1)
            : Number.NEGATIVE_INFINITY;
        const valB =
          b.current_price != null
            ? Number(b.current_price) * (b.currency === 'USD' ? currentUsdRate : 1)
            : Number.NEGATIVE_INFINITY;
        return direction === 'asc' ? valA - valB : valB - valA;
      }
      case 'value': {
        const valA = sa.valueBRL != null ? sa.valueBRL : sa.costBRL;
        const valB = sb.valueBRL != null ? sb.valueBRL : sb.costBRL;
        return direction === 'asc' ? valA - valB : valB - valA;
      }
      case 'returnPct': {
        const valA = sa.returnPct != null ? sa.returnPct : Number.NEGATIVE_INFINITY;
        const valB = sb.returnPct != null ? sb.returnPct : Number.NEGATIVE_INFINITY;
        return direction === 'asc' ? valA - valB : valB - valA;
      }
      default:
        return 0;
    }
  };

  return [...assets].sort(compare);
}
// #endregion

const ICONS = {
  neutral:
    '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 transition-colors"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>',
  asc: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400"><path d="m18 15-6-6-6 6"/></svg>',
  desc: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400"><path d="m6 9 6 6 6-6"/></svg>',
};

function updateSortIcons() {
  const icons = document.querySelectorAll('[data-sort-icon]');
  for (const icon of icons) {
    const key = icon.dataset.sortIcon;
    if (key === sortKey) {
      icon.innerHTML = sortDirection === 'asc' ? ICONS.asc : ICONS.desc;
    } else {
      icon.innerHTML = ICONS.neutral;
    }
  }
}

// #region render
function renderRow(asset) {
  const s = summarizeWithDividends(asset);
  const isBalance = isBalanceAsset(asset);
  const isUsd = asset.currency === 'USD';
  const isClosed = isClosedAsset(asset);

  const tr = document.createElement('tr');
  tr.className = 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30';
  tr.dataset.ticker = asset.ticker;

  const currencyBadge = isUsd ? '<span class="badge-usd">USD</span>' : '';

  const subInfo = isBalance
    ? asset.issuer
      ? asset.issuer
      : CATEGORY_LABELS[asset.category]
    : `${asset.ticker}${asset.issuer ? ` · ${asset.issuer}` : ''}`;

  const closedBadge = isClosed
    ? '<span class="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Zerado</span>'
    : '';

  const qtyDisplay = isBalance
    ? '—'
    : isClosed
      ? '0'
      : s.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 });

  let avgPriceDisplay = '—';
  if (!isBalance && !isClosed) {
    avgPriceDisplay = isUsd
      ? `<div>${formatBRL(s.averagePrice * currentUsdRate)}</div><div class="text-[10px] text-slate-400 font-normal">${formatUSD(s.averagePrice)}</div>`
      : formatBRL(s.averagePrice);
  }

  let quoteDisplay = '—';
  if (asset.current_price != null) {
    const rawQuote = Number(asset.current_price);
    quoteDisplay = isUsd
      ? `<div>${formatBRL(rawQuote * currentUsdRate)}</div><div class="text-[10px] text-slate-400 font-normal">${formatUSD(rawQuote)}</div>`
      : formatBRL(rawQuote);
  }

  const brlValue = isClosed ? 0 : s.valueBRL != null ? s.valueBRL : s.costBRL;
  const nativeValue = isClosed ? 0 : s.value != null ? s.value : s.cost;
  const valueDisplay =
    isUsd && !isClosed
      ? `<div>${formatBRL(brlValue)}</div><div class="text-[10px] text-slate-400 font-normal">${formatUSD(nativeValue)}</div>`
      : formatBRL(brlValue);

  const dividendsHint =
    !isClosed && s.dividendsBRL > 0
      ? `<div class="text-[10px] text-purple-500 dark:text-purple-400 font-normal">+ ${formatBRL(s.dividendsBRL)}</div>`
      : '';
  const returnDisplay = isClosed ? '—' : `${formatPct(s.returnPct)}${dividendsHint}`;
  const returnClass =
    isClosed || s.returnPct == null
      ? 'text-slate-400 dark:text-slate-500'
      : s.returnPct >= 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-500 dark:text-rose-400/90';

  tr.innerHTML = `
    <td class="min-w-0 px-2 sm:px-3.5 py-3 font-semibold text-slate-900 dark:text-white">
      <div class="flex min-w-0 items-center gap-1.5">
        <a href="/asset?ticker=${encodeURIComponent(asset.ticker || asset.id)}" class="min-w-0 truncate leading-snug hover:text-emerald-600" title="${asset.name}">${asset.name}</a>
        <span class="inline-flex shrink-0 items-center gap-1">
          ${currencyBadge}
          ${closedBadge}
        </span>
      </div>
      <div class="mt-0.5 min-w-0 truncate text-[11px] sm:text-xs font-normal leading-snug text-slate-500" title="${subInfo}">${subInfo}</div>
    </td>
    <td class="hidden lg:table-cell px-3 py-3 whitespace-nowrap"><span class="${CATEGORY_BADGES[asset.category]}">${CATEGORY_LABELS[asset.category]}</span></td>
    <td class="hidden xl:table-cell px-3 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">${asset.broker?.name ?? '—'}</td>
    <td class="hidden md:table-cell px-2 sm:px-3 py-3 text-right whitespace-nowrap font-mono text-xs">${qtyDisplay}</td>
    <td class="hidden xl:table-cell px-3 py-3 text-right whitespace-nowrap">${avgPriceDisplay}</td>
    <td class="hidden sm:table-cell px-2 sm:px-3 py-3 text-right whitespace-nowrap">${quoteDisplay}</td>
    <td class="px-1.5 sm:px-3 py-3 text-right font-semibold whitespace-nowrap">${valueDisplay}</td>
    <td class="hidden lg:table-cell px-3 py-3 text-right font-semibold whitespace-nowrap ${returnClass}">${returnDisplay}</td>
    <td class="min-w-[4.5rem] px-2.5 sm:px-3.5 py-3 text-center whitespace-nowrap">
      <div class="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-1.5">
        <button type="button" data-edit-asset="${asset.id}" class="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
          <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          <span class="hidden lg:inline">Editar</span>
        </button>
        <button type="button" data-delete-asset="${asset.id}" class="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 px-2 py-1 text-xs font-medium text-rose-700 dark:text-rose-400 shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/50 transition">
          <svg class="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          <span class="hidden lg:inline">Excluir</span>
        </button>
      </div>
    </td>`;
  return tr;
}

// #region footer
/** Rodapé com o valor total e a rentabilidade ponderada das posições exibidas. */
function renderFooter(assets) {
  const footer = document.querySelector('[data-assets-footer]');
  if (!footer) return;
  const open = assets.filter((a) => !isClosedAsset(a));
  if (open.length === 0) {
    footer.hidden = true;
    footer.replaceChildren();
    return;
  }

  let cost = 0;
  let value = 0;
  let gain = 0;
  let dividends = 0;
  for (const asset of open) {
    const s = summarizeWithDividends(asset);
    cost += s.costBRL;
    value += s.valueBRL != null ? s.valueBRL : s.costBRL;
    gain += s.gainBRL ?? 0;
    dividends += s.dividendsBRL;
  }
  const returnPct = cost ? gain / cost : null;
  const returnClass =
    returnPct == null
      ? 'text-slate-400 dark:text-slate-500'
      : returnPct >= 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-500 dark:text-rose-400/90';
  const dividendsHint =
    dividends > 0
      ? `<div class="text-[10px] text-purple-500 dark:text-purple-400 font-normal">+ ${formatBRL(dividends)}</div>`
      : '';

  footer.innerHTML = `
    <tr>
      <td class="px-2 sm:px-3.5 py-3 font-bold">Total</td>
      <td class="hidden lg:table-cell px-3 py-3"></td>
      <td class="hidden xl:table-cell px-3 py-3"></td>
      <td class="hidden md:table-cell px-2 sm:px-3 py-3"></td>
      <td class="hidden xl:table-cell px-3 py-3 text-right whitespace-nowrap text-xs font-normal text-slate-500 dark:text-slate-400">Investido: ${formatBRL(cost)}</td>
      <td class="hidden sm:table-cell px-2 sm:px-3 py-3"></td>
      <td class="px-1.5 sm:px-3 py-3 text-right font-bold whitespace-nowrap">${formatBRL(value)}</td>
      <td class="hidden lg:table-cell px-3 py-3 text-right font-bold whitespace-nowrap ${returnClass}">${formatPct(returnPct)}${dividendsHint}</td>
      <td class="px-2 sm:px-3.5 py-3"></td>
    </tr>`;
  footer.hidden = false;
}
// #endregion

function renderTable() {
  const filtered = filterAssets(currentAssets, currentFilter);
  const sorted = sortAssets(filtered, sortKey, sortDirection);
  tbody.replaceChildren(...sorted.map(renderRow));
  renderFooter(sorted);
  empty.hidden = sorted.length > 0;

  if (currentAssets.length === 0) {
    empty.innerHTML = 'Nenhum ativo ainda. Cadastre o primeiro em <strong>+ Novo Ativo</strong>.';
  } else if (sorted.length === 0) {
    empty.textContent = 'Nenhuma posição ativa no momento.';
  }

  if (tableTitle) {
    tableTitle.textContent = currentFilter === 'active' ? 'Posições Ativas' : 'Todos os Ativos';
  }

  const assetsCountEl = document.querySelector('[data-assets-count]');
  if (assetsCountEl) {
    assetsCountEl.textContent =
      currentFilter === 'active'
        ? `${filtered.length} posição(ões) ativa(s)`
        : `${filtered.length} ativo(s) no total`;
  }

  updateSortIcons();
}

function computeDividendsByAsset(assets, allDivs, monthlyRates) {
  const usdRateMap = new Map((monthlyRates ?? []).map((r) => [r.month, Number(r.rate)]));
  const divsByAsset = new Map();
  for (const d of allDivs ?? []) {
    if (!divsByAsset.has(d.asset_id)) divsByAsset.set(d.asset_id, []);
    divsByAsset.get(d.asset_id).push(d);
  }

  const result = new Map();
  for (const asset of assets) {
    if (!isDividendEligibleAsset(asset)) continue;
    const calc = calculateDividends(asset.transactions ?? [], divsByAsset.get(asset.id) ?? [], {
      isUsd: asset.currency === 'USD',
      rateMap: usdRateMap,
      latestRate: currentUsdRate,
    });
    if (calc.totalReceived > 0) result.set(asset.id, calc.totalReceived);
  }
  return result;
}

function renderKpis() {
  const activeAssets = currentAssets.filter(isAssetActive);
  const t = totals(activeAssets, { usdRate: currentUsdRate });
  const kpi = (name, text) => {
    const el = document.querySelector(`[data-kpi="${name}"]`);
    if (el) el.textContent = text;
  };
  kpi('value', formatBRL(t.value));
  kpi('cost', formatBRL(t.cost));

  const dividendsTotal = activeAssets.reduce((acc, asset) => acc + dividendsOf(asset), 0);
  const diff = t.value - t.cost + dividendsTotal;
  const pct = t.cost ? diff / t.cost : null;
  kpi('unrealizedLabel', includeDividends ? 'Lucro c/ Proventos' : 'Lucro / Rendimento');
  const unrealizedEl = document.querySelector('[data-kpi="unrealized"]');
  const returnPctEl = document.querySelector('[data-kpi="returnPct"]');
  if (unrealizedEl) {
    unrealizedEl.textContent = formatBRL(diff);
    const colorClass =
      diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400/90';
    unrealizedEl.className = `mt-2 text-2xl font-bold ${colorClass}`;
  }
  if (returnPctEl) {
    returnPctEl.textContent = formatPct(pct);
    const colorClass =
      diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400/90';
    returnPctEl.className = `mt-1 text-xs font-medium ${colorClass}`;
  }

  const categoriesSet = new Set(activeAssets.map((a) => a.category));
  kpi('activeAssets', `${activeAssets.length} ${activeAssets.length === 1 ? 'ativo' : 'ativos'}`);
  kpi(
    'categoriesCount',
    `${categoriesSet.size} ${categoriesSet.size === 1 ? 'classe' : 'classes'}`
  );
}

export async function renderPortfolio() {
  const [{ data: assets, error }, { data: rateData }, { data: allDivs }, { data: monthlyRates }] =
    await Promise.all([
      listAssets(),
      getLatestUsdRate(),
      listAllDividends(),
      listMonthlyUsdRates(),
    ]);
  if (error) return;

  currentUsdRate = Number(rateData?.rate) || 1;
  currentAssets = assets;
  dividendsByAsset = computeDividendsByAsset(assets, allDivs, monthlyRates);
  renderTable();
  renderKpis();
}

const dividendsButtons = document.querySelectorAll('button[data-dividends-include]');
function updateDividendsButtonsState() {
  for (const b of dividendsButtons) {
    const active = b.dataset.dividendsInclude === String(includeDividends);
    b.className = active
      ? 'rounded-md px-3 py-1.5 font-semibold transition shadow-sm bg-white text-slate-900 dark:bg-slate-900 dark:text-white'
      : 'rounded-md px-3 py-1.5 font-medium transition text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
  }
}
updateDividendsButtonsState();

for (const btn of dividendsButtons) {
  btn.addEventListener('click', () => {
    const next = btn.dataset.dividendsInclude === 'true';
    if (next === includeDividends) return;
    includeDividends = next;
    updateDividendsButtonsState();
    syncUrlParams();
    renderTable();
    renderKpis();
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
function updateFilterButtonsState() {
  for (const b of filterButtons) {
    const active = b.dataset.filter === currentFilter;
    b.className = active
      ? 'rounded-md px-3 py-1.5 font-semibold transition shadow-sm bg-white text-slate-900 dark:bg-slate-900 dark:text-white'
      : 'rounded-md px-3 py-1.5 font-medium transition text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
  }
}
updateFilterButtonsState();

for (const btn of filterButtons) {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === currentFilter) return;
    currentFilter = filter;
    updateFilterButtonsState();
    syncUrlParams();
    renderTable();
  });
}

const sortHeaders = document.querySelectorAll('th[data-sort]');
for (const th of sortHeaders) {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDirection = ['value', 'returnPct', 'quantity', 'currentPrice'].includes(key)
        ? 'desc'
        : 'asc';
    }
    syncUrlParams();
    renderTable();
  });
}
// #endregion

// #region create
const tickerContainer = form.querySelector('[data-ticker-field]');
function updateTickerVisibility() {
  if (tickerContainer) tickerContainer.hidden = false;
  form.elements.ticker.required = true;
}
// A moeda e um grupo de botoes sobre um input oculto: o restante do formulario
// continua lendo `form.elements.currency.value`.
function setCurrency(value) {
  form.elements.currency.value = value === 'USD' ? 'USD' : 'BRL';
  for (const btn of form.querySelectorAll('button[data-currency-option]')) {
    const isActive = btn.dataset.currencyOption === form.elements.currency.value;
    btn.className = isActive
      ? 'px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition'
      : 'px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
  }
}

function updateCurrencyVisibility() {
  const isFixedIncome = form.elements.category.value === 'renda_fixa';
  const currencyField = form.querySelector('[data-currency-field]');
  if (currencyField) currencyField.hidden = isFixedIncome;
  if (isFixedIncome) setCurrency('BRL');
}

for (const btn of form.querySelectorAll('button[data-currency-option]')) {
  btn.addEventListener('click', () => setCurrency(btn.dataset.currencyOption));
}

// #region currency
// Ticker so de letras (VT, AAPL, BND) e o padrao dos EUA; com digito (PETR4,
// HGLG11) e o da B3. E so uma sugestao: o botao BRL/USD continua valendo.
function autoDetectCurrency() {
  if (form.dataset.mode !== 'create') return;
  const rawTicker = form.elements.ticker.value.trim().toUpperCase();
  const category = form.elements.category.value;
  if (category === 'renda_fixa') return;

  // ETFs ou Ações sem dígitos (ex: VT, VNQ, BND, IAU, TFLO, AAPL, SPY) são tipicamente cotados em USD
  if (rawTicker && !/\d/.test(rawTicker) && rawTicker.length >= 2 && rawTicker.length <= 5) {
    setCurrency('USD');
  } else if (/\d/.test(rawTicker)) {
    setCurrency('BRL');
  }
}

// #endregion

form.elements.ticker.addEventListener('input', autoDetectCurrency);
form.elements.category.addEventListener('change', () => {
  updateTickerVisibility();
  updateCurrencyVisibility();
  autoDetectCurrency();
});

async function fillBrokers() {
  const { data } = await listBrokers();
  document
    .querySelector('[data-brokers]')
    .replaceChildren(
      ...(data ?? []).map((b) => Object.assign(document.createElement('option'), { value: b.name }))
    );
}

async function openAssetDialog(asset = null) {
  form.reset();
  form.dataset.mode = asset ? 'edit' : 'create';
  form.dataset.assetId = asset?.id ?? '';
  formTitle.textContent = asset ? 'Editar ativo' : 'Novo ativo';
  form.elements.category.value = asset?.category ?? 'renda_fixa';
  form.elements.ticker.value = asset?.ticker ?? '';
  form.elements.name.value = asset?.name ?? '';
  form.elements.brokerName.value = asset?.broker?.name ?? '';
  form.elements.issuer.value = asset?.issuer ?? '';
  updateTickerVisibility();
  updateCurrencyVisibility();
  setCurrency(asset?.currency ?? 'BRL');
  showError(form, '');
  dialog.showModal();
  await fillBrokers();
}

for (const btn of document.querySelectorAll('[data-new-asset]')) {
  btn.addEventListener('click', async () => {
    await openAssetDialog();
  });
}

form.querySelector('[data-close]').addEventListener('click', () => dialog.close());

tbody.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-edit-asset]');
  if (editButton) {
    const asset = currentAssets.find((item) => item.id === editButton.dataset.editAsset);
    if (asset) await openAssetDialog(asset);
    return;
  }

  const deleteButton = event.target.closest('[data-delete-asset]');
  if (!deleteButton) return;

  const asset = currentAssets.find((item) => item.id === deleteButton.dataset.deleteAsset);
  const confirmed = window.confirm(
    `Excluir ${asset?.ticker ?? 'este ativo'}? Os aportes, resgates, comprovantes vinculados e o historico de cotacoes tambem serao removidos.`
  );
  if (!confirmed) return;

  const { error } = await deleteAsset(deleteButton.dataset.deleteAsset);
  toast.hidden = !error;
  if (error) {
    toast.textContent = error.message;
    return;
  }

  await renderPortfolio();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const currentAsset =
    form.dataset.mode === 'edit'
      ? currentAssets.find((item) => item.id === form.dataset.assetId)
      : null;
  const payload = {
    ticker: form.elements.ticker.value,
    name: form.elements.name.value,
    category: form.elements.category.value,
    currency: form.elements.currency.value || 'BRL',
    issuer: form.elements.issuer.value,
    brokerName: form.elements.brokerName.value,
    currentPrice: currentAsset?.current_price ?? undefined,
  };

  const { data: savedAsset, error } =
    form.dataset.mode === 'edit'
      ? await updateAsset(form.dataset.assetId, payload)
      : await createAsset(payload);

  // 23505 e a violacao do unique (user_id, ticker).
  if (error?.code === '23505') return showError(form, 'Voce ja tem esse ticker');
  if (error) return showError(form, error.message);

  dialog.close();
  if (savedAsset && QUOTED_CATEGORIES.includes(savedAsset.category)) {
    toast.hidden = true;
    const { data, error: quoteError } = await updateQuotes();
    toast.hidden = false;
    toast.textContent = quoteError
      ? 'Ativo salvo, mas nao foi possivel atualizar a cotacao agora'
      : `Ativo salvo. ${describeRun(data)}`;
  }
  await renderPortfolio();
});
// #endregion

// #region quotes
refresh.addEventListener('click', async () => {
  refresh.disabled = true;
  refresh.querySelector('[data-update-quotes-icon]')?.classList.add('animate-spin');
  toast.hidden = true;

  const { data, error } = await updateQuotes();

  refresh.disabled = false;
  refresh.querySelector('[data-update-quotes-icon]')?.classList.remove('animate-spin');
  toast.hidden = false;
  toast.textContent = error ? 'Nao foi possivel atualizar as cotacoes' : describeRun(data);

  if (!error) await renderPortfolio();
});
// #endregion

await renderPortfolio();
