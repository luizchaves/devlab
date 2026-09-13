import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  /** Recebe os atributos que ligam rótulo, dica e erro ao controle. */
  children: (control: {
    id: string;
    'aria-describedby': string | undefined;
    invalid: boolean;
  }) => ReactNode;
};

// #region field
/**
 * Rótulo, dica e erro ligados ao controle por `id` e `aria-describedby`:
 * leitores de tela anunciam o erro junto do campo.
 */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children({ id, 'aria-describedby': describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
// #endregion
