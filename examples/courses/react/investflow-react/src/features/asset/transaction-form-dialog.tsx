'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { transactionSchema, type TransactionInput } from '@/core/assets';
import { validateReceipt } from '@/core/file-validation';
import { BALANCE_CATEGORIES, type AssetWithTransactions } from '@/core/portfolio';
import { ApiError } from '@/lib/http';
import { useCreateTransaction, useUploadReceipt } from '@/features/portfolio/queries';

type Props = { open: boolean; onOpenChange: (open: boolean) => void; asset: AssetWithTransactions };
type Values = { type: TransactionInput['type']; quantity: string; price: string; transactionDate: string };
type FieldErrors = Partial<Record<keyof Values | 'receipt', string>>;

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
  const [receipt, setReceipt] = useState<File | null>(null);
  const create = useCreateTransaction();
  const upload = useUploadReceipt();

  const set = (key: keyof Values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const close = () => {
    onOpenChange(false);
    setValues(initial);
    setErrors({});
    setReceipt(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = transactionSchema.safeParse({ ...values, assetId: asset.id });
    const fieldErrors: FieldErrors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as keyof Values] ??= issue.message;
    }
    // O comprovante é validado antes do upload (CA05.2); o bucket confere de novo.
    const receiptError = receipt ? validateReceipt(receipt) : null;
    if (receiptError) fieldErrors.receipt = receiptError;
    if (!parsed.success || receiptError) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const created = await create.mutateAsync(parsed.data);
      if (receipt) await upload.mutateAsync({ transactionId: created.id, file: receipt });
      toast.success(receipt ? 'Lançamento registrado com comprovante.' : 'Lançamento registrado.');
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
        <Field label="Comprovante (opcional)" hint="PDF, PNG ou JPG até 5 MB." error={errors.receipt}>
          {(c) => (
            <Input
              {...c}
              name="receipt"
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              className="h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold dark:file:bg-slate-800"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
            />
          )}
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" pending={create.isPending || upload.isPending}>
            Registrar
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
// #endregion
