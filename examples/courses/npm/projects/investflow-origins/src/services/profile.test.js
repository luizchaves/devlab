import { beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
const from = vi.fn();
const auth = {
  getUser: vi.fn(),
  updateUser: vi.fn(),
};
const storageUpload = vi.fn();
const storageGetPublicUrl = vi.fn();
const storage = {
  from: vi.fn(() => ({
    upload: storageUpload,
    getPublicUrl: storageGetPublicUrl,
  })),
};

vi.mock('../lib/supabase-client.js', () => ({
  supabase: { from, auth, storage },
}));

const { getProfile, updateProfile, uploadAvatar, removeAvatar, validateAvatar } = await import(
  './profile.js'
);
// #endregion

describe('profile service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'ana@example.com' } },
      error: null,
    });
    auth.updateUser.mockResolvedValue({ data: {}, error: null });
  });

  it('getProfile busca informações completas do usuário incluindo avatar_url', async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'user-123',
        full_name: 'Ana Paula',
        avatar_url: 'https://example.com/avatar.png',
        role: 'investor',
        created_at: '2026-01-01T00:00:00Z',
      },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    from.mockReturnValue({ select });

    const { data, error } = await getProfile();

    expect(error).toBeNull();
    expect(data).toEqual({
      id: 'user-123',
      email: 'ana@example.com',
      fullName: 'Ana Paula',
      avatarUrl: 'https://example.com/avatar.png',
      role: 'investor',
      createdAt: '2026-01-01T00:00:00Z',
    });
  });

  it('updateProfile valida nome obrigatório quando passado em branco', async () => {
    const { data, error } = await updateProfile({ fullName: '   ' });

    expect(data).toBeNull();
    expect(error?.message).toContain('obrigatório');
  });

  it('updateProfile atualiza public.profiles e auth.users com nome e avatar', async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'user-123',
        full_name: 'Ana Silva Santos',
        avatar_url: 'https://test/avatar.png',
      },
      error: null,
    });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    from.mockReturnValue({ update });

    const { data, error } = await updateProfile({
      fullName: 'Ana Silva Santos',
      avatarUrl: 'https://test/avatar.png',
    });

    expect(error).toBeNull();
    expect(update).toHaveBeenCalledWith({
      full_name: 'Ana Silva Santos',
      avatar_url: 'https://test/avatar.png',
    });
    expect(auth.updateUser).toHaveBeenCalledWith({
      data: { full_name: 'Ana Silva Santos', avatar_url: 'https://test/avatar.png' },
    });
    expect(data).toMatchObject({ full_name: 'Ana Silva Santos' });
  });

  it('validateAvatar valida formato e limite de tamanho da imagem', () => {
    expect(validateAvatar(null)).toContain('Selecione uma imagem');
    expect(validateAvatar({ type: 'application/pdf', size: 100 })).toContain('PNG, JPG, WEBP');
    expect(validateAvatar({ type: 'image/png', size: 3 * 1024 * 1024 })).toContain('máximo 2 MB');
    expect(validateAvatar({ type: 'image/jpeg', size: 1024 })).toBeNull();
  });

  it('uploadAvatar envia arquivo para storage e atualiza o perfil com a URL pública', async () => {
    storageUpload.mockResolvedValue({ error: null });
    storageGetPublicUrl.mockReturnValue({
      data: {
        publicUrl: 'https://supabase.co/storage/v1/object/public/avatars/user-123/avatar.png',
      },
    });

    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'user-123',
        full_name: 'Ana',
        avatar_url: 'https://supabase.co/storage/v1/object/public/avatars/user-123/avatar.png',
      },
      error: null,
    });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    from.mockReturnValue({ update });

    const fakeFile = {
      name: 'meu-avatar.png',
      type: 'image/png',
      size: 50000,
    };

    const { data, error } = await uploadAvatar({ userId: 'user-123', file: fakeFile });

    expect(error).toBeNull();
    expect(storage.from).toHaveBeenCalledWith('avatars');
    expect(storageUpload).toHaveBeenCalled();
    expect(data?.publicUrl).toContain('avatars/user-123/');
  });

  it('removeAvatar remove a foto definindo avatar_url como null', async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: 'user-123', avatar_url: null },
      error: null,
    });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    from.mockReturnValue({ update });

    const { data, error } = await removeAvatar({ userId: 'user-123' });

    expect(error).toBeNull();
    expect(update).toHaveBeenCalledWith({ avatar_url: null });
    expect(auth.updateUser).toHaveBeenCalledWith({ data: { avatar_url: null } });
  });
});
