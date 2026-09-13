import { z } from 'zod';
import type { AssetCategory, Currency } from './portfolio';
import { QUOTED_CATEGORIES } from './portfolio';

// #region types
export type Quote = { ticker: string; price: number; quoteDate: string };

export type QuoteFailure = { ticker: string; reason: 'not_found' | 'provider_error' };

/** O contrato que a carteira e o admin consomem, definido antes do primeiro fetch. */
export type RunSummary = {
  ranAt: string;
  requested: number;
  updated: number;
  failed: QuoteFailure[];
};

export interface MarketProvider {
  fetchQuotes(tickers: string[]): Promise<Quote[]>;
}

export type QuotedAsset = { ticker: string; category: AssetCategory; currency: Currency };
// #endregion

export const today = () => new Date().toISOString().slice(0, 10);

// #region fake-provider
/**
 * O adaptador simulado implementa o mesmo contrato do real com uma tabela fixa.
 * Ticker desconhecido fica de fora: a falha é registrada, não mascarada com
 * um preço inventado.
 */
export const FAKE_PRICES: Record<string, number> = {
  HGLG11: 162.3,
  PETR4: 38.42,
  VALE3: 61.1,
  AAPL: 230.5,
  VT: 120,
  'BTC-USD': 65_000,
  'BRL=X': 5.2,
};

export const fakeProvider: MarketProvider = {
  async fetchQuotes(tickers) {
    return tickers.filter((t) => t in FAKE_PRICES).map((ticker) => ({ ticker, price: FAKE_PRICES[ticker], quoteDate: today() }));
  },
};
// #endregion

// #region collect
/**
 * Falha parcial vira dado, não exceção. Um ticker que o provedor não conhece
 * não pode derrubar os outros trinta; um erro do provedor inteiro marca todos
 * como `provider_error`, e a rodada ainda responde 200 com o resumo (CA04.2).
 */
export async function collectQuotes(provider: MarketProvider, tickers: string[]): Promise<{ quotes: Quote[]; failed: QuoteFailure[] }> {
  if (tickers.length === 0) return { quotes: [], failed: [] };

  try {
    const quotes = await provider.fetchQuotes(tickers);
    const found = new Set(quotes.map((q) => q.ticker));
    const failed: QuoteFailure[] = tickers.filter((t) => !found.has(t)).map((ticker) => ({ ticker, reason: 'not_found' }));
    return { quotes, failed };
  } catch {
    return { quotes: [], failed: tickers.map((ticker) => ({ ticker, reason: 'provider_error' })) };
  }
}
// #endregion

// #region symbols
/** Par USD/BRL no Yahoo, usado para converter cripto cotada em dólar. */
export const USD_BRL_SYMBOL = 'BRL=X';

export function isQuotable(asset: { category: AssetCategory }) {
  return QUOTED_CATEGORIES.includes(asset.category);
}

/**
 * Símbolo consultado no provedor. O Yahoo só indexa cripto em dólar
 * (BTC-USD), então cripto vira `TICKER-USD` e, para ativo em real, o preço é
 * convertido depois com o câmbio da mesma rodada (CA10.11).
 */
export function quoteSymbol(asset: Pick<QuotedAsset, 'ticker' | 'category'>) {
  if (asset.category === 'cripto' && !asset.ticker.includes('-')) return `${asset.ticker}-USD`;
  return asset.ticker;
}

/** Cripto em real precisa do câmbio; o resto já vem na moeda do ativo. */
export function needsUsdConversion(asset: Pick<QuotedAsset, 'category' | 'currency'>) {
  return asset.category === 'cripto' && asset.currency !== 'USD';
}

/**
 * Preço na moeda do ativo. Devolve `null` quando a conversão é necessária e o
 * câmbio não veio: melhor ficar sem cotação do que gravar dólar como real (CA10.12).
 */
export function priceInAssetCurrency(asset: Pick<QuotedAsset, 'category' | 'currency'>, quotePrice: number, usdBrlRate: number | undefined): number | null {
  if (!needsUsdConversion(asset)) return quotePrice;
  return typeof usdBrlRate === 'number' && usdBrlRate > 0 ? quotePrice * usdBrlRate : null;
}
// #endregion

// #region manual-schema
/** Cotação manual: `price` para ativo cotado, `balance` para ativo por saldo. */
export const manualQuoteSchema = z
  .object({
    price: z.coerce.number().min(0, 'Informe um valor maior ou igual a zero.').optional(),
    balance: z.coerce.number().min(0, 'Informe um saldo maior ou igual a zero.').optional(),
    quoteDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.').optional(),
  })
  .refine((v) => v.price != null || v.balance != null, { message: 'Informe o valor.', path: ['price'] });

export type ManualQuoteInput = z.input<typeof manualQuoteSchema>;
// #endregion
