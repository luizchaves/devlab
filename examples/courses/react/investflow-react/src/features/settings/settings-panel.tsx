'use client';

import { Switch } from '@base-ui/react/switch';
import { EyeOff } from 'lucide-react';
import { usePreferencesStore } from '@/store/preferences';

export function SettingsPanel() {
  const hideValues = usePreferencesStore((state) => state.hideValues);
  const toggleHideValues = usePreferencesStore((state) => state.toggleHideValues);

  return (
    <section className="max-w-xl rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Privacidade local</h2>
          <p className="mt-1 text-sm text-slate-600">
            O estado fica no navegador e não substitui autorização no servidor.
          </p>
        </div>
        <EyeOff className="size-5 text-slate-500" aria-hidden="true" />
      </div>
      <label className="mt-5 flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Ocultar valores financeiros</span>
        <Switch.Root
          checked={hideValues}
          onCheckedChange={toggleHideValues}
          className="h-6 w-11 rounded-full bg-slate-300 data-[checked]:bg-slate-950"
        >
          <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white transition data-[checked]:translate-x-5" />
        </Switch.Root>
      </label>
    </section>
  );
}
