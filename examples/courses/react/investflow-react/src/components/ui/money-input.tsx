'use client';

import { useState, type ChangeEvent } from 'react';
import { formatMoneyInput, maskMoney, parseMoney } from '@/core/money-mask';
import { Input, type InputProps } from './input';

export type MoneyInputProps = Omit<InputProps, 'value' | 'onChange' | 'type'> & {
  /** Valor numérico; `null` quando o campo está vazio. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Casas decimais aceitas (2 por padrão; 4 para preços de cotação). */
  decimals?: number;
};

// #region money-input
/**
 * Campo monetário com máscara pt-BR (RNF08): o texto exibido é `1.250,56`, o
 * valor entregue ao formulário é `1250.56`. A máscara mora em `core/money-mask`;
 * aqui só se sincroniza o texto digitado com o número controlado de fora.
 */
export function MoneyInput({ value, onValueChange, decimals = 2, ...props }: MoneyInputProps) {
  const [text, setText] = useState(() => formatMoneyInput(value, { decimals }));

  // Quando o valor muda por fora (reset, "resgate total"), o texto acompanha.
  if (value !== parseMoney(text) && !(value === null && text === '')) {
    setText(formatMoneyInput(value, { decimals }));
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const masked = maskMoney(event.target.value, { decimals });
    setText(masked);
    onValueChange(parseMoney(masked));
  };

  return <Input {...props} type="text" inputMode="decimal" autoComplete="off" value={text} onChange={handleChange} />;
}
// #endregion
