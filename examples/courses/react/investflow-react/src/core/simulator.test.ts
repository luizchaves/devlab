import { describe, expect, it } from 'vitest';
import { DEFAULT_SIMULATION, simulate } from './simulator';

describe('simulate', () => {
  it('CA01.2 — sem taxa, o total é só o que foi aportado', () => {
    const result = simulate({ initial: 1000, monthly: 100, annualRate: 0, years: 1 });

    expect(result.total).toBeCloseTo(2200, 6);
    expect(result.invested).toBe(2200);
    expect(result.interest).toBe(0);
    expect(result.multiplier).toBeCloseTo(1, 6);
  });

  it('capitaliza pela taxa mensal equivalente à anual', () => {
    // 12 meses a 12% a.a. sem aportes: o valor inicial cresce exatamente 12%.
    const result = simulate({ initial: 1000, monthly: 0, annualRate: 12, years: 1 });

    expect(result.total).toBeCloseTo(1120, 6);
    expect(result.interest).toBeCloseTo(120, 6);
  });

  it('limita o prazo entre 1 e 50 anos e ignora valores negativos', () => {
    const short = simulate({ initial: -5, monthly: -1, annualRate: -3, years: 0 });
    const long = simulate({ initial: 1, monthly: 0, annualRate: 0, years: 99 });

    expect(short.invested).toBe(0);
    expect(short.multiplier).toBe(0);
    expect(long.invested).toBe(1);
  });

  it('as fatias de investido e juros somam 100%', () => {
    const result = simulate(DEFAULT_SIMULATION);

    expect(result.investedShare + result.interestShare).toBeCloseTo(100, 6);
    expect(result.total).toBeGreaterThan(result.invested);
  });
});
