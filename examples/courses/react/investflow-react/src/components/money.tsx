'use client';

import { formatMoney } from '@/lib/format';
import { usePreferences } from '@/store/preferences';

type MoneyProps = {
  value: number | null | undefined;
  currency?: 'BRL' | 'USD';
  className?: string;
};

// #region money
/**
 * Todo valor monetário passa por aqui: com "ocultar valores" ligado, o texto
 * vira `••••••` em qualquer lugar da árvore, inclusive no que renderizar depois (CA11.10).
 */
export function Money({ value, currency = 'BRL', className }: MoneyProps) {
  const hideValues = usePreferences((state) => state.hideValues);

  if (value == null) return <span className={className}>—</span>;

  return (
    <span className={className} data-money>
      {hideValues ? '••••••' : formatMoney(value, currency)}
    </span>
  );
}
// #endregion
