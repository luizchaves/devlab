import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 3 contra a stack local', () => {
  const admin = adminClient();
  const users = [];

  /** Cria a conta e devolve um cliente ja logado: e assim que o RLS enxerga auth.uid(). */
  async function login(name) {
    const client = anonClient();
    const email = uniqueEmail(name.toLowerCase());
    const { data, error } = await client.auth.signUp({
      email,
      password: PASSWORD,
      options: { data: { full_name: name } },
    });
    expect(error).toBeNull();
    users.push(data.user.id);
    return { client, id: data.user.id };
  }

  let ana;
  let bruno;
  let petr4;

  beforeAll(async () => {
    ana = await login('Ana');
    bruno = await login('Bruno');
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region assets
  it('TK03-1 / TK03-10: cadastra um ativo com corretora nova e emissor', async () => {
    const { data: broker } = await ana.client
      .from('brokers')
      .upsert({ user_id: ana.id, name: 'XP' }, { onConflict: 'user_id,name' })
      .select()
      .single();

    const { data, error } = await ana.client
      .from('assets')
      .insert({
        user_id: ana.id,
        ticker: 'PETR4',
        name: 'Petrobras PN',
        category: 'acoes',
        issuer: 'Petrobras',
        broker_id: broker.id,
        current_price: 33,
      })
      .select('id, ticker, issuer, broker:brokers(name)')
      .single();

    expect(error).toBeNull();
    expect(data.broker.name).toBe('XP');
    expect(data.issuer).toBe('Petrobras');
    petr4 = data;
  });

  it('TK03-10: a mesma corretora citada duas vezes e uma linha so', async () => {
    await ana.client
      .from('brokers')
      .upsert({ user_id: ana.id, name: 'XP' }, { onConflict: 'user_id,name' });
    const { data } = await ana.client.from('brokers').select('name').eq('name', 'XP');

    expect(data).toHaveLength(1);
  });

  it('TK03-1: categoria fora do conjunto e recusada pelo CHECK', async () => {
    const { error } = await ana.client
      .from('assets')
      .insert({ user_id: ana.id, ticker: 'XPTO', name: 'Invalido', category: 'imoveis' });

    expect(error.code).toBe('23514');
  });

  it('TK03-1: o ticker e unico por dono, nao no sistema', async () => {
    const dup = await ana.client
      .from('assets')
      .insert({ user_id: ana.id, ticker: 'PETR4', name: 'De novo', category: 'acoes' });
    const other = await bruno.client
      .from('assets')
      .insert({ user_id: bruno.id, ticker: 'PETR4', name: 'Do Bruno', category: 'acoes' });

    expect(dup.error.code).toBe('23505');
    expect(other.error).toBeNull();
  });
  // #endregion

  // #region transactions
  it('TK03-2 / TK03-8: compras registradas reproduzem a planilha de referencia', async () => {
    const rows = [
      {
        user_id: ana.id,
        asset_id: petr4.id,
        type: 'buy',
        quantity: 100,
        price: 30,
        transaction_date: '2026-01-10',
      },
      {
        user_id: ana.id,
        asset_id: petr4.id,
        type: 'buy',
        quantity: 100,
        price: 34,
        transaction_date: '2026-02-10',
      },
    ];
    const { error } = await ana.client.from('transactions').insert(rows);
    expect(error).toBeNull();

    const { data } = await ana.client
      .from('assets')
      .select('current_price, transactions(type, quantity, price, transaction_date)')
      .eq('id', petr4.id)
      .single();
    const { summarize } = await import('../../src/lib/portfolio.js');
    const s = summarize(data);

    expect(s.quantity).toBe(200);
    expect(s.averagePrice).toBe(32);
    expect(s.cost).toBe(6400);
    expect(s.value).toBe(6600);
  });

  it('TK03-2: quantidade zero e recusada pelo CHECK', async () => {
    const { error } = await ana.client
      .from('transactions')
      .insert({ user_id: ana.id, asset_id: petr4.id, type: 'buy', quantity: 0, price: 10 });

    expect(error.code).toBe('23514');
  });
  // #endregion

  // #region rls
  it('CA03.4: cada conta le apenas os proprios ativos', async () => {
    const { data } = await bruno.client.from('assets').select('ticker, user_id');

    expect(data.every((a) => a.user_id === bruno.id)).toBe(true);
    expect(data.some((a) => a.ticker === 'PETR4' && a.user_id === ana.id)).toBe(false);
  });

  it('CA03.5: inserir uma transacao em nome de outra conta viola o WITH CHECK', async () => {
    const { error } = await bruno.client
      .from('transactions')
      .insert({ user_id: ana.id, asset_id: petr4.id, type: 'buy', quantity: 1, price: 1 });

    expect(error.code).toBe('42501');
  });

  it('CA03.10: o ativo de outra conta por id devolve nulo, nao erro', async () => {
    const { data, error } = await bruno.client
      .from('assets')
      .select('id')
      .eq('id', petr4.id)
      .maybeSingle();

    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it('CA03.6: quotes_history de um ativo alheio nao aparece', async () => {
    await admin
      .from('quotes_history')
      .insert({ asset_id: petr4.id, price: 33, quote_date: '2026-02-28' });

    // Filtrado pela data: a Edge Function da Sprint 4 tambem grava neste ativo.
    const { data: own } = await ana.client
      .from('quotes_history')
      .select('price')
      .eq('asset_id', petr4.id)
      .eq('quote_date', '2026-02-28');
    const { data: other } = await bruno.client
      .from('quotes_history')
      .select('price')
      .eq('asset_id', petr4.id)
      .eq('quote_date', '2026-02-28');

    expect(own).toHaveLength(1);
    expect(other).toEqual([]);
  });

  it('TK03-5: o cliente nao escreve em quotes_history (so a Edge Function)', async () => {
    const { error } = await ana.client
      .from('quotes_history')
      .insert({ asset_id: petr4.id, price: 1, quote_date: '2026-03-31' });

    expect(error.code).toBe('42501');
  });

  it('CA03.4: update e delete cruzados nao alcancam nenhuma linha', async () => {
    const upd = await bruno.client
      .from('assets')
      .update({ name: 'hack' })
      .eq('id', petr4.id)
      .select();
    const del = await bruno.client.from('assets').delete().eq('id', petr4.id).select();
    const { data: still } = await ana.client
      .from('assets')
      .select('name')
      .eq('id', petr4.id)
      .single();

    expect(upd.data).toEqual([]);
    expect(del.data).toEqual([]);
    expect(still.name).toBe('Petrobras PN');
  });
  // #endregion
});
