import type { MarketProvider, Quote, QuoteFailure } from './types.ts';

// Sem Deno.* e sem npm: aqui: este modulo roda no edge runtime E no Vitest.

// #region today
export const today = () => new Date().toISOString().slice(0, 10);
// #endregion

// #region fake-provider
/**
 * O adaptador simulado implementa o mesmo contrato do real com uma tabela fixa.
 * Ticker desconhecido fica de fora: a falha e registrada, nao mascarada com
 * um preco inventado.
 */
export const FAKE_PRICES: Record<string, number> = { PETR4: 38.42, VALE3: 61.1, HGLG11: 162.3 };

export const fakeProvider: MarketProvider = {
  async fetchQuotes(tickers) {
    return tickers
      .filter((t) => t in FAKE_PRICES)
      .map((ticker) => ({ ticker, price: FAKE_PRICES[ticker], quoteDate: today() }));
  },
};
// #endregion

// #region collect
/**
 * Falha parcial vira dado, nao excecao. Um ticker que o provedor nao conhece
 * nao pode derrubar os outros trinta; um erro do provedor inteiro marca todos
 * como provider_error, e a funcao ainda responde 200 com o resumo.
 */
export async function collectQuotes(
  provider: MarketProvider,
  tickers: string[]
): Promise<{ quotes: Quote[]; failed: QuoteFailure[] }> {
  if (tickers.length === 0) return { quotes: [], failed: [] };

  try {
    const quotes = await provider.fetchQuotes(tickers);
    const found = new Set(quotes.map((q) => q.ticker));
    const failed: QuoteFailure[] = tickers
      .filter((t) => !found.has(t))
      .map((ticker) => ({ ticker, reason: 'not_found' }));

    return { quotes, failed };
  } catch {
    return { quotes: [], failed: tickers.map((ticker) => ({ ticker, reason: 'provider_error' })) };
  }
}
// #endregion

// #region eligible
/** So acoes e FIIs tem ticker negociado em bolsa; o resto e preco manual. */
export const ELIGIBLE_CATEGORIES = ['acoes', 'fiis'];
// #endregion
