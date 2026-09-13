import { isDividendEligibleAsset } from '../lib/dividends.js';
import { supabase } from '../lib/supabase-client.js';

// #region get
/** Busca os proventos registrados no banco para o ativo informado. */
export function getDividends(assetId) {
  return supabase
    .from('dividends_history')
    .select('id, asset_id, rate, ex_date, payment_date, created_at')
    .eq('asset_id', assetId)
    .order('ex_date', { ascending: false });
}

/** Busca todos os proventos acessíveis pelo usuário logado com paginação transparente. */
export async function listAllDividends() {
  const all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('dividends_history')
      .select('id, asset_id, rate, ex_date, payment_date')
      .order('payment_date', { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) return { data: all, error };
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return { data: all, error: null };
}
// #endregion

// #region sync
/**
 * Crawler de dividendos: busca o histórico de eventos de proventos no Yahoo Finance
 * e grava em dividends_history de forma idempotente.
 */
export async function fetchAndSyncDividends(asset) {
  if (!asset?.id || !asset?.ticker) return { count: 0, error: 'Ativo inválido' };

  if (!isDividendEligibleAsset(asset)) {
    return { count: 0, message: 'Categoria não possui proventos por cota' };
  }

  const rawTicker = asset.ticker.trim().toUpperCase();
  const candidates = rawTicker.includes('.')
    ? [rawTicker]
    : /\d/.test(rawTicker)
      ? [`${rawTicker}.SA`, rawTicker]
      : [rawTicker, `${rawTicker}.SA`];

  let rawDividends = null;
  let lastError = null;

  for (const symbol of candidates) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?events=div&interval=1mo&range=5y`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (InvestFlow)' } });
      if (res.status === 404) continue;
      if (!res.ok) {
        lastError = `Yahoo respondeu status ${res.status}`;
        continue;
      }

      const data = await res.json();
      const divs = data?.chart?.result?.[0]?.events?.dividends;
      if (divs && Object.keys(divs).length > 0) {
        rawDividends = divs;
        break;
      }
      if (data?.chart?.result?.[0]) {
        rawDividends = {};
        break;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  if (!rawDividends) {
    if (lastError) return { count: 0, error: lastError };
    return { count: 0, message: 'Nenhum provento encontrado no provedor' };
  }

  const rowsToUpsert = [];
  for (const key of Object.keys(rawDividends)) {
    const item = rawDividends[key];
    const timestamp = item.date || Number(key);
    const dateStr = new Date(timestamp * 1000).toISOString().slice(0, 10);
    const rate = Number(item.amount);

    if (rate > 0 && dateStr) {
      rowsToUpsert.push({
        asset_id: asset.id,
        rate: Math.round(rate * 10000) / 10000,
        ex_date: dateStr,
        payment_date: dateStr,
      });
    }
  }

  if (rowsToUpsert.length === 0) {
    return { count: 0, message: 'Sem eventos válidos' };
  }

  const { error } = await supabase
    .from('dividends_history')
    .upsert(rowsToUpsert, { onConflict: 'asset_id,ex_date' });

  if (error) {
    return { count: 0, error: error.message };
  }

  return { count: rowsToUpsert.length, items: rowsToUpsert };
}
// #endregion
