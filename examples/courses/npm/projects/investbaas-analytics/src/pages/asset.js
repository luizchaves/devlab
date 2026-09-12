import './private.js';
import { validateReceipt } from '../lib/file-validation.js';
import { showError } from '../lib/form.js';
import {
  CATEGORY_BADGES,
  CATEGORY_LABELS,
  formatBRL,
  formatPct,
  summarize,
} from '../lib/portfolio.js';
import { getAsset } from '../services/assets.js';
import { receiptUrl, uploadReceipt } from '../services/receipts.js';
import { createTransaction } from '../services/transactions.js';

const id = new URLSearchParams(window.location.search).get('id');
const section = document.querySelector('[data-asset]');
const notFound = document.querySelector('[data-not-found]');
const dialog = document.querySelector('[data-transaction-dialog]');
const form = document.querySelector('[data-transaction-form]');

const field = (name) => document.querySelector(`[data-field="${name}"]`);
const kpi = (name) => document.querySelector(`[data-kpi="${name}"]`);

// #region render
function renderTransactions(asset) {
  const rows = [...asset.transactions].sort((a, b) =>
    a.transaction_date.localeCompare(b.transaction_date)
  );
  let position = 0;

  const trs = rows.map((t) => {
    const qty = Number(t.quantity);
    const price = Number(t.price);
    position += t.type === 'buy' ? qty : -qty;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-6 py-3">${new Date(`${t.transaction_date}T12:00:00`).toLocaleDateString('pt-BR')}</td>
      <td class="px-6 py-3"><span class="${t.type === 'buy' ? 'badge-renda-fixa' : 'badge-cripto'}">${t.type === 'buy' ? 'Compra' : 'Venda'}</span></td>
      <td class="px-6 py-3">${qty.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
      <td class="px-6 py-3">${formatBRL(price)}</td>
      <td class="px-6 py-3 font-semibold">${formatBRL(qty * price)}</td>
      <td class="px-6 py-3">${position.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</td>
      <td class="px-6 py-3">${t.receipt_path ? `<button type="button" data-receipt="${t.receipt_path}" class="text-emerald-600 hover:underline">Ver comprovante</button>` : '—'}</td>`;
    return tr;
  });

  document.querySelector('[data-transactions]').replaceChildren(...trs);
  document.querySelector('[data-empty]').hidden = rows.length > 0;
  document.querySelector('[data-transactions-count]').textContent = `${rows.length} lançamento(s)`;
}

async function render() {
  const { data: asset } = await getAsset(id);

  // null cobre "nao existe" e "nao e seu": o RLS nao deixa distinguir os dois.
  if (!asset) {
    notFound.hidden = false;
    section.hidden = true;
    return;
  }

  const s = summarize(asset);
  field('name').textContent = asset.name;
  field('ticker').textContent = asset.ticker;
  field('category-badge').innerHTML =
    `<span class="${CATEGORY_BADGES[asset.category]}">${CATEGORY_LABELS[asset.category]}</span>`;
  field('broker').textContent = asset.broker?.name ?? '—';
  field('issuer').textContent = asset.issuer ?? '—';

  kpi('quantity').textContent = s.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 8 });
  kpi('averagePrice').textContent = formatBRL(s.averagePrice);
  kpi('cost').textContent = formatBRL(s.cost);
  kpi('value').textContent = formatBRL(s.value);
  kpi('returnPct').textContent = formatPct(s.returnPct);
  kpi('realized').textContent = `Realizado: ${formatBRL(s.realized)}`;

  renderTransactions(asset);
  section.hidden = false;
  notFound.hidden = true;
}
// #endregion

// #region create
document.querySelector('[data-new-transaction]').addEventListener('click', () => {
  form.reset();
  form.elements.transactionDate.value = new Date().toISOString().slice(0, 10);
  showError(form, '');
  dialog.showModal();
});

form.querySelector('[data-close]').addEventListener('click', () => dialog.close());

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // A validacao do cliente responde antes de subir 5 MB pela rede.
  const file = form.elements.receipt.files[0];
  const invalid = file ? validateReceipt(file) : null;
  if (invalid) return showError(form, invalid);

  const { data: transaction, error } = await createTransaction({
    assetId: id,
    type: form.elements.type.value,
    quantity: form.elements.quantity.value,
    price: form.elements.price.value,
    transactionDate: form.elements.transactionDate.value,
  });

  // 23514: violacao de CHECK (quantidade zero, preco negativo).
  if (error?.code === '23514') return showError(form, 'Quantidade e preco precisam ser positivos');
  if (error) return showError(form, error.message);

  if (file) {
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

// #region receipt
// A URL nao e escrita no HTML: nasce no clique e expira em 60 segundos.
document.querySelector('[data-transactions]').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-receipt]');
  if (!button) return;

  const { url, error } = await receiptUrl(button.dataset.receipt);
  const toast = document.querySelector('[data-toast]');
  toast.hidden = !error;
  if (error) {
    toast.textContent = 'Comprovante indisponivel';
    return;
  }

  window.open(url, '_blank', 'noopener');
});
// #endregion

await render();
