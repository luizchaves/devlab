// #region layout
/**
 * Treemap "squarified" (Bruls, Huizing, van Wijk) como funcao pura: recebe
 * [{ label, value }] e a area, devolve [{ label, value, x, y, w, h }]. Sem DOM,
 * sem biblioteca. A soma das areas e width * height, e cada retangulo fica
 * dentro dos limites: e o que os testes afirmam.
 */
export function layout(items, width, height) {
  const total = items.reduce((acc, i) => acc + i.value, 0);
  const sorted = [...items].filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  if (total <= 0 || sorted.length === 0) return [];

  const scale = (width * height) / total;
  const rects = [];
  let x = 0;
  let y = 0;
  let w = width;
  let h = height;
  let row = [];

  const worst = (areas, side) => {
    const sum = areas.reduce((a, b) => a + b, 0);
    const max = Math.max(...areas);
    const min = Math.min(...areas);
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  };

  const place = (rowItems) => {
    const sum = rowItems.reduce((a, i) => a + i.value * scale, 0);
    const vertical = w >= h; // linha ocupa o lado menor
    const side = vertical ? h : w;
    const thickness = sum / side;
    let offset = 0;

    for (const item of rowItems) {
      const len = (item.value * scale) / thickness;
      rects.push(
        vertical
          ? { ...item, x, y: y + offset, w: thickness, h: len }
          : { ...item, x: x + offset, y, w: len, h: thickness }
      );
      offset += len;
    }

    if (vertical) {
      x += thickness;
      w -= thickness;
    } else {
      y += thickness;
      h -= thickness;
    }
  };

  for (const item of sorted) {
    const side = Math.min(w, h);
    const areas = row.map((i) => i.value * scale);
    const next = [...areas, item.value * scale];

    if (row.length === 0 || worst(next, side) <= worst(areas, side)) {
      row.push(item);
    } else {
      place(row);
      row = [item];
    }
  }
  if (row.length) place(row);

  return rects;
}
// #endregion

// #region render
const PALETTE = [
  '#059669',
  '#2563eb',
  '#7c3aed',
  '#d97706',
  '#e11d48',
  '#0891b2',
  '#65a30d',
  '#9333ea',
];

/** Corta o texto para caber em `maxWidth` (fonte ~0.55em por caractere), com reticencias. */
export function fitText(text, maxWidth, fontSize) {
  const perChar = fontSize * 0.55;
  const maxChars = Math.floor(maxWidth / perChar);
  if (maxChars < 2) return '';
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(1, maxChars - 1))}…`;
}

/**
 * Desenha os retangulos em SVG. Todo bloco com altura para uma linha recebe o
 * rotulo (cortado quando preciso); o valor so entra quando ha uma segunda linha.
 */
export function renderTreemap(rects, { width, height, format = (v) => String(v) }) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'w-full h-auto');

  const total = rects.reduce((a, r) => a + r.value, 0);

  // Bloco baixo: uma linha com o rotulo; bloco alto: rotulo e, se couber, o valor.
  const tileText = (r, textValue) => {
    const innerWidth = r.w - 12;
    if (r.h < 18 || innerWidth < 14) return '';
    const twoLines = r.h >= 34;
    const labelSize = twoLines ? 12 : 10;
    const label = fitText(r.label, innerWidth, labelSize);
    if (!label) return '';
    const labelY = twoLines ? r.y + 20 : r.y + r.h / 2 + labelSize / 3;
    let out = `<text x="${r.x + 6}" y="${labelY}" fill="#fff" font-size="${labelSize}" font-weight="600" pointer-events="none">${label}</text>`;
    if (twoLines) {
      const value = fitText(textValue, innerWidth, 11);
      if (value) {
        out += `<text x="${r.x + 6}" y="${r.y + 36}" fill="#fff" font-size="11" pointer-events="none">${value}</text>`;
      }
    }
    return out;
  };

  rects.forEach((r, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.label = r.label;
    const pct = total > 0 ? (r.value / total) * 100 : 0;
    const pctStr = `${pct.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`;
    const textValue = `${format(r.value)} (${pctStr})`;

    const color = PALETTE[i % PALETTE.length];
    g.innerHTML = `
      <rect data-tile x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${color}" stroke="#fff" stroke-width="2" rx="4" class="cursor-pointer transition-opacity" data-label="${r.label}" data-value="${r.value}" data-pct="${pctStr}" data-color="${color}"></rect>
      ${tileText(r, textValue)}`;
    svg.append(g);
  });

  // Tooltip no mesmo estilo dos outros graficos: caixa escura com bullet na cor do bloco
  const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  tooltip.setAttribute('data-tooltip', '');
  tooltip.setAttribute('class', 'pointer-events-none');
  tooltip.setAttribute('opacity', '0');
  tooltip.setAttribute('style', 'transition: opacity 0.15s ease;');
  tooltip.innerHTML = `
    <g data-tooltip-box transform="translate(0, 0)">
      <rect data-tooltip-bg width="180" height="52" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.3));"></rect>
      <circle data-tooltip-bullet cx="14" cy="18" r="4" fill="#059669"></circle>
      <text data-tooltip-title x="24" y="22" fill="#cbd5e1" font-size="11" font-weight="600"></text>
      <text data-tooltip-value x="14" y="41" fill="#ffffff" font-size="13" font-weight="700"></text>
    </g>`;
  svg.append(tooltip);

  const tooltipBox = tooltip.querySelector('[data-tooltip-box]');
  const tooltipBg = tooltip.querySelector('[data-tooltip-bg]');
  const tooltipBullet = tooltip.querySelector('[data-tooltip-bullet]');
  const tooltipTitle = tooltip.querySelector('[data-tooltip-title]');
  const tooltipValue = tooltip.querySelector('[data-tooltip-value]');
  let activeTile = null;

  // Converte a posicao do ponteiro (pixels da tela) para o sistema do viewBox
  const toSvgPoint = (event) => {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const ctm = svg.getScreenCTM();
    return ctm ? point.matrixTransform(ctm.inverse()) : point;
  };

  const placeTooltip = (event) => {
    const { x, y } = toSvgPoint(event);
    const boxWidth = Number(tooltipBg.getAttribute('width'));
    const boxHeight = 52;
    let boxX = x + 12;
    if (boxX + boxWidth > width - 4) boxX = x - boxWidth - 12;
    let boxY = y - boxHeight - 12;
    if (boxY < 4) boxY = y + 16;
    tooltipBox.setAttribute('transform', `translate(${boxX.toFixed(1)}, ${boxY.toFixed(1)})`);
  };

  svg.addEventListener('pointerover', (event) => {
    const tile = event.target.closest('[data-tile]');
    if (!tile) return;
    activeTile?.removeAttribute('opacity');
    activeTile = tile;
    tile.setAttribute('opacity', '0.8');

    tooltipBullet.setAttribute('fill', tile.dataset.color);
    tooltipTitle.textContent = tile.dataset.label;
    tooltipValue.textContent = `${format(Number(tile.dataset.value))} · ${tile.dataset.pct}`;
    // Largura da caixa acompanha o texto mais longo (fonte ~7px por caractere)
    const longest = Math.max(tooltipTitle.textContent.length + 2, tooltipValue.textContent.length);
    tooltipBg.setAttribute('width', String(Math.max(150, Math.ceil(longest * 7.2 + 24))));
    placeTooltip(event);
    tooltip.setAttribute('opacity', '1');
  });

  svg.addEventListener('pointermove', (event) => {
    if (activeTile && event.target.closest('[data-tile]')) placeTooltip(event);
  });

  svg.addEventListener('pointerout', (event) => {
    const tile = event.target.closest('[data-tile]');
    if (tile && !event.relatedTarget?.closest?.('[data-tile]')) {
      tooltip.setAttribute('opacity', '0');
      activeTile?.removeAttribute('opacity');
      activeTile = null;
    }
  });

  return svg;
}
// #endregion

// #region group
/** Agrupa as linhas de allocation_by_origin por uma dimensao. */
export function groupBy(rows, dimension) {
  const map = new Map();
  for (const row of rows)
    map.set(row[dimension], (map.get(row[dimension]) ?? 0) + Number(row.value));
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}
// #endregion
