import { describe, expect, it, vi } from 'vitest';

const invoke = vi.fn();
vi.mock('../lib/supabase-client.js', () => ({ supabase: { functions: { invoke } } }));

const { describeRun, updateQuotes } = await import('./quotes.js');

// TK04-6: o botao invoca a funcao pelo SDK e traduz o resumo.
describe('quotes service', () => {
  it('invoca update-quotes com POST', async () => {
    invoke.mockResolvedValue({ data: {}, error: null });

    await updateQuotes();

    expect(invoke).toHaveBeenCalledWith('update-quotes', { method: 'POST' });
  });

  it('descreve o resumo com as falhas por ticker', () => {
    expect(describeRun({ updated: 12, failed: [] })).toBe('12 atualizado(s)');
    expect(describeRun({ updated: 2, failed: [{ ticker: 'XPTO3' }] })).toBe(
      '2 atualizado(s), 1 sem cotacao (XPTO3)'
    );
  });
});
