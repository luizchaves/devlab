import { describe, expect, it } from 'vitest';
import { collectQuotes, fakeProvider, needsUsdConversion, priceInAssetCurrency, quoteSymbol, type MarketProvider } from './quotes';

describe('collectQuotes', () => {
  it('CA04.2 — ticker desconhecido entra na lista de falhas e os demais são cotados', async () => {
    const { quotes, failed } = await collectQuotes(fakeProvider, ['PETR4', 'XPTO3']);

    expect(quotes).toEqual([expect.objectContaining({ ticker: 'PETR4', price: 38.42 })]);
    expect(failed).toEqual([{ ticker: 'XPTO3', reason: 'not_found' }]);
  });

  it('erro do provedor inteiro marca todos como provider_error, sem exceção', async () => {
    const broken: MarketProvider = { fetchQuotes: async () => { throw new Error('offline'); } };
    const { quotes, failed } = await collectQuotes(broken, ['PETR4', 'VALE3']);

    expect(quotes).toEqual([]);
    expect(failed.map((f) => f.reason)).toEqual(['provider_error', 'provider_error']);
  });

  it('lista vazia não consulta o provedor', async () => {
    const spy: MarketProvider = { fetchQuotes: async () => { throw new Error('não deveria chamar'); } };
    await expect(collectQuotes(spy, [])).resolves.toEqual({ quotes: [], failed: [] });
  });
});

describe('símbolos e conversão', () => {
  it('CA10.11 — cripto é consultada como TICKER-USD e convertida para real pelo câmbio', () => {
    expect(quoteSymbol({ ticker: 'BTC', category: 'cripto' })).toBe('BTC-USD');
    expect(quoteSymbol({ ticker: 'PETR4', category: 'acoes' })).toBe('PETR4');
    expect(needsUsdConversion({ category: 'cripto', currency: 'BRL' })).toBe(true);
    expect(needsUsdConversion({ category: 'cripto', currency: 'USD' })).toBe(false);
    expect(priceInAssetCurrency({ category: 'cripto', currency: 'BRL' }, 100, 5)).toBe(500);
  });

  it('CA10.12 — sem o câmbio na rodada, a cripto em real fica sem cotação', () => {
    expect(priceInAssetCurrency({ category: 'cripto', currency: 'BRL' }, 100, undefined)).toBeNull();
    expect(priceInAssetCurrency({ category: 'acoes', currency: 'BRL' }, 100, undefined)).toBe(100);
  });
});
