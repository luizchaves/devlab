'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { transactionSchema, type TransactionInput } from '@/core/assets';
import { validateReceipt } from '@/core/file-validation';
import { BALANCE_CATEGORIES, summarize, type AssetWithTransactions, type TransactionFact } from '@/core/portfolio';
import { ApiError } from '@/lib/http';
import { useCreateTransaction, useUpdateTransaction, useUploadReceipt } from '@/features/portfolio/queries';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetWithTransactions;
  /** Com `transaction`, o diálogo edita (CA08.1); sem, cria. */
  transaction?: TransactionFact | null;
};
type Values = { type: TransactionInput['type']; quantity: string; price: string; transactionDate: string };
type FieldErrors = Partial<Record<keyof Values | 'receipt', string>>;

const today = () => new Date().toISOString().slice(0, 10);

function initialValues(byBalance: boolean, transaction?: TransactionFact | null): Values {
  if (transaction) {
    return { type: transaction.type, quantity: String(transaction.quantity), price: String(transaction.price), transactionDate: transaction.transactionDate };
  }
  return { type: 'buy', quantity: '', price: byBalance ? '1' : '', transactionDate: today() };
}

// #region dialog
/**
 * Lançamento novo ou editado (CA03.9, CA08.1). Ativo por saldo oferece o tipo
 * `update`; na venda, "resgate total" preenche a quantidade disponível (CA08.3).
 */
export function TransactionFormDialog({ open, onOpenChange, asset, transaction }: Props) {
  const byBalance = BALANCE_CATEGORIES.includes(asset.category);
  const [values, setValues] = useState<Values>(() => initialValues(byBalance, transaction));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [receipt, setReceipt] = useState<File | null>(null);
  const [totalRedemption, setTotalRedemption] = useState(false);
  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const upload = useUploadReceipt();

  // Posição disponível para o resgate total: sem o próprio lançamento, quando ele está sendo editado.
  const available = useMemo(
    () => summarize({ ...asset, transactions: asset.transactions.filter((t) => t.id !== transaction?.id) }).quantity,
    [asset, transaction]
  );

  const set = (key: keyof Values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const toggleTotalRedemption = (checked: boolean) => {
    setTotalRedemption(checked);
    if (checked) set('quantity', String(available));
  };
  const close = () => {
    onOpenChange(false);
    setValues(initialValues(byBalance, transaction));
    setErrors({});
    setReceipt(null);
    setTotalRedemption(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = transactionSchema.safeParse({ ...values, assetId: asset.id });
    const fieldErrors: FieldErrors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as keyof Values] ??= issue.message;
    }
    const receiptError = receipt ? validateReceipt(receipt) : null;
    if (receiptError) fieldErrors.receipt = receiptError;
    if (!parsed.success || receiptError) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const { type, quantity, price, transactionDate } = parsed.data;
      const saved = transaction
        ? await update.mutateAsync({ id: transaction.id, type, quantity, price, transactionDate })
        : await create.mutateAsync(parsed.data);
      if (receipt) await upload.mutateAsync({ transactionId: saved.id, file: receipt });
      toast.success(transaction ? 'Lançamento atualizado.' : receipt ? 'Lançamento registrado com comprovante.' : 'Lançamento registrado.');
      close();
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length) setErrors(error.fieldErrors);
      else toast.error(error instanceof Error ? error.message : 'Não foi possível salvar.');
    }
  };

  const pending = create.isPending || update.isPending || upload.isPending;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())} title={transaction ? 'Editar lançamento' : 'Novo lançamento'} description={`${asset.ticker} · ${asset.name}`}>
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
        {values.type === 'sell' && (
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input id="totalRedemption" type="checkbox" className="size-4 accent-emerald-600" checked={totalRedemption} onChange={(e) => toggleTotalRedemption(e.target.checked)} />
            Resgate total ({available.toLocaleString('pt-BR', { maximumFractionDigits: 8 })} disponível)
          </label>
        )}
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
        <Field label={transaction?.receiptPath ? 'Trocar comprovante (opcional)' : 'Comprovante (opcional)'} hint="PDF, PNG ou JPG até 5 MB." error={errors.receipt}>
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
          <Button type="submit" pending={pending}>
            {transaction ? 'Salvar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
// #endregion
