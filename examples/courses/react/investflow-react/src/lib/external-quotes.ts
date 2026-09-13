export type Quote = {
  symbol: string;
  price: number;
  currency: string;
  fetchedAt: string;
};

export async function fetchMarketQuote(symbol: string, signal?: AbortSignal): Promise<Quote> {
  const baseUrl = process.env.MARKET_API_URL ?? 'https://brapi.dev/api';
  const token = process.env.MARKET_API_TOKEN;
  const url = new URL(`${baseUrl}/quote/${encodeURIComponent(symbol)}`);

  if (token) {
    url.searchParams.set('token', token);
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Market provider failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    results?: Array<{ symbol: string; regularMarketPrice?: number; currency?: string }>;
  };
  const first = payload.results?.[0];

  if (!first?.regularMarketPrice) {
    throw new Error(`Quote not found for ${symbol}`);
  }

  return {
    symbol: first.symbol,
    price: first.regularMarketPrice,
    currency: first.currency ?? 'BRL',
    fetchedAt: new Date().toISOString(),
  };
}
