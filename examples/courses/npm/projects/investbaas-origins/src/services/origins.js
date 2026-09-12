import { supabase } from '../lib/supabase-client.js';

// #region views
export function allocationByOrigin() {
  return supabase
    .from('allocation_by_origin')
    .select('asset_id, ticker, broker, category, issuer, value');
}

/** Sem asset_id: a carteira inteira. Com: so aquele ativo. */
export function portfolioEvolution(assetId = null) {
  let query = supabase
    .from('portfolio_evolution')
    .select('asset_id, month, invested, value')
    .order('month');
  if (assetId) query = query.eq('asset_id', assetId);
  return query;
}

/** Soma as linhas por mes: e o que transforma a serie por ativo na serie da carteira. */
export function totalsByMonth(rows) {
  const map = new Map();
  for (const r of rows) {
    const acc = map.get(r.month) ?? { month: r.month, invested: 0, value: 0 };
    acc.invested += Number(r.invested);
    acc.value += Number(r.value);
    map.set(r.month, acc);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export function toSeries(rows) {
  return [
    {
      name: 'Aportado',
      color: '#64748b',
      points: rows.map((r) => ({ month: r.month, value: r.invested })),
    },
    {
      name: 'Valor de mercado',
      color: '#059669',
      points: rows.map((r) => ({ month: r.month, value: r.value })),
    },
  ];
}
// #endregion
