import { fakeProvider, today, type MarketProvider, type Quote } from '@/core/quotes';

// #region yahoo
/**
 * O provedor real padrão: o endpoint de gráfico do Yahoo Finance é público e
 * não pede token. Tickers da B3 levam o sufixo `.SA`. Um ticker por requisição;
 * um que o Yahoo não conhece responde 404 e vira `not_found` no resumo.
 */
export const yahooProvider: MarketProvider = {
  async fetchQuotes(tickers) {
    const quotes: Quote[] = [];

    for (const ticker of tickers) {
      const candidates = ticker.includes('.') || ticker.includes('=') ? [ticker] : /\d/.test(ticker) ? [`${ticker}.SA`, ticker] : [ticker, `${ticker}.SA`];

      for (const symbol of candidates) {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (InvestFlow)' },
          signal: AbortSignal.timeout(8_000),
        });
        if (response.status === 404) continue;
        if (!response.ok) throw new Error(`Yahoo respondeu ${response.status}`);

        const { chart } = (await response.json()) as { chart?: { result?: { meta?: { regularMarketPrice?: number } }[] } };
        const price = chart?.result?.[0]?.meta?.regularMarketPrice;
        if (typeof price === 'number') {
          quotes.push({ ticker, price, quoteDate: today() });
          break;
        }
      }
    }

    return quotes;
  },
};
// #endregion

// #region select
/** `yahoo` é o padrão real sem custo; `fake` existe para testes determinísticos. */
export function selectProvider(name = process.env.QUOTES_PROVIDER ?? 'yahoo'): MarketProvider {
  return name === 'fake' ? fakeProvider : yahooProvider;
}
// #endregion
