import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { url, adminClient, anonClient, anonKey, hasStack, serviceKey, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';
const FUNCTION_URL = `${url}/functions/v1/update-quotes`;

// #region setup
describe.skipIf(!hasStack)('Sprint 4 contra o edge runtime local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let petr4;
  let xpto3;

  async function login(name) {
    const client = anonClient();
    const { data, error } = await client.auth.signUp({
      email: uniqueEmail(name.toLowerCase()),
      password: PASSWORD,
      options: { data: { full_name: name } },
    });
    expect(error).toBeNull();
    users.push(data.user.id);
    return { client, id: data.user.id, token: data.session.access_token };
  }

  const invoke = (token) =>
    fetch(FUNCTION_URL, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });

  beforeAll(async () => {
    ana = await login('Ana');
    const { data } = await ana.client
      .from('assets')
      .insert([
        { user_id: ana.id, ticker: 'PETR4', name: 'Petrobras', category: 'acoes' },
        { user_id: ana.id, ticker: 'XPTO3', name: 'Inexistente', category: 'acoes' },
        { user_id: ana.id, ticker: 'CDB-BB', name: 'CDB BB', category: 'renda_fixa' },
      ])
      .select('id, ticker');
    petr4 = data.find((a) => a.ticker === 'PETR4');
    xpto3 = data.find((a) => a.ticker === 'XPTO3');
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region auth
  it('TK04-2: sem sessao valida responde 401 antes de qualquer consulta', async () => {
    const res = await invoke(anonKey);

    expect(res.status).toBe(401);
  });
  // #endregion

  // #region run
  it('CA04.1 / CA04.2: atualiza os elegiveis, registra a falha por ticker e ignora renda fixa', async () => {
    const res = await invoke(ana.token);
    const summary = await res.json();

    expect(res.status).toBe(200);
    expect(summary.requested).toBe(2); // PETR4 e XPTO3; CDB-BB nao e elegivel
    expect(summary.updated).toBe(1);
    expect(summary.failed).toEqual([{ ticker: 'XPTO3', reason: 'not_found' }]);

    const { data: asset } = await ana.client
      .from('assets')
      .select('current_price')
      .eq('id', petr4.id)
      .single();
    expect(Number(asset.current_price)).toBe(38.42);
  });

  it('CA04.1: rodar duas vezes no mesmo dia deixa uma linha por ativo em quotes_history', async () => {
    await invoke(ana.token);
    await invoke(ana.token);

    const { data } = await ana.client
      .from('quotes_history')
      .select('quote_date')
      .eq('asset_id', petr4.id);

    expect(data).toHaveLength(1);
  });

  it('TK04-7: cada execucao grava um resumo em quote_runs, ilegivel pelo cliente', async () => {
    const before = (await admin.from('quote_runs').select('id', { count: 'exact', head: true }))
      .count;
    await invoke(ana.token);
    const after = (await admin.from('quote_runs').select('id', { count: 'exact', head: true }))
      .count;

    expect(after).toBe(before + 1);

    const { error } = await ana.client.from('quote_runs').select('id');
    expect(error.code).toBe('42501');
  });

  it('TK04-2: a chamada agendada usa a chave de servico e nao precisa de sessao', async () => {
    const res = await invoke(serviceKey);

    expect(res.status).toBe(200);
  });
  // #endregion

  // #region schedule
  it('TK04-8: o agendamento registra o job no pg_cron', async () => {
    const { data: jobId, error } = await admin.rpc('schedule_update_quotes', {
      function_url: FUNCTION_URL,
      secret_name: 'service_role_key',
    });

    expect(error).toBeNull();
    expect(jobId).toBeGreaterThan(0);

    const { error: denied } = await ana.client.rpc('schedule_update_quotes', {
      function_url: 'x',
      secret_name: 'y',
    });
    expect(denied.code).toBe('42501');
  });
  // #endregion
});
