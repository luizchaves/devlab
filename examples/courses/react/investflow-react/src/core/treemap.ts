// #region layout
export type TreemapItem = { label: string; value: number };
export type TreemapRect = TreemapItem & { x: number; y: number; w: number; h: number };

/**
 * Treemap "squarified" (Bruls, Huizing, van Wijk) como função pura: recebe
 * `[{ label, value }]` e a área, devolve retângulos. Sem DOM, sem biblioteca.
 * A soma das áreas é `width × height` e cada retângulo fica dentro dos limites (CA07.1).
 */
export function layout(items: TreemapItem[], width: number, height: number): TreemapRect[] {
  const sorted = items.filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  const total = sorted.reduce((acc, i) => acc + i.value, 0);
  if (total <= 0) return [];

  const scale = (width * height) / total;
  const rects: TreemapRect[] = [];
  let x = 0;
  let y = 0;
  let w = width;
  let h = height;
  let row: TreemapItem[] = [];

  const worst = (areas: number[], side: number) => {
    const sum = areas.reduce((a, b) => a + b, 0);
    return Math.max((side * side * Math.max(...areas)) / (sum * sum), (sum * sum) / (side * side * Math.min(...areas)));
  };

  const place = (rowItems: TreemapItem[]) => {
    const sum = rowItems.reduce((a, i) => a + i.value * scale, 0);
    const vertical = w >= h; // a fileira ocupa o lado menor
    const side = vertical ? h : w;
    const thickness = sum / side;
    let offset = 0;
    for (const item of rowItems) {
      const len = (item.value * scale) / thickness;
      rects.push(vertical ? { ...item, x, y: y + offset, w: thickness, h: len } : { ...item, x: x + offset, y, w: len, h: thickness });
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
    if (row.length === 0 || worst(next, side) <= worst(areas, side)) row.push(item);
    else {
      place(row);
      row = [item];
    }
  }
  if (row.length) place(row);
  return rects;
}
// #endregion

// #region text
/** Corta o texto para caber em `maxWidth` (fonte ~0,55 em por caractere), com reticências. */
export function fitText(text: string, maxWidth: number, fontSize: number): string {
  const maxChars = Math.floor(maxWidth / (fontSize * 0.55));
  if (maxChars < 2) return '';
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(1, maxChars - 1))}…`;
}
// #endregion
