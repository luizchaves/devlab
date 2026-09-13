import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

// #region variants
/**
 * Variantes com CVA: cada combinação `variant` × `size` vira uma lista de
 * utilitários, e o `cn` resolve conflitos com classes passadas de fora.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500',
        secondary:
          'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
        ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        danger: 'bg-rose-600 text-white hover:bg-rose-500',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        // Alvos de toque de pelo menos 44 px em telas de toque (CA12.4).
        md: 'h-11 px-4 md:h-10',
        lg: 'h-12 px-6 text-base',
        icon: 'size-11 md:size-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
// #endregion

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { pending?: boolean };

// #region button
export function Button({ className, variant, size, pending, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {children}
    </button>
  );
}
// #endregion
