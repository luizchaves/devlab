// #region simulate
export type SimulationInput = {
  /** Valor inicial, em reais. */
  initial: number;
  /** Aporte mensal, em reais. */
  monthly: number;
  /** Taxa anual em porcentagem (11.5 = 11,5% a.a.). */
  annualRate: number;
  /** Prazo em anos, de 1 a 50. */
  years: number;
};

export type SimulationResult = {
  total: number;
  invested: number;
  interest: number;
  /** Quantas vezes o total supera o investido; 0 quando nada foi investido. */
  multiplier: number;
  investedShare: number;
  interestShare: number;
};

/**
 * Juros compostos com aporte mensal: a taxa anual vira a mensal equivalente
 * e cada mês capitaliza o saldo antes de somar o aporte. Mesma regra do
 * simulador da landing vanilla, agora sem DOM.
 */
export function simulate(input: SimulationInput): SimulationResult {
  const initial = Math.max(0, input.initial || 0);
  const monthly = Math.max(0, input.monthly || 0);
  const annualRate = Math.max(0, input.annualRate || 0) / 100;
  const years = Math.max(1, Math.min(50, input.years || 1));

  const months = Math.round(years * 12);
  const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

  let total = initial;
  for (let month = 1; month <= months; month++) {
    total = total * (1 + monthlyRate) + monthly;
  }

  const invested = initial + monthly * months;
  const interest = Math.max(0, total - invested);

  return {
    total,
    invested,
    interest,
    multiplier: invested > 0 ? total / invested : 0,
    investedShare: total > 0 ? (invested / total) * 100 : 0,
    interestShare: total > 0 ? (interest / total) * 100 : 0,
  };
}
// #endregion

/** Valores de exemplo da landing: uma ilustração, não uma recomendação (CA01.2). */
export const DEFAULT_SIMULATION: SimulationInput = {
  initial: 10_000,
  monthly: 1_500,
  annualRate: 11.5,
  years: 10,
};
