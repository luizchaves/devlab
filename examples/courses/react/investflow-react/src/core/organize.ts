import { summarizeWithDividends } from './dividends';
import { summarize, totals, type AssetWithTransactions, type PortfolioTotals } from './portfolio';

// #region filter
export type AssetFilter = 'active' | 'all';

/** Um ativo sem lançamento conta como ativo; posição zerada é encerrada (CA08.13). */
export function isAssetActive(asset: AssetWithTransactions): boolean {
  return asset.transactions.length === 0 || summarize(asset).quantity > 0.000001;
}

export function filterAssets(assets: AssetWithTransactions[], filter: AssetFilter): AssetWithTransactions[] {
  return filter === 'all' ? assets : assets.filter(isAssetActive);
}
// #endregion

// #region footer
export type FooterTotals = PortfolioTotals & { dividends: number; includeDividends: boolean };

/**
 * O rodapé soma as posições abertas exibidas e mostra a rentabilidade
 * ponderada pelo custo (CA08.15). Com `includeDividends`, os proventos
 * recebidos entram no lucro e na rentabilidade (CA09.9).
 */
export function footerTotals(assets: AssetWithTransactions[], { usdRate = 1, includeDividends = false } = {}): FooterTotals | null {
  const open = assets.filter(isAssetActive).filter((a) => a.transactions.length > 0);
  if (open.length === 0) return null;
  const base = totals(open, { usdRate });
  const dividends = open.reduce((sum, a) => sum + summarizeWithDividends(a, { usdRate }).dividendsBRL, 0);
  if (!includeDividends) return { ...base, dividends, includeDividends };
  const unrealized = base.unrealized + dividends;
  return { ...base, dividends, includeDividends, unrealized, returnPct: base.cost === 0 ? null : unrealized / base.cost };
}
// #endregion
