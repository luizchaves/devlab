// #region scale
/**
 * Duas ou três séries no mesmo eixo de tempo: aportado acumulado, valor de mercado e proventos.
 * Um ponto com value null vira lacuna na linha (o caminho é interrompido), e não zero.
 * Função pura até o SVG final: os testes conferem os pontos.
 */
export function scalePoints(
  series,
  {
    width = 720,
    height = 260,
    padding = null,
    paddingLeft = padding ?? 56,
    paddingRight = padding ?? 24,
    paddingTop = padding ?? 36,
    paddingBottom = padding ?? 32,
  } = {}
) {
  const months = [...new Set(series.flatMap((s) => s.points.map((p) => p.month)))].sort();
  const values = series.flatMap((s) => s.points.map((p) => p.value)).filter((v) => v != null);
  const max = Math.max(...values, 0) || 1;
  const innerWidth = Math.max(10, width - paddingLeft - paddingRight);
  const innerHeight = Math.max(10, height - paddingTop - paddingBottom);

  const xOf = (month) =>
    paddingLeft + (months.indexOf(month) / Math.max(months.length - 1, 1)) * innerWidth;
  const yOf = (value) => height - paddingBottom - (value / max) * innerHeight;

  return {
    months,
    max,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    innerWidth,
    innerHeight,
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
  const values = series.flatMap((s) => s.points.map((p) => p.value)).filter((v) => v != null);
  const rawMax = Math.max(...values, 0) || 1;
  const widestLabel = Math.max(...[0, 0.5, 1].map((frac) => format(frac * rawMax).length));
  const paddingLeft = Math.ceil(widestLabel * 6 + 14);

  const scaled = scalePoints(series, {
    width,
    height,
    paddingLeft,
    paddingRight: 24,
    paddingTop: 36,
    paddingBottom: 32,
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'w-full h-auto select-none');

  // Linhas de grade horizontais e eixo Y
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('class', 'text-slate-200 dark:text-slate-800');
  for (const frac of [0, 0.5, 1]) {
    const y = height - scaled.paddingBottom - frac * scaled.innerHeight;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(scaled.paddingLeft));
    line.setAttribute('x2', String(width - scaled.paddingRight));
    line.setAttribute('y1', String(y));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', frac === 0 ? 'none' : '3 3');
    gridGroup.appendChild(line);

    // Label do eixo Y
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(scaled.paddingLeft - 8));
    label.setAttribute('y', String(y + 3));
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('font-size', '9');
    label.setAttribute('fill', 'currentColor');
    label.setAttribute('class', 'text-slate-400 dark:text-slate-500 font-sans');
    label.textContent = format(frac * scaled.max);
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);

  // Legenda discreta alinhada no topo
  const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  legendGroup.setAttribute('transform', `translate(${scaled.paddingLeft}, 12)`);
  let legendX = 0;
  for (const s of scaled.series) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${legendX}, 0)`);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '10');
    rect.setAttribute('height', '10');
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', s.color);
    g.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '16');
    text.setAttribute('y', '9');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', 'currentColor');
    text.setAttribute('class', 'text-slate-600 dark:text-slate-300 font-medium');
    text.textContent = s.name;
    g.appendChild(text);

    legendGroup.appendChild(g);
    legendX += 16 + s.name.length * 6.5 + 16;
  }
  svg.appendChild(legendGroup);

  // Linhas das séries
  const pathsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (const s of scaled.series) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('data-series', s.name);
    path.setAttribute('d', pathOf(s.points));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', s.color);
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    pathsGroup.appendChild(path);
  }
  svg.appendChild(pathsGroup);

  // Pontos com títulos interativos no hover
  const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (const s of scaled.series) {
    for (const p of s.points) {
      if (p.y != null) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(p.x.toFixed(1)));
        circle.setAttribute('cy', String(p.y.toFixed(1)));
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', s.color);
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('class', 'dark:stroke-slate-900');
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        const monthKey = p.month.slice(0, 7);
        const monthDisplay =
          monthKey.includes('-') && monthKey.length >= 7
            ? `${monthKey.slice(5, 7)}/${monthKey.slice(0, 4)}`
            : p.month;
        title.textContent = `${s.name} (${monthDisplay}): ${format(p.value)}`;
        circle.appendChild(title);
        dotsGroup.appendChild(circle);
      }
    }
  }
  svg.appendChild(dotsGroup);

  // Labels do eixo X com cálculo inteligente de espaçamento (evita colisão de textos)
  const totalPoints = scaled.months.length;
  const maxLabels = Math.max(2, Math.floor(scaled.innerWidth / 52));
  const step = totalPoints > maxLabels ? Math.ceil(totalPoints / maxLabels) : 1;

  const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  scaled.months.forEach((m, i) => {
    const isFirst = i === 0;
    const isLast = i === totalPoints - 1;
    const isStepped = i % step === 0 && totalPoints - 1 - i >= Math.ceil(step / 2);
    if (!isFirst && !isLast && !isStepped) return;

    const x = scaled.series[0].points[i].x;
    const monthKey = m.slice(0, 7);
    const monthLabel =
      monthKey.includes('-') && monthKey.length >= 7
        ? `${monthKey.slice(5, 7)}/${monthKey.slice(2, 4)}`
        : monthKey;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x.toFixed(1)));
    text.setAttribute('y', String(height - 8));
    text.setAttribute('font-size', '10');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'currentColor');
    text.setAttribute('class', 'text-slate-500 dark:text-slate-400 font-medium');
    text.textContent = monthLabel;
    labelsGroup.appendChild(text);
  });
  svg.appendChild(labelsGroup);

  return svg;
}
// #endregion
