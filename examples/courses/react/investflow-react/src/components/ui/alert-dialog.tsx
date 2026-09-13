'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Button } from './button';

type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
};

// #region alert
/**
 * Confirmação destrutiva: não fecha ao clicar fora, o foco começa em
 * "Cancelar" e o botão de confirmar é o único vermelho.
 */
export function AlertDialog({ open, onOpenChange, title, description, confirmLabel = 'Excluir', pending, onConfirm }: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="fixed inset-0 bg-slate-950/50" />
        <BaseAlertDialog.Viewport className="fixed inset-0 grid place-items-center p-4">
          <BaseAlertDialog.Popup className="w-[26rem] max-w-full rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-white">
            <BaseAlertDialog.Title className="text-lg font-bold">{title}</BaseAlertDialog.Title>
            <BaseAlertDialog.Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </BaseAlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <BaseAlertDialog.Close render={<Button variant="secondary" />}>Cancelar</BaseAlertDialog.Close>
              <Button variant="danger" pending={pending} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </BaseAlertDialog.Popup>
        </BaseAlertDialog.Viewport>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
// #endregion
