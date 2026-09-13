'use client';

import { useQuery } from '@tanstack/react-query';
import { getJson } from '@/lib/http';
import type { PortfolioSummary } from './types';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: () => getJson<PortfolioSummary>('/api/portfolio'),
  });
}
