'use client';

import { LineChart } from '@/components/charts/line-chart';
import { timeline, toSeries, totalsByMonth, type EvolutionRow, type TimelineMode, type TimelineRange } from '@/core/evolution';
import { cn } from '@/lib/cn';
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
export function EvolutionChart({ evolution, movementMonths }: { evolution: EvolutionRow[]; movementMonths: string[] }) {
  const { mode, range, set } = useTimelineParams();
  const points = timeline(totalsByMonth(evolution), { mode, range, movementMonths });

  return (
    <div data-evolution className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Aportes × valor</h2>
        <div className="flex flex-wrap gap-2">
          <Segmented options={MODES} value={mode} onChange={(value) => set({ mode: value })} attribute="data-timeline-mode" label="Modo" />
          <Segmented options={RANGES} value={range} onChange={(value) => set({ range: value })} attribute="data-timeline-range" label="Janela" />
        </div>
      </div>
      <LineChart series={toSeries(points)} />
    </div>
  );
}
// #endregion

function Segmented<T extends string>({ options, value, onChange, attribute, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; attribute: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs dark:border-slate-700">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          {...{ [attribute]: o.value }}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn('min-h-9 rounded-md px-3 font-medium', o.value === value ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
