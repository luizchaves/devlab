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
/** O rodapé soma as posições abertas exibidas e mostra a rentabilidade ponderada pelo custo (CA08.15). */
export function footerTotals(assets: AssetWithTransactions[], { usdRate = 1 } = {}): PortfolioTotals | null {
  const open = assets.filter(isAssetActive).filter((a) => a.transactions.length > 0);
  return open.length === 0 ? null : totals(open, { usdRate });
}
// #endregion
