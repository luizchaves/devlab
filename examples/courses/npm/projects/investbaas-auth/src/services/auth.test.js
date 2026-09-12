import { beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
// O SDK inteiro vira um dublê: o teste de unidade prova o que o servico faz com
// ele, nao o que o Supabase responde (isso e o teste de integracao).
const auth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
};

vi.mock('../lib/supabase-client.js', () => ({ supabase: { auth } }));

const { INVALID_CREDENTIALS, onSessionEnd, signIn, signOut, signUp } = await import('./auth.js');
// #endregion

beforeEach(() => vi.clearAllMocks());

// #region sign-up
describe('signUp (TK02-2)', () => {
  it('envia o nome como metadado, para a trigger de profiles copiar', async () => {
    auth.signUp.mockResolvedValue({ data: {}, error: null });

    await signUp({ fullName: 'Ana', email: 'ana@example.com', password: 'senha-de-teste' });

    expect(auth.signUp).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'senha-de-teste',
      options: { data: { full_name: 'Ana' } },
    });
  });
});
// #endregion

// #region sign-in
describe('signIn (TK02-3)', () => {
  it('devolve a mesma mensagem para senha errada e e-mail inexistente', async () => {
    auth.signInWithPassword.mockResolvedValueOnce({
      data: {},
      error: { message: 'Invalid login credentials', status: 400 },
    });
    auth.signInWithPassword.mockResolvedValueOnce({
      data: {},
      error: { message: 'User not found', status: 400 },
    });

    const wrongPassword = await signIn({ email: 'ana@example.com', password: 'errada' });
    const unknownEmail = await signIn({ email: 'ninguem@example.com', password: 'x' });

    expect(wrongPassword.error.message).toBe(INVALID_CREDENTIALS);
    expect(unknownEmail.error.message).toBe(INVALID_CREDENTIALS);
  });

  it('devolve a sessao sem erro quando as credenciais batem', async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { session: { access_token: 'jwt' } },
      error: null,
    });

    const result = await signIn({ email: 'ana@example.com', password: 'senha-de-teste' });

    expect(result.error).toBeNull();
    expect(result.data.session.access_token).toBe('jwt');
  });
});
// #endregion

// #region session
describe('sessao (TK02-5)', () => {
  it('signOut delega ao SDK', async () => {
    auth.signOut.mockResolvedValue({ error: null });

    await signOut();

    expect(auth.signOut).toHaveBeenCalledOnce();
  });

  it('onSessionEnd so dispara no evento SIGNED_OUT', () => {
    const callback = vi.fn();
    onSessionEnd(callback);

    const listener = auth.onAuthStateChange.mock.calls[0][0];
    listener('TOKEN_REFRESHED');
    listener('SIGNED_OUT');

    expect(callback).toHaveBeenCalledOnce();
  });
});
// #endregion
