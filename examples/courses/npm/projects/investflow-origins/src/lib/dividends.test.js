import { describe, expect, it } from 'vitest';
import {
  buildDividendsMatrix,
  calculateDividends,
  dividendYieldOnCost,
  isDividendEligibleCategory,
  totalReturn,
} from './dividends.js';

describe('calculateDividends', () => {
  it('retorna lista vazia se nao houver transacoes ou historico', () => {
    expect(calculateDividends([], [])).toEqual({
      items: [],
      totalReceived: 0,
      count: 0,
      yieldOnCost: null,
    });
  });

  it('calcula proventos recebidos com base na posicao na data de corte (Data Ex)', () => {
    const transactions = [
      { type: 'buy', quantity: '100', transaction_date: '2025-01-10' },
      { type: 'buy', quantity: '50', transaction_date: '2025-03-01' },
      { type: 'sell', quantity: '30', transaction_date: '2025-05-01' },
    ];

    const dividends = [
      { id: '1', ex_date: '2025-01-05', payment_date: '2025-01-15', rate: '0.50' }, // antes do primeiro aporte -> ignorado
      { id: '2', ex_date: '2025-02-01', payment_date: '2025-02-15', rate: '0.50' }, // 100 cotas -> 50.00
      { id: '3', ex_date: '2025-04-01', payment_date: '2025-04-15', rate: '0.60' }, // 150 cotas -> 90.00
      { id: '4', ex_date: '2025-06-01', payment_date: '2025-06-15', rate: '0.40' }, // 120 cotas -> 48.00
    ];

    const res = calculateDividends(transactions, dividends);

    expect(res.count).toBe(3);
    expect(res.totalReceived).toBeCloseTo(50 + 90 + 48); // 188.00
    expect(res.items[0]).toEqual({
      id: '4',
      exDate: '2025-06-01',
      paymentDate: '2025-06-15',
      rate: 0.4,
      quantity: 120,
      total: 48,
      totalBRL: 48,
      totalUSD: null,
      usdRate: null,
      isUsd: false,
    });
  });

  it('garante que compras na Data Ex nao dao direito e vendas na Data Ex mantem direito', () => {
    // Ex-Date: 2025-04-01
    // Caso 1: Compra antes de Ex (Data Com 2025-03-31) e Venda na Data Ex (2025-04-01) -> Tem direito
    const txHolding = [
      { type: 'buy', quantity: '100', transaction_date: '2025-03-31' },
      { type: 'sell', quantity: '100', transaction_date: '2025-04-01' },
    ];
    const div = [{ id: 'd1', ex_date: '2025-04-01', payment_date: '2025-04-15', rate: '1.00' }];
    const resHolding = calculateDividends(txHolding, div);
    expect(resHolding.count).toBe(1);
    expect(resHolding.totalReceived).toBe(100);

    // Caso 2: Compra na Data Ex (2025-04-01) -> Nao tem direito a esse dividendo
    const txBuyingOnEx = [{ type: 'buy', quantity: '100', transaction_date: '2025-04-01' }];
    const resBuyingOnEx = calculateDividends(txBuyingOnEx, div);
    expect(resBuyingOnEx.count).toBe(0);
    expect(resBuyingOnEx.totalReceived).toBe(0);
  });

  it('nao gera proventos se a posicao estiver zerada antes da Data Ex', () => {
    const transactions = [
      { type: 'buy', quantity: '100', transaction_date: '2025-01-10' },
      { type: 'sell', quantity: '100', transaction_date: '2025-02-10' },
    ];
    const dividends = [
      { id: '1', ex_date: '2025-03-01', payment_date: '2025-03-15', rate: '0.50' },
    ];

    const res = calculateDividends(transactions, dividends);
    expect(res.count).toBe(0);
    expect(res.totalReceived).toBe(0);
    expect(res.items).toEqual([]);
  });

  it('converte proventos de ativo em USD para BRL usando a cotacao cambial', () => {
    const transactions = [{ type: 'buy', quantity: '100', transaction_date: '2025-01-10' }];
    const dividends = [
      { id: '1', ex_date: '2025-03-01', payment_date: '2025-03-15', rate: '0.50' }, // 100 * 0.50 = 50 USD
    ];

    const res = calculateDividends(transactions, dividends, {
      isUsd: true,
      rateMap: { '2025-03': 5.5 },
    });

    expect(res.count).toBe(1);
    expect(res.totalReceived).toBe(275); // 50 * 5.5 = 275 BRL
    expect(res.items[0].totalUSD).toBe(50);
    expect(res.items[0].totalBRL).toBe(275);
    expect(res.items[0].usdRate).toBe(5.5);
  });
});

describe('isDividendEligibleCategory', () => {
  it('considera elegiveis apenas categorias que podem pagar proventos por cota', () => {
    expect(isDividendEligibleCategory('acoes')).toBe(true);
    expect(isDividendEligibleCategory('fiis')).toBe(true);
    expect(isDividendEligibleCategory('etfs')).toBe(true);
    expect(isDividendEligibleCategory('fi_infra')).toBe(true);

    expect(isDividendEligibleCategory('cripto')).toBe(false);
    expect(isDividendEligibleCategory('fundos')).toBe(false);
    expect(isDividendEligibleCategory('renda_fixa')).toBe(false);
  });
});

describe('dividendYieldOnCost', () => {
  it('calcula yield on cost corretamente', () => {
    expect(dividendYieldOnCost(100, 1000)).toBe(0.1);
    expect(dividendYieldOnCost(0, 1000)).toBeNull();
    expect(dividendYieldOnCost(100, 0)).toBeNull();
  });
});

describe('totalReturn', () => {
  it('calcula retorno total positivo somando valorizacao e proventos', () => {
    const res = totalReturn({ cost: 1000, value: 1100, realized: 0, totalDividends: 50 });
    expect(res.netGain).toBe(150);
    expect(res.returnPct).toBe(0.15);
  });

  it('compensa desvalorizacao de capital com dividendos', () => {
    const res = totalReturn({ cost: 1000, value: 900, realized: 0, totalDividends: 200 });
    expect(res.netGain).toBe(100);
    expect(res.returnPct).toBe(0.1);
  });

  it('retorna nulo para ativo sem cotacao', () => {
    const res = totalReturn({ cost: 1000, value: null, realized: 50, totalDividends: 0 });
    expect(res.netGain).toBe(50);
    expect(res.returnPct).toBeNull();
  });
});

describe('buildDividendsMatrix', () => {
  it('retorna estrutura vazia quando nao ha itens', () => {
    const res = buildDividendsMatrix([]);
    expect(res.years).toEqual([]);
    expect(res.grandTotal).toBe(0);
    expect(res.months.length).toBe(12);
  });

  it('agrupa proventos em anos e meses corretamente permitindo comparacao vertical e horizontal', () => {
    const items = [
      { paymentDate: '2025-01-15', total: 100 },
      { paymentDate: '2025-02-15', total: 150 },
      { paymentDate: '2026-01-15', total: 200 },
      { paymentDate: '2026-03-15', total: 250 },
    ];

    const res = buildDividendsMatrix(items);

    expect(res.years).toEqual([2026, 2025]);
    expect(res.yearTotals[2026]).toBe(450);
    expect(res.yearTotals[2025]).toBe(250);
    expect(res.grandTotal).toBe(700);

    // Comparação vertical: Janeiro (índice 0) em 2026 vs 2025
    expect(res.matrix[2026][0]).toBe(200);
    expect(res.matrix[2025][0]).toBe(100);

    // Comparação horizontal: Meses de 2025 (Jan: 100, Fev: 150, Mar: 0)
    expect(res.matrix[2025][0]).toBe(100);
    expect(res.matrix[2025][1]).toBe(150);
    expect(res.matrix[2025][2]).toBe(0);

    // Total de Janeiro em todos os anos
    expect(res.monthTotals[0]).toBe(300);
    // Total de Fevereiro em todos os anos
    expect(res.monthTotals[1]).toBe(150);
  });
});
