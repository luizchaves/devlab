import { supabase } from '../lib/supabase-client.js';

// #region get
/** Busca a taxa USDBRL mais recente registrada no banco. */
export async function getLatestUsdRate() {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('rate, rate_date')
    .eq('from_currency', 'USD')
    .eq('to_currency', 'BRL')
    .order('rate_date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    const fallback = { rate: 5.4, rate_date: new Date().toISOString().slice(0, 10) };
    return { data: fallback, rate: 5.4, rateDate: fallback.rate_date, error };
  }

  const rateNum = Number(data.rate);
  return {
    data: { rate: rateNum, rateDate: data.rate_date },
    rate: rateNum,
    rateDate: data.rate_date,
    error: null,
  };
}

/** Busca todas as taxas mensais de USDBRL e retorna um Map por mês 'YYYY-MM' -> rate. */
export async function listMonthlyUsdRates() {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('rate, rate_date')
    .eq('from_currency', 'USD')
    .eq('to_currency', 'BRL')
    .order('rate_date', { ascending: true });

  const map = new Map();
  let latestRate = 5.4;

  const items = (data ?? []).map((r) => {
    const monthKey = r.rate_date.slice(0, 7);
    const rateVal = Number(r.rate);
    map.set(monthKey, rateVal);
    latestRate = rateVal;
    return { month: monthKey, rate: rateVal, rateDate: r.rate_date };
  });

  return { data: items, ratesByMonth: map, latestRate, error };
}
// #endregion
