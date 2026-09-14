// #region yield-index
/** Indexador do rendimento contratado em renda fixa (CA14.4). */
export type YieldIndex = 'fixed' | 'cdi' | 'selic' | 'ipca';

export const YIELD_INDEXES = ['fixed', 'cdi', 'selic', 'ipca'] as const satisfies readonly YieldIndex[];

/** Rótulo do indexador no formulário e o que a taxa significa em cada um. */
export const YIELD_INDEX_LABELS: Record<YieldIndex, { option: string; rate: string; placeholder: string }> = {
  fixed: { option: 'Prefixado', rate: 'Taxa (% a.a.)', placeholder: '12' },
  cdi: { option: '% do CDI', rate: 'Percentual do CDI', placeholder: '100' },
  selic: { option: '% da SELIC', rate: 'Percentual da SELIC', placeholder: '100' },
  ipca: { option: 'IPCA +', rate: 'Juros acima do IPCA (% a.a.)', placeholder: '6' },
};

/**
 * Taxas de referência anuais (% a.a.) usadas para estimar o saldo de títulos
 * pós-fixados. São indicativas: o app não consulta o Banco Central, e a
 * projeção serve para acompanhar o saldo entre uma consulta e outra ao banco.
 */
export const REFERENCE_RATES = { cdi: 14.9, selic: 15, ipca: 4.5 } as const;
export type ReferenceRates = { cdi: number; selic: number; ipca: number };

/**
 * Taxa anual efetiva (% a.a.) que um rendimento contratado rende hoje:
 * prefixado é a própria taxa; `% do CDI` e `% da SELIC` aplicam o percentual
 * sobre a referência; `IPCA +` compõe a inflação com os juros reais.
 */
export function effectiveAnnualRate(index: YieldIndex, rate: number, reference: ReferenceRates = REFERENCE_RATES): number {
  switch (index) {
    case 'fixed':
      return rate;
    case 'cdi':
      return (rate / 100) * reference.cdi;
    case 'selic':
      return (rate / 100) * reference.selic;
    case 'ipca':
      return ((1 + reference.ipca / 100) * (1 + rate / 100) - 1) * 100;
  }
}

const percent = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/** Como o extrato e o KPI mostram o rendimento: `12% a.a.`, `100% do CDI`, `100% da SELIC`, `IPCA + 6% a.a.`. */
export function formatYield(index: YieldIndex, rate: number): string {
  switch (index) {
    case 'fixed':
      return `${percent(rate)}% a.a.`;
    case 'cdi':
      return `${percent(rate)}% do CDI`;
    case 'selic':
      return `${percent(rate)}% da SELIC`;
    case 'ipca':
      return `IPCA + ${percent(rate)}% a.a.`;
  }
}
// #endregion
