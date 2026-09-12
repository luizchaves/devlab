import { fakeProvider, today } from './logic.ts';
import type { MarketProvider, Quote } from './types.ts';

// #region yahoo
/**
 * O provedor real padrao: o endpoint de grafico do Yahoo Finance e publico e
 * nao pede token. Tickers da B3 levam o sufixo .SA. Um ticker por requisicao;
 * um que o Yahoo nao conhece responde 404 e vira not_found no resumo.
 */
export const yahooProvider: MarketProvider = {
  async fetchQuotes(tickers) {
    const quotes: Quote[] = [];

    for (const ticker of tickers) {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?range=1d&interval=1d`,
        { headers: { 'User-Agent': 'Mozilla/5.0 (InvestBaaS)' } }
      );
      if (res.status === 404) continue;
      if (!res.ok) throw new Error(`Yahoo respondeu ${res.status}`);

      const { chart } = await res.json();
      const price = chart?.result?.[0]?.meta?.regularMarketPrice;
      if (typeof price === 'number') quotes.push({ ticker, price, quoteDate: today() });
    }

    return quotes;
  },
};
// #endregion

// #region brapi
/**
 * Alternativa com free tier e token: cotacoes em lote numa chamada so. O token
 * vive em Deno.env, gravado com `supabase secrets set`; o navegador nunca o ve.
 */
export const brapiProvider: MarketProvider = {
  async fetchQuotes(tickers) {
    const token = Deno.env.get('MARKET_API_TOKEN');
    if (!token) throw new Error('MARKET_API_TOKEN ausente');

    const res = await fetch(`https://brapi.dev/api/quote/${tickers.join(',')}?token=${token}`);
    if (!res.ok) throw new Error(`Provedor respondeu ${res.status}`);

    const { results } = await res.json();
    return results.map((r: { symbol: string; regularMarketPrice: number }) => ({
      ticker: r.symbol,
      price: r.regularMarketPrice,
      quoteDate: today(),
    }));
  },
};
// #endregion

// #region select
/**
 * `fake` e o padrao: sem internet e sem token, a trilha inteira roda e os
 * testes sao deterministicos. `yahoo` e o real sem custo; `brapi` o real em lote.
 */
export function selectProvider(name = Deno.env.get('MARKET_PROVIDER') ?? 'fake'): MarketProvider {
  if (name === 'yahoo') return yahooProvider;
  if (name === 'brapi') return brapiProvider;
  return fakeProvider;
}
// #endregion
