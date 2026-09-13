import { isDividendEligible } from '@/core/dividends';
import { prisma } from './prisma';
import { HttpError } from './session';

// #region provider
export type DividendEventInput = { rate: number; exDate: string; paymentDate: string };

export interface DividendProvider {
  fetchDividends(ticker: string): Promise<DividendEventInput[]>;
}

/** Eventos fixos para testes: três para o HGLG11, nenhum para os demais. */
export const FAKE_DIVIDENDS: Record<string, DividendEventInput[]> = {
  HGLG11: [
    { rate: 1.5, exDate: '2026-01-05', paymentDate: '2026-01-15' },
    { rate: 1.1, exDate: '2026-02-27', paymentDate: '2026-03-14' },
    { rate: 1.1, exDate: '2026-03-31', paymentDate: '2026-04-15' },
  ],
};

export const fakeDividendProvider: DividendProvider = {
  async fetchDividends(ticker) {
    return FAKE_DIVIDENDS[ticker] ?? [];
  },
};

/**
 * Yahoo Finance: o endpoint de gráfico com `events=div` devolve os eventos
 * dos últimos cinco anos. A data ex vale também como pagamento, como no vanilla.
 */
export const yahooDividendProvider: DividendProvider = {
  async fetchDividends(ticker) {
    const candidates = ticker.includes('.') ? [ticker] : /\d/.test(ticker) ? [`${ticker}.SA`, ticker] : [ticker, `${ticker}.SA`];
    for (const symbol of candidates) {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?events=div&interval=1mo&range=5y`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (InvestFlow)' },
        signal: AbortSignal.timeout(8_000),
      });
      if (response.status === 404) continue;
      if (!response.ok) throw new Error(`Yahoo respondeu ${response.status}`);
      const data = (await response.json()) as { chart?: { result?: { events?: { dividends?: Record<string, { date?: number; amount?: number }> } }[] } };
      const result = data.chart?.result?.[0];
      if (!result) continue;
      return Object.entries(result.events?.dividends ?? {})
        .map(([key, item]) => {
          const date = new Date((item.date ?? Number(key)) * 1000).toISOString().slice(0, 10);
          return { rate: Math.round((item.amount ?? 0) * 10000) / 10000, exDate: date, paymentDate: date };
        })
        .filter((e) => e.rate > 0);
    }
    return [];
  },
};

export function selectDividendProvider(name = process.env.QUOTES_PROVIDER ?? 'yahoo'): DividendProvider {
  return name === 'fake' ? fakeDividendProvider : yahooDividendProvider;
}
// #endregion

// #region sync
export type SyncResult = { count: number; message?: string };

/**
 * Sincroniza o histórico de um ativo do dono: idempotente por (ativo, data
 * ex) (CA09.3); categoria sem proventos por cota recebe aviso (CA09.2);
 * provedor fora do ar devolve erro sem apagar o já gravado (CA09.4).
 */
export async function syncDividends(userId: string, assetId: string): Promise<SyncResult> {
  const asset = await prisma.asset.findFirst({ where: { id: assetId, userId }, select: { id: true, ticker: true, category: true } });
  if (!asset) throw new HttpError(404, 'Ativo não encontrado.');
  if (!isDividendEligible(asset.category)) return { count: 0, message: 'Categoria sem proventos por cota.' };

  let events: DividendEventInput[];
  try {
    events = await selectDividendProvider().fetchDividends(asset.ticker);
  } catch (error) {
    throw new HttpError(502, `Provedor indisponível: ${error instanceof Error ? error.message : 'erro'}`);
  }
  if (events.length === 0) return { count: 0, message: 'Nenhum provento encontrado no provedor.' };

  for (const event of events) {
    const exDate = new Date(`${event.exDate}T00:00:00Z`);
    await prisma.dividend.upsert({
      where: { assetId_exDate: { assetId: asset.id, exDate } },
      update: { rate: event.rate, paymentDate: new Date(`${event.paymentDate}T00:00:00Z`) },
      create: { assetId: asset.id, rate: event.rate, exDate, paymentDate: new Date(`${event.paymentDate}T00:00:00Z`) },
    });
  }
  return { count: events.length };
}
// #endregion
