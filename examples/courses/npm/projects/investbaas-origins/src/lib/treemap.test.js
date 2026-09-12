import { describe, expect, it } from 'vitest';
import { groupBy, layout } from './treemap.js';

const items = [
  { label: 'XP', value: 6000 },
  { label: 'Inter', value: 3000 },
  { label: 'Avenue', value: 1000 },
];

// #region layout
describe('layout (TK07-2)', () => {
  it('a soma das areas e a area total', () => {
    const rects = layout(items, 400, 300);
    const area = rects.reduce((a, r) => a + r.w * r.h, 0);

    expect(area).toBeCloseTo(400 * 300, 3);
  });

  it('cada retangulo e proporcional ao valor e fica dentro dos limites', () => {
    const rects = layout(items, 400, 300);

    for (const r of rects) {
      const item = items.find((i) => i.label === r.label);
      expect((r.w * r.h) / (400 * 300)).toBeCloseTo(item.value / 10000, 3);
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.x + r.w).toBeLessThanOrEqual(400 + 1e-6);
      expect(r.y + r.h).toBeLessThanOrEqual(300 + 1e-6);
    }
  });

  it('ordena do maior para o menor e ignora valor zero', () => {
    const rects = layout([...items, { label: 'Vazio', value: 0 }], 400, 300);

    expect(rects.map((r) => r.label)).toEqual(['XP', 'Inter', 'Avenue']);
  });

  it('devolve vazio sem valor', () => {
    expect(layout([], 100, 100)).toEqual([]);
    expect(layout([{ label: 'a', value: 0 }], 100, 100)).toEqual([]);
  });
});
// #endregion

// #region group
describe('groupBy (TK07-3)', () => {
  it('soma o valor por dimensao', () => {
    const rows = [
      { broker: 'XP', issuer: 'BB', value: '100' },
      { broker: 'XP', issuer: 'Petrobras', value: '50' },
      { broker: 'Inter', issuer: 'BB', value: '25' },
    ];

    expect(groupBy(rows, 'broker')).toEqual([
      { label: 'XP', value: 150 },
      { label: 'Inter', value: 25 },
    ]);
    expect(groupBy(rows, 'issuer')).toEqual([
      { label: 'BB', value: 125 },
      { label: 'Petrobras', value: 50 },
    ]);
  });
});
// #endregion
