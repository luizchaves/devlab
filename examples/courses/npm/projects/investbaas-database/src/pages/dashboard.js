import './private.js';
import { showError } from '../lib/form.js';
import {
  CATEGORY_BADGES,
  CATEGORY_LABELS,
  formatBRL,
  formatPct,
  summarize,
  totals,
} from '../lib/portfolio.js';
import { createAsset, listAssets } from '../services/assets.js';
import { listBrokers } from '../services/brokers.js';

const tbody = document.querySelector('[data-assets]');
const empty = document.querySelector('[data-empty]');
const dialog = document.querySelector('[data-asset-dialog]');
const form = document.querySelector('[data-asset-form]');

// #region render
function renderRow(asset) {
  const s = summarize(asset);
  const tr = document.createElement('tr');
  tr.className = 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30';
  tr.dataset.ticker = asset.ticker;
  tr.innerHTML = `
    <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">
      <a href="./asset.html?id=${asset.id}" class="hover:text-emerald-600">${asset.name}</a>
      <div class="text-xs font-normal text-slate-500">${asset.ticker}${asset.issuer ? ` · ${asset.issuer}` : ''}</div>
    </td>
    <td class="px-6 py-4"><span class="${CATEGORY_BADGES[asset.category]}">${CATEGORY_LABELS[asset.category]}</span></td>
    <td class="px-6 py-4">${asset.broker?.name ?? '—'}</td>
    <td class="px-6 py-4">${s.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
    <td class="px-6 py-4">${formatBRL(s.averagePrice)}</td>
    <td class="px-6 py-4">${formatBRL(asset.current_price == null ? null : Number(asset.current_price))}</td>
    <td class="px-6 py-4 font-semibold">${formatBRL(s.value)}</td>
    <td class="px-6 py-4 font-semibold ${s.returnPct == null ? 'text-slate-400' : s.returnPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}">${formatPct(s.returnPct)}</td>`;
  return tr;
}

export async function renderPortfolio() {
  const { data: assets, error } = await listAssets();
  if (error) return;

  tbody.replaceChildren(...assets.map(renderRow));
  empty.hidden = assets.length > 0;
  document.querySelector('[data-assets-count]').textContent = `${assets.length} ativo(s)`;

  const t = totals(assets);
  const kpi = (name, text) => {
    document.querySelector(`[data-kpi="${name}"]`).textContent = text;
  };
  kpi('value', formatBRL(t.value));
  kpi('cost', formatBRL(t.cost));
  kpi('unrealized', formatBRL(t.value - t.cost));
  kpi('returnPct', formatPct(t.cost ? (t.value - t.cost) / t.cost : null));
  kpi('realized', formatBRL(t.realized));
}
// #endregion

// #region create
async function fillBrokers() {
  const { data } = await listBrokers();
  document
    .querySelector('[data-brokers]')
    .replaceChildren(
      ...(data ?? []).map((b) => Object.assign(document.createElement('option'), { value: b.name }))
    );
}

document.querySelector('[data-new-asset]').addEventListener('click', async () => {
  form.reset();
  showError(form, '');
  await fillBrokers();
  dialog.showModal();
});

form.querySelector('[data-close]').addEventListener('click', () => dialog.close());

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { error } = await createAsset({
    ticker: form.elements.ticker.value,
    name: form.elements.name.value,
    category: form.elements.category.value,
    issuer: form.elements.issuer.value,
    brokerName: form.elements.brokerName.value,
  });

  // 23505 e a violacao do unique (user_id, ticker).
  if (error?.code === '23505') return showError(form, 'Voce ja tem esse ticker');
  if (error) return showError(form, error.message);

  dialog.close();
  await renderPortfolio();
});
// #endregion

await renderPortfolio();
