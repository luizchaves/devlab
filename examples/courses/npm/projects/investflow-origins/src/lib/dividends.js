// #region calculate
const DIVIDEND_ELIGIBLE_CATEGORIES = new Set(['acoes', 'fiis', 'etfs', 'fi_infra']);

export function isDividendEligibleCategory(category) {
  return DIVIDEND_ELIGIBLE_CATEGORIES.has(category);
}

export function isDividendEligibleAsset(asset) {
  return isDividendEligibleCategory(asset?.category);
}

/**
 * Calcula os proventos/dividendos recebidos por um investidor a partir do
 * histórico de transações e da tabela de eventos de proventos daquele ativo.
 *
 * O direito ao dividendo é garantido para quem comprou até a Data Com (ou seja,
 * estritamente antes da Data Ex / Ex-Dividendo: transaction_date < ex_date).
 * Vendas realizadas na Data Ex ou após mantêm o direito ao dividendo.
 */
export function calculateDividends(
  transactions,
  dividendsHistory,
  { isUsd = false, rateMap = {}, latestRate = 1 } = {}
) {
  if (!transactions?.length || !dividendsHistory?.length) {
    return {
      items: [],
      totalReceived: 0,
      count: 0,
      yieldOnCost: null,
    };
  }

  const sortedTx = [...transactions].sort((a, b) =>
    a.transaction_date.localeCompare(b.transaction_date)
  );

  const sortedDivs = [...dividendsHistory].sort((a, b) => {
    const dateA = a.ex_date || a.payment_date;
    const dateB = b.ex_date || b.payment_date;
    return dateA.localeCompare(dateB);
  });

  const items = [];
  let totalReceived = 0;

  for (const div of sortedDivs) {
    const exDate = div.ex_date || div.payment_date;
    const paymentDate = div.payment_date || div.ex_date;
    const rate = Number(div.rate);

    // Posição com direito: transações realizadas antes da Data Ex
    let positionAtEx = 0;
    for (const t of sortedTx) {
      if (t.transaction_date < exDate) {
        const qty = Number(t.quantity);
        positionAtEx += t.type === 'buy' ? qty : -qty;
      }
    }

    if (positionAtEx > 0.000001 && rate > 0) {
      const total = positionAtEx * rate;
      const monthKey = (paymentDate || exDate || '').slice(0, 7);
      const rateVal =
        typeof rateMap?.get === 'function' ? rateMap.get(monthKey) : rateMap?.[monthKey];
      const usdRate = isUsd ? Number(rateVal) || Number(latestRate) || 1 : 1;
      const totalBRL = isUsd ? total * usdRate : total;
      totalReceived += totalBRL;
      items.push({
        id: div.id,
        exDate,
        paymentDate,
        rate,
        quantity: positionAtEx,
        total: isUsd ? totalBRL : total,
        totalUSD: isUsd ? total : null,
        totalBRL,
        usdRate: isUsd ? usdRate : null,
        isUsd,
      });
    }
  }

  // Ordena os itens do mais recente para o mais antigo para exibição em tabela
  items.sort((a, b) => (b.exDate || b.paymentDate).localeCompare(a.exDate || a.paymentDate));

  return {
    items,
    totalReceived,
    count: items.length,
  };
}
// #endregion

// #region yoc
/** Calcula o Dividend Yield sobre o custo (YoC) acumulado ou anualizado. */
export function dividendYieldOnCost(totalDividends, cost) {
  if (!cost || cost <= 0 || !totalDividends || totalDividends <= 0) return null;
  return totalDividends / cost;
}

/** Calcula o Retorno Total líquido e percentual somando valorização, realizado e proventos. */
export function totalReturn({ cost = 0, value = null, realized = 0, totalDividends = 0 } = {}) {
  if (value == null || cost <= 0) {
    const netGain = (realized || 0) + (totalDividends || 0);
    return {
      netGain,
      returnPct: null,
    };
  }

  const netGain = value - cost + (realized || 0) + (totalDividends || 0);
  const returnPct = netGain / cost;

  return {
    netGain,
    returnPct,
  };
}
// #endregion

// #region matrix
/**
 * Agrupa os proventos recebidos em uma matriz anual x mensal (Anos nas linhas, Meses nas colunas).
 * Permite a comparação vertical (mesmo mês entre anos diferentes) e horizontal (progressão dos meses do ano).
 *
 * @param {Array<{ paymentDate?: string, exDate?: string, total: number }>} items
 * @returns {{
 *   years: number[],
 *   months: string[],
 *   matrix: Record<number, number[]>,
 *   yearTotals: Record<number, number>,
 *   monthTotals: number[],
 *   grandTotal: number
 * }}
 */
export function buildDividendsMatrix(items = []) {
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  if (!items || items.length === 0) {
    return {
      years: [],
      months,
      matrix: {},
      yearTotals: {},
      monthTotals: new Array(12).fill(0),
      grandTotal: 0,
    };
  }

  const yearsSet = new Set();
  for (const item of items) {
    const d = item.paymentDate || item.exDate;
    if (d && d.length >= 4) {
      const y = Number.parseInt(d.slice(0, 4), 10);
      if (!Number.isNaN(y)) yearsSet.add(y);
    }
  }

  const years = Array.from(yearsSet).sort((a, b) => b - a);
  const matrix = {};
  const yearTotals = {};
  const monthTotals = new Array(12).fill(0);
  let grandTotal = 0;

  for (const y of years) {
    matrix[y] = new Array(12).fill(0);
    yearTotals[y] = 0;
  }

  for (const item of items) {
    const d = item.paymentDate || item.exDate;
    const total = Number(item.total) || 0;
    if (d && d.length >= 7) {
      const y = Number.parseInt(d.slice(0, 4), 10);
      const m = Number.parseInt(d.slice(5, 7), 10) - 1;
      if (matrix[y] && m >= 0 && m < 12) {
        matrix[y][m] += total;
        yearTotals[y] += total;
        monthTotals[m] += total;
        grandTotal += total;
      }
    }
  }

  return {
    years,
    months,
    matrix,
    yearTotals,
    monthTotals,
    grandTotal,
  };
}
// #endregion
