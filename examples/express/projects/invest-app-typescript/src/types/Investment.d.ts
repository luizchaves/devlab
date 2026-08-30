export interface Investment {
  id: string;
  name: string;
  value: number;
}

export interface InvestmentInput {
  name?: string;
  value?: number;
}
