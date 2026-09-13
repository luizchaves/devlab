import { PortfolioDashboard } from '@/features/portfolio/portfolio-dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Carteira conectada</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Esta tela aplica componentes, hooks, server state, tabela, estado global mínimo,
          notificações e animações em um fluxo inspirado no InvestFlow vanilla.
        </p>
      </div>
      <PortfolioDashboard />
    </div>
  );
}
