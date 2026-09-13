import { today } from './logic.ts';
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
      const candidates = ticker.includes('.')
        ? [ticker]
        : /\d/.test(ticker)
          ? [`${ticker}.SA`, ticker]
          : [ticker, `${ticker}.SA`];

      let price: number | undefined;

      for (const symbol of candidates) {
        try {
          const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`,
            { headers: { 'User-Agent': 'Mozilla/5.0 (InvestFlow)' } }
          );
          if (res.status === 404) continue;
          if (!res.ok) throw new Error(`Yahoo respondeu ${res.status}`);

          const { chart } = await res.json();
          const p = chart?.result?.[0]?.meta?.regularMarketPrice;
          if (typeof p === 'number') {
            price = p;
            break;
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('404')) continue;
          throw err;
        }
      }

      if (typeof price === 'number') {
        quotes.push({ ticker, price, quoteDate: today() });
      }
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
 * `yahoo` e o padrao real sem custo; `brapi` e o real em lote com token.
 * `fake` existe so para testes Vitest deterministicos da logica pura.
 */
export function selectProvider(name = Deno.env.get('MARKET_PROVIDER') ?? 'yahoo'): MarketProvider {
  if (name === 'brapi') return brapiProvider;
  return yahooProvider;
}
// #endregion
