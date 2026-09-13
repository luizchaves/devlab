'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { exchangeTable, type ExchangeRateRow, type ExchangeTable } from '@/core/exchange';
import { api } from '@/lib/http';

const ExchangeContext = createContext<ExchangeTable>(exchangeTable([]));

// #region provider
/**
 * A tabela de câmbio disponível em toda tela privada: o layout entrega as
 * linhas iniciais, o React Query as mantém, e `useExchange()` dá a taxa do
 * mês ou a mais recente a quem precisa converter (CA10.4).
 */
export function ExchangeProvider({ initialRates, children }: { initialRates: ExchangeRateRow[]; children: ReactNode }) {
  const { data = initialRates } = useQuery({ queryKey: ['exchange'], queryFn: () => api<{ rates: ExchangeRateRow[] }>('/api/exchange').then((r) => r.rates), initialData: initialRates });
  const table = useMemo(() => exchangeTable(data), [data]);
  return <ExchangeContext.Provider value={table}>{children}</ExchangeContext.Provider>;
}

export function useExchange() {
  return useContext(ExchangeContext);
}
// #endregion
