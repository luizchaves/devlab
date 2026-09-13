'use client';

import { motion } from 'motion/react';
import { AlertCircle, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercent } from '@/lib/format';
import { usePreferencesStore } from '@/store/preferences';
import { PortfolioTable } from './portfolio-table';
import { usePortfolio } from './use-portfolio';

export function PortfolioDashboard() {
  const { data, error, isLoading, refetch, isFetching } = usePortfolio();
  const hideValues = usePreferencesStore((state) => state.hideValues);
  const toggleHideValues = usePreferencesStore((state) => state.toggleHideValues);

  if (isLoading) {
    return <p className="text-sm text-slate-600">Carregando carteira...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
        <AlertCircle className="mb-2 size-5" aria-hidden="true" />
        Não foi possível carregar a carteira. Confira sua sessão e tente novamente.
      </div>
    );
  }

  const allocation = Object.entries(data?.allocation ?? {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={toggleHideValues}>
          <EyeOff className="size-4" aria-hidden="true" />
          {hideValues ? 'Mostrar valores' : 'Ocultar valores'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            refetch();
            toast.info('Carteira atualizada');
          }}
          disabled={isFetching}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Atualizar
        </Button>
      </div>
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Patrimônio</p>
          <strong className="text-2xl" data-private-value>
            {formatCurrency(data?.total ?? 0)}
          </strong>
        </article>
        {allocation.slice(0, 2).map(([category, percent]) => (
          <article key={category} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{category}</p>
            <strong className="text-2xl">{formatPercent(percent)}</strong>
          </article>
        ))}
      </motion.div>
      <PortfolioTable assets={data?.assets ?? []} />
    </div>
  );
}
