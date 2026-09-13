import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

/** `<select>` nativo: acessível por padrão, com o mesmo visual do `Input`. */
export function Select({ className, invalid, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white',
        invalid
          ? 'border-rose-500 focus:ring-rose-500/20'
          : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700',
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
