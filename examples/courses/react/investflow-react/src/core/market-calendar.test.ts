import { describe, expect, it } from 'vitest';
import { getB3Holidays, getEasterDate, getMarketStatus, getMarketType, getUSHolidays, shouldFetchFromProvider } from './market-calendar';

const b3 = { ticker: 'PETR4', category: 'acoes', currency: 'BRL' } as const;
const us = { ticker: 'AAPL', category: 'acoes', currency: 'USD' } as const;
const crypto = { ticker: 'BTC', category: 'cripto', currency: 'USD' } as const;

describe('calendário', () => {
  it('calcula a Páscoa', () => {
    expect(getEasterDate(2026).toISOString().slice(0, 10)).toBe('2026-04-05');
    expect(getEasterDate(2025).toISOString().slice(0, 10)).toBe('2025-04-20');
  });

  it('CA10.14 — reconhece os feriados da B3', () => {
    const holidays = getB3Holidays(2026);
    for (const day of ['2026-01-01', '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01', '2026-06-04', '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25']) {
      expect(holidays.has(day), day).toBe(true);
    }
  });

  it('CA10.14 — reconhece os feriados de NYSE/Nasdaq, inclusive os observados', () => {
    const holidays = getUSHolidays(2026);
    for (const day of ['2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25', '2026-06-19', '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25']) {
      expect(holidays.has(day), day).toBe(true);
    }
  });
});

describe('getMarketStatus', () => {
  it('classifica o mercado pelo ativo', () => {
    expect(getMarketType(crypto)).toBe('crypto');
    expect(getMarketType(us)).toBe('us');
    expect(getMarketType(b3)).toBe('b3');
  });

  it('CA10.14 — B3 aberta em dia útil das 10h às 18h; cripto sempre aberta', () => {
    const wednesday = new Date('2026-09-09T17:30:00Z'); // 14h30 em São Paulo
    expect(getMarketStatus(b3, wednesday)).toMatchObject({ market: 'b3', isOpen: true, isWeekend: false, isHoliday: false });
    expect(getMarketStatus(crypto, wednesday)).toMatchObject({ market: 'crypto', isOpen: true });
    expect(getMarketStatus(us, new Date('2026-09-09T15:00:00Z'))).toMatchObject({ market: 'us', isOpen: true });
  });

  it('no domingo, a última sessão encerrada é a sexta anterior', () => {
    const sunday = new Date('2026-09-13T15:00:00Z');
    expect(getMarketStatus(b3, sunday)).toMatchObject({ isOpen: false, isWeekend: true, lastCloseDate: '2026-09-11' });
  });
});

describe('shouldFetchFromProvider', () => {
  const sunday = new Date('2026-09-13T15:00:00Z');

  it('CA10.16 — sem cotação prévia, ou anterior à última sessão, sempre consulta', () => {
    expect(shouldFetchFromProvider(b3, null)).toBe(true);
    expect(shouldFetchFromProvider(b3, { price: null })).toBe(true);
    expect(shouldFetchFromProvider(b3, { price: 37.5, quoteDate: '2026-09-10', updatedAt: '2026-09-10T22:00:00Z' }, sunday)).toBe(true);
  });

  it('CA10.15 — no fim de semana, com o fechamento de sexta já salvo, não consulta', () => {
    expect(shouldFetchFromProvider(b3, { price: 38.42, quoteDate: '2026-09-11', updatedAt: '2026-09-11T22:00:00Z' }, sunday)).toBe(false);
  });

  it('cotação intraday de sexta ainda pede consulta; cripto e mercado aberto sempre consultam', () => {
    expect(shouldFetchFromProvider(b3, { price: 38, quoteDate: '2026-09-11', updatedAt: '2026-09-11T14:00:00Z' }, sunday)).toBe(true);
    expect(shouldFetchFromProvider(crypto, { price: 60000, quoteDate: '2026-09-13', updatedAt: new Date().toISOString() })).toBe(true);
    expect(shouldFetchFromProvider(b3, { price: 38.5, quoteDate: '2026-09-09', updatedAt: '2026-09-09T16:00:00Z' }, new Date('2026-09-09T17:30:00Z'))).toBe(true);
  });
});
