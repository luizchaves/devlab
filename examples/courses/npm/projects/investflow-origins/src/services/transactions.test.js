import { beforeEach, describe, expect, it, vi } from 'vitest';

const insert = vi.fn();
const update = vi.fn();
const deleteCall = vi.fn();
const from = vi.fn();
const auth = { getUser: vi.fn() };
vi.mock('../lib/supabase-client.js', () => ({ supabase: { from, auth } }));

const { createTransaction, updateTransaction, deleteTransaction } = await import(
  './transactions.js'
);

beforeEach(() => {
  vi.clearAllMocks();
  auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  from.mockReturnValue({
    insert: insert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: 'tx-1' }, error: null }),
      }),
    }),
    update: update.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 'tx-1' }, error: null }),
        }),
      }),
    }),
    delete: deleteCall.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  });
});

describe('createTransaction', () => {
  it('cria uma transacao com o user_id do usuario autenticado', async () => {
    const res = await createTransaction({
      assetId: 'asset-1',
      type: 'buy',
      quantity: 100,
      price: 30,
      transactionDate: '2026-03-01',
    });

    expect(from).toHaveBeenCalledWith('transactions');
    expect(insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      asset_id: 'asset-1',
      type: 'buy',
      quantity: 100,
      price: 30,
      transaction_date: '2026-03-01',
    });
    expect(res.data).toEqual({ id: 'tx-1' });
  });
});

describe('updateTransaction', () => {
  it('CA08.1: atualiza os dados da transacao pelo id', async () => {
    const res = await updateTransaction('tx-1', {
      type: 'sell',
      quantity: 50,
      price: 35,
      transactionDate: '2026-03-05',
    });

    expect(from).toHaveBeenCalledWith('transactions');
    expect(update).toHaveBeenCalledWith({
      type: 'sell',
      quantity: 50,
      price: 35,
      transaction_date: '2026-03-05',
    });
    expect(res.data).toEqual({ id: 'tx-1' });
  });
});

describe('deleteTransaction', () => {
  it('CA08.2: remove a transacao pelo id', async () => {
    await deleteTransaction('tx-1');

    expect(from).toHaveBeenCalledWith('transactions');
    expect(deleteCall).toHaveBeenCalled();
    expect(deleteCall.mock.results[0].value.eq).toHaveBeenCalledWith('id', 'tx-1');
  });
});
