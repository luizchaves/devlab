import type { Metadata } from 'next';
import { MovementsView } from '@/features/movements/movements-view';
import { listAssets } from '@/server/assets';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Aportes' };

export default async function MovementsPage() {
  const session = await requirePageSession('/movements');
  return <MovementsView initialAssets={await listAssets(session.user.id)} />;
}
