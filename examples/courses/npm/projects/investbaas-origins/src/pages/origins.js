import './private.js';
import { formatBRL } from '../lib/portfolio.js';
import { groupBy, layout, renderTreemap } from '../lib/treemap.js';
import { allocationByOrigin } from '../services/origins.js';

const LABELS = { broker: 'Corretora', category: 'Categoria', issuer: 'Emissor / gestor' };
const CATEGORY = {
  renda_fixa: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'FIIs',
  fundos: 'Fundos',
  cripto: 'Cripto',
};

const { data: rows } = await allocationByOrigin();
const select = document.querySelector('[data-dimension]');
const container = document.querySelector('[data-treemap]');
const legend = document.querySelector('[data-legend]');
const empty = document.querySelector('[data-empty]');

// #region draw
function draw() {
  const dimension = select.value;
  const items = groupBy(rows ?? [], dimension).map((i) => ({
    ...i,
    label: dimension === 'category' ? (CATEGORY[i.label] ?? i.label) : i.label,
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
      li.textContent = `${r.label}: ${formatBRL(r.value)} (${((r.value / total) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%)`;
      return li;
    })
  );
  document.title = `InvestBaaS - Origem por ${LABELS[dimension]}`;
}

select.addEventListener('change', draw);
draw();
// #endregion
