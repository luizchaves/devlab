import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';

// #region setup
describe.skipIf(!hasStack)('Sprint 2 contra a stack local', () => {
  const admin = adminClient();
  const created = [];

  async function createUser(fullName) {
    const client = anonClient();
    const email = uniqueEmail(fullName.toLowerCase());
    const { data, error } = await client.auth.signUp({
      email,
      password: PASSWORD,
      options: { data: { full_name: fullName } },
    });

    expect(error).toBeNull();
    created.push(data.user.id);

    return { client, email, user: data.user };
  }

  afterAll(async () => {
    for (const id of created) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region signup
  it('TK02-2: o cadastro cria o usuario em auth.users', async () => {
    const { email, user } = await createUser('Ana');

    const { data } = await admin.auth.admin.getUserById(user.id);

    expect(data.user.email).toBe(email);
    expect(data.user.user_metadata.full_name).toBe('Ana');
  });

  it('TK02-6: a trigger cria o profile com o mesmo id e o nome do cadastro', async () => {
    const { user } = await createUser('Bruno');

    const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single();

    expect(profile.full_name).toBe('Bruno');
    expect(profile.role).toBe('investor');
  });
  // #endregion

  // #region signin
  it('TK02-3: senha errada e e-mail inexistente respondem o mesmo erro', async () => {
    const { email } = await createUser('Carla');
    const client = anonClient();

    const wrong = await client.auth.signInWithPassword({ email, password: 'errada-errada' });
    const unknown = await client.auth.signInWithPassword({
      email: uniqueEmail('ninguem'),
      password: PASSWORD,
    });

    expect(wrong.error.status).toBe(400);
    expect(unknown.error.status).toBe(400);
    expect(wrong.error.message).toBe(unknown.error.message);
  });

  it('TK02-3: credenciais validas devolvem uma sessao com JWT', async () => {
    const { email } = await createUser('Dora');
    const client = anonClient();

    const { data, error } = await client.auth.signInWithPassword({ email, password: PASSWORD });

    expect(error).toBeNull();
    expect(data.session.access_token.split('.')).toHaveLength(3);
  });
  // #endregion

  // #region rls
  it('TK02-6: cada pessoa le apenas o proprio profile (RLS)', async () => {
    const ana = await createUser('Ana');
    const bruno = await createUser('Bruno');

    const { data: own } = await ana.client.from('profiles').select('id');
    const { data: other } = await ana.client.from('profiles').select('id').eq('id', bruno.user.id);

    expect(own.map((p) => p.id)).toEqual([ana.user.id]);
    // 404 seria confirmar que existe: a resposta e uma lista vazia, com status 200.
    expect(other).toEqual([]);
  });

  it('TK02-6: ninguem promove a si mesmo a admin pelo SDK', async () => {
    const ana = await createUser('Ana');

    const { error } = await ana.client
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', ana.user.id);
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', ana.user.id)
      .single();

    // 42501: permission denied. O grant de update cobre so full_name.
    expect(error.code).toBe('42501');
    expect(profile.role).toBe('investor');

    const renamed = await ana.client
      .from('profiles')
      .update({ full_name: 'Ana Souza' })
      .eq('id', ana.user.id);
    expect(renamed.error).toBeNull();
  });
  // #endregion
});
// #endregion
