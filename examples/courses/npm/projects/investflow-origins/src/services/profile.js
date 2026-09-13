import { supabase } from '../lib/supabase-client.js';

// #region profile-service
export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

// #region validate
/**
 * Validação de imagem de avatar no cliente.
 */
export function validateAvatar(file) {
  if (!file) return 'Selecione uma imagem para o avatar.';
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return 'Envie uma imagem nos formatos PNG, JPG, WEBP ou GIF.';
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return 'A imagem deve ter no máximo 2 MB.';
  }
  return null;
}
// #endregion

/**
 * Busca o perfil do usuário autenticado no banco de dados (public.profiles)
 * e mescla com as informações da sessão de autenticação (e-mail e metadata).
 */
export async function getProfile() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { data: null, error: authError || new Error('Sessão não encontrada') };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, created_at')
    .eq('id', user.id)
    .single();

  if (error) {
    return { data: null, error };
  }

  return {
    data: {
      id: user.id,
      email: user.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url || user.user_metadata?.avatar_url || null,
      role: profile.role,
      createdAt: profile.created_at,
    },
    error: null,
  };
}

/**
 * Atualiza o nome completo e/ou URL do avatar no perfil (public.profiles) e
 * sincroniza o metadata no Supabase Auth.
 */
export async function updateProfile({ fullName, avatarUrl }) {
  const updates = {};

  if (fullName !== undefined) {
    const trimmed = (fullName || '').trim();
    if (!trimmed) {
      return { data: null, error: new Error('O nome completo é obrigatório.') };
    }
    updates.full_name = trimmed;
  }

  if (avatarUrl !== undefined) {
    updates.avatar_url = avatarUrl;
  }

  if (Object.keys(updates).length === 0) {
    return { data: null, error: new Error('Nenhum campo para atualizar.') };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { data: null, error: authError || new Error('Sessão não encontrada') };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  // Sincroniza metadados do auth.users para consistência de sessão
  const metadataUpdates = {};
  if (updates.full_name !== undefined) metadataUpdates.full_name = updates.full_name;
  if (updates.avatar_url !== undefined) metadataUpdates.avatar_url = updates.avatar_url;

  await supabase.auth.updateUser({
    data: metadataUpdates,
  });

  return { data, error: null };
}

// #region upload
/**
 * Faz upload do avatar para o bucket 'avatars' no Supabase Storage e
 * atualiza o perfil com a URL pública gerada.
 */
export async function uploadAvatar({ userId, file }) {
  const validationError = validateAvatar(file);
  if (validationError) {
    return { data: null, error: new Error(validationError) };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  const uid = userId || user?.id;
  if (authError || !uid) {
    return { data: null, error: authError || new Error('Sessão não encontrada') };
  }

  const ext = (file.name.split('.').pop() ?? 'png').toLowerCase();
  const path = `${uid}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path);

  const { data: updatedProfile, error: updateError } = await updateProfile({
    avatarUrl: publicUrl,
  });

  if (updateError) {
    return { data: null, error: updateError };
  }

  return {
    data: {
      publicUrl,
      path,
      profile: updatedProfile,
    },
    error: null,
  };
}
// #endregion

/**
 * Remove a foto de perfil definindo avatar_url como null.
 */
export async function removeAvatar({ userId } = {}) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  const uid = userId || user?.id;
  if (authError || !uid) {
    return { data: null, error: authError || new Error('Sessão não encontrada') };
  }

  const { data, error } = await updateProfile({ avatarUrl: null });
  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}
// #endregion
