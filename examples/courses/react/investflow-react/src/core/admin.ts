// Tipos do painel administrativo, compartilhados entre servidor e cliente (RNF05: só agregados).
export type AdminMetrics = {
  activeAccounts: number;
  aum: number;
  lastQuoteRun: string | null;
};

export type ServiceCheck = 'database' | 'storage' | 'quotes' | 'jobs';

export type AdminPayload = { metrics: AdminMetrics; checks: Record<ServiceCheck, boolean> };
