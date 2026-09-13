import { describe, expect, it } from 'vitest';
import type { TransactionFact } from './portfolio';
import { allocationByCategory, compoundPct, matrixByYear, monthlyPct, monthlyReturns, withDividends, type AssetWithQuotes, type MonthlyReturn } from './returns';

const tx = (type: TransactionFact['type'], quantity: number, price: number, transactionDate: string): TransactionFact => ({
  id: `${type}-${transactionDate}`,
  type,
  quantity,
  price,
  transactionDate,
  receiptPath: null,
});

const petr: AssetWithQuotes = {
  id: 'a1', ticker: 'PETR4', name: 'Petrobras', category: 'acoes', currency: 'BRL', issuer: null, broker: null, currentPrice: 33,
  transactions: [tx('buy', 100, 30, '2026-01-10'), tx('buy', 100, 34, '2026-02-10')],
  quotes: [{ price: 31, quoteDate: '2026-01-31' }, { price: 33, quoteDate: '2026-02-28' }],
};

describe('monthlyReturns', () => {
  it('CA06.2 — reproduz a planilha de referência: 100 a 30 em janeiro, 100 a 34 em fevereiro', () => {
    const rows = monthlyReturns([petr]);
    expect(rows.map((r) => [r.month, r.value, r.netFlow, r.returnBrl])).toEqual([
      ['2026-01-01', 3100, 3000, 100],
      ['2026-02-01', 6600, 3400, 100],
    ]);
  });

  it('CA06.1 — março, sem cotação, não aparece na série', () => {
    expect(monthlyReturns([petr]).some((r) => r.month.startsWith('2026-03'))).toBe(false);
  });

  it('ativo por saldo entra pelo custo e um update não conta como aporte', () => {
    const cdb: AssetWithQuotes = { ...petr, id: 'a2', ticker: 'CDB', category: 'renda_fixa', currentPrice: null, quotes: [],
      transactions: [tx('buy', 1, 1000, '2026-01-05'), tx('update', 1010, 1, '2026-02-05')] };
    const rows = monthlyReturns([cdb]);
    expect(rows).toEqual([
      { month: '2026-01-01', value: 1000, netFlow: 1000, returnBrl: 0 },
      { month: '2026-02-01', value: 1010, netFlow: 0, returnBrl: 10 },
    ]);
  });

  it('CA10.8 — ativo em dólar usa a taxa do mês', () => {
    const aapl: AssetWithQuotes = { ...petr, currency: 'USD', transactions: [tx('buy', 10, 100, '2026-01-10')], quotes: [{ price: 110, quoteDate: '2026-01-31' }] };
    const [row] = monthlyReturns([aapl], { rateOf: () => 5 });
    expect(row).toEqual({ month: '2026-01-01', value: 5500, netFlow: 5000, returnBrl: 500 });
  });
});

describe('allocationByCategory', () => {
  it('soma posição × cotação por categoria, do maior para o menor, com a fatia', () => {
    const cdb: AssetWithQuotes = { ...petr, id: 'a2', ticker: 'CDB', category: 'renda_fixa', currentPrice: null, quotes: [], transactions: [tx('buy', 1, 3400, '2026-01-05')] };
    expect(allocationByCategory([petr, cdb])).toEqual([
      { category: 'acoes', value: 6600, share: 0.66 },
      { category: 'renda_fixa', value: 3400, share: 0.34 },
    ]);
  });
});

describe('matriz', () => {
  const row = (month: string, value: number, returnBrl: number): MonthlyReturn => ({ month, value, netFlow: 0, returnBrl });

  it('o percentual do mês é o ganho sobre a base, e o acumulado compõe em vez de somar', () => {
    expect(monthlyPct(row('2026-01-01', 110, 10))).toBeCloseTo(0.1, 9);
    expect(compoundPct([row('2026-01-01', 110, 10), row('2026-02-01', 99, -11)])).toBeCloseTo(-0.01, 9);
    expect(compoundPct([])).toBeNull();
  });

  it('CA06.1 — agrupa por ano com traço (null) nos meses sem dado, e o global acumula ano a ano', () => {
    const years = matrixByYear([row('2025-12-01', 100, 0), row('2026-01-01', 110, 10), row('2026-03-01', 121, 11)]);
    expect(years.map((y) => y.year)).toEqual(['2026', '2025']);
    const y2026 = years[0];
    expect(y2026.cells[0]?.returnBrl).toBe(10);
    expect(y2026.cells[1]).toBeNull();
    expect(y2026.cells[2]?.returnBrl).toBe(11);
    expect(y2026.yearlyBrl).toBe(21);
    expect(y2026.yearlyPct).toBeCloseTo(0.21, 9);
    expect(y2026.globalBrl).toBe(21);
  });

  it('CA09.10 — proventos do mês entram no valor e no retorno', () => {
    const [adjusted] = withDividends([row('2026-01-01', 110, 10)], new Map([['2026-01', 5]]));
    expect(adjusted).toMatchObject({ value: 115, returnBrl: 15, dividendBrl: 5 });
  });
});
