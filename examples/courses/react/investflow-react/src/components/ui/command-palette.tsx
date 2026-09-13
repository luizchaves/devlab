'use client';

import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePreferencesStore } from '@/store/preferences';

const items = [
  { label: 'Dashboard', href: '/' },
  { label: 'Ativos', href: '/assets' },
  { label: 'Preferências', href: '/settings' },
];

export function CommandPalette() {
  const router = useRouter();
  const commandOpen = usePreferencesStore((state) => state.commandOpen);
  const setCommandOpen = usePreferencesStore((state) => state.setCommandOpen);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(!commandOpen);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 p-4" onClick={() => setCommandOpen(false)}>
      <Command
        className="mx-auto mt-24 max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-3">
          <Search className="size-4 text-slate-500" aria-hidden="true" />
          <Command.Input className="h-12 flex-1 outline-none" placeholder="Buscar rota..." />
        </div>
        <Command.List className="p-2">
          <Command.Empty className="px-3 py-6 text-sm text-slate-500">Nenhuma rota encontrada.</Command.Empty>
          {items.map((item) => (
            <Command.Item
              key={item.href}
              className="cursor-pointer rounded-md px-3 py-2 text-sm aria-selected:bg-slate-100"
              onSelect={() => {
                router.push(item.href);
                setCommandOpen(false);
              }}
            >
              {item.label}
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
