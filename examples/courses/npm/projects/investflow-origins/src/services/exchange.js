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

// #region sync
/** Sincroniza taxas mensais e cotação atual do USDBRL do Yahoo Finance. */
export async function fetchAndSyncUsdRates() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/USDBRL=X?interval=1mo&range=5y';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (InvestFlow)' } });
    if (!res.ok) return { count: 0, error: `Yahoo respondeu status ${res.status}` };

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const timestamps = result?.timestamp ?? [];
    const closes = result?.indicators?.quote?.[0]?.close ?? [];
    const currentPrice = result?.meta?.regularMarketPrice;

    const rows = [];
    for (let i = 0; i < timestamps.length; i++) {
      const close = closes[i];
      if (close != null && !Number.isNaN(close) && close > 0) {
        const dateStr = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
        rows.push({
          from_currency: 'USD',
          to_currency: 'BRL',
          rate: Math.round(Number(close) * 10000) / 10000,
          rate_date: dateStr,
        });
      }
    }

    if (currentPrice != null && currentPrice > 0) {
      const todayStr = new Date().toISOString().slice(0, 10);
      rows.push({
        from_currency: 'USD',
        to_currency: 'BRL',
        rate: Math.round(Number(currentPrice) * 10000) / 10000,
        rate_date: todayStr,
      });
    }

    if (rows.length === 0) return { count: 0, message: 'Nenhuma cotação de USDBRL encontrada' };

    const { error } = await supabase
      .from('exchange_rates')
      .upsert(rows, { onConflict: 'from_currency,to_currency,rate_date' });

    if (error) return { count: 0, error: error.message };

    return { count: rows.length, items: rows };
  } catch (err) {
    return { count: 0, error: err.message };
  }
}
// #endregion
