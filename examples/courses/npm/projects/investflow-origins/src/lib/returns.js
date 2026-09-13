// #region monthly
/** Retorno percentual de um mes: ganho sobre a base (patrimonio anterior + aportes). */
export function monthlyPct(row) {
  const base = Number(row.value) - Number(row.return_brl);
  return base ? Number(row.return_brl) / base : null;
}
// #endregion

// #region yearly
/**
 * O acumulado do ano e a COMPOSICAO dos percentuais, nao a soma: +10% seguido
 * de -10% deixa a carteira em 99%. Mes sem dado devolve null e nao entra.
 */
export function yearlyPct(rows) {
  const factors = rows.map(monthlyPct).filter((pct) => pct !== null);
  if (factors.length === 0) return null;
  return factors.reduce((acc, pct) => acc * (1 + pct), 1) - 1;
}
// #endregion

// #region group
/** Agrupa as linhas da view por ano, com 12 posicoes (null = mes sem dado), retorno anual e retorno global. */
export function matrixByYear(rows) {
  const years = new Map();

  // Ordena cronologicamente para calcular o acumulado global com precisao.
  const sortedRows = [...rows].sort((a, b) => a.month.localeCompare(b.month));

  for (const row of sortedRows) {
    const year = row.month.slice(0, 4);
    const monthIndex = Number(row.month.slice(5, 7)) - 1;
    if (!years.has(year)) years.set(year, { cells: Array(12).fill(null), rows: [] });
    years.get(year).cells[monthIndex] = row;
    years.get(year).rows.push(row);
  }

  const sortedYearsAsc = [...years.keys()].sort();
  const allRowsUpToYear = [];
  const globalStatsByYear = new Map();

  for (const yr of sortedYearsAsc) {
    const yrRows = years.get(yr).rows;
    allRowsUpToYear.push(...yrRows);
    const globalFactors = allRowsUpToYear.map(monthlyPct).filter((pct) => pct !== null);
    const globalPct =
      globalFactors.length === 0
        ? null
        : globalFactors.reduce((acc, pct) => acc * (1 + pct), 1) - 1;
    const globalBrl = allRowsUpToYear.reduce((sum, r) => sum + Number(r.return_brl), 0);
    globalStatsByYear.set(yr, { globalPct, globalBrl });
  }

  return [...years.entries()]
    .filter(([, { rows: yearRows }]) =>
      yearRows.some((r) => Number(r.value) > 0 || Number(r.return_brl) !== 0)
    )
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, { cells, rows: yearRows }]) => {
      const stats = globalStatsByYear.get(year) ?? { globalPct: null, globalBrl: 0 };
      return {
        year,
        cells,
        yearlyPct: yearlyPct(yearRows),
        globalPct: stats.globalPct,
        globalBrl: stats.globalBrl,
      };
    });
}
// #endregion

// #region evolution
/**
 * Deriva as linhas da matriz (mesma forma da view monthly_returns) a partir da
 * evolucao mensal de UM ativo. O fluxo do mes vem de `flowsByMonth` ('AAAA-MM'
 * -> aportes menos resgates, ja em reais); sem ele, usa a diferenca do
 * `invested` acumulado, que so e exata para ativo em real (em USD, a view
 * reconverte o acumulado a cada mes e o cambio viraria falso aporte).
 */
export function monthlyReturnsFromEvolution(rows, { flowsByMonth = null } = {}) {
  const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
  let prevValue = 0;
  let prevInvested = 0;
  return sorted.map((r) => {
    const value = Number(r.value);
    const invested = Number(r.invested);
    const netFlow = flowsByMonth
      ? (flowsByMonth.get(r.month.slice(0, 7)) ?? 0)
      : invested - prevInvested;
    const row = {
      month: r.month,
      value,
      net_flow: netFlow,
      return_brl: value - prevValue - netFlow,
    };
    prevValue = value;
    prevInvested = invested;
    return row;
  });
}

/** Soma os proventos do mes ao valor e ao retorno, marcando a linha com `dividend_brl`. */
export function withDividends(rows, dividendsByMonth) {
  return rows.map((row) => {
    const div = dividendsByMonth.get(row.month.slice(0, 7)) ?? 0;
    if (div === 0) return row;
    return {
      ...row,
      value: Number(row.value) + div,
      return_brl: Number(row.return_brl) + div,
      dividend_brl: div,
    };
  });
}
// #endregion
