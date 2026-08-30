import type { Broker } from '@/types/Broker.d.ts';
import type { Category } from '@/types/Category.d.ts';

export interface Investment {
  id: string;
  name: string;
  value: number;
  interest: string;
  createdAt: Date;
  categoryId: string;
  brokerId: string;
  category?: Category;
  broker?: Broker;
}

export interface InvestmentInput {
  name?: string;
  value?: number;
  interest?: string;
  createdAt?: string;
  categoryId?: string;
  broker?: string;
}
