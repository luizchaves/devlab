import { supabase } from '../lib/supabase-client.js';

// #region views
export function allocationByOrigin() {
  return supabase
    .from('allocation_by_origin')
    .select('asset_id, ticker, broker, category, issuer, value');
}

/** Sem asset_id: a carteira inteira (paginada). Com: so aquele ativo. */
export async function portfolioEvolution(assetId = null) {
  if (assetId) {
    return supabase
      .from('portfolio_evolution')
      .select('asset_id, month, invested, value')
      .eq('asset_id', assetId)
      .order('month');
  }

  const all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('portfolio_evolution')
      .select('asset_id, month, invested, value')
      .order('month')
      .range(from, from + pageSize - 1);
    if (error) return { data: all, error };
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return { data: all, error: null };
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
  const list = [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
  const firstActiveIdx = list.findIndex(
    (r) => Math.abs(r.invested) > 0.000001 || Math.abs(r.value) > 0.000001
  );
  if (firstActiveIdx > 0) {
    return list.slice(firstActiveIdx);
  }
  return list;
}

export function toSeries(rows, { includeDividends = false } = {}) {
  const series = [
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

  if (includeDividends) {
    series.push({
      name: 'Valor + Proventos',
      color: '#8b5cf6',
      points: rows.map((r) => ({
        month: r.month,
        value: r.value != null ? r.value + (Number(r.dividendsAcc) || 0) : null,
      })),
    });
  }

  return series;
}

/** Preenche todos os meses intermediários de forma contínua mantendo a última posição/valor. */
export function fillContinuousMonths(rows) {
  if (!rows || rows.length === 0) return [];
  const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
  const hasDividendsAcc = sorted.some((r) => r.dividendsAcc != null);
  const [startYear, startMonth] = sorted[0].month.split('-').map(Number);
  const [endYear, endMonth] = sorted[sorted.length - 1].month.split('-').map(Number);

  const rowMap = new Map(sorted.map((r) => [r.month.slice(0, 7), r]));
  const result = [];

  let curY = startYear;
  let curM = startMonth;
  let lastInvested = Number(sorted[0].invested);
  let lastValue = Number(sorted[0].value);
  let lastDividendsAcc = Number(sorted[0].dividendsAcc) || 0;

  while (curY < endYear || (curY === endYear && curM <= endMonth)) {
    const key = `${curY}-${String(curM).padStart(2, '0')}`;
    const fullDate = `${key}-01`;

    if (rowMap.has(key)) {
      const r = rowMap.get(key);
      lastInvested = Number(r.invested);
      lastValue = Number(r.value);
      if (r.dividendsAcc != null) {
        lastDividendsAcc = Number(r.dividendsAcc);
      }
    }

    const item = {
      month: fullDate,
      invested: lastInvested,
      value: lastValue,
    };
    if (hasDividendsAcc) {
      item.dividendsAcc = lastDividendsAcc;
    }

    result.push(item);

    curM += 1;
    if (curM > 12) {
      curM = 1;
      curY += 1;
    }
  }

  return result;
}

/** Anexa a cada linha de evolução o total de dividendos acumulados até aquele mês. */
export function attachCumulativeDividends(rows, receivedDividends) {
  if (!rows?.length) return [];
  const sortedDivs = [...(receivedDividends ?? [])].sort((a, b) =>
    a.paymentDate.localeCompare(b.paymentDate)
  );

  return rows.map((row) => {
    const monthKey = row.month.slice(0, 7);
    let dividendsAcc = 0;
    for (const d of sortedDivs) {
      if (d.paymentDate.slice(0, 7) <= monthKey) {
        dividendsAcc += Number(d.total);
      }
    }
    return {
      ...row,
      dividendsAcc,
    };
  });
}

/** Filtra apenas os meses em que houve compra/venda (movimentação). */
export function filterMovementMonths(rows, movementMonths = null) {
  if (!rows || rows.length === 0) return [];
  if (movementMonths instanceof Set || Array.isArray(movementMonths)) {
    const set = movementMonths instanceof Set ? movementMonths : new Set(movementMonths);
    return rows.filter((r) => set.has(r.month.slice(0, 7)));
  }
  return rows.filter((r, idx) => {
    if (idx === 0) return true;
    return Number(r.invested) !== Number(rows[idx - 1].invested);
  });
}
// #endregion
