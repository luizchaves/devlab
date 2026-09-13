import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignUpForm } from '@/features/auth/signup-form';
import { auth } from '@/server/auth';
import { AuthLayout } from '@/components/layout/auth-layout';

export const metadata: Metadata = { title: 'Criar conta' };

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <AuthLayout title="Criar conta" subtitle="Leva menos de um minuto.">
      <SignUpForm />
    </AuthLayout>
  );
}
