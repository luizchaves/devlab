import { randomUUID } from 'node:crypto';

import type { Investment } from '#types/index.ts';

/**
 * Recurso protegido: toda leitura e filtrada por `userId`.
 *
 * Filtrar aqui, e nao no controller, e o que evita o vazamento classico de
 * "listar tudo e esquecer o dono".
 */
let investments: Investment[] = [];

export function findAllByUser(userId: string): Investment[] {
  return investments.filter((investment) => investment.userId === userId);
}

export function findById(id: string): Investment | undefined {
  return investments.find((investment) => investment.id === id);
}

export function create({
  name,
  amount,
  userId,
}: {
  name: string;
  amount: number;
  userId: string;
}): Investment {
  const investment: Investment = { id: randomUUID(), name, amount, userId };

  investments.push(investment);

  return investment;
}

export function remove(id: string): boolean {
  const sizeBefore = investments.length;

  investments = investments.filter((investment) => investment.id !== id);

  return investments.length < sizeBefore;
}
