export type PortfolioAsset = {
  id: string;
  symbol: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  currency: string;
};

export type PortfolioSummary = {
  assets: PortfolioAsset[];
  total: number;
  allocation: Record<string, number>;
};
