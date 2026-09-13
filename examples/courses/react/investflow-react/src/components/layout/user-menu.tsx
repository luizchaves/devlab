'use client';

import { Menu } from '@base-ui/react/menu';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { signOutAction } from '@/features/auth/actions';

type UserMenuProps = { name: string; avatarUrl?: string | null };

// #region menu
/**
 * Menu do usuário com o Base UI: Esc ou clique fora fecham (CA11.6). O nome
 * exibido é o primeiro; a inicial substitui a foto quando não há avatar.
 */
export function UserMenu({ name, avatarUrl }: UserMenuProps) {
  const firstName = name.split(' ')[0];

  return (
    <Menu.Root>
      <Menu.Trigger aria-label={`Menu de ${firstName}`} className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
        <Avatar name={name} avatarUrl={avatarUrl} />
        <span className="hidden sm:inline">{firstName}</span>
        <ChevronDown className="size-4" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end">
          <Menu.Popup className="min-w-44 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <Menu.Item
              render={<Link href="/profile" />}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-800 data-highlighted:bg-slate-100 dark:text-slate-100 dark:data-highlighted:bg-slate-800"
            >
              <User className="size-4" aria-hidden /> Meu perfil
            </Menu.Item>
            <Menu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
            <form action={signOutAction}>
              <Menu.Item
                render={<button type="submit" />}
                nativeButton
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-600 data-highlighted:bg-rose-50 dark:data-highlighted:bg-rose-950"
              >
                <LogOut className="size-4" aria-hidden /> Sair
              </Menu.Item>
            </form>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
// #endregion

function Avatar({ name, avatarUrl }: UserMenuProps) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- avatar servido por rota própria, sem otimização
    return <img src={avatarUrl} alt="" data-navbar-avatar-img className="size-8 rounded-full object-cover" />;
  }
  return (
    <span data-navbar-avatar-initial className="grid size-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
