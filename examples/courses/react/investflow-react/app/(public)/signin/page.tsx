import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/features/auth/signin-form';
import { auth } from '@/server/auth';
import { AuthLayout } from '@/components/layout/auth-layout';

export const metadata: Metadata = { title: 'Entrar' };

// #region page
/** Já autenticado, a tela de login não faz sentido: vai direto para a carteira. */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  const { callbackUrl = '/dashboard' } = await searchParams;

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua carteira.">
      <SignInForm callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}
// #endregion
