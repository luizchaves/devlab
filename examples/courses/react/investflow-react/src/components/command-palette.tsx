'use client';

import { Command } from 'cmdk';
import { BarChart3, EyeOff, LayoutDashboard, Moon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePreferences } from '@/store/preferences';

// #region palette
/**
 * Paleta de comandos (Cmd/Ctrl + K): navegação e preferências. O estado
 * "aberta" vive no store porque o atalho e o botão da barra o compartilham.
 */
export function CommandPalette() {
  const router = useRouter();
  const open = usePreferences((state) => state.paletteOpen);
  const setOpen = usePreferences((state) => state.setPaletteOpen);
  const cycleTheme = usePreferences((state) => state.cycleTheme);
  const toggleHideValues = usePreferences((state) => state.toggleHideValues);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Paleta de comandos"
      className="fixed top-1/4 left-1/2 z-50 w-[32rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      overlayClassName="fixed inset-0 z-40 bg-slate-950/50"
    >
      <Command.Input
        placeholder="Para onde você quer ir?"
        className="w-full border-b border-slate-200 bg-transparent px-4 py-3 text-sm outline-none dark:border-slate-800"
      />
      <Command.List className="max-h-72 overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-slate-500">
          Nada encontrado.
        </Command.Empty>
        <Command.Group heading="Navegação" className="text-xs text-slate-500 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5">
          <Item icon={LayoutDashboard} onSelect={() => run(() => router.push('/dashboard'))}>
            Carteira
          </Item>
          <Item icon={BarChart3} onSelect={() => run(() => router.push('/analytics'))}>
            Rentabilidade
          </Item>
          <Item icon={User} onSelect={() => run(() => router.push('/profile'))}>
            Meu perfil
          </Item>
        </Command.Group>
        <Command.Group heading="Preferências" className="text-xs text-slate-500 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5">
          <Item icon={Moon} onSelect={() => run(cycleTheme)}>
            Alternar tema
          </Item>
          <Item icon={EyeOff} onSelect={() => run(toggleHideValues)}>
            Ocultar ou mostrar valores
          </Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
// #endregion

function Item({
  icon: Icon,
  children,
  onSelect,
}: {
  icon: typeof LayoutDashboard;
  children: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-800 data-[selected=true]:bg-emerald-50 data-[selected=true]:text-emerald-800 dark:text-slate-100 dark:data-[selected=true]:bg-emerald-950"
    >
      <Icon className="size-4" aria-hidden />
      {children}
    </Command.Item>
  );
}
