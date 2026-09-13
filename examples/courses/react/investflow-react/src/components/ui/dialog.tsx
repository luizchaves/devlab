'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

// #region dialog
/**
 * Diálogo modal sobre o Base UI: foco preso, Esc e clique fora fecham
 * (CA11.8), título e descrição anunciados. O conteúdo é livre.
 */
export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-slate-950/50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDialog.Viewport className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
        <BaseDialog.Popup
          className={cn(
            'w-[28rem] max-w-full rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl transition-[scale,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:border-slate-800 dark:bg-slate-900 dark:text-white',
            className
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <BaseDialog.Title className="text-lg font-bold">{title}</BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </BaseDialog.Description>
              )}
            </div>
            <BaseDialog.Close
              aria-label="Fechar"
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="size-4" aria-hidden />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
// #endregion
