import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';
// Um PNG de 1x1 pixel: o menor arquivo valido que o bucket aceita.
const png = () =>
  new Blob(
    [
      Uint8Array.from(
        atob(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        ),
        (c) => c.charCodeAt(0)
      ),
    ],
    { type: 'image/png' }
  );

// #region setup
describe.skipIf(!hasStack)('Sprint 11 contra a stack local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let bruno;

  async function login(name) {
    const client = anonClient();
    const { data, error } = await client.auth.signUp({
      email: uniqueEmail(name.toLowerCase()),
      password: PASSWORD,
      options: { data: { full_name: name } },
    });
    expect(error).toBeNull();
    users.push(data.user.id);
    return { client, id: data.user.id };
  }

  beforeAll(async () => {
    ana = await login('Ana');
    bruno = await login('Bruno');
  });

  afterAll(async () => {
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region bucket
  it('CA11.2: o bucket avatars e publico, limita a 2 MB e aceita so imagens', async () => {
    const { data } = await admin.storage.getBucket('avatars');

    expect(data.public).toBe(true);
    expect(data.file_size_limit).toBe(2 * 1024 * 1024);
    expect(data.allowed_mime_types).toEqual(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
  });

  it('CA11.2: o dono envia para a propria pasta, e outra conta nao', async () => {
    const path = `${ana.id}/avatar-${Date.now()}.png`;
    const own = await ana.client.storage
      .from('avatars')
      .upload(path, png(), { contentType: 'image/png' });
    const cross = await bruno.client.storage
      .from('avatars')
      .upload(`${ana.id}/avatar-hack.png`, png(), { contentType: 'image/png' });
    const publicUrl = ana.client.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    const res = await fetch(publicUrl);

    expect(own.error).toBeNull();
    expect(cross.error.message).toMatch(/row-level security/i);
    // Publico: a URL abre sem sessao, e por isso o avatar nunca leva dado sensivel.
    expect(res.status).toBe(200);
  });
  // #endregion

  // #region profile
  it('CA11.4: o cliente edita nome e avatar do proprio perfil, e nada mais', async () => {
    const { data, error } = await ana.client
      .from('profiles')
      .update({ full_name: 'Ana Editada', avatar_url: 'https://example.com/a.png' })
      .eq('id', ana.id)
      .select('full_name, avatar_url')
      .single();
    expect(error).toBeNull();
    expect(data).toEqual({ full_name: 'Ana Editada', avatar_url: 'https://example.com/a.png' });

    const { error: denied } = await ana.client
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', ana.id);
    expect(denied.code).toBe('42501');

    const cleared = await ana.client
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', ana.id)
      .select('avatar_url')
      .single();
    expect(cleared.data.avatar_url).toBeNull();
  });
  // #endregion
});
