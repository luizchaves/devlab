import { describe, expect, it, vi } from 'vitest';

const getSession = vi.fn();
vi.mock('../services/auth.js', () => ({ getSession }));

const { requireSession } = await import('./require-session.js');

// #region guard
describe('requireSession (TK02-4)', () => {
  it('redireciona para signin.html sem sessao e nunca resolve', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const location = { replace: vi.fn() };

    const pending = requireSession({ location });
    const settled = await Promise.race([
      pending,
      new Promise((r) => setTimeout(() => r('pendente'), 20)),
    ]);

    expect(location.replace).toHaveBeenCalledWith('./signin.html');
    expect(settled).toBe('pendente');
  });

  it('devolve a sessao quando ela existe', async () => {
    const session = { user: { email: 'ana@example.com' } };
    getSession.mockResolvedValue({ data: { session } });
    const location = { replace: vi.fn() };

    await expect(requireSession({ location })).resolves.toBe(session);
    expect(location.replace).not.toHaveBeenCalled();
  });
});
// #endregion
