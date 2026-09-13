import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'InvestFlow', template: '%s · InvestFlow' },
  description: 'Gestão patrimonial para investidores individuais.',
};

// #region layout
/**
 * Layout raiz: `suppressHydrationWarning` porque as preferências gravam
 * `data-theme` no `<html>` antes de o React hidratar.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
// #endregion
