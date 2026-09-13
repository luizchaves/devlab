import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Providers } from '@/components/ui/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'InvestFlow React',
  description: 'Carteira de investimentos em React, Next.js, Prisma, NextAuth e TanStack.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-semibold text-slate-950">
                InvestFlow React
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/assets">Ativos</Link>
                <Link href="/settings">Preferências</Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
