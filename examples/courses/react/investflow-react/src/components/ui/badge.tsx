import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import type { AssetCategory } from '@/core/portfolio';
import { cn } from '@/lib/cn';

// #region badge
/** Uma cor por categoria: as mesmas sete do InvestFlow vanilla (CA01.5). */
export const badgeVariants = cva('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap', {
  variants: {
    tone: {
      neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
      renda_fixa: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100',
      acoes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
      fiis: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
      etfs: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
      fi_infra: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100',
      fundos: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
      cripto: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants> & { tone?: AssetCategory | 'neutral' };

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
// #endregion
