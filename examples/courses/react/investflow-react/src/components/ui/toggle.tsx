'use client';

import { cn } from '@/lib/cn';

type Option<T extends string> = { value: T; label: string };

// #region segmented
/** Grupo de botões exclusivos (`aria-pressed`), o mesmo controle de filtros, modos e janelas. */
export function Segmented<T extends string>({ options, value, onChange, attribute, label, className }: { options: Option<T>[]; value: T; onChange: (v: T) => void; attribute: string; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn('inline-flex w-fit rounded-lg border border-slate-200 p-0.5 text-xs dark:border-slate-700', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          {...{ [attribute]: o.value }}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn('min-h-9 rounded-md px-3 font-medium', o.value === value ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
// #endregion
