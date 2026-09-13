// #region format
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const usd = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' });
const percent = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value: number, currency: 'BRL' | 'USD' = 'BRL') {
  return (currency === 'USD' ? usd : brl).format(value);
}

/** `ratio` é fração (0.125 = 12,50%). */
export function formatPercent(ratio: number) {
  return percent.format(ratio);
}

export function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  return date.toLocaleDateString('pt-BR');
}
// #endregion
