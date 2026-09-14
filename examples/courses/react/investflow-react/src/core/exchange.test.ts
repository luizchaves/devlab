import { describe, expect, it } from 'vitest';
import { exchangeTable, FALLBACK_USD_RATE } from './exchange';
import type { TransactionFact } from './portfolio';
import { summarizeInBRL } from './portfolio';
import { monthlyReturns, type AssetWithQuotes } from './returns';

const rows = [
  { rateDate: '2026-01-15', rate: 5 },
  { rateDate: '2026-02-10', rate: 5.5 },
  { rateDate: '2026-02-20', rate: 5.2 },
];

describe('tabela de câmbio', () => {
  it('CA10.3 — a taxa do dia ou a última anterior; sem anterior, a primeira', () => {
    const table = exchangeTable(rows);
    expect(table.rateAt('2026-02-10')).toBe(5.5);
    expect(table.rateAt('2026-02-15')).toBe(5.5);
    expect(table.rateAt('2026-03-01')).toBe(5.2);
    expect(table.rateAt('2025-12-01')).toBe(5);
    expect(table.rateOf('2026-01')).toBe(5);
    expect(table.rateOf('2026-02')).toBe(5.2);
    expect(table.latest).toBe(5.2);
  });

  it('CA10.5 — sem nenhuma taxa gravada, devolve a referência fixa sem quebrar', () => {
    const table = exchangeTable([]);
    expect(table.latest).toBe(FALLBACK_USD_RATE);
    expect(table.rateAt('2026-01-01')).toBe(FALLBACK_USD_RATE);
    expect(table.latestDate).toBeNull();
  });
});

const tx = (type: TransactionFact['type'], quantity: number, price: number, transactionDate: string): TransactionFact => ({ id: `${type}-${transactionDate}`, type, quantity, price, transactionDate, yieldRate: null, yieldIndex: 'fixed', receiptPath: null });

describe('ativo em dólar', () => {
  const aapl: AssetWithQuotes = {
    id: 'a1', ticker: 'AAPL', name: 'Apple', category: 'acoes', currency: 'USD', issuer: null, broker: null, currentPrice: 110, dividends: [],
    transactions: [tx('buy', 10, 100, '2026-01-20'), tx('buy', 10, 100, '2026-02-25')],
    quotes: [{ price: 105, quoteDate: '2026-01-31' }, { price: 110, quoteDate: '2026-02-28' }],
  };
  const table = exchangeTable(rows);

  it('CA10.6 — o custo em reais usa o câmbio do mês de cada compra, não o de hoje', () => {
    const s = summarizeInBRL(aapl, { rateOf: table.rateOf, latestRate: table.latest });
    expect(s.cost).toBe(1000 * 5 + 1000 * 5.2); // 10.200
    expect(s.value).toBe(20 * 110 * 5.2); // 11.440
  });

  it('CA10.7, CA10.10 — o fluxo do mês é convertido pelo câmbio do mês, e o câmbio não vira aporte', () => {
    const series = monthlyReturns([aapl], { rateOf: table.rateOf });
    expect(series).toEqual([
      { month: '2026-01-01', value: 10 * 105 * 5, netFlow: 1000 * 5, returnBrl: 250 },
      { month: '2026-02-01', value: 20 * 110 * 5.2, netFlow: 1000 * 5.2, returnBrl: 11440 - 5250 - 5200 },
    ]);
  });
});
