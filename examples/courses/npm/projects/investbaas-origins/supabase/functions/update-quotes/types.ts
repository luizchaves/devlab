// #region types
export type Quote = { ticker: string; price: number; quoteDate: string };

export type QuoteFailure = { ticker: string; reason: 'not_found' | 'provider_error' };

/** O contrato que o dashboard e o admin consomem. Definido antes do primeiro fetch. */
export type RunSummary = {
  ranAt: string;
  requested: number;
  updated: number;
  failed: QuoteFailure[];
};

export interface MarketProvider {
  fetchQuotes(tickers: string[]): Promise<Quote[]>;
}
// #endregion
