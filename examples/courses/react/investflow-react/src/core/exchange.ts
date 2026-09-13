// #region types
export type ExchangeRateRow = { rateDate: string; rate: number };

/** Taxa de referência usada quando não há nenhuma gravada (CA10.5). */
export const FALLBACK_USD_RATE = 5.4;

export type ExchangeTable = {
  /** Taxa mais recente. */
  latest: number;
  latestDate: string | null;
  /** Taxa do mês (`AAAA-MM`): a última do mês ou a anterior mais próxima. */
  rateOf: (month: string) => number;
  /** Taxa do dia ou a última anterior; sem anterior, a primeira; sem nada, a referência (CA10.3). */
  rateAt: (date: string) => number;
  rows: ExchangeRateRow[];
};
// #endregion

// #region table
/** Monta as funções de consulta a partir das linhas USD/BRL ordenadas por data. */
export function exchangeTable(rows: ExchangeRateRow[]): ExchangeTable {
  const sorted = [...rows].sort((a, b) => a.rateDate.localeCompare(b.rateDate));
  const latest = sorted.at(-1);

  const rateAt = (date: string) => {
    if (sorted.length === 0) return FALLBACK_USD_RATE;
    const before = sorted.filter((r) => r.rateDate <= date).at(-1);
    return (before ?? sorted[0]).rate;
  };

  // O mês inteiro vale a taxa vigente no último dia dele.
  const rateOf = (month: string) => rateAt(`${month}-31`);

  return { latest: latest?.rate ?? FALLBACK_USD_RATE, latestDate: latest?.rateDate ?? null, rateOf, rateAt, rows: sorted };
}
// #endregion
