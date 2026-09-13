import type { QuotedAsset } from './quotes';

// #region easter
/** Algoritmo de Meeus/Jones/Butcher para o Domingo de Páscoa de qualquer ano. */
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
// #endregion

const toIso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
};

// #region holidays
/** Feriados nacionais e da B3 (CA10.14). */
export function getB3Holidays(year: number): Set<string> {
  const easter = getEasterDate(year);
  return new Set([
    `${year}-01-01`, // Confraternização Universal
    addDays(easter, -48), // Segunda de Carnaval
    addDays(easter, -47), // Terça de Carnaval
    addDays(easter, -2), // Sexta-feira Santa
    `${year}-04-21`, // Tiradentes
    `${year}-05-01`, // Dia do Trabalho
    addDays(easter, 60), // Corpus Christi
    `${year}-09-07`, // Independência
    `${year}-10-12`, // Nossa Senhora Aparecida
    `${year}-11-02`, // Finados
    `${year}-11-15`, // Proclamação da República
    `${year}-11-20`, // Consciência Negra
    `${year}-12-25`, // Natal
  ]);
}

/** Feriados do mercado americano (NYSE / Nasdaq). */
export function getUSHolidays(year: number): Set<string> {
  const easter = getEasterDate(year);

  const nthWeekday = (month: number, weekday: number, nth: number) => {
    let count = 0;
    for (let day = 1; day <= 31; day++) {
      const d = new Date(Date.UTC(year, month - 1, day));
      if (d.getUTCMonth() !== month - 1) break;
      if (d.getUTCDay() === weekday && ++count === nth) return toIso(year, month, day);
    }
    return '';
  };

  const lastWeekday = (month: number, weekday: number) => {
    for (let day = 31; day >= 1; day--) {
      const d = new Date(Date.UTC(year, month - 1, day));
      if (d.getUTCMonth() === month - 1 && d.getUTCDay() === weekday) return toIso(year, month, day);
    }
    return '';
  };

  // Feriado fixo que cai no fim de semana é observado na sexta ou na segunda.
  const observed = (month: number, day: number) => {
    const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    if (dow === 0) return toIso(year, month, day + 1);
    if (dow === 6) return toIso(year, month, day - 1);
    return toIso(year, month, day);
  };

  return new Set([
    observed(1, 1), // New Year's Day
    nthWeekday(1, 1, 3), // Martin Luther King Jr. Day
    nthWeekday(2, 1, 3), // Presidents Day
    addDays(easter, -2), // Good Friday
    lastWeekday(5, 1), // Memorial Day
    observed(6, 19), // Juneteenth
    observed(7, 4), // Independence Day
    nthWeekday(9, 1, 1), // Labor Day
    nthWeekday(11, 4, 4), // Thanksgiving
    observed(12, 25), // Christmas Day
  ]);
}
// #endregion

// #region status
export type MarketType = 'b3' | 'us' | 'crypto';

export function getMarketType(asset: Pick<QuotedAsset, 'category' | 'currency'>): MarketType {
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

const localParts = (date: Date, timeZone: string) => {
  const local = new Date(date.toLocaleString('en-US', { timeZone }));
  return {
    iso: toIso(local.getFullYear(), local.getMonth() + 1, local.getDate()),
    year: local.getFullYear(),
    dayOfWeek: local.getDay(),
    minutes: local.getHours() * 60 + local.getMinutes(),
    local,
  };
};

/**
 * Status do mercado do ativo em um instante: B3 opera em dias úteis das 10h às
 * 18h (São Paulo), NYSE/Nasdaq das 9h30 às 16h (Nova York), cripto 24/7 (CA10.14).
 * `lastCloseDate` é a última sessão já encerrada.
 */
export function getMarketStatus(asset: Pick<QuotedAsset, 'category' | 'currency'>, now = new Date()): MarketStatus {
  const market = getMarketType(asset);
  if (market === 'crypto') {
    return { market, isOpen: true, isHoliday: false, isWeekend: false, lastCloseDate: now.toISOString().slice(0, 10) };
  }

  const isUS = market === 'us';
  const timeZone = isUS ? 'America/New_York' : 'America/Sao_Paulo';
  const holidaysOf = isUS ? getUSHolidays : getB3Holidays;
  const openMinutes = isUS ? 9 * 60 + 30 : 10 * 60;
  const closeMinutes = isUS ? 16 * 60 : 18 * 60;

  const today = localParts(now, timeZone);
  const isWeekend = today.dayOfWeek === 0 || today.dayOfWeek === 6;
  const isHoliday = holidaysOf(today.year).has(today.iso);
  const isTradingDay = !isWeekend && !isHoliday;
  const isOpen = isTradingDay && today.minutes >= openMinutes && today.minutes < closeMinutes;

  if (isTradingDay && today.minutes >= closeMinutes) {
    return { market, isOpen: false, isHoliday: false, isWeekend: false, lastCloseDate: today.iso };
  }

  // Volta dia a dia até achar a última sessão encerrada.
  const scan = new Date(today.local);
  for (;;) {
    scan.setDate(scan.getDate() - 1);
    const iso = toIso(scan.getFullYear(), scan.getMonth() + 1, scan.getDate());
    const weekend = scan.getDay() === 0 || scan.getDay() === 6;
    if (!weekend && !holidaysOf(scan.getFullYear()).has(iso)) {
      return { market, isOpen, isHoliday, isWeekend, lastCloseDate: iso };
    }
  }
}
// #endregion

// #region should-fetch
export type LastQuoteInfo = { price: number | null; quoteDate?: string | null; updatedAt?: string | Date | null };

/**
 * Decide se vale consultar o provedor. Sem cotação prévia, ou com cotação
 * anterior à última sessão, sempre consulta (CA10.16). No fim de semana ou
 * feriado, com o fechamento da última sessão já salvo, não consulta (CA10.15).
 */
export function shouldFetchFromProvider(asset: Pick<QuotedAsset, 'category' | 'currency'>, lastQuote?: LastQuoteInfo | null, now = new Date()): boolean {
  if (!lastQuote || lastQuote.price == null || !lastQuote.quoteDate) return true;

  const status = getMarketStatus(asset, now);
  if (status.market === 'crypto' || status.isOpen) return true;
  if (lastQuote.quoteDate < status.lastCloseDate) return true;
  if (!lastQuote.updatedAt) return false;

  // A cotação do dia do fechamento só vale como fechamento se foi capturada depois do pregão.
  const timeZone = status.market === 'us' ? 'America/New_York' : 'America/Sao_Paulo';
  const captured = localParts(new Date(lastQuote.updatedAt), timeZone);
  const holidaysOf = status.market === 'us' ? getUSHolidays : getB3Holidays;
  const closeHour = status.market === 'us' ? 16 : 18;
  const afterClose =
    captured.dayOfWeek === 0 || captured.dayOfWeek === 6 || holidaysOf(captured.year).has(captured.iso) || captured.minutes >= closeHour * 60;

  return !afterClose;
}
// #endregion
