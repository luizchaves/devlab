import { z } from 'zod';
import { validateAvatar } from '@/core/file-validation';
import { prisma } from './prisma';
import { HttpError } from './session';
import { AVATARS_BUCKET, avatarPublicUrl, ensureAvatarsBucket, supabaseAdmin } from './storage';
import { findUserById, type PublicUser } from './users';

export type Profile = Omit<PublicUser, 'avatarPath'> & { avatarUrl: string | null };

// #region read
export async function getProfile(userId: string): Promise<Profile> {
  const user = await findUserById(userId);
  if (!user) throw new HttpError(404, 'Usuário não encontrado.');
  const { avatarPath, ...rest } = user;
  return { ...rest, avatarUrl: avatarPublicUrl(avatarPath) };
}
// #endregion

// #region update
/** Só o nome é editável pelo dono; e-mail e papel não mudam por aqui (CA11.1, CA11.4). */
export const profileSchema = z.object({ name: z.string().trim().min(2, 'O nome não pode ficar em branco.').max(80) });

export async function updateProfile(userId: string, input: z.output<typeof profileSchema>): Promise<Profile> {
  await prisma.user.update({ where: { id: userId }, data: { name: input.name } });
  return getProfile(userId);
}
// #endregion

// #region avatar
export async function uploadAvatar(userId: string, file: File): Promise<Profile> {
  const invalid = validateAvatar(file);
  if (invalid) throw new HttpError(400, invalid);

  const user = await findUserById(userId);
  if (!user) throw new HttpError(404, 'Usuário não encontrado.');

  const ext = (file.name.split('.').pop() ?? 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  await ensureAvatarsBucket();
  const { error } = await supabaseAdmin().storage.from(AVATARS_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new HttpError(502, `Storage recusou a imagem: ${error.message}`);

  if (user.avatarPath) await supabaseAdmin().storage.from(AVATARS_BUCKET).remove([user.avatarPath]);
  await prisma.user.update({ where: { id: userId }, data: { avatarPath: path } });
  return getProfile(userId);
}

/** Remover zera o path; a inicial do nome volta ao lugar da foto (CA11.3). */
export async function removeAvatar(userId: string): Promise<Profile> {
  const user = await findUserById(userId);
  if (!user) throw new HttpError(404, 'Usuário não encontrado.');
  if (user.avatarPath) {
    await supabaseAdmin().storage.from(AVATARS_BUCKET).remove([user.avatarPath]);
    await prisma.user.update({ where: { id: userId }, data: { avatarPath: null } });
  }
  return getProfile(userId);
}
// #endregion
