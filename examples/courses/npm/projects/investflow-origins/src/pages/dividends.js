import './private.js';
import { renderBarChart } from '../lib/bar-chart.js';
import {
  buildDividendsMatrix,
  calculateDividends,
  isDividendEligibleAsset,
} from '../lib/dividends.js';
import { formatBRL, formatDate, formatPct, truncateText } from '../lib/portfolio.js';
import { getQueryParam, setQueryParams } from '../lib/query-params.js';
import { listAssets } from '../services/assets.js';
import { fetchAndSyncDividends, listAllDividends } from '../services/dividends.js';
import { listTransactions } from '../services/transactions.js';

// Estado local inicializado a partir da query string
let selectedAssetId = getQueryParam('asset', 'all');
let selectedTimeRange = getQueryParam('range', 'all');
let selectedDividendsView = getQueryParam('view', 'chart');
let assets = [];
let allTransactions = [];
let allReceivedDividends = [];

function syncUrlParams() {
  setQueryParams(
    {
      asset: selectedAssetId,
      range: selectedTimeRange,
      view: selectedDividendsView,
    },
    { asset: 'all', range: 'all', view: 'chart' }
  );
}

const toastEl = document.querySelector('[data-toast]');
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  setTimeout(() => {
    toastEl.hidden = true;
  }, 3500);
}

// 1. Carregamento de dados
async function loadData() {
  try {
    const [{ data: assetList }, { data: txList }, { data: allDivs }] = await Promise.all([
      listAssets(),
      listTransactions(),
      listAllDividends(),
    ]);
    assets = assetList ?? [];
    allTransactions = txList ?? [];

    // Mapeia proventos por ativo
    const divsByAsset = new Map();
    for (const d of allDivs ?? []) {
      if (!divsByAsset.has(d.asset_id)) divsByAsset.set(d.asset_id, []);
      divsByAsset.get(d.asset_id).push(d);
    }

    // Calcula proventos recebidos para cada ativo de renda variável
    allReceivedDividends = [];
    for (const asset of assets) {
      if (asset.category !== 'renda_fixa') {
        const assetTx = allTransactions.filter((t) => t.asset_id === asset.id);
        const assetDivs = divsByAsset.get(asset.id) ?? [];
        const calc = calculateDividends(assetTx, assetDivs);
        for (const item of calc.items) {
          allReceivedDividends.push({
            ...item,
            assetId: asset.id,
            assetTicker: asset.ticker,
            assetName: asset.name,
          });
        }
      }
    }

    // Ordena proventos recebidos (mais recente primeiro)
    allReceivedDividends.sort((a, b) =>
      (b.paymentDate || b.exDate).localeCompare(a.paymentDate || a.exDate)
    );

    populateAssetSelect();
    renderKPIs();
    renderCharts();
    renderDividendsTable();
  } catch (err) {
    console.error('Erro ao carregar proventos:', err);
    showToast(`Erro ao carregar dados: ${err.message}`);
  }
}

// 2. Seletor de ativo do filtro
function populateAssetSelect() {
  const filterSelect = document.querySelector('[data-filter-asset]');
  if (!filterSelect) return;
  filterSelect.innerHTML = '<option value="all">Todos os Ativos</option>';
  for (const asset of assets) {
    if (!isDividendEligibleAsset(asset)) continue;
    const opt = document.createElement('option');
    opt.value = asset.id;
    opt.textContent = `${asset.ticker} · ${truncateText(asset.name, 22)}`;
    filterSelect.appendChild(opt);
  }
  filterSelect.value = selectedAssetId || 'all';
}

// 3. KPIs
// #region kpis
function renderKPIs() {
  const kpi = (name, text) => {
    const el = document.querySelector(`[data-kpi="${name}"]`);
    if (el) el.textContent = text;
  };

  // O filtro global por ativo vale tambem para os KPIs
  const received = allReceivedDividends.filter(
    (d) => selectedAssetId === 'all' || d.assetId === selectedAssetId
  );
  const transactions = allTransactions.filter(
    (t) => selectedAssetId === 'all' || t.asset_id === selectedAssetId
  );
  const totalDivs = received.reduce((sum, d) => sum + d.total, 0);
  kpi('total-dividends', formatBRL(totalDivs));

  // Proventos dos últimos 12 meses e média mensal no período
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const oneYearAgoStr = oneYearAgo.toISOString().slice(0, 10);
  const ltmDivs = received
    .filter((d) => (d.paymentDate || d.exDate) >= oneYearAgoStr)
    .reduce((sum, d) => sum + d.total, 0);
  kpi('ltm-dividends', formatBRL(ltmDivs));
  kpi('monthly-avg', formatBRL(ltmDivs / 12));

  // Yield on Cost médio: proventos sobre o total comprado
  const totalBuys = transactions
    .filter((t) => t.type === 'buy')
    .reduce((sum, t) => sum + Number(t.quantity) * Number(t.price), 0);
  kpi('avg-yoc', formatPct(totalBuys > 0 ? totalDivs / totalBuys : 0));
}
// #endregion

// 4. Gráficos e Matriz Comparativa
function updateDividendsRangeButtons() {
  const btnGroup = document.querySelector('[data-dividends-range-group]');
  if (!btnGroup) return;
  const buttons = btnGroup.querySelectorAll('button[data-dividends-range]');
  for (const btn of buttons) {
    const isActive = btn.dataset.dividendsRange === selectedTimeRange;
    if (isActive) {
      btn.className =
        'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition';
    } else {
      btn.className =
        'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
    }
  }
}

function updateDividendsView() {
  const chartWrapper = document.querySelector('[data-dividends-chart-wrapper]');
  const matrixWrapper = document.querySelector('[data-dividends-matrix-wrapper]');
  const rangeContainer = document.querySelector('[data-dividends-range-container]');
  const viewGroup = document.querySelector('[data-dividends-view-group]');

  if (viewGroup) {
    const buttons = viewGroup.querySelectorAll('button[data-dividends-view]');
    for (const btn of buttons) {
      const isActive = btn.dataset.dividendsView === selectedDividendsView;
      if (isActive) {
        btn.className =
          'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition flex items-center gap-1.5';
      } else {
        btn.className =
          'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5';
      }
    }
  }

  if (chartWrapper && matrixWrapper) {
    if (selectedDividendsView === 'chart') {
      chartWrapper.hidden = false;
      matrixWrapper.hidden = true;
      if (rangeContainer) rangeContainer.hidden = false;
    } else if (selectedDividendsView === 'matrix') {
      chartWrapper.hidden = true;
      matrixWrapper.hidden = false;
      if (rangeContainer) rangeContainer.hidden = true;
    } else {
      // 'both'
      chartWrapper.hidden = false;
      matrixWrapper.hidden = false;
      if (rangeContainer) rangeContainer.hidden = false;
    }
  }
}

function renderDividendsMatrixTable(items) {
  const matrixData = buildDividendsMatrix(items);
  const { years, months, matrix, yearTotals, monthTotals, grandTotal } = matrixData;

  const container = document.querySelector('[data-dividends-matrix]');
  if (!container) return;

  if (years.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        Nenhum provento creditado para comparação no período selecionado.
      </div>
    `;
    return;
  }

  // Encontra o valor individual máximo para destaque suave
  let maxMonthVal = 0;
  for (const y of years) {
    for (const val of matrix[y]) {
      if (val > maxMonthVal) maxMonthVal = val;
    }
  }

  let html = `
    <div class="w-full rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table class="w-full table-fixed text-[11px] sm:text-xs text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold">
            <th class="py-2.5 px-2 sm:px-3 text-left w-[11%] sm:w-[9%] border-r border-slate-200 dark:border-slate-700">Ano</th>
            ${months.map((m) => `<th class="py-2.5 px-0.5 sm:px-1 text-right font-medium w-[6.2%] sm:w-[6.5%]">${m}</th>`).join('')}
            <th class="py-2.5 px-2 sm:px-3 text-right font-bold text-purple-700 dark:text-purple-300 bg-purple-50/60 dark:bg-purple-950/30 border-l border-slate-200 dark:border-slate-800 w-[14.6%] sm:w-[13%]">Total (R$)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
  `;

  for (const y of years) {
    const rowMonths = matrix[y];
    const totalYear = yearTotals[y] || 0;

    html += `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
        <td class="py-2.5 px-2 sm:px-3 font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 truncate">
          ${y}
        </td>
    `;

    for (let m = 0; m < 12; m++) {
      const val = rowMonths[m];
      if (val > 0) {
        const ratio = maxMonthVal > 0 ? val / maxMonthVal : 0;
        const bgClass =
          ratio > 0.5
            ? 'bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
            : 'font-medium text-slate-900 dark:text-slate-100';
        const formattedVal = val.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        html += `
          <td class="py-2.5 px-0.5 sm:px-1 text-right font-mono truncate ${bgClass}" title="${months[m]}/${y}: ${formatBRL(val)}">
            ${formattedVal}
          </td>
        `;
      } else {
        html += `
          <td class="py-2.5 px-0.5 sm:px-1 text-right text-slate-400 dark:text-slate-600 font-mono">
            —
          </td>
        `;
      }
    }

    html += `
        <td class="py-2.5 px-2 sm:px-3 text-right font-bold font-mono text-purple-700 dark:text-purple-300 bg-purple-50/40 dark:bg-purple-950/20 border-l border-slate-100 dark:border-slate-800 truncate" title="Total ${y}: ${formatBRL(totalYear)}">
          ${formatBRL(totalYear)}
        </td>
      </tr>
    `;
  }

  // Linha de Rodapé com Totais por Mês e Total Geral
  html += `
        </tbody>
        <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/80 font-semibold text-slate-900 dark:text-slate-100">
          <tr>
            <td class="py-2.5 px-2 sm:px-3 font-bold border-r border-slate-200 dark:border-slate-700 truncate">
              Total
            </td>
  `;

  for (let m = 0; m < 12; m++) {
    const mTotal = monthTotals[m] || 0;
    const formattedTotal = mTotal.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    html += `
      <td class="py-2.5 px-0.5 sm:px-1 text-right font-mono truncate ${mTotal > 0 ? 'text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-400 dark:text-slate-600'}" title="Total ${months[m]}: ${formatBRL(mTotal)}">
        ${mTotal > 0 ? formattedTotal : '—'}
      </td>
    `;
  }

  html += `
            <td class="py-2.5 px-2 sm:px-3 text-right font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/50 border-l border-slate-200 dark:border-slate-700 truncate" title="Total Geral: ${formatBRL(grandTotal)}">
              ${formatBRL(grandTotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

function renderCharts() {
  // Filtra proventos pelo período de tempo selecionado
  const now = new Date();
  const currentYear = now.getFullYear();
  let startMonthStr = '';
  if (selectedTimeRange === 'ytd') {
    startMonthStr = `${currentYear}-01`;
  } else if (selectedTimeRange === '2y') {
    const twoYearsAgoYear = currentYear - 2;
    const currentMonthNum = String(now.getMonth() + 1).padStart(2, '0');
    startMonthStr = `${twoYearsAgoYear}-${currentMonthNum}`;
  }

  // Proventos filtrados por ativo (para a matriz comparativa completa)
  const assetFilteredDividends = allReceivedDividends.filter((item) => {
    return selectedAssetId === 'all' || item.assetId === selectedAssetId;
  });

  // Proventos filtrados por ativo e tempo (para o gráfico)
  const filteredDividends = assetFilteredDividends.filter((item) => {
    const m = (item.paymentDate || item.exDate || '').slice(0, 7);
    return !startMonthStr || m >= startMonthStr;
  });

  // 4.1 Gráfico de Barras Mensais de Proventos
  const monthlyMap = new Map();
  for (const item of filteredDividends) {
    const month = (item.paymentDate || item.exDate).slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + item.total);
  }

  const sortedMonths = [...monthlyMap.keys()].sort();
  const monthNames = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  const chartData = sortedMonths.map((month) => {
    const [year, m] = month.split('-');
    const mIndex = Number(m) - 1;
    const shortMonth = monthNames[mIndex] ?? m;
    const year2 = year.slice(-2);
    const label = `${shortMonth}/${year2}`;
    return {
      label,
      month,
      value: monthlyMap.get(month),
    };
  });

  const chartContainer = document.querySelector('[data-dividends-chart]');
  if (chartContainer) {
    chartContainer.replaceChildren(
      renderBarChart(chartData, {
        color: '#a855f7',
        format: formatBRL,
        width: 960,
        height: 260,
      })
    );
  }

  // 4.2 Matriz Comparativa Anual x Mensal
  renderDividendsMatrixTable(assetFilteredDividends);

  updateDividendsRangeButtons();
  updateDividendsView();

  // 4.2 Maiores Pagadores (respeita o filtro de tempo)
  const byAssetMap = new Map();
  for (const item of filteredDividends) {
    if (!byAssetMap.has(item.assetTicker)) {
      byAssetMap.set(item.assetTicker, {
        ticker: item.assetTicker,
        name: item.assetName,
        total: 0,
      });
    }
    byAssetMap.get(item.assetTicker).total += item.total;
  }

  const totalFiltered = filteredDividends.reduce((sum, d) => sum + d.total, 0);
  const topList = [...byAssetMap.values()].sort((a, b) => b.total - a.total);

  const topContainer = document.querySelector('[data-top-dividends]');
  const topEmpty = document.querySelector('[data-top-dividends-empty]');

  if (topContainer) {
    if (topList.length === 0) {
      topContainer.replaceChildren();
      if (topEmpty) topEmpty.hidden = false;
    } else {
      if (topEmpty) topEmpty.hidden = true;

      // Divide a lista em 2 colunas balanceadas para melhor aproveitamento do espaço
      const mid = Math.ceil(topList.length / 2);
      const col1Items = topList.slice(0, mid);
      const col2Items = topList.slice(mid);

      const renderTableColumn = (items) => {
        if (!items.length) return '';
        return `
          <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold">
                  <th class="py-2.5 px-3.5">Ativo</th>
                  <th class="py-2.5 px-3 text-right">Total</th>
                  <th class="py-2.5 px-3.5 text-right w-36 sm:w-44">Participação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                ${items
                  .map((item) => {
                    const share = totalFiltered > 0 ? (item.total / totalFiltered) * 100 : 0;
                    return `
                      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td class="py-2.5 px-3.5">
                          <div class="flex items-center gap-2 min-w-0">
                            <span class="font-bold text-slate-900 dark:text-white">${item.ticker}</span>
                            <span class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[130px] sm:max-w-[170px]" title="${item.ticker} (${item.name})">
                              ${item.name}
                            </span>
                          </div>
                        </td>
                        <td class="py-2.5 px-3 text-right font-mono font-bold text-purple-700 dark:text-purple-300">
                          ${formatBRL(item.total)}
                        </td>
                        <td class="py-2.5 px-3.5 text-right">
                          <div class="flex items-center justify-end gap-2">
                            <div class="w-16 sm:w-20 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div class="h-2 rounded-full bg-purple-500 transition-all duration-300" style="width: ${share.toFixed(1)}%"></div>
                            </div>
                            <span class="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 w-11 text-right">${share.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      };

      topContainer.innerHTML = `
        <div class="grid grid-cols-1 ${col2Items.length > 0 ? 'lg:grid-cols-2' : ''} gap-4 sm:gap-6">
          ${renderTableColumn(col1Items)}
          ${col2Items.length > 0 ? renderTableColumn(col2Items) : ''}
        </div>
      `;
    }
  }
}

// 5. Tabela de proventos
function renderDividendsTable() {
  const tbody = document.querySelector('[data-dividends-tbody]');
  const tfoot = document.querySelector('[data-dividends-tfoot]');
  const emptyEl = document.querySelector('[data-dividends-empty]');
  if (!tbody) return;

  const filtered = allReceivedDividends.filter(
    (d) => selectedAssetId === 'all' || d.assetId === selectedAssetId
  );

  if (filtered.length === 0) {
    tbody.replaceChildren();
    if (tfoot) {
      tfoot.hidden = true;
      tfoot.replaceChildren();
    }
    if (emptyEl) emptyEl.hidden = false;
    return;
  }

  if (emptyEl) emptyEl.hidden = true;

  // Rodapé: total de proventos recebidos no filtro atual
  if (tfoot) {
    const total = filtered.reduce((acc, item) => acc + Number(item.total), 0);
    tfoot.innerHTML = `
      <tr>
        <td class="py-3 px-4 font-bold" colspan="5">Total (${filtered.length} ${filtered.length === 1 ? 'provento' : 'proventos'})</td>
        <td class="py-3 px-4 text-right font-bold font-mono text-purple-700 dark:text-purple-300">${formatBRL(total)}</td>
      </tr>`;
    tfoot.hidden = false;
  }

  tbody.replaceChildren(
    ...filtered.map((item) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition';
      tr.innerHTML = `
        <td class="py-2.5 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
          <a href="/asset?ticker=${encodeURIComponent(item.assetTicker || item.assetId)}" class="hover:underline text-emerald-600 dark:text-emerald-400 font-bold">${item.assetTicker}</a>
          <span class="text-xs text-slate-500 block font-normal truncate max-w-[180px]" title="${item.assetName}">${truncateText(item.assetName, 22)}</span>
        </td>
        <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${formatDate(item.exDate)}</td>
        <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${formatDate(item.paymentDate)}</td>
        <td class="py-3 px-4 text-right font-mono">${item.quantity.toLocaleString('pt-BR')}</td>
        <td class="py-3 px-4 text-right font-mono">${formatBRL(item.rate)}</td>
        <td class="py-3 px-4 text-right font-bold text-purple-700 dark:text-purple-300 font-mono">${formatBRL(item.total)}</td>
      `;
      return tr;
    })
  );
}

// 6. Configuração de Eventos
function initEvents() {
  // 6.1 Filtro por Ativo
  document.querySelector('[data-filter-asset]')?.addEventListener('change', (e) => {
    selectedAssetId = e.target.value;
    syncUrlParams();
    renderKPIs();
    renderCharts();
    renderDividendsTable();
  });

  // 6.2 Filtro de Período e Visão da evolução
  document.querySelector('[data-dividends-range-group]')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-dividends-range]');
    if (!btn) return;
    selectedTimeRange = btn.dataset.dividendsRange;
    syncUrlParams();
    renderCharts();
  });

  document.querySelector('[data-dividends-view-group]')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-dividends-view]');
    if (!btn) return;
    selectedDividendsView = btn.dataset.dividendsView;
    syncUrlParams();
    updateDividendsView();
  });

  // 6.3 Sincronizar Proventos
  const syncBtn = document.querySelector('[data-sync-dividends]');
  syncBtn?.addEventListener('click', async () => {
    syncBtn.disabled = true;
    syncBtn.querySelector('[data-sync-dividends-icon]')?.classList.add('animate-spin');
    showToast('Sincronizando proventos da carteira...');
    try {
      for (const asset of assets) {
        if (isDividendEligibleAsset(asset)) await fetchAndSyncDividends(asset);
      }
      showToast('Proventos sincronizados com sucesso!');
      await loadData();
    } catch (err) {
      showToast(`Erro ao sincronizar proventos: ${err.message}`);
    } finally {
      syncBtn.disabled = false;
      syncBtn.querySelector('[data-sync-dividends-icon]')?.classList.remove('animate-spin');
    }
  });
}

// Inicialização
initEvents();
await loadData();
