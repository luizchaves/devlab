import type { Metadata } from 'next';
import { requirePageSession } from '@/server/session';
import { findUserById } from '@/server/users';

export const metadata: Metadata = { title: 'Carteira' };

// Fase 1: a carteira ainda não existe; a página só prova a sessão (CA02.3).
export default async function DashboardPage() {
  const session = await requirePageSession('/dashboard');
  const user = await findUserById(session.user.id);

  return (
    <section>
      <h1 className="text-2xl font-bold">Carteira</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Olá, <strong data-testid="user-name">{user?.name}</strong>. Sua carteira aparece aqui na próxima fase.
      </p>
    </section>
  );
}
