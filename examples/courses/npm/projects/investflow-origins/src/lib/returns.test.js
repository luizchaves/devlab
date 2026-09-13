import { describe, expect, it } from 'vitest';
import {
  matrixByYear,
  monthlyPct,
  monthlyReturnsFromEvolution,
  withDividends,
  yearlyPct,
} from './returns.js';

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

  it('nao cria linha para ano cujos meses nao tem base', () => {
    const years = matrixByYear([
      { month: '2021-03-01', value: '0', return_brl: '0' },
      { month: '2022-01-01', value: '1100', return_brl: '100' },
    ]);

    expect(years.map((y) => y.year)).toEqual(['2022']);
  });

  it('ordena os anos do mais recente para o mais antigo e calcula acumulado global', () => {
    const rows = [
      { ...jan, month: '2025-06-01', value: '1100', net_flow: '1000', return_brl: '100' },
      { ...fev, month: '2026-02-01', value: '2420', net_flow: '1000', return_brl: '220' },
    ];
    const [y2026, y2025] = matrixByYear(rows);
    expect(y2026.year).toBe('2026');
    expect(y2025.year).toBe('2025');
    expect(y2025.yearlyPct).toBeCloseTo(0.1, 2);
    expect(y2025.globalPct).toBeCloseTo(0.1, 2);
    expect(y2026.yearlyPct).toBeCloseTo(220 / 2200, 2); // 10%
    expect(y2026.globalPct).toBeCloseTo((1 + 0.1) * (1 + 0.1) - 1, 2); // 21%
    expect(y2026.globalBrl).toBe(320);
  });
});
// #endregion

// #region evolution
describe('monthlyReturnsFromEvolution', () => {
  it('desconta o fluxo do mes da variacao do valor', () => {
    const rows = monthlyReturnsFromEvolution([
      { month: '2026-02-01', invested: '11000', value: '11500' },
      { month: '2026-01-01', invested: '10000', value: '10000' },
    ]);

    expect(rows.map((r) => r.month)).toEqual(['2026-01-01', '2026-02-01']);
    expect(rows[0]).toMatchObject({ net_flow: 10000, return_brl: 0 });
    expect(rows[1]).toMatchObject({ net_flow: 1000, return_brl: 500 });
  });

  it('usa o fluxo informado em vez da diferenca do acumulado', () => {
    // Ativo em USD: o acumulado muda com o cambio, mas nao houve aporte em fevereiro
    const rows = monthlyReturnsFromEvolution(
      [
        { month: '2026-01-01', invested: '10000', value: '10000' },
        { month: '2026-02-01', invested: '11000', value: '11500' },
      ],
      { flowsByMonth: new Map([['2026-01', 10000]]) }
    );

    expect(rows[1]).toMatchObject({ net_flow: 0, return_brl: 1500 });
  });
});

describe('withDividends', () => {
  it('soma o provento do mes ao valor e ao retorno', () => {
    const [row] = withDividends(
      [{ month: '2026-01-01', value: 1000, net_flow: 0, return_brl: 50 }],
      new Map([['2026-01', 20]])
    );

    expect(row).toMatchObject({ value: 1020, return_brl: 70, dividend_brl: 20 });
  });
});
// #endregion
