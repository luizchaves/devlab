import { describe, expect, it } from 'vitest';
import { collectQuotes, fakeProvider } from './logic.ts';

// TK04-3 e TK04-5: a logica pura da funcao roda no Vitest, sem edge runtime.

// #region fake
describe('fakeProvider', () => {
  it('devolve preco so para os tickers que conhece', async () => {
    const quotes = await fakeProvider.fetchQuotes(['PETR4', 'XPTO3']);

    expect(quotes).toHaveLength(1);
    expect(quotes[0]).toMatchObject({ ticker: 'PETR4', price: 38.42 });
  });
});
// #endregion

// #region partial
describe('collectQuotes', () => {
  it('registra como not_found o ticker que o provedor nao devolveu', async () => {
    const { quotes, failed } = await collectQuotes(fakeProvider, ['PETR4', 'XPTO3']);

    expect(quotes.map((q) => q.ticker)).toEqual(['PETR4']);
    expect(failed).toEqual([{ ticker: 'XPTO3', reason: 'not_found' }]);
  });

  it('marca todos como provider_error quando o provedor inteiro falha', async () => {
    const broken = {
      fetchQuotes: async () => {
        throw new Error('429');
      },
    };
    const { quotes, failed } = await collectQuotes(broken, ['PETR4', 'VALE3']);

    expect(quotes).toEqual([]);
    expect(failed.map((f) => f.reason)).toEqual(['provider_error', 'provider_error']);
  });

  it('nao chama o provedor com lista vazia', async () => {
    let calls = 0;
    const spy = {
      fetchQuotes: async () => {
        calls += 1;
        return [];
      },
    };

    await collectQuotes(spy, []);

    expect(calls).toBe(0);
  });
});
// #endregion
