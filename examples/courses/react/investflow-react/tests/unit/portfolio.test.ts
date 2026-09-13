import { describe, expect, it } from 'vitest';
import {
  calculateCategoryAllocation,
  calculatePortfolioTotal,
  calculatePositionValue,
} from '../../src/core/portfolio';

describe('portfolio core', () => {
  it('calculates a position value', () => {
    expect(calculatePositionValue({ quantity: 10, price: 12.5 })).toBe(125);
  });

  it('calculates total and category allocation', () => {
    const assets = [
      { id: '1', symbol: 'A', name: 'A', category: 'Ações', quantity: 10, price: 10, currency: 'BRL' },
      { id: '2', symbol: 'B', name: 'B', category: 'Renda fixa', quantity: 2, price: 50, currency: 'BRL' },
    ];

    expect(calculatePortfolioTotal(assets)).toBe(200);
    expect(calculateCategoryAllocation(assets)).toEqual({ Ações: 50, 'Renda fixa': 50 });
  });
});
