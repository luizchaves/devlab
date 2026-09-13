import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 9 contra a stack local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let bruno;
  let hglg11;

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
      .insert({ user_id: ana.id, ticker: 'HGLG11', name: 'CSHG Logistica', category: 'fiis' })
      .select('id')
      .single();
    hglg11 = data;
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region rls
  it('CA09.1: dividends_history e lida e escrita so pelo dono do ativo', async () => {
    const event = {
      asset_id: hglg11.id,
      rate: 1.1,
      ex_date: '2026-03-31',
      payment_date: '2026-04-15',
    };

    const own = await ana.client.from('dividends_history').insert(event);
    const cross = await bruno.client
      .from('dividends_history')
      .insert({ ...event, ex_date: '2026-04-30' });
    const { data: seenByBruno } = await bruno.client
      .from('dividends_history')
      .select('id')
      .eq('asset_id', hglg11.id);
    const { data: seenByAna } = await ana.client
      .from('dividends_history')
      .select('rate, ex_date, payment_date')
      .eq('asset_id', hglg11.id);
    seenByAna[0].rate = Number(seenByAna[0].rate);

    expect(own.error).toBeNull();
    expect(cross.error.code).toBe('42501');
    expect(seenByBruno).toEqual([]);
    expect(seenByAna).toEqual([{ rate: 1.1, ex_date: '2026-03-31', payment_date: '2026-04-15' }]);
  });
  // #endregion

  // #region idempotent
  it('CA09.3: repetir a carga deixa uma linha por data ex', async () => {
    const rows = [
      { asset_id: hglg11.id, rate: 1.1, ex_date: '2026-03-31', payment_date: '2026-04-15' },
      { asset_id: hglg11.id, rate: 1.2, ex_date: '2026-04-30', payment_date: '2026-05-15' },
    ];
    const first = await ana.client
      .from('dividends_history')
      .upsert(rows, { onConflict: 'asset_id,ex_date' });
    const second = await ana.client
      .from('dividends_history')
      .upsert(rows, { onConflict: 'asset_id,ex_date' });
    const duplicate = await ana.client.from('dividends_history').insert(rows[0]);

    expect(first.error).toBeNull();
    expect(second.error).toBeNull();
    expect(duplicate.error.code).toBe('23505');

    const { data } = await ana.client
      .from('dividends_history')
      .select('ex_date')
      .eq('asset_id', hglg11.id)
      .order('ex_date');
    expect(data.map((d) => d.ex_date)).toEqual(['2026-03-31', '2026-04-30']);
  });
  // #endregion
});
