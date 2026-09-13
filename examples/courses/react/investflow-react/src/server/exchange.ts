import { exchangeTable, type ExchangeRateRow, type ExchangeTable } from '@/core/exchange';
import { prisma } from './prisma';
import { isoDate } from './serialize';

// #region read
/** Linhas USD/BRL gravadas pela rodada de cotações; só o servidor escreve (CA10.3). */
export async function listExchangeRates(): Promise<ExchangeRateRow[]> {
  const rows = await prisma.exchangeRate.findMany({ where: { fromCurrency: 'USD', toCurrency: 'BRL' }, orderBy: { rateDate: 'asc' }, select: { rate: true, rateDate: true } });
  return rows.map((r) => ({ rate: Number(r.rate), rateDate: isoDate(r.rateDate) }));
}

export async function getExchangeTable(): Promise<ExchangeTable> {
  return exchangeTable(await listExchangeRates());
}
// #endregion
