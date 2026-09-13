import type { Decimal } from '@/generated/prisma/internal/prismaNamespace';

// #region serialize
/**
 * O Prisma devolve `Decimal` e `Date`; o cliente recebe `number` e `AAAA-MM-DD`.
 * Concentrar a conversão aqui evita `Number(...)` espalhado pelos componentes.
 */
export function decimal(value: Decimal | null | undefined): number | null {
  return value == null ? null : Number(value);
}

export function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
// #endregion
