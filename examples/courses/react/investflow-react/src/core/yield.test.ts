import { describe, expect, it } from 'vitest';
import { effectiveAnnualRate, formatYield } from './yield';

describe('effectiveAnnualRate', () => {
  it('CA14.4 — prefixado rende a própria taxa', () => {
    expect(effectiveAnnualRate('fixed', 12)).toBe(12);
  });

  it('CA14.4 — percentual do CDI aplica a fração sobre o CDI de referência', () => {
    expect(effectiveAnnualRate('cdi', 100, { cdi: 14, selic: 15, ipca: 4 })).toBe(14);
    expect(effectiveAnnualRate('cdi', 110, { cdi: 10, selic: 15, ipca: 4 })).toBeCloseTo(11);
  });

  it('CA14.4 — percentual da SELIC aplica a fração sobre a SELIC de referência', () => {
    expect(effectiveAnnualRate('selic', 100, { cdi: 14, selic: 15, ipca: 4 })).toBe(15);
  });

  it('CA14.4 — IPCA + compõe a inflação com os juros reais', () => {
    expect(effectiveAnnualRate('ipca', 6, { cdi: 14, selic: 15, ipca: 4 })).toBeCloseTo(10.24);
  });
});

describe('formatYield', () => {
  it('mostra cada indexador do jeito que o mercado escreve', () => {
    expect(formatYield('fixed', 12)).toBe('12% a.a.');
    expect(formatYield('cdi', 100)).toBe('100% do CDI');
    expect(formatYield('selic', 100)).toBe('100% da SELIC');
    expect(formatYield('ipca', 6.5)).toBe('IPCA + 6,5% a.a.');
  });
});
