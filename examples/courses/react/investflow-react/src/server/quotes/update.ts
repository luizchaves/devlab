import { shouldFetchFromProvider } from '@/core/market-calendar';
import { QUOTED_CATEGORIES } from '@/core/portfolio';
import { collectQuotes, needsUsdConversion, priceInAssetCurrency, quoteSymbol, USD_BRL_SYMBOL, type RunSummary } from '@/core/quotes';
import { prisma } from '../prisma';
import { selectProvider } from './providers';

// #region update
/**
 * A rodada de cotações, antes uma Edge Function: escolhe os ativos cotáveis do
 * dono da sessão (ou só o `assetId` pedido, CA08.9), consulta o provedor
 * apenas para quem precisa (calendário de mercado), grava preço atual e
 * histórico idempotente por (ativo, dia) e registra o resumo (CA04.1).
 */
export async function updateQuotes(userId: string, { assetId, now = new Date() }: { assetId?: string; now?: Date } = {}): Promise<RunSummary> {
  const assets = await prisma.asset.findMany({
    where: { userId, category: { in: QUOTED_CATEGORIES }, ...(assetId ? { id: assetId } : {}) },
    select: {
      id: true,
      ticker: true,
      category: true,
      currency: true,
      quotes: { orderBy: { quoteDate: 'desc' }, take: 1, select: { price: true, quoteDate: true, createdAt: true } },
    },
  });

  // 1. Só consulta o provedor para quem ainda não tem o fechamento vigente.
  const toFetch = assets.filter((asset) => {
    const last = asset.quotes[0];
    return shouldFetchFromProvider(asset, last ? { price: Number(last.price), quoteDate: last.quoteDate.toISOString().slice(0, 10), updatedAt: last.createdAt } : null, now);
  });

  const symbols = [...new Set(toFetch.map(quoteSymbol))];
  const wantsFx = assets.some((a) => a.currency === 'USD' || needsUsdConversion(a));
  const { quotes: all, failed: allFailed } = await collectQuotes(selectProvider(), wantsFx ? [...symbols, USD_BRL_SYMBOL] : symbols);

  const fx = all.find((q) => q.ticker === USD_BRL_SYMBOL);
  const quotes = all.filter((q) => q.ticker !== USD_BRL_SYMBOL);
  const failed = allFailed.filter((f) => f.ticker !== USD_BRL_SYMBOL);

  // 2. A taxa do dia fica em `ExchangeRate`, idempotente por (par, data) (CA10.13).
  if (fx) {
    const rateDate = new Date(`${fx.quoteDate}T00:00:00Z`);
    await prisma.exchangeRate.upsert({
      where: { fromCurrency_toCurrency_rateDate: { fromCurrency: 'USD', toCurrency: 'BRL', rateDate } },
      update: { rate: fx.price },
      create: { fromCurrency: 'USD', toCurrency: 'BRL', rate: fx.price, rateDate },
    });
  }

  // 3. Preço atual e histórico, uma linha por ativo e dia.
  const updated = new Set<string>();
  for (const quote of quotes) {
    for (const asset of toFetch.filter((a) => quoteSymbol(a) === quote.ticker)) {
      const price = priceInAssetCurrency(asset, quote.price, fx?.price);
      if (price == null) {
        failed.push({ ticker: quote.ticker, reason: 'provider_error' });
        continue;
      }
      const quoteDate = new Date(`${quote.quoteDate}T00:00:00Z`);
      await prisma.$transaction([
        prisma.asset.update({ where: { id: asset.id }, data: { currentPrice: price } }),
        prisma.quote.upsert({
          where: { assetId_quoteDate: { assetId: asset.id, quoteDate } },
          update: { price },
          create: { assetId: asset.id, price, quoteDate },
        }),
      ]);
      updated.add(quote.ticker);
    }
  }

  // 4. O resumo operacional, gravado e devolvido.
  const summary: RunSummary = { ranAt: now.toISOString(), requested: new Set(assets.map(quoteSymbol)).size, updated: updated.size, failed };
  await prisma.quoteRun.create({ data: { ranAt: now, requested: summary.requested, updated: summary.updated, failed } });
  return summary;
}
// #endregion
