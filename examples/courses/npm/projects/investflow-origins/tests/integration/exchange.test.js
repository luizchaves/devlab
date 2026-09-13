import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 10 contra a stack local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let vt;

  async function login(name) {
    const client = anonClient();
    const { data, error } = await client.auth.signUp({
      email: uniqueEmail(name.toLowerCase()),
      password: PASSWORD,
      options: { data: { full_name: name } },
    });
    expect(error).toBeNull();
    users.push(data.user.id);
    return { client, id: data.user.id };
  }

  // Um ETF em dolar comprado em janeiro (cambio 5,00) e cotado em fevereiro (cambio 6,00).
  beforeAll(async () => {
    ana = await login('Ana');
    await admin.from('exchange_rates').upsert(
      [
        { from_currency: 'USD', to_currency: 'BRL', rate: 5, rate_date: '2026-01-15' },
        { from_currency: 'USD', to_currency: 'BRL', rate: 6, rate_date: '2026-02-15' },
      ],
      { onConflict: 'from_currency,to_currency,rate_date' }
    );

    const { data } = await ana.client
      .from('assets')
      .insert({
        user_id: ana.id,
        ticker: 'VT',
        name: 'Vanguard Total World',
        category: 'etfs',
        currency: 'USD',
        current_price: 120,
      })
      .select('id')
      .single();
    vt = data;

    await ana.client.from('transactions').insert({
      user_id: ana.id,
      asset_id: vt.id,
      type: 'buy',
      quantity: 10,
      price: 100,
      transaction_date: '2026-01-20',
    });
    await admin.from('quotes_history').insert([
      { asset_id: vt.id, price: 110, quote_date: '2026-01-31' },
      { asset_id: vt.id, price: 120, quote_date: '2026-02-28' },
    ]);
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
    await admin.from('exchange_rates').delete().in('rate_date', ['2026-01-15', '2026-02-15']);
  });
  // #endregion

  // #region currency
  it('CA10.1: a moeda do ativo e BRL ou USD, e outra e recusada', async () => {
    const { error } = await ana.client.from('assets').insert({
      user_id: ana.id,
      ticker: 'EUR-ETF',
      name: 'Euro',
      category: 'etfs',
      currency: 'EUR',
    });

    expect(error.code).toBe('23514');
  });
  // #endregion

  // #region rates
  it('CA10.3: exchange_rates e lida por qualquer sessao e escrita so pelo servico', async () => {
    const anon = anonClient();
    const { data, error } = await anon
      .from('exchange_rates')
      .select('rate')
      .eq('rate_date', '2026-02-15')
      .single();
    expect(error).toBeNull();
    expect(Number(data.rate)).toBe(6);

    const { error: denied } = await ana.client
      .from('exchange_rates')
      .insert({ from_currency: 'USD', to_currency: 'BRL', rate: 9, rate_date: '2026-03-15' });
    expect(denied.code).toBe('42501');
  });

  it('CA10.3: get_usd_rate devolve a taxa do dia ou a ultima anterior', async () => {
    const sameDay = await ana.client.rpc('get_usd_rate', { p_date: '2026-02-15' });
    const between = await ana.client.rpc('get_usd_rate', { p_date: '2026-02-01' });
    const before = await ana.client.rpc('get_usd_rate', { p_date: '2025-12-01' });

    expect(Number(sameDay.data)).toBe(6);
    expect(Number(between.data)).toBe(5);
    // Antes da primeira taxa conhecida, usa a primeira: melhor que inventar 1:1.
    expect(Number(before.data)).toBe(5);
  });
  // #endregion

  // #region views
  it('CA10.8: allocation_by_origin e portfolio_evolution convertem o ativo em USD pela taxa do mes', async () => {
    // A posicao atual usa a taxa de hoje (a que a Edge Function gravou, ou a
    // ultima conhecida): 10 cotas x US$ 120 x get_usd_rate(hoje).
    const { data: todayRate } = await ana.client.rpc('get_usd_rate');
    const { data: origin } = await ana.client
      .from('allocation_by_origin')
      .select('value')
      .eq('asset_id', vt.id)
      .single();
    expect(Number(origin.value)).toBeCloseTo(10 * 120 * Number(todayRate), 2);

    // A evolucao usa a taxa vigente no primeiro dia de cada mes: em 1/jan e em
    // 1/fev a unica taxa conhecida ate ali e a de 15/jan (5,00).
    const { data: evolution } = await ana.client
      .from('portfolio_evolution')
      .select('month, invested, value')
      .eq('asset_id', vt.id)
      .order('month');
    expect(evolution.map((r) => r.month)).toEqual(['2026-01-01', '2026-02-01']);
    expect(Number(evolution[0].invested)).toBeCloseTo(10 * 100 * 5, 2);
    expect(Number(evolution[0].value)).toBeCloseTo(10 * 110 * 5, 2);
    expect(Number(evolution[1].invested)).toBeCloseTo(10 * 100 * 5, 2);
    expect(Number(evolution[1].value)).toBeCloseTo(10 * 120 * 5, 2);
  });
  // #endregion
});
