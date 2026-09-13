import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminView } from '@/features/admin/admin-view';
import { adminMetrics, serviceChecks } from '@/server/admin';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Painel Admin' };

// #region page
/** Investidor comum é mandado de volta à carteira (CA06.4); a API responde 403 pelo mesmo motivo. */
export default async function AdminPage() {
  const session = await requirePageSession('/admin');
  if (session.user.role !== 'ADMIN') redirect('/dashboard');

  const [metrics, checks] = await Promise.all([adminMetrics(), serviceChecks()]);
  return <AdminView initial={{ metrics, checks }} />;
}
// #endregion
