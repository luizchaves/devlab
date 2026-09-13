import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { summarize } from '../../src/lib/portfolio.js';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 8 contra a stack local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let bruno;
  let cdb;

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

  beforeAll(async () => {
    ana = await login('Ana');
    bruno = await login('Bruno');
    const { data } = await ana.client
      .from('assets')
      .insert({ user_id: ana.id, ticker: 'CDB-BB', name: 'CDB BB', category: 'renda_fixa' })
      .select('id')
      .single();
    cdb = data;
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region categories
  it('CA08.5: as sete categorias sao aceitas, e so elas', async () => {
    const categories = ['renda_fixa', 'acoes', 'fiis', 'etfs', 'fi_infra', 'fundos', 'cripto'];
    const { data, error } = await ana.client
      .from('assets')
      .insert(
        categories.map((category) => ({
          user_id: ana.id,
          ticker: `CAT-${category.toUpperCase()}`,
          name: category,
          category,
        }))
      )
      .select('category');

    expect(error).toBeNull();
    expect(data.map((a) => a.category).sort()).toEqual([...categories].sort());
  });
  // #endregion

  // #region balance
  it('CA08.7 / CA08.8: o lancamento update redefine a posicao pelo saldo', async () => {
    await ana.client.from('transactions').insert([
      {
        user_id: ana.id,
        asset_id: cdb.id,
        type: 'buy',
        quantity: 1000,
        price: 1,
        transaction_date: '2026-01-15',
      },
      {
        user_id: ana.id,
        asset_id: cdb.id,
        type: 'update',
        quantity: 1080,
        price: 1,
        transaction_date: '2026-06-30',
      },
    ]);

    const { data: asset } = await ana.client
      .from('assets')
      .select('*, transactions(*)')
      .eq('id', cdb.id)
      .single();
    const s = summarize(asset);
    expect(s.quantity).toBe(1080);
    expect(s.cost).toBe(1080);
    expect(s.realized).toBe(0);
    expect(asset.transactions).toHaveLength(2);

    // No treemap, o ativo por saldo vale a posicao, sem depender de current_price.
    const { data: origin } = await ana.client
      .from('allocation_by_origin')
      .select('value')
      .eq('asset_id', cdb.id)
      .single();
    expect(Number(origin.value)).toBe(1080);
  });
  // #endregion

  // #region manual-quote
  it('CA08.11: a cotacao manual entra em quotes_history so pelo dono do ativo', async () => {
    const { data: asset } = await ana.client
      .from('assets')
      .insert({ user_id: ana.id, ticker: 'XPTO3', name: 'Fora do provedor', category: 'acoes' })
      .select('id')
      .single();

    const manual = { asset_id: asset.id, price: 12.5, quote_date: '2026-07-01' };
    const own = await ana.client
      .from('quotes_history')
      .upsert(manual, { onConflict: 'asset_id,quote_date' });
    const again = await ana.client
      .from('quotes_history')
      .upsert({ ...manual, price: 13 }, { onConflict: 'asset_id,quote_date' });
    const cross = await bruno.client.from('quotes_history').insert(manual);

    expect(own.error).toBeNull();
    expect(again.error).toBeNull();
    expect(cross.error.code).toBe('42501');

    const { data: rows } = await ana.client
      .from('quotes_history')
      .select('price')
      .eq('asset_id', asset.id);
    expect(rows).toHaveLength(1);
    expect(Number(rows[0].price)).toBe(13);
  });
  // #endregion
});
