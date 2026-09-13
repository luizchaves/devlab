import { dividendsSummary, receivedDividends, type DividendsSummary, type ReceivedDividend } from '@/core/dividends';
import { listAssets } from './assets';

export type DividendsPayload = {
  assets: { id: string; ticker: string; name: string }[];
  items: ReceivedDividend[];
  summary: DividendsSummary;
};

/** Tudo que `/dividends` mostra; o filtro por ativo é aplicado no cliente sobre `items`. */
export async function getDividendsPage(userId: string): Promise<DividendsPayload> {
  const assets = await listAssets(userId);
  const items = assets.flatMap((asset) => receivedDividends(asset));
  return {
    assets: assets.filter((a) => a.dividends.length > 0).map((a) => ({ id: a.id, ticker: a.ticker, name: a.name })),
    items,
    summary: dividendsSummary(assets, items),
  };
}
