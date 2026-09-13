import { describe, expect, it } from 'vitest';
import {
  formatDate,
  investmentDuration,
  monthlyFlows,
  summarize,
  summarizeInBRL,
  totals,
  truncateText,
} from './portfolio.js';

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

  it('CA08.4: baixa o custo pelo preco medio na venda e separa o resultado realizado', () => {
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

  it('CA08.7: o lancamento update redefine posicao e custo pelo saldo e zera o realizado', () => {
    const cdb = {
      current_price: null,
      transactions: [
        { type: 'buy', quantity: '1000', price: '1', transaction_date: '2026-01-15' },
        { type: 'sell', quantity: '200', price: '1.1', transaction_date: '2026-03-01' },
        { type: 'update', quantity: '1080', price: '1', transaction_date: '2026-06-30' },
      ],
    };
    const s = summarize(cdb);

    expect(s.quantity).toBe(1080);
    expect(s.cost).toBe(1080);
    expect(s.averagePrice).toBe(1);
    // O saldo informado ja embute o rendimento: o realizado anterior nao se soma a ele.
    expect(s.realized).toBe(0);
    expect(s.value).toBeNull();
  });

  it('converte as strings do PostgREST em vez de concatenar', () => {
    const s = summarize({
      current_price: '1',
      transactions: [{ type: 'buy', quantity: '2', price: '3', transaction_date: '2026-01-01' }],
    });

    expect(s.cost).toBe(6);
  });

  it('CA10.4: converte valores para BRL quando o ativo e em USD', () => {
    const s = summarize(
      {
        currency: 'USD',
        current_price: '50',
        transactions: [
          { type: 'buy', quantity: '10', price: '40', transaction_date: '2026-01-01' },
        ],
      },
      { usdRate: 5 }
    );

    expect(s.isUsd).toBe(true);
    expect(s.currency).toBe('USD');
    expect(s.cost).toBe(400); // 10 × 40 USD
    expect(s.value).toBe(500); // 10 × 50 USD
    expect(s.costBRL).toBe(2000); // 400 × 5
    expect(s.valueBRL).toBe(2500); // 500 × 5
    expect(s.unrealizedBRL).toBe(500); // 100 × 5
  });
});
// #endregion

// #region totals
describe('totals', () => {
  it('CA08.8: soma as posicoes e usa o saldo do ativo sem cotacao como valor final', () => {
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
    expect(t.value).toBe(7600);
  });

  it('CA10.4: converte ativos USD na soma total da carteira', () => {
    const t = totals(
      [
        {
          current_price: '30',
          transactions: [
            { type: 'buy', quantity: '10', price: '30', transaction_date: '2026-01-01' },
          ],
        },
        {
          currency: 'USD',
          current_price: '10',
          transactions: [
            { type: 'buy', quantity: '10', price: '10', transaction_date: '2026-01-01' },
          ],
        },
      ],
      { usdRate: 5 }
    );

    // BRL: cost = 300, val = 300
    // USD: cost = 100 × 5 = 500, val = 100 × 5 = 500
    expect(t.cost).toBe(800);
    expect(t.value).toBe(800);
  });
});
// #endregion

// #region duration
describe('investmentDuration', () => {
  it('retorna tracinho quando nao ha transacoes', () => {
    const d = investmentDuration([]);
    expect(d.text).toBe('—');
    expect(d.subtitle).toBe('Sem lançamentos');
  });

  it('CA08.16: calcula duracao de posicao aberta em relacao a data de referencia', () => {
    const ref = new Date('2026-04-10T12:00:00');
    const d = investmentDuration(buys, ref);
    expect(d.isClosed).toBe(false);
    expect(d.subtitle).toBe('Início em 10/01/2026');
    expect(d.text).toBe('3 meses');
  });

  it('CA08.16: indica posicao encerrada quando a quantidade e zerada', () => {
    const liquidations = [
      { type: 'buy', quantity: '100', price: '30', transaction_date: '2025-01-10' },
      { type: 'sell', quantity: '100', price: '35', transaction_date: '2025-11-10' },
    ];
    const d = investmentDuration(liquidations);
    expect(d.isClosed).toBe(true);
    expect(d.subtitle).toBe('Encerrado em 10/11/2025');
    expect(d.text).toBe('10 meses');
  });
});
// #endregion

// #region format
describe('formatDate', () => {
  it('formata datas ISO YYYY-MM-DD para DD/MM/YYYY', () => {
    expect(formatDate('2026-03-15')).toBe('15/03/2026');
    expect(formatDate('2026-12-01')).toBe('01/12/2026');
  });

  it('trata datas com timestamp ISO', () => {
    expect(formatDate('2026-03-15T12:00:00Z')).toBe('15/03/2026');
  });

  it('retorna tracinho para valores nulos ou vazios', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('')).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });
});

describe('truncateText', () => {
  it('abrevia textos longos adicionando reticencias', () => {
    expect(truncateText('BTG Pactual Corporate Office', 20)).toBe('BTG Pactual Corpora…');
  });

  it('mantem textos curtos inalterados', () => {
    expect(truncateText('Petrobras', 20)).toBe('Petrobras');
  });

  it('lida com texto vazio ou nulo', () => {
    expect(truncateText('')).toBe('');
    expect(truncateText(null)).toBe('');
  });
});

describe('CATEGORY_LABELS e CATEGORY_BADGES', () => {
  it('CA08.5: mapeia corretamente todas as categorias incluindo etfs e fi_infra', async () => {
    const { CATEGORY_LABELS, CATEGORY_BADGES } = await import('./portfolio.js');
    expect(CATEGORY_LABELS.fiis).toBe('FII');
    expect(CATEGORY_LABELS.etfs).toBe('ETF');
    expect(CATEGORY_LABELS.fi_infra).toBe('FI-Infra');
    expect(CATEGORY_BADGES.fiis).toBe('badge-fiis');
    expect(CATEGORY_BADGES.etfs).toBe('badge-etfs');
    expect(CATEGORY_BADGES.fi_infra).toBe('badge-fi-infra');
  });
});

describe('formatUSD e formatCurrency', () => {
  it('formata moeda BRL e USD corretamente', async () => {
    const { formatUSD, formatCurrency, formatBRL } = await import('./portfolio.js');
    expect(formatUSD(100)).toContain('100.00');
    expect(formatBRL(100)).toContain('100,00');
    expect(formatCurrency(100, 'USD')).toBe(formatUSD(100));
    expect(formatCurrency(100, 'BRL')).toBe(formatBRL(100));
    expect(formatCurrency(null, 'USD')).toBe('—');
  });
});
// #endregion

// #region historical-brl
describe('summarizeInBRL', () => {
  it('CA10.6: mede o custo em reais pelo cambio do mes de cada compra', () => {
    const asset = {
      currency: 'USD',
      current_price: '10',
      transactions: [{ type: 'buy', quantity: '10', price: '10', transaction_date: '2026-01-10' }],
    };
    const rateMap = new Map([['2026-01', 5]]);

    // Ativo parado em US$ 10, mas o dolar foi de 5 para 6: +20% em reais, 0% em dolar
    const brl = summarizeInBRL(asset, { rateMap, latestRate: 6 });
    expect(brl.cost).toBe(500);
    expect(brl.value).toBe(600);
    expect(brl.returnPct).toBeCloseTo(0.2);
    expect(summarize(asset, { usdRate: 6 }).returnPct).toBe(0);
  });

  it('em ativo BRL devolve o mesmo que summarize', () => {
    const asset = {
      currency: 'BRL',
      current_price: '33',
      transactions: [{ type: 'buy', quantity: '100', price: '30', transaction_date: '2026-01-10' }],
    };
    expect(summarizeInBRL(asset).returnPct).toBeCloseTo(summarize(asset).returnPct);
  });
});
// #endregion

// #region flows
describe('monthlyFlows', () => {
  it('CA10.7: agrupa compras menos vendas por mes, em reais pelo cambio do mes', () => {
    const asset = {
      currency: 'USD',
      transactions: [
        { type: 'buy', quantity: '2', price: '10', transaction_date: '2026-01-05' },
        { type: 'sell', quantity: '1', price: '12', transaction_date: '2026-01-20' },
        { type: 'buy', quantity: '1', price: '10', transaction_date: '2026-02-01' },
      ],
    };
    const flows = monthlyFlows(asset, { rateMap: new Map([['2026-01', 5]]), latestRate: 6 });

    expect(flows.get('2026-01')).toBe((20 - 12) * 5);
    expect(flows.get('2026-02')).toBe(10 * 6);
  });
});
// #endregion
