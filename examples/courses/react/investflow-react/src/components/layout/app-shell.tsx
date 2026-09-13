'use client';

import { Eye, EyeOff, Search, SunMoon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { usePreferences } from '@/store/preferences';
import { Brand } from './brand';
import { CommandPalette } from '../command-palette';
import { UserMenu } from './user-menu';

type AppShellProps = {
  user: { name: string; role: 'INVESTOR' | 'ADMIN'; avatarUrl?: string | null };
  children: ReactNode;
};

// #region nav
const NAV = [
  { href: '/dashboard', label: 'Carteira' },
  { href: '/analytics', label: 'Rentabilidade' },
  { href: '/dividends', label: 'Proventos' },
  { href: '/movements', label: 'Aportes' },
  { href: '/origins', label: 'Origem' },
];

/**
 * Barra comum das páginas privadas (CA11.5): os mesmos links em toda tela,
 * "Painel Admin" só para administradores, tema, privacidade e menu do usuário.
 */
export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const hideValues = usePreferences((state) => state.hideValues);
  const toggleHideValues = usePreferences((state) => state.toggleHideValues);
  const cycleTheme = usePreferences((state) => state.cycleTheme);
  const setPaletteOpen = usePreferences((state) => state.setPaletteOpen);

  const links = user.role === 'ADMIN' ? [...NAV, { href: '/admin', label: 'Painel Admin' }] : NAV;

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Brand href="/dashboard" />
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  pathname.startsWith(link.href) && 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Buscar (Ctrl+K)" onClick={() => setPaletteOpen(true)}>
              <Search className="size-4" aria-hidden />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Alternar tema" onClick={cycleTheme}>
              <SunMoon className="size-4" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
              aria-pressed={hideValues}
              onClick={toggleHideValues}
            >
              {hideValues ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </Button>
            <UserMenu name={user.name} avatarUrl={user.avatarUrl} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <CommandPalette />
    </div>
  );
}
// #endregion
