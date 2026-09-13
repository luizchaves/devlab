import { describe, expect, it, vi } from 'vitest';

const session = { user: { id: 'u1', email: 'ana@example.com' } };
const single = vi.fn();
vi.mock('./require-session.js', () => ({ requireSession: vi.fn().mockResolvedValue(session) }));
vi.mock('../lib/supabase-client.js', () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ single }) }) }) },
}));

const { requireAdmin } = await import('./require-admin.js');

// #region guard
describe('requireAdmin (TK06-6)', () => {
  it('manda o investidor de volta para a carteira e nunca resolve', async () => {
    single.mockResolvedValue({ data: { role: 'investor' } });
    const location = { replace: vi.fn() };

    const settled = await Promise.race([
      requireAdmin({ location }),
      new Promise((r) => setTimeout(() => r('pendente'), 20)),
    ]);

    expect(location.replace).toHaveBeenCalledWith('/dashboard');
    expect(settled).toBe('pendente');
  });

  it('devolve a sessao para admin', async () => {
    single.mockResolvedValue({ data: { role: 'admin' } });
    const location = { replace: vi.fn() };

    await expect(requireAdmin({ location })).resolves.toBe(session);
    expect(location.replace).not.toHaveBeenCalled();
  });
});
// #endregion
