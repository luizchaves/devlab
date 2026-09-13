import { CATEGORY_LABELS, summarize, type AssetWithTransactions } from './portfolio';

// #region rows
/** Uma linha por ativo com as três dimensões de origem, como a view `allocation_by_origin`. */
export type OriginRow = {
  assetId: string;
  ticker: string;
  broker: string;
  category: string;
  issuer: string;
  value: number;
};

export type OriginDimension = 'broker' | 'category' | 'issuer';

export const DIMENSION_LABELS: Record<OriginDimension, string> = {
  broker: 'Corretora',
  category: 'Categoria',
  issuer: 'Emissor',
};

export function allocationByOrigin(assets: AssetWithTransactions[], { usdRate = 1 } = {}): OriginRow[] {
  return assets.map((asset) => {
    const s = summarize(asset, { usdRate });
    return {
      assetId: asset.id,
      ticker: asset.ticker,
      broker: asset.broker?.name ?? 'Sem corretora',
      category: CATEGORY_LABELS[asset.category],
      issuer: asset.issuer ?? 'Sem emissor',
      value: Math.max(0, s.valueBRL ?? s.costBRL),
    };
  });
}
// #endregion

// #region group
/** Agrupa as linhas por uma dimensão: o que o treemap desenha (CA07.2). */
export function groupBy(rows: OriginRow[], dimension: OriginDimension): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) map.set(row[dimension], (map.get(row[dimension]) ?? 0) + row.value);
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
// #endregion
