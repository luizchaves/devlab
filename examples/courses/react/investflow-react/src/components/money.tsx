'use client';

import { formatMoney } from '@/lib/format';
import { usePreferences } from '@/store/preferences';

type MoneyProps = {
  value: number | null | undefined;
  currency?: 'BRL' | 'USD';
  className?: string;
  /** Atributos de dados para os testes localizarem o valor. */
  [dataAttribute: `data-${string}`]: string | undefined;
};

// #region money
/**
 * Todo valor monetário passa por aqui: com "ocultar valores" ligado, o texto
 * vira `••••••` em qualquer lugar da árvore, inclusive no que renderizar depois (CA11.10).
 */
export function Money({ value, currency = 'BRL', className, ...dataAttributes }: MoneyProps) {
  const hideValues = usePreferences((state) => state.hideValues);

  if (value == null) {
    return (
      <span className={className} {...dataAttributes}>
        —
      </span>
    );
  }

  return (
    <span className={className} data-money {...dataAttributes}>
      {hideValues ? '••••••' : formatMoney(value, currency)}
    </span>
  );
}
// #endregion
