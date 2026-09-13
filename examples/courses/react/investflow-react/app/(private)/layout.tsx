import type { ReactNode } from 'react';
import { ExchangeProvider } from '@/components/exchange-provider';
import { AppShell } from '@/components/layout/app-shell';
import { listExchangeRates } from '@/server/exchange';
import { requirePageSession } from '@/server/session';
import { findUserById } from '@/server/users';

// #region layout
/**
 * Toda página privada passa por aqui: o `proxy.ts` já redirecionou quem não
 * tem sessão, e este layout carrega o usuário para a barra comum.
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const session = await requirePageSession('/dashboard');
  const [user, rates] = await Promise.all([findUserById(session.user.id), listExchangeRates()]);
  if (!user) return null;

  return (
    <ExchangeProvider initialRates={rates}>
      <AppShell user={{ name: user.name, role: user.role, avatarUrl: user.avatarPath ? `/api/avatars/${user.id}` : null }}>
        {children}
      </AppShell>
    </ExchangeProvider>
  );
}
// #endregion
