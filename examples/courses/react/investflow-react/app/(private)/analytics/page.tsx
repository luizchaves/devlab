import type { Metadata } from 'next';
import { AnalyticsView } from '@/features/analytics/analytics-view';
import { getAnalytics } from '@/server/analytics';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Rentabilidade' };

export default async function AnalyticsPage() {
  const session = await requirePageSession('/analytics');
  const summary = await getAnalytics(session.user.id);

  return <AnalyticsView initial={summary} />;
}
