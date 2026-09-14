import { describe, expect, it } from 'vitest';
import { investmentDuration, projectedBalance, summarize, totals, type AssetWithTransactions, type TransactionFact } from './portfolio';

const tx = (
  type: TransactionFact['type'],
  quantity: number,
  price: number,
  transactionDate: string
): TransactionFact => ({ id: `${type}-${transactionDate}`, type, quantity, price, transactionDate, yieldRate: null, yieldIndex: 'fixed', receiptPath: null });

const asset = (overrides: Partial<AssetWithTransactions> = {}): AssetWithTransactions => ({
  id: 'a1',
  ticker: 'PETR4',
  name: 'Petrobras',
  category: 'acoes',
  currency: 'BRL',
  issuer: null,
  broker: null,
  currentPrice: 40,
  transactions: [],
  dividends: [],
  ...overrides,
});

describe('summarize', () => {
  it('CA03.3 — quantidade, custo e valor atual saem das transações e da cotação', () => {
    const s = summarize(asset({ transactions: [tx('buy', 100, 30, '2026-01-10'), tx('buy', 100, 34, '2026-02-10')] }));

    expect(s.quantity).toBe(200);
    expect(s.cost).toBe(6400);
    expect(s.averagePrice).toBe(32);
    expect(s.value).toBe(8000);
    expect(s.unrealized).toBe(1600);
    expect(s.returnPct).toBeCloseTo(0.25, 6);
  });

  it('CA08.4 — a venda baixa o custo pelo preço médio e a diferença vira realizado', () => {
    const s = summarize(
      asset({ transactions: [tx('buy', 100, 30, '2026-01-10'), tx('buy', 100, 34, '2026-02-10'), tx('sell', 50, 40, '2026-03-10')] })
    );

    expect(s.quantity).toBe(150);
    expect(s.cost).toBe(4800); // 6400 - 50 × 32
    expect(s.realized).toBe(400); // 50 × (40 - 32)
    expect(s.averagePrice).toBe(32);
  });

  it('CA08.7 — um lançamento update redefine posição e custo e zera o realizado', () => {
    const s = summarize(
      asset({
        category: 'renda_fixa',
        currentPrice: null,
        transactions: [tx('buy', 1000, 1, '2026-01-10'), tx('sell', 200, 1.1, '2026-02-10'), tx('update', 900, 1, '2026-03-10')],
      })
    );

    expect(s.quantity).toBe(900);
    expect(s.cost).toBe(900);
    expect(s.realized).toBe(0);
  });

  it('CA08.8 — ativo por saldo vale o próprio saldo, sem cotação', () => {
    const s = summarize(asset({ category: 'fundos', currentPrice: null, transactions: [tx('buy', 1, 2500, '2026-01-10')] }));

    expect(s.value).toBe(2500);
    expect(s.returnPct).toBe(0);
  });

  it('sem cotação, valor e retorno ficam nulos em vez de zero', () => {
    const s = summarize(asset({ currentPrice: null, transactions: [tx('buy', 10, 10, '2026-01-10')] }));

    expect(s.value).toBeNull();
    expect(s.unrealized).toBeNull();
    expect(s.returnPct).toBeNull();
  });

  it('CA10.4 — ativo em dólar é convertido pela taxa informada', () => {
    const s = summarize(asset({ currency: 'USD', currentPrice: 10, transactions: [tx('buy', 10, 8, '2026-01-10')] }), { usdRate: 5 });

    expect(s.cost).toBe(80);
    expect(s.costBRL).toBe(400);
    expect(s.valueBRL).toBe(500);
  });
});

describe('totals', () => {
  it('soma custo, valor e realizado da carteira e conta posições ativas', () => {
    const t = totals([
      asset({ transactions: [tx('buy', 100, 30, '2026-01-10')] }),
      asset({ id: 'a2', ticker: 'X', currentPrice: null, transactions: [tx('buy', 10, 10, '2026-01-10')] }),
      asset({ id: 'a3', ticker: 'Y', transactions: [tx('buy', 10, 10, '2026-01-10'), tx('sell', 10, 12, '2026-02-10')] }),
      asset({ id: 'a4', ticker: 'Z' }),
    ]);

    expect(t.cost).toBe(3100);
    expect(t.value).toBe(4100); // 4000 + 100 (sem cotação entra pelo custo) + 0 (zerada)
    expect(t.realized).toBe(20);
    // CA08.13: um ativo sem lançamento conta como ativo; o zerado não.
    expect(t.activeAssets).toBe(3);
  });
});

describe('investmentDuration', () => {
  it('CA08.16 — posição aberta conta até hoje; encerrada, até a última venda', () => {
    const today = new Date('2026-09-13T12:00:00');
    const open = investmentDuration([tx('buy', 10, 10, '2025-06-10')], today);
    const closed = investmentDuration([tx('buy', 10, 10, '2025-06-10'), tx('sell', 10, 12, '2025-09-20')], today);

    expect(open).toMatchObject({ text: '1 ano e 3 meses', isClosed: false, subtitle: 'Início em 10/06/2025' });
    expect(closed).toMatchObject({ text: '3 meses', isClosed: true, subtitle: 'Encerrado em 20/09/2025' });
  });

  it('sem lançamentos devolve traço', () => {
    expect(investmentDuration([])).toMatchObject({ text: '—', days: 0 });
  });
});

describe('projectedBalance', () => {
  it('CA14.3 — capitaliza o saldo pelo rendimento contratado desde o último lançamento', () => {
    const today = new Date('2027-01-10T12:00:00');
    const withRate = [{ ...tx('buy', 1000, 1, '2026-01-10'), yieldRate: 12 }];
    const projected = projectedBalance(withRate, today)!;

    expect(projected.yieldRate).toBe(12);
    expect(projected.since).toBe('2026-01-10');
    expect(projected.balance).toBeCloseTo(1120, 0); // um ano a 12% a.a.
  });

  it('CA14.4 — pós-fixado capitaliza pela taxa efetiva derivada da referência', () => {
    const today = new Date('2027-01-10T12:00:00');
    const reference = { cdi: 10, selic: 12, ipca: 4 };
    const cdi = projectedBalance([{ ...tx('buy', 1000, 1, '2026-01-10'), yieldRate: 110, yieldIndex: 'cdi' }], today, reference)!;
    const ipca = projectedBalance([{ ...tx('buy', 1000, 1, '2026-01-10'), yieldRate: 6, yieldIndex: 'ipca' }], today, reference)!;

    expect(cdi).toMatchObject({ yieldIndex: 'cdi', yieldRate: 110 });
    expect(cdi.effectiveRate).toBeCloseTo(11);
    expect(cdi.balance).toBeCloseTo(1110, 0);
    expect(ipca.effectiveRate).toBeCloseTo(10.24);
    expect(ipca.balance).toBeCloseTo(1102.4, 0);
  });

  it('sem rendimento informado, ou sem saldo, não estima', () => {
    expect(projectedBalance([tx('buy', 1000, 1, '2026-01-10')])).toBeNull();
    expect(projectedBalance([])).toBeNull();
  });

  it('um saldo atualizado recomeça a capitalização da data do saldo, com a última taxa conhecida', () => {
    const today = new Date('2026-07-01T12:00:00');
    const projected = projectedBalance([{ ...tx('buy', 1000, 1, '2026-01-01'), yieldRate: 10 }, tx('update', 1050, 1, '2026-06-01')], today)!;
    expect(projected.since).toBe('2026-06-01');
    expect(projected.balance).toBeGreaterThan(1050);
    expect(projected.balance).toBeLessThan(1060);
  });
});
