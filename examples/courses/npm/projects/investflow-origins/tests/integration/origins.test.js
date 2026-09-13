import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  attachCumulativeDividends,
  fillContinuousMonths,
  filterMovementMonths,
  toSeries,
} from '../../src/services/origins.js';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 7 contra a stack local', () => {
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

  // Dois ativos em corretoras e emissores diferentes; PETR4 com a planilha da Sprint 6.
  beforeAll(async () => {
    ana = await login('Ana');
    bruno = await login('Bruno');

    const { data: brokers } = await ana.client
      .from('brokers')
      .insert([
        { user_id: ana.id, name: 'XP' },
        { user_id: ana.id, name: 'Banco do Brasil' },
      ])
      .select('id, name');
    const xp = brokers.find((b) => b.name === 'XP');
    const bb = brokers.find((b) => b.name === 'Banco do Brasil');

    const { data: assets } = await ana.client
      .from('assets')
      .insert([
        {
          user_id: ana.id,
          ticker: 'PETR4',
          name: 'Petrobras',
          category: 'acoes',
          issuer: 'Petrobras',
          broker_id: xp.id,
          current_price: 33,
        },
        {
          user_id: ana.id,
          ticker: 'CDB-BB',
          name: 'CDB BB',
          category: 'renda_fixa',
          issuer: 'Banco do Brasil',
          broker_id: bb.id,
          current_price: 1,
        },
      ])
      .select('id, ticker');
    const petr4 = assets.find((a) => a.ticker === 'PETR4');
    const cdb = assets.find((a) => a.ticker === 'CDB-BB');

    await ana.client.from('transactions').insert([
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
      {
        user_id: ana.id,
        asset_id: cdb.id,
        type: 'buy',
        quantity: 1000,
        price: 1,
        transaction_date: '2026-01-15',
      },
    ]);
    await admin.from('quotes_history').insert([
      { asset_id: petr4.id, price: 31, quote_date: '2026-01-31' },
      { asset_id: petr4.id, price: 33, quote_date: '2026-02-28' },
    ]);
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region origin
  it('CA07.1 / CA07.2: allocation_by_origin traz as tres dimensoes e o valor atual', async () => {
    const { data } = await ana.client
      .from('allocation_by_origin')
      .select('ticker, broker, category, issuer, value')
      .order('ticker');

    expect(data).toEqual([
      {
        ticker: 'CDB-BB',
        broker: 'Banco do Brasil',
        category: 'renda_fixa',
        issuer: 'Banco do Brasil',
        value: expect.anything(),
      },
      {
        ticker: 'PETR4',
        broker: 'XP',
        category: 'acoes',
        issuer: 'Petrobras',
        value: expect.anything(),
      },
    ]);
    expect(data.map((r) => Number(r.value))).toEqual([1000, 6600]);
  });

  it('CA07.3: a view e security_invoker', async () => {
    const { data } = await bruno.client.from('allocation_by_origin').select('ticker');
    expect(data).toEqual([]);
  });
  // #endregion

  // #region evolution
  it('CA07.4 / CA07.6: portfolio_evolution reproduz aportado x valor da planilha, sem marco', async () => {
    const { data } = await ana.client
      .from('portfolio_evolution')
      .select('month, invested, value')
      .order('month');

    expect(data.map((r) => [r.month, Number(r.invested), Number(r.value)])).toEqual([
      ['2026-01-01', 3000, 3100],
      ['2026-02-01', 6400, 6600],
    ]);
  });

  it('CA07.5: a serie do ativo e a serie da carteira coincidem quando so um ativo tem cotacao', async () => {
    const { data: all } = await ana.client.from('portfolio_evolution').select('asset_id, month');
    const assets = new Set(all.map((r) => r.asset_id));

    // O CDB nao tem cotacao: nao entra na evolucao, por construcao.
    expect(assets.size).toBe(1);
  });

  it('CA07.7: modo continuo preenche os meses intermediarios com a ultima posicao', () => {
    const sparse = [
      { month: '2026-01-01', invested: 1000, value: 1100 },
      { month: '2026-04-01', invested: 2000, value: 2300 },
    ];
    const continuous = fillContinuousMonths(sparse);
    expect(continuous.map((r) => r.month)).toEqual([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
      '2026-04-01',
    ]);
    expect(continuous[1]).toEqual({ month: '2026-02-01', invested: 1000, value: 1100 });
    expect(continuous[2]).toEqual({ month: '2026-03-01', invested: 1000, value: 1100 });
    expect(continuous[3]).toEqual({ month: '2026-04-01', invested: 2000, value: 2300 });
  });

  it('CA07.7: modo eventos deixa so os meses com movimentacao', () => {
    const rows = [
      { month: '2026-01-01', invested: 1000, value: 1050 },
      { month: '2026-02-01', invested: 1000, value: 1080 },
      { month: '2026-03-01', invested: 1500, value: 1600 },
      { month: '2026-04-01', invested: 1500, value: 1550 },
      { month: '2026-05-01', invested: 1200, value: 1300 },
    ];

    // Com conjunto explicito de meses
    const txMonths = new Set(['2026-01', '2026-03', '2026-05']);
    const filteredBySet = filterMovementMonths(rows, txMonths);
    expect(filteredBySet.map((r) => r.month)).toEqual(['2026-01-01', '2026-03-01', '2026-05-01']);

    // Fallback: variacao no valor investido
    const filteredByDelta = filterMovementMonths(rows);
    expect(filteredByDelta.map((r) => r.month)).toEqual(['2026-01-01', '2026-03-01', '2026-05-01']);
  });

  it('CA09.11: a serie Valor + Proventos acumula os proventos pagos ate cada mes', () => {
    const rows = [
      { month: '2026-01-01', invested: 1000, value: 1050 },
      { month: '2026-02-01', invested: 1000, value: 1080 },
      { month: '2026-03-01', invested: 1500, value: 1600 },
    ];
    const divs = [
      { paymentDate: '2026-01-15', total: 50 },
      { paymentDate: '2026-02-15', total: 60 },
      { paymentDate: '2026-03-15', total: 70 },
    ];

    const withDivs = attachCumulativeDividends(rows, divs);
    expect(withDivs[0].dividendsAcc).toBe(50);
    expect(withDivs[1].dividendsAcc).toBe(110);
    expect(withDivs[2].dividendsAcc).toBe(180);

    const series = toSeries(withDivs, { includeDividends: true });
    expect(series.length).toBe(3);
    expect(series[2].name).toBe('Valor + Proventos');
    expect(series[2].points.map((p) => p.value)).toEqual([1050 + 50, 1080 + 110, 1600 + 180]);
  });
  // #endregion
});
