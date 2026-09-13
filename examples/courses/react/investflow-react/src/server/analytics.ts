import { receivedDividends } from '@/core/dividends';
import { portfolioEvolution } from '@/core/evolution';
import { totals } from '@/core/portfolio';
import { allocationByCategory, monthlyReturns, type AnalyticsSummary, type AssetWithQuotes } from '@/core/returns';
import { allocationByOrigin } from '@/core/origins';
import { listAssets } from './assets';
import { getExchangeTable } from './exchange';
import { prisma } from './prisma';
import { isoDate } from './serialize';

// #region assets-with-quotes
/** A carteira do dono com o histórico de cotações, o que a série mensal precisa. */
export async function listAssetsWithQuotes(userId: string): Promise<AssetWithQuotes[]> {
  const assets = await listAssets(userId);
  const quotes = await prisma.quote.findMany({
    where: { asset: { userId } },
    select: { assetId: true, price: true, quoteDate: true },
    orderBy: { quoteDate: 'asc' },
  });

  const byAsset = new Map<string, AssetWithQuotes['quotes']>();
  for (const q of quotes) {
    const list = byAsset.get(q.assetId) ?? [];
    list.push({ price: Number(q.price), quoteDate: isoDate(q.quoteDate) });
    byAsset.set(q.assetId, list);
  }
  return assets.map((asset) => ({ ...asset, quotes: byAsset.get(asset.id) ?? [] }));
}
// #endregion

// #region summary
/** Tudo que `/analytics` mostra, calculado no servidor a partir dos fatos do dono (CA06.3). */
export async function getAnalytics(userId: string): Promise<AnalyticsSummary> {
  const [assets, fx] = await Promise.all([listAssetsWithQuotes(userId), getExchangeTable()]);
  // Ativo em dólar entra pela taxa do mês nas séries e pela mais recente nos totais (CA10.4, CA10.8).
  return {
    totals: totals(assets, { usdRate: fx.latest }),
    monthlyReturns: monthlyReturns(assets, { rateOf: fx.rateOf }),
    allocation: allocationByCategory(assets, { usdRate: fx.latest }),
    evolution: portfolioEvolution(assets, { rateOf: fx.rateOf }),
    movementMonths: movementMonthsOf(assets),
    dividends: assets.flatMap((asset) => receivedDividends(asset, { rateOf: fx.rateOf })),
  };
}

export function movementMonthsOf(assets: AssetWithQuotes[]): string[] {
  const months = new Set<string>();
  for (const asset of assets) for (const t of asset.transactions) if (t.type !== 'update') months.add(t.transactionDate.slice(0, 7));
  return [...months].sort();
}

// #region asset-evolution
/** Evolução de um único ativo, para a tela dele (CA07.5). Ativo alheio: `null`. */
export async function getAssetEvolution(userId: string, assetId: string) {
  const asset = (await listAssetsWithQuotes(userId)).find((a) => a.id === assetId);
  if (!asset) return null;
  const fx = await getExchangeTable();
  // `evolutionNative` fica na moeda do ativo: é a série que o botão US$ mostra (CA10.9).
  return { evolution: portfolioEvolution([asset], { rateOf: fx.rateOf }), evolutionNative: portfolioEvolution([asset]), movementMonths: movementMonthsOf([asset]) };
}
// #endregion

// #region origins
export async function getOrigins(userId: string) {
  const [assets, fx] = await Promise.all([listAssets(userId), getExchangeTable()]);
  return allocationByOrigin(assets, { usdRate: fx.latest });
}
// #endregion
// #endregion
