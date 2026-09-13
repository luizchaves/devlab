'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { transactionSchema, type TransactionInput } from '@/core/assets';
import { BALANCE_CATEGORIES, type AssetWithTransactions } from '@/core/portfolio';
import { ApiError } from '@/lib/http';
import { useCreateTransaction } from '@/features/portfolio/queries';

type Props = { open: boolean; onOpenChange: (open: boolean) => void; asset: AssetWithTransactions };
type Values = { type: TransactionInput['type']; quantity: string; price: string; transactionDate: string };
type FieldErrors = Partial<Record<keyof Values, string>>;

const today = () => new Date().toISOString().slice(0, 10);

// #region dialog
/**
 * Novo lançamento (CA03.9). Ativo por saldo (renda fixa, fundos) oferece o
 * tipo `update`, que redefine a posição pelo saldo informado com preço 1.
 */
export function TransactionFormDialog({ open, onOpenChange, asset }: Props) {
  const byBalance = BALANCE_CATEGORIES.includes(asset.category);
  const initial: Values = { type: 'buy', quantity: '', price: byBalance ? '1' : '', transactionDate: today() };
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const create = useCreateTransaction();

  const set = (key: keyof Values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const close = () => {
    onOpenChange(false);
    setValues(initial);
    setErrors({});
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = transactionSchema.safeParse({ ...values, assetId: asset.id });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as keyof Values] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }

    try {
      await create.mutateAsync(parsed.data);
      toast.success('Lançamento registrado.');
      close();
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length) setErrors(error.fieldErrors);
      else toast.error(error instanceof Error ? error.message : 'Não foi possível salvar.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())} title="Novo lançamento" description={`${asset.ticker} · ${asset.name}`}>
      <form onSubmit={submit} className="grid gap-4" data-transaction-form noValidate>
        <Field label="Tipo" error={errors.type}>
          {(c) => (
            <Select {...c} name="type" value={values.type} onChange={(e) => set('type', e.target.value)}>
              <option value="buy">Compra / aporte</option>
              <option value="sell">Venda / resgate</option>
              {byBalance && <option value="update">Atualizar saldo</option>}
            </Select>
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={values.type === 'update' ? 'Saldo' : 'Quantidade'} error={errors.quantity}>
            {(c) => <Input {...c} name="quantity" type="number" inputMode="decimal" min={0} step="any" value={values.quantity} onChange={(e) => set('quantity', e.target.value)} />}
          </Field>
          <Field label={`Preço unitário (${asset.currency === 'USD' ? 'US$' : 'R$'})`} error={errors.price}>
            {(c) => <Input {...c} name="price" type="number" inputMode="decimal" min={0} step="any" value={values.price} onChange={(e) => set('price', e.target.value)} />}
          </Field>
        </div>
        <Field label="Data" error={errors.transactionDate}>
          {(c) => <Input {...c} name="transactionDate" type="date" value={values.transactionDate} onChange={(e) => set('transactionDate', e.target.value)} />}
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" pending={create.isPending}>
            Registrar
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
// #endregion
