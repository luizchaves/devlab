import { randomUUID } from 'node:crypto';
import { investments } from '@/data/investments.ts';
import type { Investment, InvestmentInput } from '@/types/Investment.d.ts';

async function create({ name, value }: InvestmentInput): Promise<Investment> {
  if (!name || !value) {
    throw new Error('Unable to create investment');
  }

  const newInvestment: Investment = { id: randomUUID(), name, value };

  investments.push(newInvestment);

  return newInvestment;
}

async function read(field?: keyof Investment, value?: string): Promise<Investment[]> {
  if (field && value) {
    return investments.filter((investment) => String(investment[field]).includes(value));
  }

  return investments;
}

async function readById(id: string): Promise<Investment> {
  const investment = investments.find((item) => item.id === id);

  if (!investment) {
    throw new Error('Investment not found');
  }

  return investment;
}

async function update({ id, name, value }: InvestmentInput & { id?: string }): Promise<Investment> {
  if (!id || !name || !value) {
    throw new Error('Unable to update investment');
  }

  const index = investments.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Investment not found');
  }

  const updatedInvestment: Investment = { id, name, value };

  investments[index] = updatedInvestment;

  return updatedInvestment;
}

async function remove(id: string): Promise<boolean> {
  const index = investments.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Investment not found');
  }

  investments.splice(index, 1);

  return true;
}

export default { create, read, readById, update, remove };
