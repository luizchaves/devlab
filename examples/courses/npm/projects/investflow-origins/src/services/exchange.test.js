import { beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
const single = vi.fn();
const order = vi.fn();
const query = {
  select: vi.fn(() => query),
  eq: vi.fn(() => query),
  order: vi.fn((...args) => {
    order(...args);
    return query;
  }),
  limit: vi.fn(() => query),
  single,
};
const from = vi.fn(() => query);
vi.mock('../lib/supabase-client.js', () => ({ supabase: { from } }));

const { getLatestUsdRate, listMonthlyUsdRates } = await import('./exchange.js');
// #endregion

describe('exchange service (TK10-3)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('CA10.4: devolve a taxa mais recente como numero', async () => {
    single.mockResolvedValue({ data: { rate: '5.1234', rate_date: '2026-09-12' }, error: null });

    const { rate, rateDate, error } = await getLatestUsdRate();

    expect(from).toHaveBeenCalledWith('exchange_rates');
    expect(order).toHaveBeenCalledWith('rate_date', { ascending: false });
    expect(rate).toBe(5.1234);
    expect(rateDate).toBe('2026-09-12');
    expect(error).toBeNull();
  });

  it('CA10.5: sem nenhuma taxa gravada, devolve a taxa de referencia e o erro', async () => {
    const notFound = { code: 'PGRST116', message: 'no rows' };
    single.mockResolvedValue({ data: null, error: notFound });

    const { rate, error } = await getLatestUsdRate();

    expect(rate).toBe(5.4);
    expect(error).toBe(notFound);
  });

  it('CA10.6: listMonthlyUsdRates indexa a taxa por mes AAAA-MM', async () => {
    // A ultima chamada da cadeia e order(); ela resolve com as linhas.
    query.order.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          { rate: '5', rate_date: '2026-01-15' },
          { rate: '6', rate_date: '2026-02-15' },
        ],
        error: null,
      })
    );

    const { ratesByMonth, latestRate } = await listMonthlyUsdRates();

    expect(ratesByMonth.get('2026-01')).toBe(5);
    expect(ratesByMonth.get('2026-02')).toBe(6);
    expect(latestRate).toBe(6);
  });
});
