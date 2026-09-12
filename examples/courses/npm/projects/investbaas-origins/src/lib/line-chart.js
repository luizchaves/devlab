// #region scale
/**
 * Duas series no mesmo eixo de tempo: aportado acumulado e valor de mercado.
 * Um ponto com value null vira lacuna na linha (o caminho e interrompido), e
 * nao zero. Funcao pura ate o SVG final: os testes conferem os pontos.
 */
export function scalePoints(series, { width, height, padding = 32 }) {
  const months = [...new Set(series.flatMap((s) => s.points.map((p) => p.month)))].sort();
  const values = series.flatMap((s) => s.points.map((p) => p.value)).filter((v) => v != null);
  const max = Math.max(...values, 0) || 1;
  const xOf = (month) =>
    padding + (months.indexOf(month) / Math.max(months.length - 1, 1)) * (width - 2 * padding);
  const yOf = (value) => height - padding - (value / max) * (height - 2 * padding);

  return {
    months,
    max,
    series: series.map((s) => ({
      ...s,
      points: months.map((month) => {
        const p = s.points.find((q) => q.month === month);
        return {
          month,
          value: p?.value ?? null,
          x: xOf(month),
          y: p?.value == null ? null : yOf(p.value),
        };
      }),
    })),
  };
}

/** "M x y L x y ... " com M novo depois de cada lacuna. */
export function pathOf(points) {
  let d = '';
  let pen = false;
  for (const p of points) {
    if (p.y == null) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    pen = true;
  }
  return d.trim();
}
// #endregion

// #region render
export function renderLineChart(
  series,
  { width = 720, height = 260, format = (v) => String(v) } = {}
) {
  const scaled = scalePoints(series, { width, height });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'w-full h-auto');

  const labels = scaled.months
    .map(
      (m, i) =>
        `<text x="${scaled.series[0].points[i].x.toFixed(1)}" y="${height - 8}" font-size="10" text-anchor="middle" fill="currentColor">${m.slice(0, 7)}</text>`
    )
    .join('');
  const paths = scaled.series
    .map(
      (s) =>
        `<path data-series="${s.name}" d="${pathOf(s.points)}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round"></path>`
    )
    .join('');
  const dots = scaled.series
    .map((s) =>
      s.points
        .filter((p) => p.y != null)
        .map(
          (p) =>
            `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="${s.color}"><title>${s.name} ${p.month.slice(0, 7)}: ${format(p.value)}</title></circle>`
        )
        .join('')
    )
    .join('');
  const legend = scaled.series
    .map(
      (s, i) =>
        `<g transform="translate(${32 + i * 180}, 14)"><rect width="12" height="12" rx="2" fill="${s.color}"></rect><text x="18" y="10" font-size="11" fill="currentColor">${s.name}</text></g>`
    )
    .join('');

  svg.innerHTML = `${legend}${paths}${dots}${labels}<text x="${width - 32}" y="24" font-size="10" text-anchor="end" fill="currentColor">máx. ${format(scaled.max)}</text>`;
  return svg;
}
// #endregion
