import { SettingsPanel } from '@/features/settings/settings-panel';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">Preferências</p>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Estado global mínimo</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Zustand guarda apenas preferência local. Dados de carteira continuam no React Query.
        </p>
      </div>
      <SettingsPanel />
    </div>
  );
}
