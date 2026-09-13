import type { AdminMetrics, ServiceCheck } from '@/core/admin';
import { summarize } from '@/core/portfolio';
import { prisma } from './prisma';
import { RECEIPTS_BUCKET, supabaseAdmin } from './storage';
import { toAssetDto } from './assets';

// #region metrics
/**
 * Só totais (RNF05): contas, patrimônio sob gestão e a última rodada de
 * cotações. Nenhum ticker, quantidade ou posição individual sai daqui.
 */
export async function adminMetrics(): Promise<AdminMetrics> {
  const [activeAccounts, assets, lastRun, latestRate] = await Promise.all([
    prisma.user.count(),
    prisma.asset.findMany({
      include: {
        broker: { select: { id: true, name: true } },
        transactions: { select: { id: true, type: true, quantity: true, price: true, transactionDate: true, yieldRate: true, receiptPath: true } },
        dividends: { select: { id: true, rate: true, exDate: true, paymentDate: true } },
      },
    }),
    prisma.quoteRun.findFirst({ orderBy: { ranAt: 'desc' }, select: { ranAt: true } }),
    prisma.exchangeRate.findFirst({ where: { fromCurrency: 'USD', toCurrency: 'BRL' }, orderBy: { rateDate: 'desc' }, select: { rate: true } }),
  ]);

  const usdRate = latestRate ? Number(latestRate.rate) : 1;
  const aum = assets.reduce((sum, row) => {
    const s = summarize(toAssetDto(row), { usdRate });
    return sum + Math.max(0, s.valueBRL ?? s.costBRL);
  }, 0);

  return { activeAccounts, aum, lastQuoteRun: lastRun?.ranAt.toISOString() ?? null };
}
// #endregion

// #region checks
/**
 * Cada indicador é uma chamada barata e independente; `allSettled` faz um
 * não derrubar os outros. `quotes` exige rodada nas últimas 24 h.
 */
export async function serviceChecks(): Promise<Record<ServiceCheck, boolean>> {
  const results = await Promise.allSettled([
    prisma.$queryRaw`select 1`.then(() => true),
    supabaseAdmin().storage.getBucket(RECEIPTS_BUCKET).then(({ data }) => Boolean(data)),
    prisma.quoteRun.findFirst({ orderBy: { ranAt: 'desc' } }).then((run) => Boolean(run) && Date.now() - run!.ranAt.getTime() < 24 * 60 * 60 * 1000),
    prisma.quoteRun.count().then((count) => count > 0),
  ]);
  const ok = (r: PromiseSettledResult<boolean>) => r.status === 'fulfilled' && r.value;
  return { database: ok(results[0]), storage: ok(results[1]), quotes: ok(results[2]), jobs: ok(results[3]) };
}
// #endregion
