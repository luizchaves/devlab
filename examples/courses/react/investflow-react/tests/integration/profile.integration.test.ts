import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '@/server/prisma';
import { actAs, createAccounts, jsonRequest, resetTables } from './helpers';
import { DELETE as deleteAvatar, POST as postAvatar } from '../../app/api/profile/avatar/route';
import { GET as getProfile, PATCH as patchProfile } from '../../app/api/profile/route';

beforeEach(resetTables);

const png = () => new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'foto.png', { type: 'image/png' });

function upload(file: File) {
  const form = new FormData();
  form.append('file', file);
  return postAvatar(new Request('http://localhost/api', { method: 'POST', body: form }));
}

describe('perfil', () => {
  it('CA11.1, CA11.4 — mostra nome, e-mail, papel e cadastro; nome em branco é recusado; papel não muda pelo cliente', async () => {
    const { ana } = await createAccounts();
    actAs(ana);

    const { profile } = await (await getProfile()).json();
    expect(profile).toMatchObject({ email: 'ana@example.com', name: 'Ana', role: 'INVESTOR', avatarUrl: null });
    expect(profile.createdAt).toBeDefined();

    const blank = await patchProfile(jsonRequest('PATCH', { name: '   ' }));
    expect(blank.status).toBe(400);
    expect((await blank.json()).fieldErrors.name).toBe('O nome não pode ficar em branco.');

    const renamed = await patchProfile(jsonRequest('PATCH', { name: 'Ana Beatriz', role: 'ADMIN', email: 'outro@example.com' }));
    expect(renamed.status).toBe(200);
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: ana.id } });
    expect(stored).toMatchObject({ name: 'Ana Beatriz', role: 'INVESTOR', email: 'ana@example.com' });
  });

  it('CA11.2, CA11.3 — o avatar vai para a pasta do dono no bucket público e remover zera o path', async () => {
    const { ana } = await createAccounts();
    actAs(ana);

    const bad = await upload(new File([new Uint8Array([0x25])], 'nota.pdf', { type: 'application/pdf' }));
    expect(bad.status).toBe(400);

    const response = await upload(png());
    const { profile } = await response.json();
    expect(response.status).toBe(200);
    expect(profile.avatarUrl).toContain(`/storage/v1/object/public/avatars/${ana.id}/`);
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: ana.id } });
    expect(stored.avatarPath).toMatch(new RegExp(`^${ana.id}/[0-9a-f-]{36}\\.png$`));

    // O bucket é público: a URL abre sem sessão.
    expect((await fetch(profile.avatarUrl)).status).toBe(200);

    const removed = await (await deleteAvatar()).json();
    expect(removed.profile.avatarUrl).toBeNull();
    expect((await prisma.user.findUniqueOrThrow({ where: { id: ana.id } })).avatarPath).toBeNull();
  });
});
