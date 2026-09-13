'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { assetSchema, suggestCurrency, type AssetInput } from '@/core/assets';
import { CATEGORIES, CATEGORY_LABELS, type AssetWithTransactions } from '@/core/portfolio';
import { ApiError } from '@/lib/http';
import { isQuotable } from '@/core/quotes';
import { useCreateAsset, useUpdateAsset, useUpdateQuotes } from './queries';

type AssetFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sem `asset`, o diálogo cria; com ele, edita. */
  asset?: AssetWithTransactions | null;
};

type FieldErrors = Partial<Record<keyof AssetInput, string>>;

function initialValues(asset?: AssetWithTransactions | null): AssetInput {
  return {
    ticker: asset?.ticker ?? '',
    name: asset?.name ?? '',
    category: asset?.category ?? 'acoes',
    issuer: asset?.issuer ?? '',
    brokerName: asset?.broker?.name ?? '',
    currency: asset?.currency ?? 'BRL',
  };
}

// #region dialog
/**
 * Formulário de ativo: o schema de `core/assets` valida antes de enviar, e
 * o erro de campo da API (409 de ticker repetido, por exemplo) cai no mesmo
 * lugar do erro local.
 */
export function AssetFormDialog({ open, onOpenChange, asset }: AssetFormDialogProps) {
  const [values, setValues] = useState<AssetInput>(() => initialValues(asset));
  const [errors, setErrors] = useState<FieldErrors>({});
  const create = useCreateAsset();
  const update = useUpdateAsset(asset?.id ?? '');
  const mutation = asset ? update : create;
  const updateQuotes = useUpdateQuotes();

  const set = <K extends keyof AssetInput>(key: K, value: AssetInput[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      // Sugere a moeda pelo ticker enquanto o usuário digita (CA10.2); ele pode trocar depois.
      if (key === 'ticker' && typeof value === 'string' && current.category !== 'renda_fixa') {
        next.currency = suggestCurrency(value);
      }
      if (key === 'category' && value === 'renda_fixa') next.currency = 'BRL';
      return next;
    });
  };

  const close = () => {
    onOpenChange(false);
    setValues(initialValues(asset));
    setErrors({});
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = assetSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as keyof AssetInput] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }

    try {
      const saved = await mutation.mutateAsync(parsed.data);
      toast.success(asset ? 'Ativo atualizado.' : 'Ativo cadastrado.');
      close();
      // Ativo cotável já busca a cotação (CA04.4); se o provedor falhar, o ativo continua salvo (CA04.5).
      if (isQuotable(saved)) {
        updateQuotes
          .mutateAsync({ assetId: saved.id })
          .then((summary) => {
            if (summary.updated === 0) toast.warning(`Cotação de ${saved.ticker} não foi atualizada. Informe o valor na tela do ativo.`);
          })
          .catch(() => toast.warning(`Cotação de ${saved.ticker} não foi atualizada.`));
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) setErrors({ ticker: error.message });
      else if (error instanceof ApiError && Object.keys(error.fieldErrors).length) setErrors(error.fieldErrors);
      else toast.error(error instanceof Error ? error.message : 'Não foi possível salvar.');
    }
  };

  const isFixedIncome = values.category === 'renda_fixa';

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())} title={asset ? 'Editar ativo' : 'Novo ativo'}>
      <form onSubmit={submit} className="grid gap-4" data-asset-form noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoria" error={errors.category}>
            {(c) => (
              <Select {...c} name="category" value={values.category} onChange={(e) => set('category', e.target.value as AssetInput['category'])}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Ticker" hint={isFixedIncome ? 'Opcional na renda fixa.' : undefined} error={errors.ticker}>
            {(c) => <Input {...c} name="ticker" value={values.ticker} onChange={(e) => set('ticker', e.target.value)} placeholder={isFixedIncome ? 'automático' : 'PETR4'} />}
          </Field>
        </div>
        <Field label="Nome" error={errors.name}>
          {(c) => <Input {...c} name="name" value={values.name} onChange={(e) => set('name', e.target.value)} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Corretora" hint="Uma nova é criada se não existir." error={errors.brokerName}>
            {(c) => <Input {...c} name="brokerName" value={values.brokerName} onChange={(e) => set('brokerName', e.target.value)} />}
          </Field>
          <Field label="Emissor ou gestor" error={errors.issuer}>
            {(c) => <Input {...c} name="issuer" value={values.issuer} onChange={(e) => set('issuer', e.target.value)} />}
          </Field>
        </div>
        <Field label="Moeda" error={errors.currency}>
          {(c) => (
            <Select {...c} name="currency" value={values.currency} disabled={isFixedIncome} onChange={(e) => set('currency', e.target.value as 'BRL' | 'USD')}>
              <option value="BRL">Real (BRL)</option>
              <option value="USD">Dólar (USD)</option>
            </Select>
          )}
        </Field>
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" pending={mutation.isPending}>
            {asset ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
// #endregion
