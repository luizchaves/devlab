import { beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
const insert = vi.fn();
const from = vi.fn();
const auth = { getUser: vi.fn() };
vi.mock('../lib/supabase-client.js', () => ({ supabase: { from, auth } }));
vi.mock('./brokers.js', () => ({ findOrCreateBroker: vi.fn() }));

const { findOrCreateBroker } = await import('./brokers.js');
const { createAsset, listAssets } = await import('./assets.js');
// #endregion

beforeEach(() => {
  vi.clearAllMocks();
  auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  from.mockReturnValue({
    select: vi
      .fn()
      .mockReturnValue({ order: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    insert: insert.mockReturnValue({
      select: vi
        .fn()
        .mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) }),
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
      issuer: 'Petrobras S.A.',
      broker_id: 'broker-1',
    });
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
// #endregion
