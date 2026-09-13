import { PortfolioDashboard } from '@/features/portfolio/portfolio-dashboard';

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">Ativos</p>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Tabela da carteira</h1>
        <p className="mt-2 text-slate-600">
          A mesma query alimenta outra rota, mostrando reaproveitamento de hooks e cache.
        </p>
      </div>
      <PortfolioDashboard />
    </div>
  );
}
