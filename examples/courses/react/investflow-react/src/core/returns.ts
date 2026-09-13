import { BALANCE_CATEGORIES, costAt, positionAt, summarize, type AssetWithTransactions, type PortfolioTotals } from './portfolio';

// #region types
export type QuotePoint = { price: number; quoteDate: string };
export type AssetWithQuotes = AssetWithTransactions & { quotes: QuotePoint[] };

/** Uma linha por mês, a mesma forma da view `monthly_returns` do vanilla. */
export type MonthlyReturn = {
  /** Primeiro dia do mês, `AAAA-MM-01`. */
  month: string;
  value: number;
  netFlow: number;
  returnBrl: number;
  dividendBrl?: number;
};

/** O que `/api/analytics` devolve. */
export type AnalyticsSummary = {
  totals: PortfolioTotals;
  monthlyReturns: MonthlyReturn[];
  allocation: AllocationSlice[];
};

/** Taxa USD/BRL do mês; sem tabela de câmbio, tudo vale 1 (fase 9 troca isto). */
export type RateOf = (month: string) => number;
const oneRate: RateOf = () => 1;
// #endregion

const monthOf = (date: string) => date.slice(0, 7);
const monthEnd = (month: string) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
};

// #region monthly
/**
 * Série mensal da carteira a partir dos fatos: para cada mês com cotação, o
 * valor é a posição no fim do mês vezes a última cotação do mês; ativo por
 * saldo entra pelo custo acumulado. O fluxo é o líquido de compras e vendas;
 * `update` não é aporte. O retorno do mês é o valor menos o valor anterior
 * menos o fluxo. Mês sem cotação simplesmente não existe na série (CA06.1).
 */
export function monthlyReturns(assets: AssetWithQuotes[], { rateOf = oneRate }: { rateOf?: RateOf } = {}): MonthlyReturn[] {
  const months = new Set<string>();
  for (const asset of assets) {
    if (BALANCE_CATEGORIES.includes(asset.category)) {
      for (const t of asset.transactions) months.add(monthOf(t.transactionDate));
    } else {
      for (const q of asset.quotes) months.add(monthOf(q.quoteDate));
    }
  }

  const rows: MonthlyReturn[] = [];
  let previousValue = 0;

  for (const month of [...months].sort()) {
    const end = monthEnd(month);
    let value = 0;
    let netFlow = 0;

    for (const asset of assets) {
      const rate = asset.currency === 'USD' ? rateOf(month) : 1;

      if (BALANCE_CATEGORIES.includes(asset.category)) {
        value += costAt(asset.transactions, end) * rate;
      } else {
        const lastQuote = asset.quotes.filter((q) => monthOf(q.quoteDate) === month).sort((a, b) => a.quoteDate.localeCompare(b.quoteDate)).at(-1);
        if (lastQuote) value += positionAt(asset.transactions, end) * lastQuote.price * rate;
      }

      for (const t of asset.transactions) {
        if (monthOf(t.transactionDate) !== month || t.type === 'update') continue;
        netFlow += (t.type === 'buy' ? 1 : -1) * t.quantity * t.price * rate;
      }
    }

    rows.push({ month: `${month}-01`, value, netFlow, returnBrl: value - previousValue - netFlow });
    previousValue = value;
  }

  return rows;
}
// #endregion

// #region allocation
export type AllocationSlice = { category: AssetWithTransactions['category']; value: number; share: number };

/** Distribuição por classe: soma o valor atual (ou o custo, sem cotação) por categoria, do maior para o menor. */
export function allocationByCategory(assets: AssetWithTransactions[], { usdRate = 1 } = {}): AllocationSlice[] {
  const byCategory = new Map<AssetWithTransactions['category'], number>();
  for (const asset of assets) {
    const s = summarize(asset, { usdRate });
    const value = Math.max(0, s.valueBRL ?? s.costBRL);
    byCategory.set(asset.category, (byCategory.get(asset.category) ?? 0) + value);
  }
  const total = [...byCategory.values()].reduce((a, b) => a + b, 0);
  return [...byCategory.entries()]
    .map(([category, value]) => ({ category, value, share: total ? value / total : 0 }))
    .sort((a, b) => b.value - a.value);
}
// #endregion

// #region pct
/** Retorno percentual de um mês: ganho sobre a base (patrimônio anterior + aportes). */
export function monthlyPct(row: MonthlyReturn): number | null {
  const base = row.value - row.returnBrl;
  return base ? row.returnBrl / base : null;
}

/**
 * O acumulado é a COMPOSIÇÃO dos percentuais, não a soma: +10% seguido de
 * −10% deixa a carteira em 99%. Mês sem dado devolve `null` e não entra.
 */
export function compoundPct(rows: MonthlyReturn[]): number | null {
  const factors = rows.map(monthlyPct).filter((pct): pct is number => pct !== null);
  if (factors.length === 0) return null;
  return factors.reduce((acc, pct) => acc * (1 + pct), 1) - 1;
}
// #endregion

// #region matrix
export type YearRow = {
  year: string;
  /** 12 posições; `null` é mês sem dado, que vira traço, nunca 0% (CA06.1). */
  cells: (MonthlyReturn | null)[];
  yearlyPct: number | null;
  yearlyBrl: number;
  globalPct: number | null;
  globalBrl: number;
};

/** Agrupa a série por ano, do mais recente ao mais antigo, com o acumulado do ano e o global até aquele ano. */
export function matrixByYear(rows: MonthlyReturn[]): YearRow[] {
  const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
  const years = new Map<string, { cells: (MonthlyReturn | null)[]; rows: MonthlyReturn[] }>();

  for (const row of sorted) {
    const year = row.month.slice(0, 4);
    const monthIndex = Number(row.month.slice(5, 7)) - 1;
    if (!years.has(year)) years.set(year, { cells: Array(12).fill(null), rows: [] });
    years.get(year)!.cells[monthIndex] = row;
    years.get(year)!.rows.push(row);
  }

  const accumulated: MonthlyReturn[] = [];
  const result: YearRow[] = [];
  for (const [year, { cells, rows: yearRows }] of [...years.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    accumulated.push(...yearRows);
    if (!yearRows.some((r) => r.value > 0 || r.returnBrl !== 0)) continue;
    result.push({
      year,
      cells,
      yearlyPct: compoundPct(yearRows),
      yearlyBrl: yearRows.reduce((sum, r) => sum + r.returnBrl, 0),
      globalPct: compoundPct(accumulated),
      globalBrl: accumulated.reduce((sum, r) => sum + r.returnBrl, 0),
    });
  }
  return result.reverse();
}

/** Soma os proventos do mês ao valor e ao retorno, marcando a linha (fase 8). */
export function withDividends(rows: MonthlyReturn[], dividendsByMonth: Map<string, number>): MonthlyReturn[] {
  return rows.map((row) => {
    const dividend = dividendsByMonth.get(row.month.slice(0, 7)) ?? 0;
    return dividend === 0 ? row : { ...row, value: row.value + dividend, returnBrl: row.returnBrl + dividend, dividendBrl: dividend };
  });
}
// #endregion
