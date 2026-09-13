import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '@/server/prisma';
import { updateQuotes } from '@/server/quotes/update';
import { actAs, createAccounts, jsonRequest, params, resetTables } from './helpers';
import { GET as analytics } from '../../app/api/analytics/route';
import { GET as getAsset } from '../../app/api/assets/[id]/route';
import { POST as postAsset } from '../../app/api/assets/route';
import { GET as exchange } from '../../app/api/exchange/route';
import { GET as origins } from '../../app/api/origins/route';
import { POST as postTransaction } from '../../app/api/transactions/route';

beforeEach(resetTables);

describe('dólar e cripto', () => {
  it('CA10.1 — a moeda do ativo é BRL ou USD; renda fixa fica em reais e outra moeda é recusada', async () => {
    const { ana } = await createAccounts();
    actAs(ana);

    const usd = await postAsset(jsonRequest('POST', { ticker: 'VT', name: 'Vanguard Total World', category: 'etfs', currency: 'USD' }));
    expect(usd.status).toBe(201);
    expect((await usd.json()).asset.currency).toBe('USD');

    const rfUsd = await postAsset(jsonRequest('POST', { ticker: 'CDB', name: 'CDB', category: 'renda_fixa', currency: 'USD' }));
    expect(rfUsd.status).toBe(400);
    const eur = await postAsset(jsonRequest('POST', { ticker: 'X', name: 'X', category: 'acoes', currency: 'EUR' }));
    expect(eur.status).toBe(400);
  });

  it('CA10.3, CA10.13 — a tabela de câmbio é lida por qualquer sessão e escrita só pela rodada', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const { asset } = await (await postAsset(jsonRequest('POST', { ticker: 'AAPL', name: 'Apple', category: 'acoes', currency: 'USD' }))).json();
    expect((await (await exchange()).json()).rates).toEqual([]);

    await updateQuotes(ana.id, { now: new Date('2026-09-09T17:30:00Z') });

    const { rates } = await (await exchange()).json();
    expect(rates).toHaveLength(1);
    expect(rates[0].rate).toBe(5.2);
    expect(Number((await prisma.asset.findUniqueOrThrow({ where: { id: asset.id } })).currentPrice)).toBe(230.5);
  });

  it('CA10.4, CA10.8 — a carteira converte o ativo em USD pela taxa mais recente e as séries pela taxa do mês', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const { asset } = await (await postAsset(jsonRequest('POST', { ticker: 'AAPL', name: 'Apple', category: 'acoes', currency: 'USD' }))).json();
    await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 10, price: 100, transactionDate: '2026-01-20' }));
    await prisma.asset.update({ where: { id: asset.id }, data: { currentPrice: 110 } });
    await prisma.quote.create({ data: { assetId: asset.id, price: 110, quoteDate: new Date('2026-01-31T00:00:00Z') } });
    await prisma.exchangeRate.createMany({
      data: [
        { fromCurrency: 'USD', toCurrency: 'BRL', rate: 5, rateDate: new Date('2026-01-15T00:00:00Z') },
        { fromCurrency: 'USD', toCurrency: 'BRL', rate: 5.5, rateDate: new Date('2026-02-10T00:00:00Z') },
      ],
    });

    const body = await (await analytics()).json();
    expect(body.totals).toMatchObject({ cost: 5500, value: 6050 }); // taxa mais recente: 5,5
    expect(body.evolution).toEqual([{ assetId: asset.id, month: '2026-01-01', invested: 5000, value: 5500 }]); // taxa do mês: 5
    expect(body.monthlyReturns).toEqual([{ month: '2026-01-01', value: 5500, netFlow: 5000, returnBrl: 500 }]);

    const { rows } = await (await origins()).json();
    expect(rows[0].value).toBe(6050);

    const { asset: dto } = await (await getAsset(new Request('http://localhost'), params(asset.id))).json();
    expect(dto.currency).toBe('USD');
  });
});
