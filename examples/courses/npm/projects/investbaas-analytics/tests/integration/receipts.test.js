import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, anonClient, hasStack, uniqueEmail } from './env.js';

const PASSWORD = 'senha-de-teste';
const pdf = () => new Blob(['%PDF-1.4 teste'], { type: 'application/pdf' });

// #region setup
describe.skipIf(!hasStack)('Sprint 5 contra o Storage local', () => {
  const admin = adminClient();
  const users = [];
  let ana;
  let bruno;
  let anaPath;

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
    anaPath = `${ana.id}/tx/${crypto.randomUUID()}.pdf`;
  });

  afterAll(async () => {
    await admin.storage.from('receipts').remove([anaPath]);
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  // #endregion

  // #region bucket
  it('TK05-1: o bucket existe, e privado e limita tipo e tamanho', async () => {
    const { data } = await admin.storage.getBucket('receipts');

    expect(data.public).toBe(false);
    expect(data.file_size_limit).toBe(5 * 1024 * 1024);
    expect(data.allowed_mime_types).toEqual(['application/pdf', 'image/png', 'image/jpeg']);
  });
  // #endregion

  // #region upload
  it('CA05.1: o dono envia para a propria pasta', async () => {
    const { error } = await ana.client.storage
      .from('receipts')
      .upload(anaPath, pdf(), { contentType: 'application/pdf' });

    expect(error).toBeNull();
  });

  it('CA05.2: o bucket recusa um tipo fora da lista, mesmo por curl', async () => {
    const { error } = await ana.client.storage
      .from('receipts')
      .upload(
        `${ana.id}/tx/${crypto.randomUUID()}.exe`,
        new Blob(['MZ'], { type: 'application/x-msdownload' }),
        { contentType: 'application/x-msdownload' }
      );

    expect(error).not.toBeNull();
    expect(error.message).toMatch(/mime type/i);
  });

  it('TK05-2: enviar para a pasta de outra conta viola a policy', async () => {
    const { error } = await bruno.client.storage
      .from('receipts')
      .upload(`${ana.id}/tx/${crypto.randomUUID()}.pdf`, pdf(), { contentType: 'application/pdf' });

    expect(error).not.toBeNull();
    expect(error.message).toMatch(/row-level security/i);
  });
  // #endregion

  // #region read
  it('CA05.3: o dono recebe uma URL assinada, que abre', async () => {
    const { data, error } = await ana.client.storage.from('receipts').createSignedUrl(anaPath, 60);

    expect(error).toBeNull();
    expect(data.signedUrl).toContain('token=');

    const res = await fetch(data.signedUrl);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('%PDF');
  });

  it('CA05.4: outra conta nao consegue assinar o path, sem confirmar que existe', async () => {
    const { data, error } = await bruno.client.storage
      .from('receipts')
      .createSignedUrl(anaPath, 60);

    expect(data).toBeNull();
    expect(error.message).toMatch(/not found/i);
  });

  it('RNF04: a URL publica do objeto nao funciona', async () => {
    const { data } = ana.client.storage.from('receipts').getPublicUrl(anaPath);
    const res = await fetch(data.publicUrl);

    expect(res.status).toBe(400);
  });
  // #endregion

  // #region stats
  it('TK05-7: a contagem agregada responde so para admin', async () => {
    const { data: investor } = await ana.client.rpc('admin_receipts_stats');
    expect(investor).toEqual([]);

    await admin.from('profiles').update({ role: 'admin' }).eq('id', bruno.id);
    const { data: adminRows } = await bruno.client.rpc('admin_receipts_stats');

    expect(adminRows).toHaveLength(1);
    expect(Number(adminRows[0].total)).toBeGreaterThanOrEqual(1);
  });
  // #endregion
});
