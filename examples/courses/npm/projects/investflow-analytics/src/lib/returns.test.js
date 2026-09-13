import { describe, expect, it } from 'vitest';
import { matrixByYear, monthlyPct, yearlyPct } from './returns.js';

// Planilha de referencia: jan valor 3100 (aporte 3000, retorno 100),
// fev valor 6600 (aporte 3400, retorno 100).
const jan = { month: '2026-01-01', value: '3100', net_flow: '3000', return_brl: '100' };
const fev = { month: '2026-02-01', value: '6600', net_flow: '3400', return_brl: '100' };

// #region unit
describe('monthlyPct (TK06-2)', () => {
  it('divide o retorno pela base (valor anterior + aportes)', () => {
    expect(monthlyPct(jan)).toBeCloseTo(100 / 3000);
    expect(monthlyPct(fev)).toBeCloseTo(100 / 6500);
  });
});

describe('yearlyPct (TK06-2)', () => {
  it('compoe os meses em vez de somar', () => {
    expect(yearlyPct([jan, fev])).toBeCloseTo((1 + 100 / 3000) * (1 + 100 / 6500) - 1, 4);
  });

  it('+10% seguido de -10% nao e 0%', () => {
    const up = { value: '110', return_brl: '10' };
    const down = { value: '99', return_brl: '-11' };
    expect(yearlyPct([up, down])).toBeCloseTo(-0.01);
  });

  it('devolve null sem meses e ignora mes sem base', () => {
    expect(yearlyPct([])).toBeNull();
    expect(yearlyPct([{ value: '0', return_brl: '0' }])).toBeNull();
  });
});

describe('matrixByYear (TK06-3)', () => {
  it('coloca cada mes na posicao certa e deixa o resto nulo', () => {
    const [row] = matrixByYear([jan, fev]);

    expect(row.year).toBe('2026');
    expect(row.cells[0]).toBe(jan);
    expect(row.cells[1]).toBe(fev);
    expect(row.cells.slice(2).every((c) => c === null)).toBe(true);
    expect(row.yearlyPct).toBeCloseTo(0.0492, 3);
  });

  it('ordena os anos do mais recente para o mais antigo', () => {
    const years = matrixByYear([{ ...jan, month: '2025-06-01' }, fev]).map((y) => y.year);
    expect(years).toEqual(['2026', '2025']);
  });
});
// #endregion
