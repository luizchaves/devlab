'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { BALANCE_CATEGORIES, type AssetWithTransactions } from '@/core/portfolio';
import { useManualQuote } from '@/features/portfolio/queries';
import { ApiError } from '@/lib/http';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetWithTransactions;
  /** Aviso mostrado quando o provedor não devolveu o ticker (CA08.10). */
  warning?: string | null;
};

const today = () => new Date().toISOString().slice(0, 10);

// #region dialog
/**
 * Cotação manual: ativo cotado informa o preço; ativo por saldo (renda fixa,
 * fundos) informa o saldo, que vira um lançamento `update` (CA08.12).
 */
export function QuoteDialog({ open, onOpenChange, asset, warning }: Props) {
  const byBalance = BALANCE_CATEGORIES.includes(asset.category);
  const [value, setValue] = useState('');
  const [quoteDate, setQuoteDate] = useState(today());
  const [error, setError] = useState<string | null>(null);
  const mutation = useManualQuote(asset.id);

  const close = () => {
    onOpenChange(false);
    setValue('');
    setQuoteDate(today());
    setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(value);
    if (value === '' || Number.isNaN(amount) || amount < 0) {
      setError(byBalance ? 'Informe um saldo maior ou igual a zero.' : 'Informe um valor maior ou igual a zero.');
      return;
    }

    try {
      await mutation.mutateAsync(byBalance ? { balance: amount, quoteDate } : { price: amount, quoteDate });
      toast.success(byBalance ? 'Saldo atualizado.' : 'Cotação registrada.');
      close();
    } catch (err) {
      setError(err instanceof ApiError ? (err.fieldErrors.price ?? err.fieldErrors.balance ?? err.message) : 'Não foi possível salvar.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())} title={byBalance ? 'Atualizar saldo' : 'Cotação manual'} description={`${asset.ticker} · ${asset.name}`}>
      <form onSubmit={submit} className="grid gap-4" data-price-form noValidate>
        {warning && (
          <p role="status" data-price-warning className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {warning}
          </p>
        )}
        <Field label={byBalance ? 'Saldo atual (R$)' : `Cotação (${asset.currency === 'USD' ? 'US$' : 'R$'})`} error={error ?? undefined}>
          {(c) => <Input {...c} name={byBalance ? 'currentBalance' : 'currentPrice'} type="number" inputMode="decimal" min={0} step="any" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />}
        </Field>
        <Field label="Data">
          {(c) => <Input {...c} name="quoteDate" type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} />}
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" pending={mutation.isPending}>
            Salvar
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
// #endregion
