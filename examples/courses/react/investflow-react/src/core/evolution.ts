import { BALANCE_CATEGORIES, costAt, positionAt, type TransactionFact } from './portfolio';
import type { AssetWithQuotes, RateOf } from './returns';

// #region rows
/** Uma linha por ativo e mês, como a view `portfolio_evolution`: aportado acumulado e valor. */
export type EvolutionRow = { assetId: string; month: string; invested: number; value: number };
export type MonthPoint = { month: string; invested: number; value: number; dividendsAcc?: number };

const monthOf = (date: string) => date.slice(0, 7);
const monthEnd = (month: string) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
};

const investedUpTo = (transactions: TransactionFact[], date: string) =>
  transactions.filter((t) => t.transactionDate <= date && t.type !== 'update').reduce((sum, t) => sum + (t.type === 'buy' ? 1 : -1) * t.quantity * t.price, 0);

/**
 * Evolução mensal por ativo: nos meses com cotação, o aportado acumulado
 * (compras menos vendas) e a posição × última cotação do mês. Posição zerada
 * devolve aportado 0, como a view. Ativo por saldo entra pelo custo (CA07.4, CA07.6).
 */
export function portfolioEvolution(assets: AssetWithQuotes[], { rateOf = () => 1 }: { rateOf?: RateOf } = {}): EvolutionRow[] {
  // Os meses da carteira: cotações dos ativos cotados e lançamentos dos ativos por saldo.
  const months = new Set<string>();
  for (const asset of assets) {
    const dates = BALANCE_CATEGORIES.includes(asset.category) ? asset.transactions.map((t) => t.transactionDate) : asset.quotes.map((q) => q.quoteDate);
    for (const d of dates) months.add(monthOf(d));
  }

  const rows: EvolutionRow[] = [];
  for (const month of [...months].sort()) {
    const end = monthEnd(month);
    for (const asset of assets) {
      const rate = asset.currency === 'USD' ? rateOf(month) : 1;

      if (BALANCE_CATEGORIES.includes(asset.category)) {
        // Ativo por saldo acompanha a carteira desde o primeiro lançamento, pelo custo acumulado.
        const first = asset.transactions.map((t) => monthOf(t.transactionDate)).sort()[0];
        if (!first || first > month) continue;
        const cost = costAt(asset.transactions, end);
        rows.push({ assetId: asset.id, month: `${month}-01`, invested: cost * rate, value: cost * rate });
        continue;
      }

      const lastQuote = asset.quotes.filter((q) => monthOf(q.quoteDate) === month).sort((a, b) => a.quoteDate.localeCompare(b.quoteDate)).at(-1);
      if (!lastQuote) continue;
      const position = positionAt(asset.transactions, end);
      rows.push({
        assetId: asset.id,
        month: `${month}-01`,
        invested: position <= 0.000001 ? 0 : investedUpTo(asset.transactions, end) * rate,
        value: position * lastQuote.price * rate,
      });
    }
  }
  return rows;
}
// #endregion

// #region totals
/** Soma as linhas por mês: transforma a série por ativo na série da carteira. */
export function totalsByMonth(rows: EvolutionRow[]): MonthPoint[] {
  const map = new Map<string, MonthPoint>();
  for (const r of rows) {
    const acc = map.get(r.month) ?? { month: r.month, invested: 0, value: 0 };
    acc.invested += r.invested;
    acc.value += r.value;
    map.set(r.month, acc);
  }
  const list = [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
  const firstActive = list.findIndex((r) => Math.abs(r.invested) > 0.000001 || Math.abs(r.value) > 0.000001);
  return firstActive > 0 ? list.slice(firstActive) : list;
}
// #endregion

// #region timeline
/** Modo contínuo: preenche os meses intermediários repetindo a última posição e o último valor (CA07.7). */
export function fillContinuousMonths(rows: MonthPoint[]): MonthPoint[] {
  if (rows.length === 0) return [];
  const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
  const byMonth = new Map(sorted.map((r) => [monthOf(r.month), r]));
  const [startY, startM] = sorted[0].month.split('-').map(Number);
  const [endY, endM] = sorted[sorted.length - 1].month.split('-').map(Number);

  const result: MonthPoint[] = [];
  let last = sorted[0];
  for (let y = startY, m = startM; y < endY || (y === endY && m <= endM); m === 12 ? ((y += 1), (m = 1)) : (m += 1)) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    last = byMonth.get(key) ?? last;
    result.push({ ...last, month: `${key}-01` });
  }
  return result;
}

/** Modo eventos: só os meses com aporte ou resgate (ou, sem a lista, com variação do aportado). */
export function filterMovementMonths(rows: MonthPoint[], movementMonths?: Iterable<string>): MonthPoint[] {
  if (rows.length === 0) return [];
  if (movementMonths) {
    const set = new Set(movementMonths);
    return rows.filter((r) => set.has(monthOf(r.month)));
  }
  return rows.filter((r, i) => i === 0 || r.invested !== rows[i - 1].invested);
}

export type TimelineRange = 'all' | '2y' | '1y';
export type TimelineMode = 'continuous' | 'events';

/** Janela de tempo (CA07.8): recorta as duas séries a partir de hoje. */
export function applyRange(rows: MonthPoint[], range: TimelineRange, now = new Date()): MonthPoint[] {
  if (range === 'all') return rows;
  const from = new Date(Date.UTC(now.getUTCFullYear() - (range === '2y' ? 2 : 1), now.getUTCMonth(), 1)).toISOString().slice(0, 7);
  return rows.filter((r) => monthOf(r.month) >= from);
}

/** Monta a linha do tempo no modo e na janela pedidos. */
export function timeline(points: MonthPoint[], { mode, range, movementMonths, now }: { mode: TimelineMode; range: TimelineRange; movementMonths?: Iterable<string>; now?: Date }) {
  const shaped = mode === 'continuous' ? fillContinuousMonths(points) : filterMovementMonths(points, movementMonths);
  return applyRange(shaped, range, now);
}
// #endregion

// #region series
export type Series = { name: string; color: string; points: { month: string; value: number | null }[] };

export function toSeries(rows: MonthPoint[], { includeDividends = false } = {}): Series[] {
  const series: Series[] = [
    { name: 'Aportado', color: '#64748b', points: rows.map((r) => ({ month: r.month, value: r.invested })) },
    { name: 'Valor de mercado', color: '#059669', points: rows.map((r) => ({ month: r.month, value: r.value })) },
  ];
  if (includeDividends) {
    series.push({ name: 'Valor + Proventos', color: '#8b5cf6', points: rows.map((r) => ({ month: r.month, value: r.value + (r.dividendsAcc ?? 0) })) });
  }
  return series;
}
// #endregion
