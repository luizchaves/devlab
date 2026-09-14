'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Select } from '@/components/ui/select';
import { transactionSchema } from '@/core/assets';
import { BALANCE_CATEGORIES, type AssetWithTransactions } from '@/core/portfolio';
import { YIELD_INDEX_LABELS, YIELD_INDEXES, type YieldIndex } from '@/core/yield';
import { useCreateTransaction } from '@/features/portfolio/queries';
import { ApiError } from '@/lib/http';

type Values = { assetId: string; type: 'buy' | 'sell'; quantity: string; price: number | null; amount: number | null; yieldRate: number | null; yieldIndex: YieldIndex; transactionDate: string };

// #region dialog
/** Registrar uma movimentação pela página, escolhendo o ativo (CA09.15). */
export function MovementDialog({ open, onOpenChange, assets }: { open: boolean; onOpenChange: (open: boolean) => void; assets: AssetWithTransactions[] }) {
  const [values, setValues] = useState<Values>({ assetId: assets[0]?.id ?? '', type: 'buy', quantity: '', price: null, amount: null, yieldRate: null, yieldIndex: 'fixed', transactionDate: new Date().toISOString().slice(0, 10) });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const create = useCreateTransaction();
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((c) => ({ ...c, [key]: value }));

  const selected = assets.find((a) => a.id === values.assetId);
  const byBalance = selected ? BALANCE_CATEGORIES.includes(selected.category) : false;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    // Ativo por saldo: valor em reais vira quantidade com preço 1 (CA14.1).
    const parsed = transactionSchema.safeParse(
      byBalance ? { ...values, quantity: values.amount ?? '', price: 1 } : { ...values, price: values.price ?? '', yieldRate: null, yieldIndex: 'fixed' }
    );
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        fieldErrors[byBalance && key === 'quantity' ? 'amount' : key] ??= byBalance && key === 'quantity' ? 'Informe o valor.' : issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    try {
      await create.mutateAsync(parsed.data);
      toast.success('Lançamento registrado.');
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length) setErrors(error.fieldErrors);
      else toast.error(error instanceof Error ? error.message : 'Não foi possível salvar.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Novo lançamento">
      <form onSubmit={submit} className="grid gap-4" data-transaction-form noValidate>
        <Field label="Ativo" error={errors.assetId}>
          {(c) => (
            <Select {...c} name="assetId" value={values.assetId} onChange={(e) => set('assetId', e.target.value)}>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.ticker} · {a.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Tipo" error={errors.type}>
          {(c) => (
            <Select {...c} name="type" value={values.type} onChange={(e) => set('type', e.target.value as Values['type'])}>
              <option value="buy">Compra / aporte</option>
              <option value="sell">Venda / resgate</option>
            </Select>
          )}
        </Field>
        {byBalance ? (
          <>
          <Field label={values.type === 'sell' ? 'Valor resgatado (R$)' : 'Valor aplicado (R$)'} error={errors.amount}>
            {(c) => <MoneyInput {...c} name="amount" value={values.amount} onValueChange={(value) => set('amount', value)} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rendimento" hint="Opcional." error={errors.yieldIndex}>
              {(c) => (
                <Select {...c} name="yieldIndex" value={values.yieldIndex} onChange={(e) => set('yieldIndex', e.target.value as YieldIndex)}>
                  {YIELD_INDEXES.map((index) => (
                    <option key={index} value={index}>
                      {YIELD_INDEX_LABELS[index].option}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label={YIELD_INDEX_LABELS[values.yieldIndex].rate} error={errors.yieldRate}>
              {(c) => <MoneyInput {...c} name="yieldRate" value={values.yieldRate} onValueChange={(value) => set('yieldRate', value)} placeholder={YIELD_INDEX_LABELS[values.yieldIndex].placeholder} />}
            </Field>
          </div>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Quantidade" error={errors.quantity}>
              {(c) => <Input {...c} name="quantity" type="number" inputMode="decimal" min={0} step="any" value={values.quantity} onChange={(e) => set('quantity', e.target.value)} />}
            </Field>
            <Field label="Preço unitário" error={errors.price}>
              {(c) => <MoneyInput {...c} name="price" decimals={4} value={values.price} onValueChange={(value) => set('price', value)} />}
            </Field>
          </div>
        )}
        <Field label="Data" error={errors.transactionDate}>
          {(c) => <Input {...c} name="transactionDate" type="date" value={values.transactionDate} onChange={(e) => set('transactionDate', e.target.value)} />}
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
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
