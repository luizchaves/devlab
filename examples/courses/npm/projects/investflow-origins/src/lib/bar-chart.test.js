import { describe, expect, it } from 'vitest';
import { renderBarChart, scaleBars } from './bar-chart.js';

describe('scaleBars', () => {
  it('CA09.13: escala os valores proporcionalmente ao maximo', () => {
    const data = [
      { label: 'Jan', value: 100 },
      { label: 'Fev', value: 200 },
    ];
    const { max, bars } = scaleBars(data, { width: 400, height: 200, padding: 20 });
    expect(max).toBe(200);
    expect(bars).toHaveLength(2);
    expect(bars[0].height).toBeCloseTo(80); // 100/200 * 160
    expect(bars[1].height).toBeCloseTo(160); // 200/200 * 160
  });

  it('lida com lista vazia sem explodir', () => {
    const { max, bars } = scaleBars([], { width: 400, height: 200 });
    expect(max).toBe(1);
    expect(bars).toEqual([]);
  });
});

describe('renderBarChart', () => {
  it('retorna mensagem quando vazio', () => {
    const el = renderBarChart([]);
    expect(el.textContent).toContain('Sem registros no período');
  });

  it('renderiza svg com elementos de barra e tooltip box', () => {
    const data = [
      { label: 'Jan', value: 50 },
      { label: 'Fev', value: 150 },
    ];
    const svg = renderBarChart(data);
    expect(svg.tagName).toBe('svg');
    expect(svg.querySelectorAll('[data-bar-index]')).toHaveLength(2);
    expect(svg.querySelector('[data-tooltip]')).not.toBeNull();
    expect(svg.querySelectorAll('text').length).toBeGreaterThanOrEqual(2);
  });
});
