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

/** Desenha os retangulos em SVG. Rotulo so quando cabe. */
export function renderTreemap(rects, { width, height, format = (v) => String(v) }) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'w-full h-auto');

  rects.forEach((r, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.label = r.label;
    g.innerHTML = `
      <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${PALETTE[i % PALETTE.length]}" stroke="#fff" stroke-width="2" rx="4"></rect>
      <title>${r.label}: ${format(r.value)}</title>
      ${r.w > 70 && r.h > 32 ? `<text x="${r.x + 8}" y="${r.y + 20}" fill="#fff" font-size="12" font-weight="600">${r.label}</text><text x="${r.x + 8}" y="${r.y + 36}" fill="#fff" font-size="11">${format(r.value)}</text>` : ''}`;
    svg.append(g);
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
