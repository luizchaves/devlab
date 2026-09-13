import './private.js';
import { renderBarChart } from '../lib/bar-chart.js';
import { closeDialogOnBackdropClick } from '../lib/dialog.js';
import { formatBRL, formatDate, truncateText } from '../lib/portfolio.js';
import { getQueryParam, setQueryParams } from '../lib/query-params.js';
import { listAssets } from '../services/assets.js';
import { receiptUrl, uploadReceipt } from '../services/receipts.js';
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from '../services/transactions.js';

// Estado local inicializado a partir da query string
let selectedAssetId = getQueryParam('asset', 'all');
let selectedTimeRange = getQueryParam('range', 'all');
let assets = [];
let allTransactions = [];

function syncUrlParams() {
  setQueryParams(
    { asset: selectedAssetId, range: selectedTimeRange },
    { asset: 'all', range: 'all' }
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
    const [{ data: assetList }, { data: txList }] = await Promise.all([
      listAssets(),
      listTransactions(),
    ]);
    assets = assetList ?? [];

    const assetMap = new Map(assets.map((a) => [a.id, a]));

    // Monta lista de transações com dados do ativo
    allTransactions = (txList ?? []).map((t) => {
      const asset = assetMap.get(t.asset_id);
      return {
        ...t,
        assetTicker: asset?.ticker ?? '—',
        assetName: asset?.name ?? '—',
        assetCategory: asset?.category ?? '—',
      };
    });

    populateAssetSelects();
    renderKPIs();
    renderChart();
    renderMovementsTable();
  } catch (err) {
    console.error('Erro ao carregar movimentações:', err);
    showToast(`Erro ao carregar dados: ${err.message}`);
  }
}

// 2. Preenchimento de Seletores de Ativo
function populateAssetSelects() {
  const filterSelect = document.querySelector('[data-filter-asset]');
  if (filterSelect) {
    filterSelect.innerHTML = '<option value="all">Todos os Ativos</option>';
    for (const asset of assets) {
      const opt = document.createElement('option');
      opt.value = asset.id;
      opt.textContent = `${asset.ticker} · ${truncateText(asset.name, 22)}`;
      filterSelect.appendChild(opt);
    }
    filterSelect.value = selectedAssetId || 'all';
  }

  const txAssetSelect = document.querySelector('[name="assetId"]');
  if (txAssetSelect) {
    txAssetSelect.innerHTML = '';
    for (const asset of assets) {
      const opt = document.createElement('option');
      opt.value = asset.id;
      opt.textContent = `${asset.ticker} (${asset.name})`;
      txAssetSelect.appendChild(opt);
    }
  }
}

function filteredTransactions() {
  return allTransactions.filter((t) => selectedAssetId === 'all' || t.asset_id === selectedAssetId);
}

// #region kpis
// 3. KPIs
function renderKPIs() {
  const kpi = (name, text) => {
    const el = document.querySelector(`[data-kpi="${name}"]`);
    if (el) el.textContent = text;
  };

  // O filtro global por ativo vale tambem para os KPIs
  const transactions = filteredTransactions();
  let totalBuys = 0;
  let totalSells = 0;
  for (const t of transactions) {
    const amount = Number(t.quantity) * Number(t.price);
    if (t.type === 'buy') totalBuys += amount;
    else if (t.type === 'sell') totalSells += amount;
  }
  kpi('net-invested', formatBRL(totalBuys - totalSells));
  kpi('total-buys', formatBRL(totalBuys));
  kpi('total-sells', formatBRL(totalSells));
  kpi(
    'count',
    `${transactions.length} ${transactions.length === 1 ? 'lançamento' : 'lançamentos'}`
  );
}
// #endregion

// 4. Gráfico de aportes por mês
function updateRangeButtons() {
  const btnGroup = document.querySelector('[data-movements-range-group]');
  if (!btnGroup) return;
  for (const btn of btnGroup.querySelectorAll('button[data-movements-range]')) {
    const isActive = btn.dataset.movementsRange === selectedTimeRange;
    btn.className = isActive
      ? 'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition'
      : 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
  }
}

const MONTH_NAMES = [
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

function renderChart() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let startMonthStr = '';
  if (selectedTimeRange === 'ytd') {
    startMonthStr = `${currentYear}-01`;
  } else if (selectedTimeRange === '2y') {
    const currentMonthNum = String(now.getMonth() + 1).padStart(2, '0');
    startMonthStr = `${currentYear - 2}-${currentMonthNum}`;
  }

  // Soma as compras (aportes) por mês, respeitando o filtro de ativo e o período
  const monthlyMap = new Map();
  for (const t of filteredTransactions()) {
    if (t.type !== 'buy') continue;
    const month = t.transaction_date.slice(0, 7);
    if (startMonthStr && month < startMonthStr) continue;
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + Number(t.quantity) * Number(t.price));
  }

  const chartData = [...monthlyMap.keys()].sort().map((month) => {
    const [year, m] = month.split('-');
    return {
      label: `${MONTH_NAMES[Number(m) - 1] ?? m}/${year.slice(-2)}`,
      month,
      value: monthlyMap.get(month),
    };
  });

  const chartContainer = document.querySelector('[data-movements-chart]');
  if (chartContainer) {
    chartContainer.replaceChildren(
      renderBarChart(chartData, {
        color: '#10b981',
        format: formatBRL,
        width: 960,
        height: 260,
        seriesLabel: 'Aportes',
      })
    );
  }
  updateRangeButtons();
}

// 5. Tabela de movimentações
function renderMovementsTable() {
  const tbody = document.querySelector('[data-movements-tbody]');
  const tfoot = document.querySelector('[data-movements-tfoot]');
  const emptyEl = document.querySelector('[data-movements-empty]');
  if (!tbody) return;

  const filtered = allTransactions.filter(
    (t) => selectedAssetId === 'all' || t.asset_id === selectedAssetId
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

  // Rodapé: total comprado, total vendido e saldo líquido do filtro atual
  if (tfoot) {
    let bought = 0;
    let sold = 0;
    for (const t of filtered) {
      const total = Number(t.quantity) * Number(t.price);
      if (t.type === 'buy') bought += total;
      else if (t.type === 'sell') sold += total;
    }
    tfoot.innerHTML = `
      <tr>
        <td class="py-3 px-4 font-bold" colspan="3">Total (${filtered.length})</td>
        <td class="py-3 px-4 text-right text-xs font-normal text-slate-500 dark:text-slate-400 whitespace-nowrap" colspan="2">
          Compras: <span class="font-mono text-emerald-700 dark:text-emerald-300">${formatBRL(bought)}</span>
          · Vendas: <span class="font-mono text-rose-700 dark:text-rose-300">${formatBRL(sold)}</span>
        </td>
        <td class="py-3 px-4 text-right font-bold font-mono">${formatBRL(bought - sold)}</td>
        <td class="py-3 px-4" colspan="2"></td>
      </tr>`;
    tfoot.hidden = false;
  }

  tbody.replaceChildren(
    ...filtered.map((t) => {
      const tr = document.createElement('tr');
      tr.dataset.transactionId = t.id;
      tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition';

      const typeBadge =
        t.type === 'buy'
          ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Compra</span>'
          : t.type === 'sell'
            ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">Venda</span>'
            : '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">Atualização</span>';

      const total = Number(t.quantity) * Number(t.price);

      const receiptButton = t.receipt_path
        ? `<button type="button" data-view-receipt="${t.receipt_path}" class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg><span>Ver anexo</span></button>`
        : '<span class="text-slate-400 text-xs">—</span>';

      tr.innerHTML = `
        <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${formatDate(t.transaction_date)}</td>
        <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
          <a href="/asset?ticker=${encodeURIComponent(t.assetTicker || t.asset_id)}" class="hover:underline text-emerald-600 dark:text-emerald-400 font-bold">${t.assetTicker}</a>
          <span class="text-xs text-slate-500 block font-normal truncate max-w-[180px]" title="${t.assetName}">${truncateText(t.assetName, 22)}</span>
        </td>
        <td class="py-3 px-4">${typeBadge}</td>
        <td class="py-3 px-4 text-right font-mono">${Number(t.quantity).toLocaleString('pt-BR')}</td>
        <td class="py-3 px-4 text-right font-mono">${formatBRL(Number(t.price))}</td>
        <td class="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">${formatBRL(total)}</td>
        <td class="py-3 px-4 text-center">${receiptButton}</td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <button type="button" data-edit-tx="${t.id}" class="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              <span>Editar</span>
            </button>
            <button type="button" data-delete-tx="${t.id}" class="inline-flex items-center gap-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 px-2 py-1 text-xs font-medium text-rose-700 dark:text-rose-400 shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/50 transition">
              <svg class="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <span>Excluir</span>
            </button>
          </div>
        </td>
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
    renderChart();
    renderMovementsTable();
  });

  // 6.2 Filtro de Período do gráfico
  document.querySelector('[data-movements-range-group]')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-movements-range]');
    if (!btn) return;
    selectedTimeRange = btn.dataset.movementsRange;
    syncUrlParams();
    renderChart();
  });

  // 6.3 Diálogo de Transação
  const dialog = document.querySelector('[data-transaction-dialog]');
  const form = document.querySelector('[data-transaction-form]');
  const dialogTitle = document.querySelector('[data-transaction-dialog-title]');
  closeDialogOnBackdropClick(dialog);

  document.querySelector('[data-new-transaction]')?.addEventListener('click', () => {
    form.reset();
    form.elements.id.value = '';
    form.elements.transactionDate.value = new Date().toISOString().slice(0, 10);
    if (dialogTitle) dialogTitle.textContent = 'Registrar Movimentação';
    dialog.showModal();
  });

  const closeButtons = document.querySelectorAll('[data-close-transaction-dialog]');
  for (const btn of closeButtons) {
    btn.addEventListener('click', () => dialog.close());
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = form.querySelector('[data-form-error]');
    errorEl.classList.add('hidden');

    const txId = form.elements.id.value;
    const assetId = form.elements.assetId.value;
    const type = form.elements.type.value;
    const quantity = Number(form.elements.quantity.value);
    const price = Number(form.elements.price.value);
    const transactionDate = form.elements.transactionDate.value;
    const receiptFile = form.elements.receipt?.files?.[0];

    try {
      const payload = { type, quantity, price, transactionDate };
      const res = txId
        ? await updateTransaction(txId, payload)
        : await createTransaction({ assetId, ...payload });
      if (res.error) throw res.error;
      const transaction = res.data;

      // O comprovante é enviado depois do lançamento existir, pois o path usa o id
      if (receiptFile && transaction) {
        const { error: uploadError } = await uploadReceipt({
          userId: transaction.user_id,
          transactionId: transaction.id,
          file: receiptFile,
        });
        if (uploadError) {
          throw new Error(`Lançamento salvo, mas o comprovante falhou: ${uploadError.message}`);
        }
      }
      showToast(
        txId ? 'Movimentação atualizada com sucesso!' : 'Movimentação registrada com sucesso!'
      );

      dialog.close();
      await loadData();
    } catch (err) {
      errorEl.textContent = err.message || 'Erro ao salvar movimentação.';
      errorEl.classList.remove('hidden');
    }
  });

  // 6.4 Ações da Tabela de Movimentações (Editar, Excluir, Comprovante)
  document.querySelector('[data-movements-tbody]')?.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('[data-edit-tx]');
    if (editBtn) {
      const txId = editBtn.dataset.editTx;
      const tx = allTransactions.find((t) => t.id === txId);
      if (tx) {
        form.elements.id.value = tx.id;
        form.elements.assetId.value = tx.asset_id;
        form.elements.type.value = tx.type;
        form.elements.quantity.value = tx.quantity;
        form.elements.price.value = tx.price;
        form.elements.transactionDate.value = tx.transaction_date;
        if (dialogTitle) dialogTitle.textContent = 'Editar Movimentação';
        dialog.showModal();
      }
      return;
    }

    const deleteBtn = e.target.closest('[data-delete-tx]');
    if (deleteBtn) {
      const txId = deleteBtn.dataset.deleteTx;
      if (confirm('Deseja realmente excluir esta movimentação?')) {
        const res = await deleteTransaction(txId);
        if (res.error) {
          showToast(`Erro ao excluir: ${res.error.message}`);
        } else {
          showToast('Movimentação excluída com sucesso!');
          await loadData();
        }
      }
      return;
    }

    const receiptBtn = e.target.closest('[data-view-receipt]');
    if (receiptBtn) {
      const path = receiptBtn.dataset.viewReceipt;
      const { url, error } = await receiptUrl(path);
      if (url) {
        window.open(url, '_blank');
      } else {
        showToast('Não foi possível abrir o comprovante.');
      }
    }
  });
}

// Inicialização
initEvents();
await loadData();
