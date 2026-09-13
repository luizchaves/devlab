import { cva, type VariantProps } from 'class-variance-authority';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const inputVariants = cva(
  'w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white',
  {
    variants: {
      size: {
        md: 'h-10',
        lg: 'h-12 text-base',
      },
      invalid: {
        true: 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
        false: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
);

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants>;

export function Input({ className, size, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(inputVariants({ size, invalid }), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
