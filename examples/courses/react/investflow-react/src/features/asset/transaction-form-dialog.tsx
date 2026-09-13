'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
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
type Values = {
  type: TransactionInput['type'];
  quantity: string;
  price: number | null;
  /** Ativo por saldo: o valor aplicado, resgatado ou o saldo (vira quantidade com preço 1). */
  amount: number | null;
  yieldRate: number | null;
  transactionDate: string;
};
type FieldErrors = Partial<Record<keyof Values | 'receipt', string>>;

const today = () => new Date().toISOString().slice(0, 10);

function initialValues(byBalance: boolean, transaction?: TransactionFact | null): Values {
  if (transaction) {
    return {
      type: transaction.type,
      quantity: String(transaction.quantity),
      price: transaction.price,
      amount: transaction.quantity * transaction.price,
      yieldRate: transaction.yieldRate,
      transactionDate: transaction.transactionDate,
    };
  }
  return { type: 'buy', quantity: '', price: byBalance ? 1 : null, amount: null, yieldRate: null, transactionDate: today() };
}

const AMOUNT_LABEL: Record<Values['type'], string> = { buy: 'Valor aplicado (R$)', sell: 'Valor resgatado (R$)', update: 'Saldo atual (R$)' };

// #region dialog
/**
 * Lançamento novo ou editado (CA03.9, CA08.1). Ativo cotado pede quantidade e
 * preço; ativo por saldo (renda fixa, fundos) pede o valor em reais, que vira
 * quantidade com preço 1, e o rendimento contratado em % a.a. (CA14.1, CA14.2).
 * Na venda, "resgate total" preenche a quantidade disponível (CA08.3).
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

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));
  const toggleTotalRedemption = (checked: boolean) => {
    setTotalRedemption(checked);
    if (!checked) return;
    if (byBalance) set('amount', available);
    else set('quantity', String(available));
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
    // Ativo por saldo: o valor em reais é a quantidade, e o preço é 1 (CA08.7).
    const candidate = byBalance
      ? { ...values, quantity: values.amount ?? '', price: 1, assetId: asset.id }
      : { ...values, price: values.price ?? '', yieldRate: null, assetId: asset.id };
    const parsed = transactionSchema.safeParse(candidate);
    const fieldErrors: FieldErrors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        fieldErrors[byBalance && key === 'quantity' ? 'amount' : key] ??= key === 'quantity' && byBalance ? 'Informe o valor.' : issue.message;
      }
    }
    const receiptError = receipt ? validateReceipt(receipt) : null;
    if (receiptError) fieldErrors.receipt = receiptError;
    if (!parsed.success || receiptError) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const { type, quantity, price, transactionDate, yieldRate } = parsed.data;
      const saved = transaction
        ? await update.mutateAsync({ id: transaction.id, type, quantity, price, transactionDate, yieldRate })
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
      <form onSubmit={submit} className="grid gap-4" data-transaction-form data-mode={byBalance ? 'balance' : 'quoted'} noValidate>
        <Field label="Tipo" error={errors.type}>
          {(c) => (
            <Select {...c} name="type" value={values.type} onChange={(e) => set('type', e.target.value as Values['type'])}>
              <option value="buy">{byBalance ? 'Aplicação' : 'Compra / aporte'}</option>
              <option value="sell">{byBalance ? 'Resgate' : 'Venda / resgate'}</option>
              {byBalance && <option value="update">Atualizar saldo</option>}
            </Select>
          )}
        </Field>
        {values.type === 'sell' && (
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input id="totalRedemption" type="checkbox" className="size-4 accent-emerald-600" checked={totalRedemption} onChange={(e) => toggleTotalRedemption(e.target.checked)} />
            Resgate total ({byBalance ? available.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : `${available.toLocaleString('pt-BR', { maximumFractionDigits: 8 })} disponível`})
          </label>
        )}
        {byBalance ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={AMOUNT_LABEL[values.type]} error={errors.amount}>
              {(c) => <MoneyInput {...c} name="amount" value={values.amount} onValueChange={(value) => set('amount', value)} />}
            </Field>
            <Field label="Rendimento (% a.a.)" hint="Opcional: a taxa contratada, para estimar o saldo." error={errors.yieldRate}>
              {(c) => <MoneyInput {...c} name="yieldRate" value={values.yieldRate} onValueChange={(value) => set('yieldRate', value)} placeholder="12,5" />}
            </Field>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Quantidade" error={errors.quantity}>
              {(c) => <Input {...c} name="quantity" type="number" inputMode="decimal" min={0} step="any" value={values.quantity} onChange={(e) => set('quantity', e.target.value)} />}
            </Field>
            <Field label={`Preço unitário (${asset.currency === 'USD' ? 'US$' : 'R$'})`} error={errors.price}>
              {(c) => <MoneyInput {...c} name="price" decimals={4} value={values.price} onValueChange={(value) => set('price', value)} />}
            </Field>
          </div>
        )}
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
