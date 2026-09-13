// #region scale
/**
 * Escala pontos de uma série em barras SVG com espaçamento seguro contra overflow.
 * @param {Array<{ label: string, value: number, month?: string }>} data
 * @param {{ width: number, height: number, padding: number, paddingLeft: number, paddingRight: number, paddingTop: number, paddingBottom: number }} options
 */
export function scaleBars(
  data,
  {
    width = 840,
    height = 260,
    padding = null,
    paddingLeft = padding ?? 56,
    paddingRight = padding ?? 24,
    paddingTop = padding ?? 20,
    paddingBottom = padding ?? 38,
  } = {}
) {
  const max = Math.max(...data.map((d) => d.value || 0), 0) || 1;
  const innerWidth = Math.max(10, width - paddingLeft - paddingRight);
  const innerHeight = Math.max(10, height - paddingTop - paddingBottom);
  const count = Math.max(data.length, 1);
  const step = innerWidth / count;
  const barWidth = Math.max(6, Math.min(step * 0.7, 42));

  const bars = data.map((d, i) => {
    const barHeight = d.value > 0 ? (d.value / max) * innerHeight : 0;
    const x = paddingLeft + i * step + (step - barWidth) / 2;
    const y = height - paddingBottom - barHeight;
    return {
      label: d.label,
      month: d.month ?? d.label,
      value: d.value,
      x,
      y,
      width: barWidth,
      height: barHeight,
      slotX: paddingLeft + i * step,
      slotWidth: step,
    };
  });

  return {
    max,
    bars,
    width,
    height,
    padding: padding ?? 32,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    innerWidth,
    innerHeight,
  };
}
// #endregion

// #region render
/**
 * Renderiza gráfico de barras interativo em SVG com tooltip box no hover e controle inteligente de legendas.
 * @param {Array<{ label: string, value: number, month?: string }>} data
 * @param {{ width: number, height: number, color: string, format: (v: number) => string, seriesLabel: string }} options
 */
export function renderBarChart(
  data,
  {
    width = 840,
    height = 260,
    color = '#a855f7',
    format = (v) => String(v),
    seriesLabel = 'Proventos',
  } = {}
) {
  if (!data?.length) {
    const empty = document.createElement('div');
    empty.className = 'py-12 text-center text-sm text-slate-500';
    empty.textContent = 'Sem registros no período.';
    return empty;
  }

  // A margem esquerda acomoda o rótulo mais largo do eixo Y (fonte de 10px, ~6px por
  // caractere), para que nada vaze para fora da área do gráfico e desalinhe com o título.
  const rawMax = Math.max(...data.map((d) => d.value || 0), 0) || 1;
  const widestLabel = Math.max(...[0, 0.5, 1].map((frac) => format(frac * rawMax).length));
  const paddingLeft = Math.ceil(widestLabel * 6 + 12);

  const { max, bars, paddingRight, paddingTop, paddingBottom, innerHeight } = scaleBars(data, {
    width,
    height,
    paddingLeft,
  });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'w-full h-auto select-none overflow-visible');

  // Linhas de grade horizontais e eixo Y
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('class', 'text-slate-200 dark:text-slate-800');
  for (const frac of [0, 0.5, 1]) {
    const y = height - paddingBottom - frac * innerHeight;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(paddingLeft));
    line.setAttribute('x2', String(width - paddingRight));
    line.setAttribute('y1', String(y));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', frac === 0 ? 'none' : '3 3');
    gridGroup.appendChild(line);

    // Label do eixo Y
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(paddingLeft - 8));
    label.setAttribute('y', String(y + 3));
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('font-size', '9');
    label.setAttribute('fill', 'currentColor');
    label.setAttribute('class', 'text-slate-300 dark:text-slate-600');
    label.textContent = format(frac * max);
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);

  // Grupos para barras, slots interativos e legendas
  const barsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const hoverGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Cálculo inteligente de espaçamento para legendas do eixo X (evita poluição e overflow)
  const totalBars = bars.length;
  const maxLabels = Math.max(2, Math.floor((width - paddingLeft - paddingRight) / 52));
  const step = totalBars > maxLabels ? Math.ceil(totalBars / maxLabels) : 1;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];

    // Barra visual
    if (bar.height > 0) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('data-bar-index', String(i));
      rect.setAttribute('x', String(bar.x));
      rect.setAttribute('y', String(bar.y));
      rect.setAttribute('width', String(bar.width));
      rect.setAttribute('height', String(bar.height));
      rect.setAttribute('rx', '4');
      rect.setAttribute('fill', color);
      rect.setAttribute('class', 'transition-all duration-150');
      barsGroup.appendChild(rect);
    }

    // Slot interativo de toque/hover (cobre toda a coluna para facilitar o hover)
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitArea.setAttribute('data-hit-index', String(i));
    hitArea.setAttribute('data-label', bar.label);
    hitArea.setAttribute('data-month', bar.month);
    hitArea.setAttribute('data-value', String(bar.value));
    hitArea.setAttribute('data-x', String(bar.x + bar.width / 2));
    hitArea.setAttribute('data-y', String(bar.height > 0 ? bar.y : height - paddingBottom));
    hitArea.setAttribute('x', String(bar.slotX));
    hitArea.setAttribute('y', String(paddingTop));
    hitArea.setAttribute('width', String(bar.slotWidth));
    hitArea.setAttribute('height', String(innerHeight));
    hitArea.setAttribute('fill', 'transparent');
    hitArea.setAttribute('class', 'cursor-pointer');
    hoverGroup.appendChild(hitArea);

    // Legenda no eixo X (apenas nos passos adequados ou extremos)
    const isFirst = i === 0;
    const isLast = i === totalBars - 1;
    const isStepped = i % step === 0;
    const isTooCloseToLast = isStepped && totalBars - 1 - i < Math.ceil(step / 2);

    if (isFirst || isLast || (isStepped && !isTooCloseToLast)) {
      const labelX = bar.x + bar.width / 2;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(labelX));
      text.setAttribute('y', String(height - paddingBottom + 16));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('class', 'text-slate-500 dark:text-slate-400 font-sans font-medium');
      text.textContent = bar.label;
      labelsGroup.appendChild(text);
    }
  }

  svg.appendChild(barsGroup);
  svg.appendChild(labelsGroup);
  svg.appendChild(hoverGroup);

  // Tooltip Box SVG no estilo dark card com drop shadow e bullet
  const tooltipGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  tooltipGroup.setAttribute('data-tooltip', '');
  tooltipGroup.setAttribute('class', 'pointer-events-none');
  tooltipGroup.setAttribute('opacity', '0');
  tooltipGroup.setAttribute('style', 'transition: opacity 0.15s ease;');
  tooltipGroup.innerHTML = `
    <line data-tooltip-line x1="0" y1="${paddingTop}" x2="0" y2="${height - paddingBottom}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 3"></line>
    <circle data-tooltip-dot cx="0" cy="0" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.5"></circle>
    <g data-tooltip-box transform="translate(0, 0)">
      <rect width="156" height="54" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.35));"></rect>
      <circle cx="14" cy="18" r="4" fill="${color}"></circle>
      <text data-tooltip-title x="24" y="22" fill="#cbd5e1" font-size="11" font-weight="600"></text>
      <text data-tooltip-value x="14" y="42" fill="#ffffff" font-size="13" font-weight="700" font-family="monospace"></text>
    </g>
  `;
  svg.appendChild(tooltipGroup);

  // Event listeners para o tooltip
  const tooltipLine = tooltipGroup.querySelector('[data-tooltip-line]');
  const tooltipDot = tooltipGroup.querySelector('[data-tooltip-dot]');
  const tooltipBox = tooltipGroup.querySelector('[data-tooltip-box]');
  const tooltipTitle = tooltipGroup.querySelector('[data-tooltip-title]');
  const tooltipValue = tooltipGroup.querySelector('[data-tooltip-value]');

  let activeBarRect = null;

  svg.addEventListener('pointerover', (e) => {
    const target = e.target.closest('[data-hit-index]');
    if (!target) return;

    const idx = target.dataset.hitIndex;
    const x = Number(target.dataset.x);
    const y = Number(target.dataset.y);
    const label = target.dataset.label;
    const val = Number(target.dataset.value);

    // Destacar barra ativa
    if (activeBarRect) {
      activeBarRect.removeAttribute('opacity');
    }
    activeBarRect = svg.querySelector(`[data-bar-index="${idx}"]`);
    if (activeBarRect) {
      activeBarRect.setAttribute('opacity', '0.85');
    }

    tooltipLine.setAttribute('x1', String(x));
    tooltipLine.setAttribute('x2', String(x));
    tooltipDot.setAttribute('cx', String(x));
    tooltipDot.setAttribute('cy', String(y));

    tooltipTitle.textContent = `${seriesLabel} · ${label}`;
    tooltipValue.textContent = format(val);

    const boxWidth = 156;
    const boxHeight = 54;
    let boxX = x + 10;
    if (boxX + boxWidth > width - paddingRight) {
      boxX = x - boxWidth - 10;
    }
    let boxY = y - boxHeight - 10;
    if (boxY < paddingTop) {
      boxY = y + 12;
    }

    tooltipBox.setAttribute('transform', `translate(${boxX}, ${boxY})`);
    tooltipGroup.setAttribute('opacity', '1');
  });

  svg.addEventListener('pointerout', (e) => {
    const target = e.target.closest('[data-hit-index]');
    if (target && !e.relatedTarget?.closest?.('[data-hit-index]')) {
      tooltipGroup.setAttribute('opacity', '0');
      if (activeBarRect) {
        activeBarRect.removeAttribute('opacity');
        activeBarRect = null;
      }
    }
  });

  return svg;
}
// #endregion

// #region flows
const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

/**
 * Barras agrupadas por mes de movimentacao: o fluxo do mes (aporte em verde,
 * resgate em vermelho) ao lado do aportado acumulado (azul). Mesma escala em
 * reais para as duas, com eixo Y e margem esquerda calculados como nos outros
 * graficos.
 * @param {Array<{ month: string, flow: number, cumulative: number }>} data
 * @param {{ width: number, height: number, format: (v: number) => string }} options
 */
export function renderFlowsChart(
  data,
  { width = 960, height = 260, format = (v) => String(v) } = {}
) {
  if (!data?.length) {
    const empty = document.createElement('div');
    empty.className = 'py-12 text-center text-sm text-slate-500';
    empty.textContent = 'Sem movimentacoes no periodo.';
    return empty;
  }

  const max = Math.max(...data.flatMap((d) => [Math.abs(d.flow), d.cumulative]), 0) || 1;
  const widestLabel = Math.max(...[0, 0.5, 1].map((frac) => format(frac * max).length));
  const paddingLeft = Math.ceil(widestLabel * 6 + 12);
  const paddingRight = 16;
  const paddingTop = 36;
  const paddingBottom = 38;
  const innerWidth = Math.max(10, width - paddingLeft - paddingRight);
  const innerHeight = Math.max(10, height - paddingTop - paddingBottom);
  const baseY = height - paddingBottom;
  const step = innerWidth / data.length;
  const barWidth = Math.max(4, Math.min(step * 0.36, 26));
  const gap = Math.min(4, barWidth * 0.25);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`,
    class: 'w-full h-auto select-none',
  });

  // Grade e eixo Y
  const grid = svgEl('g', { class: 'text-slate-200 dark:text-slate-800' });
  for (const frac of [0, 0.5, 1]) {
    const y = baseY - frac * innerHeight;
    grid.appendChild(
      svgEl('line', {
        x1: paddingLeft,
        x2: width - paddingRight,
        y1: y,
        y2: y,
        stroke: 'currentColor',
        'stroke-width': 1,
        'stroke-dasharray': frac === 0 ? 'none' : '3 3',
      })
    );
    const label = svgEl('text', {
      x: paddingLeft - 8,
      y: y + 3,
      'text-anchor': 'end',
      'font-size': 9,
      fill: 'currentColor',
      class: 'text-slate-300 dark:text-slate-600',
    });
    label.textContent = format(frac * max);
    grid.appendChild(label);
  }
  svg.appendChild(grid);

  // Legenda compacta, alinhada a esquerda da area do grafico
  const legend = svgEl('g', { transform: `translate(${paddingLeft}, 10)` });
  const legendItems = [
    ['#10b981', 'Aporte'],
    ['#f43f5e', 'Resgate'],
    ['#0ea5e9', 'Aportado acumulado'],
  ];
  let legendX = 0;
  for (const [color, name] of legendItems) {
    const g = svgEl('g', { transform: `translate(${legendX}, 0)` });
    g.appendChild(svgEl('rect', { width: 10, height: 10, rx: 2, fill: color }));
    const t = svgEl('text', {
      x: 16,
      y: 9,
      'font-size': 11,
      fill: 'currentColor',
      class: 'text-slate-600 dark:text-slate-300',
    });
    t.textContent = name;
    g.appendChild(t);
    legend.appendChild(g);
    legendX += 16 + name.length * 6.5 + 16;
  }
  svg.appendChild(legend);

  // Barras: fluxo do mes a esquerda, acumulado a direita, com tooltip nativo
  const bars = svgEl('g');
  const labels = svgEl('g');
  const maxLabels = Math.max(2, Math.floor(innerWidth / 52));
  const labelStep = data.length > maxLabels ? Math.ceil(data.length / maxLabels) : 1;

  data.forEach((d, i) => {
    const center = paddingLeft + i * step + step / 2;
    const monthKey = d.month.slice(0, 7);
    const monthLabel = `${monthKey.slice(5, 7)}/${monthKey.slice(2, 4)}`;

    const flowHeight = (Math.abs(d.flow) / max) * innerHeight;
    if (flowHeight > 0) {
      const isBuy = d.flow > 0;
      const color = isBuy ? '#10b981' : '#f43f5e';
      bars.appendChild(
        svgEl('rect', {
          x: center - gap / 2 - barWidth,
          y: baseY - flowHeight,
          width: barWidth,
          height: flowHeight,
          rx: 3,
          fill: color,
          class: 'cursor-pointer',
          'data-bar': '',
          'data-title': `${isBuy ? 'Aporte' : 'Resgate'} · ${monthLabel}`,
          'data-value': Math.abs(d.flow),
          'data-color': color,
          'data-x': center - gap / 2 - barWidth / 2,
          'data-y': baseY - flowHeight,
        })
      );
    }

    const isZeroCum = d.cumulative != null && Math.abs(d.cumulative) <= 0.000001;
    const cumHeight = (Math.max(d.cumulative, 0) / max) * innerHeight;
    const displayCumHeight = isZeroCum ? 2 : cumHeight;
    if (cumHeight > 0 || isZeroCum) {
      bars.appendChild(
        svgEl('rect', {
          x: center + gap / 2,
          y: baseY - displayCumHeight,
          width: barWidth,
          height: displayCumHeight,
          rx: isZeroCum ? 1 : 3,
          fill: isZeroCum ? '#94a3b8' : '#0ea5e9',
          'fill-opacity': isZeroCum ? 0.4 : 0.85,
          class: 'cursor-pointer',
          'data-bar': '',
          'data-title': `Aportado acumulado · ${monthLabel}`,
          'data-value': d.cumulative,
          'data-color': isZeroCum ? '#94a3b8' : '#0ea5e9',
          'data-x': center + gap / 2 + barWidth / 2,
          'data-y': baseY - displayCumHeight,
        })
      );
    }

    const isFirst = i === 0;
    const isLast = i === data.length - 1;
    const isStepped = i % labelStep === 0 && data.length - 1 - i >= Math.ceil(labelStep / 2);
    if (isFirst || isLast || isStepped) {
      const text = svgEl('text', {
        x: center,
        y: baseY + 16,
        'text-anchor': 'middle',
        'font-size': 10,
        fill: 'currentColor',
        class: 'text-slate-500 dark:text-slate-400 font-medium',
      });
      text.textContent = monthLabel;
      labels.appendChild(text);
    }
  });

  svg.appendChild(bars);
  svg.appendChild(labels);

  // Tooltip no mesmo estilo dos outros graficos: linha tracejada, ponto e caixa escura
  const tooltip = svgEl('g', {
    'data-tooltip': '',
    class: 'pointer-events-none',
    opacity: 0,
    style: 'transition: opacity 0.15s ease;',
  });
  tooltip.innerHTML = `
    <line data-tooltip-line x1="0" y1="${paddingTop}" x2="0" y2="${baseY}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3"></line>
    <circle data-tooltip-dot cx="0" cy="0" r="5" fill="#0ea5e9" stroke="#ffffff" stroke-width="2"></circle>
    <g data-tooltip-box transform="translate(0, 0)">
      <rect width="172" height="52" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.3));"></rect>
      <circle data-tooltip-bullet cx="14" cy="18" r="4" fill="#0ea5e9"></circle>
      <text data-tooltip-title x="24" y="22" fill="#cbd5e1" font-size="11" font-weight="600"></text>
      <text data-tooltip-value x="14" y="41" fill="#ffffff" font-size="13" font-weight="700"></text>
    </g>`;
  svg.appendChild(tooltip);

  const tooltipLine = tooltip.querySelector('[data-tooltip-line]');
  const tooltipDot = tooltip.querySelector('[data-tooltip-dot]');
  const tooltipBox = tooltip.querySelector('[data-tooltip-box]');
  const tooltipBullet = tooltip.querySelector('[data-tooltip-bullet]');
  const tooltipTitle = tooltip.querySelector('[data-tooltip-title]');
  const tooltipValue = tooltip.querySelector('[data-tooltip-value]');
  let activeBar = null;

  svg.addEventListener('pointerover', (e) => {
    const target = e.target.closest('[data-bar]');
    if (!target) return;
    const x = Number(target.dataset.x);
    const y = Number(target.dataset.y);
    const color = target.dataset.color;

    activeBar?.removeAttribute('opacity');
    activeBar = target;
    activeBar.setAttribute('opacity', '0.7');

    tooltipLine.setAttribute('x1', String(x));
    tooltipLine.setAttribute('x2', String(x));
    tooltipDot.setAttribute('cx', String(x));
    tooltipDot.setAttribute('cy', String(y));
    tooltipDot.setAttribute('fill', color);
    tooltipBullet.setAttribute('fill', color);
    tooltipTitle.textContent = target.dataset.title;
    tooltipValue.textContent = format(Number(target.dataset.value));

    const boxWidth = 172;
    const boxHeight = 52;
    let boxX = x + 10;
    if (boxX + boxWidth > width - paddingRight) boxX = x - boxWidth - 10;
    let boxY = y - boxHeight - 10;
    if (boxY < paddingTop) boxY = y + 12;
    tooltipBox.setAttribute('transform', `translate(${boxX}, ${boxY})`);
    tooltip.setAttribute('opacity', '1');
  });

  svg.addEventListener('pointerout', (e) => {
    const target = e.target.closest('[data-bar]');
    if (target && !e.relatedTarget?.closest?.('[data-bar]')) {
      tooltip.setAttribute('opacity', '0');
      activeBar?.removeAttribute('opacity');
      activeBar = null;
    }
  });

  return svg;
}
// #endregion
