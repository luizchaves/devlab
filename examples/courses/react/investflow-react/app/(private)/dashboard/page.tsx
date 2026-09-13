import type { Metadata } from 'next';
import { PortfolioView } from '@/features/portfolio/portfolio-view';
import { listAssets } from '@/server/assets';
import { requirePageSession } from '@/server/session';

export const metadata: Metadata = { title: 'Carteira' };

// #region page
/**
 * Server Component: lê a carteira do dono da sessão no servidor e entrega ao
 * componente cliente como dado inicial. Sem `useEffect` para a primeira carga.
 */
export default async function DashboardPage() {
  const session = await requirePageSession('/dashboard');
  const assets = await listAssets(session.user.id);

  return <PortfolioView initialAssets={assets} />;
}
// #endregion
