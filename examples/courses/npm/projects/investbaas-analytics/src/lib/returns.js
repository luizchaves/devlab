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
/** Agrupa as linhas da view por ano, com 12 posicoes (null = mes sem dado). */
export function matrixByYear(rows) {
  const years = new Map();

  for (const row of rows) {
    const year = row.month.slice(0, 4);
    const monthIndex = Number(row.month.slice(5, 7)) - 1;
    if (!years.has(year)) years.set(year, { cells: Array(12).fill(null), rows: [] });
    years.get(year).cells[monthIndex] = row;
    years.get(year).rows.push(row);
  }

  return [...years.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, { cells, rows: yearRows }]) => ({ year, cells, yearlyPct: yearlyPct(yearRows) }));
}
// #endregion
