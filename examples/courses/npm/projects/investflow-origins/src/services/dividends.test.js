import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
const upsert = vi.fn();
const from = vi.fn(() => ({ upsert }));
vi.mock('../lib/supabase-client.js', () => ({ supabase: { from } }));

const { fetchAndSyncDividends } = await import('./dividends.js');

const hglg11 = { id: 'asset-1', ticker: 'HGLG11', category: 'fiis' };
const yahoo = (dividends) => ({
  ok: true,
  status: 200,
  json: async () => ({ chart: { result: [{ events: dividends ? { dividends } : undefined }] } }),
});
// #endregion

describe('fetchAndSyncDividends (TK09-2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    upsert.mockResolvedValue({ error: null });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('CA09.2: categoria sem proventos por cota nao consulta o provedor', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const result = await fetchAndSyncDividends({
      id: 'x',
      ticker: 'CDB-BB',
      category: 'renda_fixa',
    });

    expect(result).toEqual({ count: 0, message: 'Categoria não possui proventos por cota' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('CA09.3: grava os eventos por upsert em (asset_id, ex_date)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        yahoo({
          1743379200: { amount: 1.1, date: 1743379200 }, // 2025-03-31
          1746000000: { amount: 1.2, date: 1746000000 }, // 2025-04-30
        })
      )
    );

    const result = await fetchAndSyncDividends(hglg11);

    expect(result.count).toBe(2);
    expect(from).toHaveBeenCalledWith('dividends_history');
    expect(upsert).toHaveBeenCalledWith(
      [
        { asset_id: 'asset-1', rate: 1.1, ex_date: '2025-03-31', payment_date: '2025-03-31' },
        { asset_id: 'asset-1', rate: 1.2, ex_date: '2025-04-30', payment_date: '2025-04-30' },
      ],
      { onConflict: 'asset_id,ex_date' }
    );
    // Ticker da B3: o primeiro candidato leva o sufixo .SA.
    expect(fetch.mock.calls[0][0]).toContain('/HGLG11.SA?');
  });

  it('CA09.4: provedor fora do ar devolve erro sem tocar no banco', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rede indisponivel')));

    const result = await fetchAndSyncDividends(hglg11);

    expect(result).toEqual({ count: 0, error: 'rede indisponivel' });
    expect(upsert).not.toHaveBeenCalled();
  });

  it('CA09.4: ticker desconhecido em todos os candidatos vira aviso, nao erro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    const result = await fetchAndSyncDividends({ ...hglg11, ticker: 'XPTO3' });

    expect(result).toEqual({ count: 0, message: 'Nenhum provento encontrado no provedor' });
    expect(upsert).not.toHaveBeenCalled();
  });
});
