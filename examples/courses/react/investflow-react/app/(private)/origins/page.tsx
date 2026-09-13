import type { Metadata } from 'next';
import { OriginsView } from '@/features/origins/origins-view';
import { getOrigins } from '@/server/analytics';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Origem' };

export default async function OriginsPage() {
  const session = await requirePageSession('/origins');
  return <OriginsView initialRows={await getOrigins(session.user.id)} />;
}
