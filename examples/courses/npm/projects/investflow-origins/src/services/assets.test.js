import { beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
const insert = vi.fn();
const update = vi.fn();
const deleteCall = vi.fn();
const from = vi.fn();
const auth = { getUser: vi.fn() };
vi.mock('../lib/supabase-client.js', () => ({ supabase: { from, auth } }));
vi.mock('./brokers.js', () => ({ findOrCreateBroker: vi.fn() }));

const { findOrCreateBroker } = await import('./brokers.js');
const { createAsset, deleteAsset, getAsset, getAssetByTicker, listAssets, updateAsset } =
  await import('./assets.js');
// #endregion

beforeEach(() => {
  vi.clearAllMocks();
  auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  from.mockReturnValue({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'asset-1' }, error: null }),
      }),
      ilike: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: { ticker: 'PETR4' }, error: null }),
      }),
    }),
    insert: insert.mockReturnValue({
      select: vi
        .fn()
        .mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) }),
    }),
    update: update.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) }),
      }),
    }),
    delete: deleteCall.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  });
});

// #region create
describe('createAsset (TK03-7, TK03-10)', () => {
  it('normaliza o ticker, resolve a corretora e envia o user_id do token', async () => {
    findOrCreateBroker.mockResolvedValue({ data: { id: 'broker-1', name: 'XP' }, error: null });

    await createAsset({
      ticker: ' petr4 ',
      name: ' Petrobras ',
      category: 'acoes',
      issuer: ' Petrobras S.A. ',
      brokerName: 'XP',
    });

    expect(findOrCreateBroker).toHaveBeenCalledWith('XP', 'user-1');
    expect(insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      ticker: 'PETR4',
      name: 'Petrobras',
      category: 'acoes',
      currency: 'BRL',
      issuer: 'Petrobras S.A.',
      broker_id: 'broker-1',
    });
  });

  it('CA10.1: permite cadastrar ativo em USD', async () => {
    findOrCreateBroker.mockResolvedValue({ data: null, error: null });

    await createAsset({
      ticker: 'VT',
      name: 'Vanguard Total World Stock',
      category: 'etfs',
      currency: 'USD',
      issuer: 'Vanguard',
      brokerName: '',
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        ticker: 'VT',
        currency: 'USD',
      })
    );
  });

  it('aceita ativo sem corretora e sem emissor', async () => {
    findOrCreateBroker.mockResolvedValue({ data: null, error: null });

    await createAsset({
      ticker: 'CDB-BB',
      name: 'CDB BB 2027',
      category: 'renda_fixa',
      issuer: '',
      brokerName: '',
    });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ issuer: null, broker_id: null }));
  });

  it('CA08.6: gera ticker automatico para renda fixa quando nao fornecido', async () => {
    findOrCreateBroker.mockResolvedValue({ data: null, error: null });

    await createAsset({
      ticker: '',
      name: 'Tesouro Selic 2029',
      category: 'renda_fixa',
      issuer: 'Tesouro Nacional',
      brokerName: '',
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'renda_fixa',
        name: 'Tesouro Selic 2029',
        ticker: expect.stringMatching(/^RF-TESOUROS-/),
      })
    );
  });
});
// #endregion

// #region mutate
describe('updateAsset (RF03.2)', () => {
  it('normaliza os campos editaveis sem alterar o dono do ativo', async () => {
    findOrCreateBroker.mockResolvedValue({ data: { id: 'broker-2', name: 'BTG' }, error: null });

    await updateAsset('asset-1', {
      ticker: ' hglg11 ',
      name: ' CSHG Logistica ',
      category: 'fiis',
      issuer: ' Credit Suisse Hedging-Griffo ',
      brokerName: 'BTG',
    });

    expect(findOrCreateBroker).toHaveBeenCalledWith('BTG', 'user-1');
    expect(update).toHaveBeenCalledWith({
      ticker: 'HGLG11',
      name: 'CSHG Logistica',
      category: 'fiis',
      issuer: 'Credit Suisse Hedging-Griffo',
      broker_id: 'broker-2',
    });
    expect(update.mock.calls[0][0]).not.toHaveProperty('user_id');
  });

  it('limpa a cotacao atual quando o ativo vira categoria sem cotacao automatica', async () => {
    findOrCreateBroker.mockResolvedValue({ data: null, error: null });

    await updateAsset('asset-1', {
      ticker: ' cdb-bb ',
      name: ' CDB BB ',
      category: 'renda_fixa',
      issuer: ' Banco do Brasil ',
      brokerName: '',
    });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'renda_fixa',
        current_price: null,
      })
    );
  });
});

describe('deleteAsset (RF03.3)', () => {
  it('remove pelo id e deixa o isolamento para o RLS', async () => {
    await deleteAsset('asset-1');

    expect(deleteCall).toHaveBeenCalled();
    expect(deleteCall.mock.results[0].value.eq).toHaveBeenCalledWith('id', 'asset-1');
  });
});
// #endregion

// #region list
describe('listAssets (TK03-6)', () => {
  it('nao filtra por user_id no cliente: isso e do RLS', async () => {
    await listAssets();

    const selected = from.mock.results[0].value.select;
    expect(from).toHaveBeenCalledWith('assets');
    expect(selected).toHaveBeenCalledWith(expect.stringContaining('transactions('));
    expect(selected.mock.calls[0][0]).not.toContain('user_id');
  });
});

describe('getAsset and getAssetByTicker', () => {
  it('retorna nulo quando nenhum identificador e fornecido', async () => {
    const res = await getAsset('');
    expect(res).toEqual({ data: null, error: null });
  });

  it('busca por UUID usando eq("id", ...)', async () => {
    const uuid = '0b04bb5b-cce1-4d81-a7ca-3338cef38769';
    await getAsset(uuid);

    const selectResult = from.mock.results[0].value.select.mock.results[0].value;
    expect(selectResult.eq).toHaveBeenCalledWith('id', uuid);
  });

  it('CA08.18: busca por ticker case-insensitive quando nao for UUID', async () => {
    await getAsset('petr4');

    const selectResult = from.mock.results[0].value.select.mock.results[0].value;
    expect(selectResult.ilike).toHaveBeenCalledWith('ticker', 'PETR4');
  });

  it('busca diretamente por ticker via getAssetByTicker', async () => {
    await getAssetByTicker('vale3');

    const selectResult = from.mock.results[0].value.select.mock.results[0].value;
    expect(selectResult.ilike).toHaveBeenCalledWith('ticker', 'VALE3');
  });
});
// #endregion
