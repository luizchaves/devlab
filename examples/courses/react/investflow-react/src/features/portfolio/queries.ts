'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AssetInput, TransactionInput } from '@/core/assets';
import type { AssetWithTransactions, TransactionFact } from '@/core/portfolio';
import { api } from '@/lib/http';

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
