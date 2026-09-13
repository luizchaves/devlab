import { describe, expect, it } from 'vitest';
import { assetSchema, normalizeTicker, suggestCurrency, transactionSchema } from './assets';

describe('assetSchema', () => {
  it('CA03.1 — aceita ticker, nome e categoria permitida; recusa categoria fora do conjunto', () => {
    const ok = assetSchema.safeParse({ ticker: 'petr4', name: 'Petrobras', category: 'acoes' });
    const bad = assetSchema.safeParse({ ticker: 'X', name: 'Qualquer', category: 'imoveis' });

    expect(ok.success).toBe(true);
    expect(ok.success && ok.data.ticker).toBe('PETR4');
    expect(bad.success).toBe(false);
  });

  it('exige ticker fora da renda fixa e reais na renda fixa', () => {
    const noTicker = assetSchema.safeParse({ name: 'Fundo', category: 'fundos' });
    const rfUsd = assetSchema.safeParse({ name: 'CDB', category: 'renda_fixa', currency: 'USD' });
    const rfOk = assetSchema.safeParse({ name: 'CDB', category: 'renda_fixa' });

    expect(noTicker.success).toBe(false);
    expect(rfUsd.success).toBe(false);
    expect(rfOk.success).toBe(true);
  });
});

describe('normalizeTicker', () => {
  it('CA08.6 — renda fixa sem ticker recebe RF-<NOME>-<sufixo>', () => {
    expect(normalizeTicker('', 'renda_fixa', 'Tesouro Selic 2029', () => 0.5)).toMatch(/^RF-TESOUROS-[A-Z0-9]{5}$/);
    expect(normalizeTicker(' petr4 ', 'acoes', 'Petrobras')).toBe('PETR4');
    expect(normalizeTicker('', 'acoes', 'Sem ticker')).toBe('');
  });
});

describe('suggestCurrency', () => {
  it('CA10.2 — só letras sugere USD; com dígitos, BRL', () => {
    expect(suggestCurrency('VT')).toBe('USD');
    expect(suggestCurrency('aapl')).toBe('USD');
    expect(suggestCurrency('PETR4')).toBe('BRL');
  });
});

describe('transactionSchema', () => {
  it('CA03.2 — converte quantidade e preço e recusa quantidade zero', () => {
    const ok = transactionSchema.safeParse({ assetId: 'a1', type: 'buy', quantity: '100', price: '30.5', transactionDate: '2026-01-10' });
    const zero = transactionSchema.safeParse({ assetId: 'a1', type: 'buy', quantity: '0', price: '30', transactionDate: '2026-01-10' });

    expect(ok.success && ok.data).toMatchObject({ quantity: 100, price: 30.5 });
    expect(zero.success).toBe(false);
  });
});
