import type { AssetCategory, AssetWithTransactions, TransactionFact } from './portfolio';
import { summarize } from './portfolio';

// #region types
/** Um evento de provento como o cliente o vê. */
export type DividendEvent = { id: string; rate: number; exDate: string; paymentDate: string };

/** Provento efetivamente recebido: posição com direito × valor por cota. */
export type ReceivedDividend = {
  id: string;
  assetId: string;
  ticker: string;
  exDate: string;
  paymentDate: string;
  rate: number;
  quantity: number;
  total: number;
  /** Em reais, pela taxa do mês do pagamento quando o ativo é em dólar. */
  totalBRL: number;
};

export type AssetWithDividends = AssetWithTransactions & { dividends: DividendEvent[] };

const ELIGIBLE = new Set<AssetCategory>(['acoes', 'fiis', 'etfs', 'fi_infra']);

/** Só ações, FII, ETF e FI-Infra têm proventos por cota (CA09.2). */
export function isDividendEligible(category: AssetCategory) {
  return ELIGIBLE.has(category);
}
// #endregion

// #region received
/**
 * Tem direito ao provento a posição comprada antes da data ex: compra na data
 * ex não recebe, e venda na data ex ainda recebe (CA09.5). Mais recente primeiro.
 */
export function receivedDividends(asset: AssetWithDividends, { rateOf = () => 1 }: { rateOf?: (month: string) => number } = {}): ReceivedDividend[] {
  const items: ReceivedDividend[] = [];
  for (const event of asset.dividends) {
    if (event.rate <= 0) continue;
    const position = positionBefore(asset.transactions, event.exDate);
    if (position <= 0.000001) continue;
    // Dinheiro arredonda a centavos: 100 × 1,1 é 110, não 110,00000000000001.
    const total = cents(position * event.rate);
    const rate = asset.currency === 'USD' ? rateOf(event.paymentDate.slice(0, 7)) : 1;
    items.push({ id: event.id, assetId: asset.id, ticker: asset.ticker, exDate: event.exDate, paymentDate: event.paymentDate, rate: event.rate, quantity: position, total, totalBRL: cents(total * rate) });
  }
  return items.sort((a, b) => b.exDate.localeCompare(a.exDate));
}

const cents = (value: number) => Math.round(value * 100) / 100;

function positionBefore(transactions: TransactionFact[], date: string) {
  let quantity = 0;
  for (const t of [...transactions].sort((a, b) => a.transactionDate.localeCompare(b.transactionDate))) {
    if (t.transactionDate >= date) continue;
    if (t.type === 'update') quantity = t.quantity;
    else quantity += t.type === 'buy' ? t.quantity : -t.quantity;
  }
  return quantity;
}
// #endregion

// #region totals
/** Yield on cost: proventos recebidos sobre o custo. */
export function yieldOnCost(totalDividends: number, cost: number): number | null {
  return cost > 0 && totalDividends > 0 ? totalDividends / cost : null;
}

/** Retorno total = valorização + realizado + proventos, sobre o custo (CA09.8). */
export function totalReturn({ cost, value, realized, dividends }: { cost: number; value: number | null; realized: number; dividends: number }) {
  if (value == null || cost <= 0) return { netGain: realized + dividends, returnPct: null };
  const netGain = cents(value - cost + realized + dividends);
  return { netGain, returnPct: netGain / cost };
}

/** Resumo da posição com os proventos somados, para o rodapé "Com proventos" (CA09.9). */
export function summarizeWithDividends(asset: AssetWithDividends, { usdRate = 1, rateOf }: { usdRate?: number; rateOf?: (month: string) => number } = {}) {
  const s = summarize(asset, { usdRate });
  const dividends = receivedDividends(asset, { rateOf }).reduce((sum, d) => sum + d.totalBRL, 0);
  return { ...s, dividendsBRL: dividends, ...totalReturn({ cost: s.costBRL, value: s.valueBRL, realized: s.realizedBRL, dividends }) };
}

/** Proventos por mês de pagamento (`AAAA-MM` → total em reais), para a matriz (CA09.10). */
export function dividendsByMonth(items: ReceivedDividend[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const d of items) {
    const key = d.paymentDate.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + d.totalBRL);
  }
  return map;
}

/** Proventos acumulados até cada mês, para a série "Valor + Proventos" (CA09.11). */
export function cumulativeDividends(items: ReceivedDividend[], month: string): number {
  return items.filter((d) => d.paymentDate.slice(0, 7) <= month).reduce((sum, d) => sum + d.totalBRL, 0);
}
// #endregion

// #region page
export type DividendsSummary = {
  total: number;
  lastTwelveMonths: number;
  monthlyAverage: number;
  averageYieldOnCost: number | null;
  count: number;
};

/** KPIs da página de proventos (CA09.6). `now` fixa "últimos 12 meses" nos testes. */
export function dividendsSummary(assets: AssetWithDividends[], items: ReceivedDividend[], now = new Date()): DividendsSummary {
  const total = items.reduce((sum, d) => sum + d.totalBRL, 0);
  const cutoff = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), 1)).toISOString().slice(0, 7);
  const lastTwelveMonths = items.filter((d) => d.paymentDate.slice(0, 7) >= cutoff).reduce((sum, d) => sum + d.totalBRL, 0);
  const months = new Set(items.map((d) => d.paymentDate.slice(0, 7))).size;
  const cost = assets.filter((a) => items.some((d) => d.assetId === a.id)).reduce((sum, a) => sum + summarize(a).costBRL, 0);
  return { total, lastTwelveMonths, monthlyAverage: months ? total / months : 0, averageYieldOnCost: yieldOnCost(total, cost), count: items.length };
}

export type DividendsMatrix = { years: number[]; matrix: Record<number, number[]>; yearTotals: Record<number, number>; monthTotals: number[]; grandTotal: number };

/** Matriz ano × mês pelo mês de pagamento; soma o mesmo total do extrato (CA09.7). */
export function buildDividendsMatrix(items: ReceivedDividend[]): DividendsMatrix {
  const matrix: Record<number, number[]> = {};
  const yearTotals: Record<number, number> = {};
  const monthTotals = Array(12).fill(0) as number[];
  let grandTotal = 0;
  for (const d of items) {
    const year = Number(d.paymentDate.slice(0, 4));
    const month = Number(d.paymentDate.slice(5, 7)) - 1;
    matrix[year] ??= Array(12).fill(0);
    yearTotals[year] ??= 0;
    matrix[year][month] += d.totalBRL;
    yearTotals[year] += d.totalBRL;
    monthTotals[month] += d.totalBRL;
    grandTotal += d.totalBRL;
  }
  return { years: Object.keys(matrix).map(Number).sort((a, b) => b - a), matrix, yearTotals, monthTotals, grandTotal };
}

/** Maiores pagadores: total por ativo, do maior para o menor. */
export function topPayers(items: ReceivedDividend[]): { assetId: string; ticker: string; total: number }[] {
  const map = new Map<string, { assetId: string; ticker: string; total: number }>();
  for (const d of items) {
    const acc = map.get(d.assetId) ?? { assetId: d.assetId, ticker: d.ticker, total: 0 };
    acc.total += d.totalBRL;
    map.set(d.assetId, acc);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}
// #endregion
