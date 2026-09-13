import './private.js';
import { formatBRL } from '../lib/portfolio.js';
import { getQueryParam, setQueryParams } from '../lib/query-params.js';
import { groupBy, layout, renderTreemap } from '../lib/treemap.js';
import { allocationByOrigin } from '../services/origins.js';

const LABELS = { broker: 'Corretora', category: 'Categoria', issuer: 'Emissor / gestor' };
const CATEGORY = {
  renda_fixa: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'FIIs',
  etfs: 'ETF',
  fi_infra: 'FI-Infra',
  fundos: 'Fundos',
  cripto: 'Cripto',
};

let currentDimension = getQueryParam('dimension', 'broker');
if (!['broker', 'category', 'issuer'].includes(currentDimension)) {
  currentDimension = 'broker';
}

const { data: rows } = await allocationByOrigin();
const container = document.querySelector('[data-treemap]');
const legend = document.querySelector('[data-legend]');
const empty = document.querySelector('[data-empty]');

function syncUrlParams() {
  setQueryParams({ dimension: currentDimension }, { dimension: 'broker' });
}

function updateDimensionButtons() {
  const buttons = document.querySelectorAll('button[data-dimension]');
  for (const btn of buttons) {
    const isActive = btn.dataset.dimension === currentDimension;
    btn.className = isActive
      ? 'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold transition'
      : 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
  }
}

// #region draw
function draw() {
  const dimension = currentDimension;
  const items = groupBy(rows ?? [], dimension).map((i) => ({
    ...i,
    label: dimension === 'category' ? (CATEGORY[i.label] ?? i.label) : i.label || 'Outros',
  }));
  const total = items.reduce((a, i) => a + i.value, 0);
  const rects = layout(items, 720, 400);

  container.replaceChildren(
    rects.length ? renderTreemap(rects, { width: 720, height: 400, format: formatBRL }) : ''
  );
  empty.hidden = rects.length > 0;
  container.dataset.dimension = dimension;
  legend.replaceChildren(
    ...rects.map((r) => {
      const li = document.createElement('li');
      li.dataset.label = r.label;
      const pct = total > 0 ? (r.value / total) * 100 : 0;
      li.textContent = `${r.label}: ${formatBRL(r.value)} (${pct.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%)`;
      return li;
    })
  );
  document.title = `InvestFlow - Origem por ${LABELS[dimension]}`;
  updateDimensionButtons();
}

document.querySelector('[data-dimension-group]')?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-dimension]');
  if (!btn) return;
  currentDimension = btn.dataset.dimension;
  syncUrlParams();
  draw();
});

draw();
// #endregion
