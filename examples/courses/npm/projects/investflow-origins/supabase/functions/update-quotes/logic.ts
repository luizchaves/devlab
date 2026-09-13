import type { MarketProvider, Quote, QuoteFailure } from './types.ts';

// Sem Deno.* e sem npm: aqui: este modulo roda no edge runtime E no Vitest.

// #region today
export const today = () => new Date().toISOString().slice(0, 10);
// #endregion

// #region fake-provider
/**
 * O adaptador simulado implementa o mesmo contrato do real com uma tabela fixa.
 * Ticker desconhecido fica de fora: a falha e registrada, nao mascarada com
 * um preco inventado.
 */
export const FAKE_PRICES: Record<string, number> = {
  HGLG11: 162.3,
  PETR4: 38.42,
  VALE3: 61.1,
};

export const fakeProvider: MarketProvider = {
  async fetchQuotes(tickers) {
    return tickers
      .filter((t) => t in FAKE_PRICES)
      .map((ticker) => ({ ticker, price: FAKE_PRICES[ticker], quoteDate: today() }));
  },
};
// #endregion

// #region collect
/**
 * Falha parcial vira dado, nao excecao. Um ticker que o provedor nao conhece
 * nao pode derrubar os outros trinta; um erro do provedor inteiro marca todos
 * como provider_error, e a funcao ainda responde 200 com o resumo.
 */
export async function collectQuotes(
  provider: MarketProvider,
  tickers: string[]
): Promise<{ quotes: Quote[]; failed: QuoteFailure[] }> {
  if (tickers.length === 0) return { quotes: [], failed: [] };

  try {
    const quotes = await provider.fetchQuotes(tickers);
    const found = new Set(quotes.map((q) => q.ticker));
    const failed: QuoteFailure[] = tickers
      .filter((t) => !found.has(t))
      .map((ticker) => ({ ticker, reason: 'not_found' }));

    return { quotes, failed };
  } catch {
    return { quotes: [], failed: tickers.map((ticker) => ({ ticker, reason: 'provider_error' })) };
  }
}
// #endregion

// #region eligible
/** Acoes, FIIs, ETFs, FI-Infra e cripto tem ticker cotado; o resto e preco manual. */
export const ELIGIBLE_CATEGORIES = ['acoes', 'fiis', 'etfs', 'fi_infra', 'cripto'];

/** Par USD/BRL no Yahoo, usado para converter cripto cotada em dolar. */
export const USD_BRL_SYMBOL = 'BRL=X';

export type QuotedAsset = { ticker: string; category?: string; currency?: string };

/**
 * Simbolo consultado no provedor. O Yahoo so indexa cripto em dolar
 * (BTC-USD; BTC-BRL responde 404), entao cripto vira `TICKER-USD` e, para ativo
 * em real, o preco e convertido depois com USD_BRL_SYMBOL. Os demais usam o
 * proprio ticker.
 */
export function quoteSymbol(asset: QuotedAsset) {
  if (asset.category === 'cripto' && !asset.ticker.includes('-')) {
    return `${asset.ticker}-USD`;
  }
  return asset.ticker;
}

/** Cripto em real precisa do cambio; o resto ja vem na moeda do ativo. */
export function needsUsdConversion(asset: QuotedAsset) {
  return asset.category === 'cripto' && asset.currency !== 'USD';
}

/**
 * Preco na moeda do ativo. Devolve null quando a conversao e necessaria e o
 * cambio nao veio: melhor ficar sem cotacao do que gravar um valor em dolar
 * como se fosse real.
 */
export function priceInAssetCurrency(
  asset: QuotedAsset,
  quotePrice: number,
  usdBrlRate: number | undefined
): number | null {
  if (!needsUsdConversion(asset)) return quotePrice;
  return typeof usdBrlRate === 'number' && usdBrlRate > 0 ? quotePrice * usdBrlRate : null;
}
// #endregion

// #region market-calendar
/** Algoritmo de Meeus/Jones/Butcher para computo do Domingo de Pascoa em qualquer ano. */
export function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Calendario oficial de feriados nacionais e da B3 (Brasil). */
export function getB3Holidays(year: number): Set<string> {
  const easter = getEasterDate(year);
  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setUTCDate(res.getUTCDate() + days);
    return res.toISOString().slice(0, 10);
  };

  return new Set<string>([
    `${year}-01-01`, // Confraternizacao Universal
    addDays(easter, -48), // Segunda de Carnaval
    addDays(easter, -47), // Terca de Carnaval
    addDays(easter, -2), // Sexta-feira Santa
    `${year}-04-21`, // Tiradentes
    `${year}-05-01`, // Dia do Trabalho
    addDays(easter, 60), // Corpus Christi
    `${year}-09-07`, // Independencia do Brasil
    `${year}-10-12`, // Nossa Senhora Aparecida
    `${year}-11-02`, // Finados
    `${year}-11-15`, // Proclamacao da Republica
    `${year}-11-20`, // Dia da Consciencia Negra
    `${year}-12-25`, // Natal
  ]);
}

/** Calendario oficial de feriados do mercado americano (NYSE / NASDAQ). */
export function getUSHolidays(year: number): Set<string> {
  const easter = getEasterDate(year);
  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setUTCDate(res.getUTCDate() + days);
    return res.toISOString().slice(0, 10);
  };

  const toIso = (y: number, m: number, d: number) =>
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const nthWeekdayOfMonth = (y: number, month: number, targetDayOfWeek: number, nth: number) => {
    let count = 0;
    for (let day = 1; day <= 31; day++) {
      const d = new Date(Date.UTC(y, month - 1, day));
      if (d.getUTCMonth() !== month - 1) break;
      if (d.getUTCDay() === targetDayOfWeek) {
        count++;
        if (count === nth) return toIso(y, month, day);
      }
    }
    return '';
  };

  const lastWeekdayOfMonth = (y: number, month: number, targetDayOfWeek: number) => {
    for (let day = 31; day >= 1; day--) {
      const d = new Date(Date.UTC(y, month - 1, day));
      if (d.getUTCMonth() === month - 1 && d.getUTCDay() === targetDayOfWeek) {
        return toIso(y, month, day);
      }
    }
    return '';
  };

  const observedFixedHoliday = (y: number, month: number, day: number) => {
    const d = new Date(Date.UTC(y, month - 1, day));
    const dow = d.getUTCDay();
    if (dow === 0) return toIso(y, month, day + 1);
    if (dow === 6) return toIso(y, month, day - 1);
    return toIso(y, month, day);
  };

  return new Set<string>([
    observedFixedHoliday(year, 1, 1), // New Year's Day
    nthWeekdayOfMonth(year, 1, 1, 3), // Martin Luther King Jr. Day
    nthWeekdayOfMonth(year, 2, 1, 3), // Presidents Day
    addDays(easter, -2), // Good Friday
    lastWeekdayOfMonth(year, 5, 1), // Memorial Day
    observedFixedHoliday(year, 6, 19), // Juneteenth
    observedFixedHoliday(year, 7, 4), // Independence Day
    nthWeekdayOfMonth(year, 9, 1, 1), // Labor Day
    nthWeekdayOfMonth(year, 11, 4, 4), // Thanksgiving
    observedFixedHoliday(year, 12, 25), // Christmas Day
  ]);
}

export type MarketType = 'b3' | 'us' | 'crypto';

export function getMarketType(asset: QuotedAsset): MarketType {
  if (asset.category === 'cripto') return 'crypto';
  if (asset.currency === 'USD') return 'us';
  return 'b3';
}

export type MarketStatus = {
  market: MarketType;
  isOpen: boolean;
  isHoliday: boolean;
  isWeekend: boolean;
  lastCloseDate: string;
};

/**
 * Determina o status do mercado para o ativo em uma data/hora de referencia.
 * B3 opera em dias uteis das 10h as 18h (America/Sao_Paulo).
 * Mercado americano (US) opera em dias uteis das 09h30 as 16h (America/New_York).
 * Cripto opera 24/7.
 */
export function getMarketStatus(asset: QuotedAsset, now = new Date()): MarketStatus {
  const market = getMarketType(asset);

  if (market === 'crypto') {
    const todayIso = now.toISOString().slice(0, 10);
    return {
      market: 'crypto',
      isOpen: true,
      isHoliday: false,
      isWeekend: false,
      lastCloseDate: todayIso,
    };
  }

  const isUS = market === 'us';
  const timeZone = isUS ? 'America/New_York' : 'America/Sao_Paulo';
  const holidays = isUS ? getUSHolidays(now.getFullYear()) : getB3Holidays(now.getFullYear());

  const openMinutes = isUS ? 9 * 60 + 30 : 10 * 60;
  const closeMinutes = isUS ? 16 * 60 : 18 * 60;

  const localTime = new Date(now.toLocaleString('en-US', { timeZone }));
  const year = localTime.getFullYear();
  const month = localTime.getMonth() + 1;
  const day = localTime.getDate();
  const dayOfWeek = localTime.getDay();
  const currentTimeMinutes = localTime.getHours() * 60 + localTime.getMinutes();

  const toIso = (y: number, m: number, d: number) =>
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const todayIso = toIso(year, month, day);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = holidays.has(todayIso);

  const isTradingDay = !isWeekend && !isHoliday;
  const isOpen =
    isTradingDay && currentTimeMinutes >= openMinutes && currentTimeMinutes < closeMinutes;
  const isAfterClose = isTradingDay && currentTimeMinutes >= closeMinutes;

  if (isTradingDay && isAfterClose) {
    return {
      market,
      isOpen: false,
      isHoliday: false,
      isWeekend: false,
      lastCloseDate: todayIso,
    };
  }

  const scanDate = new Date(localTime);
  scanDate.setDate(scanDate.getDate() - 1);

  while (true) {
    const scanYear = scanDate.getFullYear();
    const scanMonth = scanDate.getMonth() + 1;
    const scanDay = scanDate.getDate();
    const scanDow = scanDate.getDay();
    const scanIso = toIso(scanYear, scanMonth, scanDay);
    const scanHolidays = isUS ? getUSHolidays(scanYear) : getB3Holidays(scanYear);

    const isScanWeekend = scanDow === 0 || scanDow === 6;
    const isScanHoliday = scanHolidays.has(scanIso);

    if (!isScanWeekend && !isScanHoliday) {
      return {
        market,
        isOpen,
        isHoliday,
        isWeekend,
        lastCloseDate: scanIso,
      };
    }
    scanDate.setDate(scanDate.getDate() - 1);
  }
}

export type LastQuoteInfo = {
  price: number | null;
  quoteDate?: string | null;
  updatedAt?: string | Date | null;
  isClosing?: boolean;
};

/**
 * Avalia se e necessario consultar a fonte externa de cotacoes.
 * Evita chamadas de rede desnecessarias quando o valor de fechamento ja e o
 * vigente e o mercado nao abriu (fins de semana, feriados, pre-mercado ou apos fechamento).
 */
export function shouldFetchFromProvider(
  asset: QuotedAsset,
  lastQuote?: LastQuoteInfo | null,
  now = new Date()
): boolean {
  if (!lastQuote || lastQuote.price == null || !lastQuote.quoteDate) {
    return true;
  }

  const status = getMarketStatus(asset, now);

  if (status.market === 'crypto') {
    return true;
  }

  // Mercado aberto no momento -> cotacao varia intraday
  if (status.isOpen) {
    return true;
  }

  // Mercado fechado (feriado, fim de semana, noite ou madrugada)
  if (lastQuote.quoteDate >= status.lastCloseDate) {
    if (lastQuote.updatedAt) {
      const timeZone = status.market === 'us' ? 'America/New_York' : 'America/Sao_Paulo';
      const quoteTime = new Date(lastQuote.updatedAt);
      const localQuoteTime = new Date(quoteTime.toLocaleString('en-US', { timeZone }));
      const quoteHours = localQuoteTime.getHours();
      const quoteDow = localQuoteTime.getDay();
      const isQuoteWeekend = quoteDow === 0 || quoteDow === 6;
      const quoteHolidays =
        status.market === 'us'
          ? getUSHolidays(localQuoteTime.getFullYear())
          : getB3Holidays(localQuoteTime.getFullYear());
      const quoteIso = localQuoteTime.toISOString().slice(0, 10);
      const isQuoteHoliday = quoteHolidays.has(quoteIso);

      const closeHours = status.market === 'us' ? 16 : 18;
      const wasCapturedAfterClose = isQuoteWeekend || isQuoteHoliday || quoteHours >= closeHours;

      if (wasCapturedAfterClose || lastQuote.isClosing) {
        return false; // Fechamento consolidado vigente!
      }
      return true; // Cotacao foi intraday antes do fechamento
    }

    return false;
  }

  return true;
}
// #endregion
