import { ArrowRight, LineChart, Lock, PieChart } from 'lucide-react';
import Link from 'next/link';
import { Brand } from '@/components/layout/brand';
import { buttonVariants } from '@/components/ui/button';
import { Simulator } from '@/features/landing/simulator';
import { cn } from '@/lib/cn';
import { auth } from '@/server/auth';

// #region landing
/**
 * Landing (CA01.1): Server Component que lê a sessão para trocar os botões
 * de entrar por "Acessar Carteira" quando há usuário (CA11.7).
 */
export default async function LandingPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Brand href={signedIn ? '/dashboard' : '/'} />
        <nav className="flex items-center gap-2">
          {signedIn ? (
            <Link href="/dashboard" className={buttonVariants()}>
              Acessar Carteira
            </Link>
          ) : (
            <>
              <Link href="/signin" className={buttonVariants({ variant: 'ghost' })}>
                Entrar
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Sua carteira de investimentos, <span className="text-emerald-600">em um só lugar</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Registre aportes, acompanhe cotações, proventos e a rentabilidade mês a mês. Sem
          planilha, sem senha da corretora.
        </p>
        <Link href={signedIn ? '/dashboard' : '/signup'} className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}>
          {signedIn ? 'Acessar Carteira' : 'Começar agora'} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section id="recursos" className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
        <Feature icon={PieChart} title="Carteira consolidada">
          Ações, FIIs, ETFs, renda fixa, fundos e cripto, em reais e em dólar.
        </Feature>
        <Feature icon={LineChart} title="Rentabilidade real">
          Matriz mensal, aportes contra valor e proventos na conta do retorno.
        </Feature>
        <Feature icon={Lock} title="Seus dados são seus">
          Cada consulta é filtrada pelo dono da sessão no servidor. Nada vaza entre contas.
        </Feature>
      </section>

      <section id="simulador" className="mt-20 border-y border-slate-200 bg-slate-100/70 py-16 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Simule o crescimento do seu patrimônio</h2>
          <p className="mt-2 mb-8 text-slate-600 dark:text-slate-300">
            Juros compostos com aporte mensal. Mude os números e veja o resultado na hora.
          </p>
          <Simulator />
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-6">
        InvestFlow · projeto didático do DevLab.
      </footer>
    </div>
  );
}
// #endregion

function Feature({ icon: Icon, title, children }: { icon: typeof PieChart; title: string; children: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <Icon className="size-6 text-emerald-600" aria-hidden />
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  );
}
