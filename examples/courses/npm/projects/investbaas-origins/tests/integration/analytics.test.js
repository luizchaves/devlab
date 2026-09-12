import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 6 contra a stack local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let bruno;

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

  // A planilha de referencia da pagina: 100 PETR4 a 30 em janeiro, 100 a 34 em
  // fevereiro; cotacoes 31 (31/jan) e 33 (28/fev); marco sem nada.
  beforeAll(async () => {
    ana = await login('Ana');
    bruno = await login('Bruno');

    const { data: asset } = await ana.client
      .from('assets')
      .insert({
        user_id: ana.id,
        ticker: 'PETR4',
        name: 'Petrobras',
        category: 'acoes',
        current_price: 33,
      })
      .select('id')
      .single();

    await ana.client.from('transactions').insert([
      {
        user_id: ana.id,
        asset_id: asset.id,
        type: 'buy',
        quantity: 100,
        price: 30,
        transaction_date: '2026-01-10',
      },
      {
        user_id: ana.id,
        asset_id: asset.id,
        type: 'buy',
        quantity: 100,
        price: 34,
        transaction_date: '2026-02-10',
      },
    ]);
    await admin.from('quotes_history').insert([
      { asset_id: asset.id, price: 31, quote_date: '2026-01-31' },
      { asset_id: asset.id, price: 33, quote_date: '2026-02-28' },
    ]);
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region returns
  it('CA06.2: monthly_returns reproduz a planilha de referencia', async () => {
    const { data, error } = await ana.client
      .from('monthly_returns')
      .select('month, value, net_flow, return_brl')
      .order('month');

    expect(error).toBeNull();
    expect(
      data.map((r) => [r.month, Number(r.value), Number(r.net_flow), Number(r.return_brl)])
    ).toEqual([
      ['2026-01-01', 3100, 3000, 100],
      ['2026-02-01', 6600, 3400, 100],
    ]);
  });

  it('CA06.1: marco nao aparece na view (lacuna, nao zero)', async () => {
    const { data } = await ana.client.from('monthly_returns').select('month');
    expect(data.some((r) => r.month.startsWith('2026-03'))).toBe(false);
  });

  it('CA06.3: a view e security_invoker, Bruno nao ve a serie da Ana', async () => {
    const { data } = await bruno.client.from('monthly_returns').select('month');
    expect(data).toEqual([]);
  });

  it('TK06-4: allocation_by_category soma posicao x cotacao atual', async () => {
    const { data } = await ana.client.from('allocation_by_category').select('category, value');
    expect(data).toEqual([{ category: 'acoes', value: expect.anything() }]);
    expect(Number(data[0].value)).toBe(6600);
  });
  // #endregion

  // #region admin
  it('CA06.5: admin_metrics devolve zero linhas para investidor e uma para admin', async () => {
    const { data: investor } = await ana.client.rpc('admin_metrics');
    expect(investor).toEqual([]);

    await admin.from('profiles').update({ role: 'admin' }).eq('id', bruno.id);
    const { data: rows } = await bruno.client.rpc('admin_metrics');

    expect(rows).toHaveLength(1);
    expect(Number(rows[0].active_accounts)).toBeGreaterThanOrEqual(2);
    expect(Number(rows[0].aum)).toBeGreaterThanOrEqual(6600);
    expect(Object.keys(rows[0])).not.toContain('ticker');
  });

  it('TK06-5: quote_runs e legivel so pelo admin', async () => {
    const { data: investor, error } = await ana.client.from('quote_runs').select('id');
    expect(error).toBeNull();
    expect(investor).toEqual([]);

    const { error: adminError } = await bruno.client.from('quote_runs').select('id');
    expect(adminError).toBeNull();
  });

  it('TK06-6: um investidor nao se promove a admin', async () => {
    const { error } = await ana.client.from('profiles').update({ role: 'admin' }).eq('id', ana.id);
    expect(error.code).toBe('42501');
  });

  it('TK06-7: a sonda do banco responde', async () => {
    const { data } = await ana.client.rpc('ping');
    expect(data).toBe('pong');
  });
  // #endregion
});
