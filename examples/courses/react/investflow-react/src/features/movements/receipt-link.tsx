'use client';

import { Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { receiptUrl } from '@/features/portfolio/queries';

/** O mesmo botão de anexo do extrato do ativo: a URL assinada nasce no clique. */
export function ReceiptLink({ transactionId, receiptPath }: { transactionId: string; receiptPath: string }) {
  const open = async () => {
    const tab = window.open('', '_blank');
    try {
      const url = await receiptUrl(transactionId);
      if (tab) tab.location.href = url;
      else window.open(url, '_blank');
    } catch {
      tab?.close();
      toast.error('Não foi possível abrir o comprovante.');
    }
  };
  return (
    <button type="button" onClick={open} data-receipt={receiptPath} className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-emerald-700 hover:underline md:min-h-9 dark:text-emerald-400">
      <Paperclip className="size-3.5" aria-hidden /> Ver anexo
    </button>
  );
}
