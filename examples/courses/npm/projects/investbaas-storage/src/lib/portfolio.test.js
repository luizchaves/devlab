import { describe, expect, it } from 'vitest';
import { summarize, totals } from './portfolio.js';

// TK03-8: os indicadores nascem das transacoes. Sem fetch e sem DOM.
// Os numeros sao os da planilha de referencia da pagina: duas compras de 100.
const buys = [
  { type: 'buy', quantity: '100', price: '30', transaction_date: '2026-01-10' },
  { type: 'buy', quantity: '100', price: '34', transaction_date: '2026-02-10' },
];

// #region summarize
describe('summarize', () => {
  it('calcula posicao, custo e preco medio a partir das compras', () => {
    const s = summarize({ current_price: '33', transactions: buys });

    expect(s.quantity).toBe(200);
    expect(s.cost).toBe(6400);
    expect(s.averagePrice).toBe(32);
    expect(s.value).toBe(6600);
    expect(s.unrealized).toBe(200);
    expect(s.returnPct).toBeCloseTo(200 / 6400);
  });

  it('baixa o custo pelo preco medio na venda e separa o resultado realizado', () => {
    const sell = { type: 'sell', quantity: '50', price: '40', transaction_date: '2026-03-10' };
    const s = summarize({ current_price: '33', transactions: [...buys, sell] });

    expect(s.quantity).toBe(150);
    expect(s.cost).toBe(4800); // 150 × 32
    expect(s.averagePrice).toBe(32);
    expect(s.realized).toBe(400); // 50 × (40 − 32)
  });

  it('ordena por data mesmo que as transacoes cheguem fora de ordem', () => {
    const s = summarize({ current_price: '33', transactions: [buys[1], buys[0]] });

    expect(s.averagePrice).toBe(32);
  });

  it('nao inventa valor quando o ativo nao tem cotacao', () => {
    const s = summarize({ current_price: null, transactions: buys });

    expect(s.cost).toBe(6400);
    expect(s.value).toBeNull();
    expect(s.returnPct).toBeNull();
  });

  it('converte as strings do PostgREST em vez de concatenar', () => {
    const s = summarize({
      current_price: '1',
      transactions: [{ type: 'buy', quantity: '2', price: '3', transaction_date: '2026-01-01' }],
    });

    expect(s.cost).toBe(6);
  });
});
// #endregion

// #region totals
describe('totals', () => {
  it('soma as posicoes e deixa o ativo sem cotacao fora do valor', () => {
    const t = totals([
      { current_price: '33', transactions: buys },
      {
        current_price: null,
        transactions: [
          { type: 'buy', quantity: '1', price: '1000', transaction_date: '2026-01-01' },
        ],
      },
    ]);

    expect(t.cost).toBe(7400);
    expect(t.value).toBe(6600);
  });
});
// #endregion
