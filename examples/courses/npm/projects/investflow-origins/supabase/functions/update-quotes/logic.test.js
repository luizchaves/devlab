import { describe, expect, it } from 'vitest';
import {
  collectQuotes,
  fakeProvider,
  getB3Holidays,
  getEasterDate,
  getMarketStatus,
  getMarketType,
  getUSHolidays,
  priceInAssetCurrency,
  quoteSymbol,
  shouldFetchFromProvider,
} from './logic.ts';

// TK04-3 e TK04-5: a logica pura da funcao roda no Vitest, sem edge runtime.

// #region fake
describe('fakeProvider', () => {
  it('devolve preco so para os tickers que conhece', async () => {
    const quotes = await fakeProvider.fetchQuotes(['PETR4', 'HGLG11', 'XPTO3']);

    expect(quotes).toHaveLength(2);
    expect(quotes[0]).toMatchObject({ ticker: 'PETR4', price: 38.42 });
    expect(quotes[1]).toMatchObject({ ticker: 'HGLG11', price: 162.3 });
  });
});
// #endregion

// #region partial
describe('collectQuotes', () => {
  it('registra como not_found o ticker que o provedor nao devolveu', async () => {
    const { quotes, failed } = await collectQuotes(fakeProvider, ['PETR4', 'XPTO3']);

    expect(quotes.map((q) => q.ticker)).toEqual(['PETR4']);
    expect(failed).toEqual([{ ticker: 'XPTO3', reason: 'not_found' }]);
  });

  it('marca todos como provider_error quando o provedor inteiro falha', async () => {
    const broken = {
      fetchQuotes: async () => {
        throw new Error('429');
      },
    };
    const { quotes, failed } = await collectQuotes(broken, ['PETR4', 'VALE3']);

    expect(quotes).toEqual([]);
    expect(failed.map((f) => f.reason)).toEqual(['provider_error', 'provider_error']);
  });

  it('nao chama o provedor com lista vazia', async () => {
    let calls = 0;
    const spy = {
      fetchQuotes: async () => {
        calls += 1;
        return [];
      },
    };

    await collectQuotes(spy, []);

    expect(calls).toBe(0);
  });
});
// #endregion

// #region symbol
describe('quoteSymbol', () => {
  it('consulta cripto sempre em dolar, como o Yahoo indexa', () => {
    expect(quoteSymbol({ ticker: 'BTC', category: 'cripto', currency: 'BRL' })).toBe('BTC-USD');
    expect(quoteSymbol({ ticker: 'ETH', category: 'cripto', currency: 'USD' })).toBe('ETH-USD');
  });

  it('respeita um par ja informado e nao mexe nos demais tickers', () => {
    expect(quoteSymbol({ ticker: 'SOL-USD', category: 'cripto', currency: 'BRL' })).toBe('SOL-USD');
    expect(quoteSymbol({ ticker: 'PETR4', category: 'acoes', currency: 'BRL' })).toBe('PETR4');
  });
});

describe('priceInAssetCurrency', () => {
  const btcBrl = { ticker: 'BTC', category: 'cripto', currency: 'BRL' };

  it('converte cripto em real pelo cambio e deixa o resto como veio', () => {
    expect(priceInAssetCurrency(btcBrl, 100, 5)).toBe(500);
    expect(priceInAssetCurrency({ ...btcBrl, currency: 'USD' }, 100, 5)).toBe(100);
    expect(priceInAssetCurrency({ ticker: 'PETR4', category: 'acoes' }, 38.42, 5)).toBe(38.42);
  });

  it('nao grava dolar como real quando o cambio falta', () => {
    expect(priceInAssetCurrency(btcBrl, 100, undefined)).toBeNull();
  });
});
// #endregion

// #region market-calendar
describe('market-calendar and holidays', () => {
  it('calcula data da Pascoa corretamente', () => {
    // 2026: 05 de Abril
    const easter2026 = getEasterDate(2026);
    expect(easter2026.toISOString().slice(0, 10)).toBe('2026-04-05');

    // 2025: 20 de Abril
    const easter2025 = getEasterDate(2025);
    expect(easter2025.toISOString().slice(0, 10)).toBe('2025-04-20');
  });

  it('identifica feriados da B3', () => {
    const b3Holidays2026 = getB3Holidays(2026);
    expect(b3Holidays2026.has('2026-01-01')).toBe(true); // Ano Novo
    expect(b3Holidays2026.has('2026-02-16')).toBe(true); // Segunda Carnaval
    expect(b3Holidays2026.has('2026-02-17')).toBe(true); // Terca Carnaval
    expect(b3Holidays2026.has('2026-04-03')).toBe(true); // Sexta-feira Santa
    expect(b3Holidays2026.has('2026-04-21')).toBe(true); // Tiradentes
    expect(b3Holidays2026.has('2026-05-01')).toBe(true); // Dia do Trabalho
    expect(b3Holidays2026.has('2026-06-04')).toBe(true); // Corpus Christi
    expect(b3Holidays2026.has('2026-09-07')).toBe(true); // Independencia
    expect(b3Holidays2026.has('2026-10-12')).toBe(true); // N. Sra Aparecida
    expect(b3Holidays2026.has('2026-11-02')).toBe(true); // Finados
    expect(b3Holidays2026.has('2026-11-15')).toBe(true); // Proclamacao
    expect(b3Holidays2026.has('2026-11-20')).toBe(true); // Consciencia Negra
    expect(b3Holidays2026.has('2026-12-25')).toBe(true); // Natal
  });

  it('identifica feriados do mercado americano (US)', () => {
    const usHolidays2026 = getUSHolidays(2026);
    expect(usHolidays2026.has('2026-01-01')).toBe(true); // New Year
    expect(usHolidays2026.has('2026-01-19')).toBe(true); // MLK Day (3rd Mon Jan)
    expect(usHolidays2026.has('2026-02-16')).toBe(true); // Presidents Day (3rd Mon Feb)
    expect(usHolidays2026.has('2026-04-03')).toBe(true); // Good Friday
    expect(usHolidays2026.has('2026-05-25')).toBe(true); // Memorial Day (last Mon May)
    expect(usHolidays2026.has('2026-06-19')).toBe(true); // Juneteenth
    expect(usHolidays2026.has('2026-07-03')).toBe(true); // July 4th observed (Fri July 3 when July 4 is Sat)
    expect(usHolidays2026.has('2026-09-07')).toBe(true); // Labor Day (1st Mon Sep)
    expect(usHolidays2026.has('2026-11-26')).toBe(true); // Thanksgiving (4th Thu Nov)
    expect(usHolidays2026.has('2026-12-25')).toBe(true); // Christmas
  });

  it('classifica tipo de mercado pelo ativo', () => {
    expect(getMarketType({ ticker: 'BTC', category: 'cripto', currency: 'BRL' })).toBe('crypto');
    expect(getMarketType({ ticker: 'AAPL', category: 'acoes', currency: 'USD' })).toBe('us');
    expect(getMarketType({ ticker: 'PETR4', category: 'acoes', currency: 'BRL' })).toBe('b3');
    expect(getMarketType({ ticker: 'HGLG11', category: 'fiis', currency: 'BRL' })).toBe('b3');
  });

  it('avalia status de mercado para cripto (sempre aberto 24/7)', () => {
    const status = getMarketStatus({ ticker: 'BTC', category: 'cripto', currency: 'USD' });
    expect(status.market).toBe('crypto');
    expect(status.isOpen).toBe(true);
    expect(status.isHoliday).toBe(false);
    expect(status.isWeekend).toBe(false);
  });

  it('avalia status de mercado B3 durante horario de pregao', () => {
    // Quarta-feira 10/09/2026 as 14:30 BRT (17:30 UTC)
    const midTrading = new Date('2026-09-09T17:30:00Z');
    const status = getMarketStatus(
      { ticker: 'PETR4', category: 'acoes', currency: 'BRL' },
      midTrading
    );
    expect(status.market).toBe('b3');
    expect(status.isOpen).toBe(true);
    expect(status.isWeekend).toBe(false);
    expect(status.isHoliday).toBe(false);
  });

  it('avalia status de mercado B3 no fim de semana e encontra ultima sessao fechada', () => {
    // Domingo 13/09/2026
    const sunday = new Date('2026-09-13T15:00:00Z');
    const status = getMarketStatus({ ticker: 'VALE3', category: 'acoes', currency: 'BRL' }, sunday);
    expect(status.market).toBe('b3');
    expect(status.isOpen).toBe(false);
    expect(status.isWeekend).toBe(true);
    expect(status.lastCloseDate).toBe('2026-09-11'); // Sexta-feira anterior
  });

  it('avalia status de mercado US durante pregao (09:30-16:00 ET)', () => {
    // Quarta-feira 10/09/2026 as 11:00 ET (15:00 UTC)
    const midTradingUS = new Date('2026-09-09T15:00:00Z');
    const status = getMarketStatus(
      { ticker: 'AAPL', category: 'acoes', currency: 'USD' },
      midTradingUS
    );
    expect(status.market).toBe('us');
    expect(status.isOpen).toBe(true);
  });
});
// #endregion

// #region should-fetch-from-provider
describe('shouldFetchFromProvider', () => {
  const b3Asset = { ticker: 'PETR4', category: 'acoes', currency: 'BRL' };
  const cryptoAsset = { ticker: 'BTC', category: 'cripto', currency: 'USD' };

  it('sempre busca quando nao ha cotacao previa', () => {
    expect(shouldFetchFromProvider(b3Asset, null)).toBe(true);
    expect(shouldFetchFromProvider(b3Asset, { price: null })).toBe(true);
  });

  it('sempre busca cripto (mercado 24/7)', () => {
    const quote = { price: 60000, quoteDate: '2026-09-13', updatedAt: new Date().toISOString() };
    expect(shouldFetchFromProvider(cryptoAsset, quote)).toBe(true);
  });

  it('busca se mercado B3 estiver aberto no momento', () => {
    const midTrading = new Date('2026-09-09T17:30:00Z'); // Quarta 14h30 BRT
    const quote = { price: 38.5, quoteDate: '2026-09-09', updatedAt: '2026-09-09T16:00:00Z' };
    expect(shouldFetchFromProvider(b3Asset, quote, midTrading)).toBe(true);
  });

  it('nao busca no fim de semana se a cotacao de fechamento da sexta-feira ja estiver salva', () => {
    const sunday = new Date('2026-09-13T15:00:00Z'); // Domingo
    // Cotacao salva na sexta-feira 11/09 apos o fechamento (19h BRT = 22h UTC)
    const quote = {
      price: 38.42,
      quoteDate: '2026-09-11',
      updatedAt: '2026-09-11T22:00:00Z',
    };
    expect(shouldFetchFromProvider(b3Asset, quote, sunday)).toBe(false);
  });

  it('busca no fim de semana se a cotacao salva for apenas intraday antes do fechamento', () => {
    const sunday = new Date('2026-09-13T15:00:00Z'); // Domingo
    // Cotacao capturada na sexta-feira as 11h BRT (14h UTC) durante o pregao
    const quote = {
      price: 38.0,
      quoteDate: '2026-09-11',
      updatedAt: '2026-09-11T14:00:00Z',
    };
    expect(shouldFetchFromProvider(b3Asset, quote, sunday)).toBe(true);
  });

  it('busca se a cotacao salva for anterior a ultima sessao fechada', () => {
    const sunday = new Date('2026-09-13T15:00:00Z'); // Domingo 13/09 (ultima sessao fechada = 11/09)
    const quote = {
      price: 37.5,
      quoteDate: '2026-09-10', // Quinta-feira
      updatedAt: '2026-09-10T22:00:00Z',
    };
    expect(shouldFetchFromProvider(b3Asset, quote, sunday)).toBe(true);
  });
});
// #endregion
