'use client';

import { useState, type ChangeEvent, type FocusEvent } from 'react';
import { formatMoneyInput, maskCents, maskMoney, parseMoney } from '@/core/money-mask';
import { Input, type InputProps } from './input';

export type MoneyInputProps = Omit<InputProps, 'value' | 'onChange' | 'type'> & {
  /** Valor numérico; `null` quando o campo está vazio. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Casas decimais aceitas (2 por padrão; 4 para preços de cotação). */
  decimals?: number;
  /** Casas sempre exibidas ao sair do campo (`100` → `100,00`); `0` em campos de percentual. */
  minDecimals?: number;
  /** Máscara de centavos: começa em `0,00` e os dígitos entram pela direita. Para valores em reais. */
  cents?: boolean;
};

// #region money-input
/**
 * Campo monetário com máscara pt-BR (RNF08): o texto exibido é `1.250,56`, o
 * valor entregue ao formulário é `1250.56`. A máscara mora em `core/money-mask`;
 * aqui só se sincroniza o texto digitado com o número controlado de fora. Com
 * `cents`, o campo começa em `0,00` e os dígitos entram pela direita; sem,
 * digita-se livremente e as casas são completadas ao sair (`100` → `100,00`).
 */
export function MoneyInput({ value, onValueChange, decimals = 2, minDecimals, cents = false, onBlur, ...props }: MoneyInputProps) {
  const options = { decimals, minDecimals };
  const format = (amount: number | null) => (cents ? maskCents(amount == null ? '' : amount.toFixed(decimals), options) : formatMoneyInput(amount, options));
  const [text, setText] = useState(() => format(value));

  // Quando o valor muda por fora (reset, "resgate total"), o texto acompanha.
  // Em centavos, o vazio (`null`) é o `0,00` do campo.
  const emptyText = cents ? format(null) : '';
  if (value !== parseMoney(text) && !(value === null && text === emptyText)) {
    setText(format(value));
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const masked = cents ? maskCents(event.target.value, options) : maskMoney(event.target.value, options);
    setText(masked);
    onValueChange(parseMoney(masked));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (!cents) setText(formatMoneyInput(parseMoney(text), options));
    onBlur?.(event);
  };

  return <Input {...props} type="text" inputMode="decimal" autoComplete="off" value={text} onChange={handleChange} onBlur={handleBlur} />;
}
// #endregion
