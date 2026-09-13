'use client';

import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { DEFAULT_SIMULATION, simulate, type SimulationInput } from '@/core/simulator';
import { formatMoney } from '@/lib/format';

// #region simulator
/**
 * Simulador da landing (CA01.2): quatro campos controlados, resultado
 * derivado com `useMemo` e barras animadas pelo Motion. O cálculo mora em
 * `core/simulator.ts`; este componente só coleta entrada e apresenta saída.
 */
export function Simulator() {
  const [input, setInput] = useState<SimulationInput>(DEFAULT_SIMULATION);
  const result = useMemo(() => simulate(input), [input]);

  const update = (key: keyof SimulationInput) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setInput((current) => ({ ...current, [key]: Number(event.target.value) }));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Valor inicial (R$)">
          {(c) => <MoneyInput {...c} id="sim-initial" decimals={0} value={input.initial} onValueChange={(value) => setInput((current) => ({ ...current, initial: value ?? 0 }))} />}
        </Field>
        <Field label="Aporte mensal (R$)">
          {(c) => <MoneyInput {...c} id="sim-monthly" decimals={0} value={input.monthly} onValueChange={(value) => setInput((current) => ({ ...current, monthly: value ?? 0 }))} />}
        </Field>
        <Field label="Taxa anual (%)">
          {(c) => <Input {...c} id="sim-rate" type="number" min={0} max={100} step={0.5} value={input.annualRate} onChange={update('annualRate')} />}
        </Field>
        <Field label="Prazo (anos)">
          {(c) => <Input {...c} id="sim-years" type="number" min={1} max={50} step={1} value={input.years} onChange={update('years')} />}
        </Field>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Patrimônio estimado</p>
        <p id="sim-result-total" className="mt-1 text-4xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
          {formatMoney(result.total)}
        </p>
        <p id="sim-result-multiplier" className="mt-1 text-xs font-semibold text-emerald-600">
          {result.multiplier.toFixed(1)}x o valor investido
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Total investido</dt>
            <dd id="sim-result-invested" className="font-bold">{formatMoney(result.invested)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Juros acumulados</dt>
            <dd id="sim-result-interest" className="font-bold text-emerald-600">{formatMoney(result.interest)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex h-3 gap-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden>
          <motion.div
            id="sim-bar-invested"
            className="h-full rounded-full bg-slate-400"
            animate={{ width: `${Math.max(2, Math.min(98, result.investedShare))}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
          <motion.div
            id="sim-bar-interest"
            className="h-full rounded-full bg-emerald-500"
            animate={{ width: `${Math.max(2, Math.min(98, result.interestShare))}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Valores ilustrativos, não são recomendação de investimento.
        </p>
      </div>
    </div>
  );
}
// #endregion
