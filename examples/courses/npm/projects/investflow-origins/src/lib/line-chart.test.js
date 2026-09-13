import { describe, expect, it } from 'vitest';
import { pathOf, scalePoints } from './line-chart.js';

const invested = {
  name: 'Aportado',
  color: '#000',
  points: [
    { month: '2026-01-01', value: 3000 },
    { month: '2026-02-01', value: 6400 },
    { month: '2026-03-01', value: 6400 },
  ],
};
const value = {
  name: 'Valor',
  color: '#0f0',
  points: [
    { month: '2026-01-01', value: 3100 },
    { month: '2026-02-01', value: 6600 },
  ],
};

// #region unit
describe('scalePoints (TK07-5)', () => {
  it('alinha as duas series no mesmo eixo de tempo', () => {
    const scaled = scalePoints([invested, value], { width: 300, height: 100 });

    expect(scaled.months).toEqual(['2026-01-01', '2026-02-01', '2026-03-01']);
    expect(scaled.series[0].points[0].x).toBe(scaled.series[1].points[0].x);
  });

  it('mes sem valor vira lacuna (y nulo), nao zero', () => {
    const scaled = scalePoints([invested, value], { width: 300, height: 100 });
    const march = scaled.series[1].points[2];

    expect(march.value).toBeNull();
    expect(march.y).toBeNull();
  });

  it('o maior valor encosta no topo util', () => {
    const scaled = scalePoints([invested, value], { width: 300, height: 100, padding: 10 });
    const top = scaled.series[1].points[1];

    expect(scaled.max).toBe(6600);
    expect(top.y).toBeCloseTo(10);
  });
});

describe('pathOf', () => {
  it('recomeca com M depois de uma lacuna', () => {
    const d = pathOf([
      { x: 0, y: 10 },
      { x: 10, y: null },
      { x: 20, y: 5 },
    ]);

    expect(d).toBe('M0.0 10.0 M20.0 5.0');
  });
});
// #endregion
