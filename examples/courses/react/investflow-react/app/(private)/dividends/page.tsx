import type { Metadata } from 'next';
import { DividendsView } from '@/features/dividends/dividends-view';
import { getDividendsPage } from '@/server/dividends-page';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Proventos' };

export default async function DividendsPage() {
  const session = await requirePageSession('/dividends');
  return <DividendsView initial={await getDividendsPage(session.user.id)} />;
}
