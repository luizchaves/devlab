import type { Metadata } from 'next';
import { ProfileView } from '@/features/profile/profile-view';
import { getProfile } from '@/server/profile';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Meu perfil' };

export default async function ProfilePage() {
  const session = await requirePageSession('/profile');
  const profile = await getProfile(session.user.id);
  return <ProfileView initial={{ ...profile, createdAt: profile.createdAt.toISOString() }} />;
}
