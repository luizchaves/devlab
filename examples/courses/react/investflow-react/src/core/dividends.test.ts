import { describe, expect, it } from 'vitest';
import { buildDividendsMatrix, cumulativeDividends, dividendsByMonth, dividendsSummary, isDividendEligible, receivedDividends, summarizeWithDividends, topPayers, totalReturn, type AssetWithDividends } from './dividends';
import { monthlyMovements, movementKpis, movements } from './movements';
import type { TransactionFact } from './portfolio';

const tx = (type: TransactionFact['type'], quantity: number, price: number, transactionDate: string): TransactionFact => ({ id: `${type}-${transactionDate}`, type, quantity, price, transactionDate, receiptPath: null });

const hglg: AssetWithDividends = {
  id: 'a1', ticker: 'HGLG11', name: 'CSHG Logística', category: 'fiis', currency: 'BRL', issuer: null, broker: null, currentPrice: 162.3,
  transactions: [tx('buy', 100, 150, '2026-01-10')],
  dividends: [
    { id: 'd1', rate: 1.5, exDate: '2026-01-05', paymentDate: '2026-01-15' },
    { id: 'd2', rate: 1.1, exDate: '2026-02-27', paymentDate: '2026-03-14' },
    { id: 'd3', rate: 1.1, exDate: '2026-03-31', paymentDate: '2026-04-15' },
  ],
};

describe('proventos', () => {
  it('CA09.2 — só ações, FII, ETF e FI-Infra têm proventos por cota', () => {
    expect(isDividendEligible('fiis')).toBe(true);
    expect(isDividendEligible('renda_fixa')).toBe(false);
    expect(isDividendEligible('cripto')).toBe(false);
  });

  it('CA09.5 — a posição comprada antes da data ex recebe; compra na data ex não; venda na data ex ainda recebe', () => {
    const items = receivedDividends(hglg);
    expect(items.map((d) => [d.exDate, d.quantity, d.total])).toEqual([
      ['2026-03-31', 100, 110],
      ['2026-02-27', 100, 110],
    ]);

    const boughtOnEx: AssetWithDividends = { ...hglg, transactions: [tx('buy', 100, 150, '2026-02-27')], dividends: [hglg.dividends[1]] };
    expect(receivedDividends(boughtOnEx)).toEqual([]);

    const soldOnEx: AssetWithDividends = { ...hglg, transactions: [tx('buy', 100, 150, '2026-01-10'), tx('sell', 100, 160, '2026-02-27')], dividends: [hglg.dividends[1]] };
    expect(receivedDividends(soldOnEx)[0].total).toBe(110);
  });

  it('CA09.8 — o retorno total soma valorização, realizado e proventos', () => {
    expect(totalReturn({ cost: 15000, value: 16230, realized: 0, dividends: 220 })).toEqual({ netGain: 1450, returnPct: 1450 / 15000 });
    expect(totalReturn({ cost: 15000, value: null, realized: 50, dividends: 220 })).toEqual({ netGain: 270, returnPct: null });
    expect(summarizeWithDividends(hglg)).toMatchObject({ dividendsBRL: 220, netGain: 1450 });
  });

  it('CA09.6, CA09.7 — KPIs, matriz e maiores pagadores somam o mesmo total do extrato', () => {
    const items = receivedDividends(hglg);
    const summary = dividendsSummary([hglg], items, new Date('2026-09-13T12:00:00Z'));
    expect(summary).toMatchObject({ total: 220, lastTwelveMonths: 220, monthlyAverage: 110, count: 2 });
    expect(summary.averageYieldOnCost).toBeCloseTo(220 / 15000, 9);

    const matrix = buildDividendsMatrix(items);
    expect(matrix.years).toEqual([2026]);
    expect(matrix.matrix[2026][2]).toBe(110); // março
    expect(matrix.matrix[2026][3]).toBe(110); // abril
    expect(matrix.grandTotal).toBe(220);
    expect(topPayers(items)).toEqual([{ assetId: 'a1', ticker: 'HGLG11', total: 220 }]);
  });

  it('CA09.10, CA09.11 — proventos por mês e acumulados até cada mês', () => {
    const items = receivedDividends(hglg);
    expect([...dividendsByMonth(items).entries()]).toEqual([['2026-04', 110], ['2026-03', 110]]);
    expect(cumulativeDividends(items, '2026-03')).toBe(110);
    expect(cumulativeDividends(items, '2026-06')).toBe(220);
    expect(cumulativeDividends(items, '2026-01')).toBe(0);
  });
});

describe('movimentações', () => {
  const cdb: AssetWithDividends = { ...hglg, id: 'a2', ticker: 'CDB', category: 'renda_fixa', dividends: [], transactions: [tx('buy', 1000, 1, '2026-05-05'), tx('update', 1010, 1, '2026-06-01'), tx('sell', 200, 1, '2026-07-01')] };

  it('CA09.12, CA09.14 — extrato com ativo e KPIs de fluxo; update não é movimentação', () => {
    const list = movements([hglg, cdb]);
    expect(list.map((m) => [m.ticker, m.type, m.total])).toEqual([
      ['CDB', 'sell', 200],
      ['CDB', 'buy', 1000],
      ['HGLG11', 'buy', 15000],
    ]);
    expect(movementKpis(list)).toEqual({ netInvested: 15800, totalBuys: 16000, totalSells: 200, count: 3 });
  });

  it('CA09.13 — o gráfico agrupa por mês na janela escolhida', () => {
    const list = movements([hglg, cdb]);
    expect(monthlyMovements(list, 'all')).toEqual([
      { month: '2026-01', buys: 15000, sells: 0 },
      { month: '2026-05', buys: 1000, sells: 0 },
      { month: '2026-07', buys: 0, sells: 200 },
    ]);
    expect(monthlyMovements(list, '1y', new Date('2027-03-01T00:00:00Z')).map((m) => m.month)).toEqual(['2026-05', '2026-07']);
  });
});
