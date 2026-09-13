'use client';

import { LineChart } from '@/components/charts/line-chart';
import { Segmented } from '@/components/ui/toggle';
import { cumulativeDividends, type ReceivedDividend } from '@/core/dividends';
import { timeline, toSeries, totalsByMonth, type EvolutionRow, type TimelineMode, type TimelineRange } from '@/core/evolution';
import { useUrlState } from '@/lib/url-state';

const MODES: { value: TimelineMode; label: string }[] = [
  { value: 'continuous', label: 'Contínuo' },
  { value: 'events', label: 'Eventos' },
];
const RANGES: { value: TimelineRange; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  { value: '2y', label: '2 anos' },
  { value: '1y', label: 'Ano' },
];

// #region url-state
/** Modo e janela vivem na URL (`?mode=events&range=2y`), com os padrões omitidos (CA07.8). */
export function useTimelineParams() {
  const [values, set] = useUrlState({ mode: 'continuous', range: 'all' });
  return { mode: values.mode as TimelineMode, range: values.range as TimelineRange, set };
}
// #endregion

// #region chart
export function EvolutionChart({ evolution, movementMonths, dividends = [], includeDividends = false }: { evolution: EvolutionRow[]; movementMonths: string[]; dividends?: ReceivedDividend[]; includeDividends?: boolean }) {
  const { mode, range, set } = useTimelineParams();
  // A terceira série acumula os proventos pagos até cada mês (CA09.11).
  const withAcc = totalsByMonth(evolution).map((p) => ({ ...p, dividendsAcc: cumulativeDividends(dividends, p.month.slice(0, 7)) }));
  const points = timeline(withAcc, { mode, range, movementMonths });

  return (
    <div data-evolution className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Aportes × valor</h2>
        <div className="flex flex-wrap gap-2">
          <Segmented options={MODES} value={mode} onChange={(value) => set({ mode: value })} attribute="data-timeline-mode" label="Modo" />
          <Segmented options={RANGES} value={range} onChange={(value) => set({ range: value })} attribute="data-timeline-range" label="Janela" />
        </div>
      </div>
      <LineChart series={toSeries(points, { includeDividends })} />
    </div>
  );
}
// #endregion
