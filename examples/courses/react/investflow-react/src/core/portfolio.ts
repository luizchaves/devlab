export type AssetPosition = {
  id: string;
  symbol: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  currency: string;
};

export function calculatePositionValue(asset: Pick<AssetPosition, 'quantity' | 'price'>) {
  return Number((asset.quantity * asset.price).toFixed(2));
}

export function calculatePortfolioTotal(assets: AssetPosition[]) {
  return assets.reduce((total, asset) => total + calculatePositionValue(asset), 0);
}

export function calculateCategoryAllocation(assets: AssetPosition[]) {
  const total = calculatePortfolioTotal(assets);

  return assets.reduce<Record<string, number>>((allocation, asset) => {
    const current = allocation[asset.category] ?? 0;
    const value = calculatePositionValue(asset);
    allocation[asset.category] = total === 0 ? 0 : Number((((current + value) / total) * 100).toFixed(2));
    return allocation;
  }, {});
}
