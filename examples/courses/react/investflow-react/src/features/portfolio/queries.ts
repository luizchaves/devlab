'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AssetInput, TransactionInput } from '@/core/assets';
import type { AssetWithTransactions, TransactionFact } from '@/core/portfolio';
import type { ManualQuoteInput, RunSummary } from '@/core/quotes';
import { api, ApiError } from '@/lib/http';

// #region keys
/** Chaves estáveis: invalidar `assets` derruba a carteira e todo detalhe de ativo. */
export const assetKeys = {
  all: ['assets'] as const,
  detail: (id: string) => ['assets', id] as const,
};
// #endregion

// #region queries
export function useAssets(initialData?: AssetWithTransactions[]) {
  return useQuery({
    queryKey: assetKeys.all,
    queryFn: () => api<{ assets: AssetWithTransactions[] }>('/api/assets').then((r) => r.assets),
    initialData,
  });
}

export function useAsset(idOrTicker: string, initialData?: AssetWithTransactions) {
  return useQuery({
    queryKey: assetKeys.detail(idOrTicker),
    queryFn: () => api<{ asset: AssetWithTransactions }>(`/api/assets/${encodeURIComponent(idOrTicker)}`).then((r) => r.asset),
    initialData,
  });
}
// #endregion

// #region mutations
/**
 * Mutações invalidam a chave `assets` no sucesso: quem estiver na tela
 * refaz a consulta, sem `setState` manual espalhado pelos componentes.
 */
function useInvalidateAssets() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: assetKeys.all });
}

export function useCreateAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (input: AssetInput) =>
      api<{ asset: AssetWithTransactions }>('/api/assets', { method: 'POST', body: JSON.stringify(input) }).then((r) => r.asset),
    onSuccess: invalidate,
  });
}

export function useUpdateAsset(id: string) {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (input: AssetInput) =>
      api<{ asset: AssetWithTransactions }>(`/api/assets/${id}`, { method: 'PATCH', body: JSON.stringify(input) }).then((r) => r.asset),
    onSuccess: invalidate,
  });
}

export function useDeleteAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/api/assets/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  });
}

export function useCreateTransaction() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (input: TransactionInput) =>
      api<{ transaction: TransactionFact }>('/api/transactions', { method: 'POST', body: JSON.stringify(input) }).then((r) => r.transaction),
    onSuccess: invalidate,
  });
}
// #endregion

// #region quotes
/** Rodada de cotações: a carteira inteira ou um ativo só (`assetId`). */
export function useUpdateQuotes() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (input: { assetId?: string } = {}) =>
      api<RunSummary>('/api/quotes/update', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: invalidate,
  });
}

export function useManualQuote(assetId: string) {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (input: ManualQuoteInput) =>
      api<{ kind: 'price' | 'balance' }>(`/api/assets/${assetId}/quote`, { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: invalidate,
  });
}
// #endregion

// #region receipts
/** Sobe o comprovante como multipart; o servidor devolve só o path (CA05.5). */
export function useUploadReceipt() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: async ({ transactionId, file }: { transactionId: string; file: File }) => {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch(`/api/transactions/${transactionId}/receipt`, { method: 'POST', body: form });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new ApiError(response.status, body.error ?? `Erro ${response.status}`);
      }
      return (await response.json()) as { receiptPath: string };
    },
    onSuccess: invalidate,
  });
}

/** Pede a URL assinada na hora do clique: ela expira em 60 s e nunca é guardada. */
export function receiptUrl(transactionId: string) {
  return api<{ url: string; expiresIn: number }>(`/api/transactions/${transactionId}/receipt`).then((r) => r.url);
}
// #endregion
