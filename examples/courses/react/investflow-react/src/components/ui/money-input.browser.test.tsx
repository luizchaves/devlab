import { page, userEvent } from 'vitest/browser';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { MoneyInput } from './money-input';

function Harness({ initial = null, cents = false }: { initial?: number | null; cents?: boolean }) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <>
      <label>
        Preço
        <MoneyInput value={value} onValueChange={setValue} cents={cents} />
      </label>
      <output data-testid="value">{value === null ? 'null' : String(value)}</output>
      <button type="button" onClick={() => setValue(300)}>
        Preencher 300
      </button>
    </>
  );
}

describe('MoneyInput', () => {
  it('CA13.1, CA13.3 — mascara o milhar enquanto digita e entrega o número sem separadores', async () => {
    render(<Harness />);
    const input = page.getByLabelText('Preço');

    await userEvent.fill(input, '1250,5');
    await expect.element(input).toHaveValue('1.250,5');
    await expect.element(page.getByTestId('value')).toHaveTextContent('1250.5');
  });

  it('CA13.2 — ignora letras e a terceira casa decimal', async () => {
    render(<Harness />);
    const input = page.getByLabelText('Preço');

    await userEvent.fill(input, 'abc12,345');
    await expect.element(input).toHaveValue('12,34');
    await expect.element(page.getByTestId('value')).toHaveTextContent('12.34');
  });

  it('acompanha um valor definido por fora, como o resgate total', async () => {
    render(<Harness initial={6400} />);
    const input = page.getByLabelText('Preço');
    await expect.element(input).toHaveValue('6.400,00');

    await page.getByRole('button', { name: 'Preencher 300' }).click();
    await expect.element(input).toHaveValue('300,00');
  });

  it('CA13.5 — em centavos começa em 0,00, os dígitos entram pela direita e o reset volta a 0,00', async () => {
    render(<Harness cents />);
    const input = page.getByLabelText('Preço');
    await expect.element(input).toHaveValue('0,00');

    await userEvent.fill(input, '10000');
    await expect.element(input).toHaveValue('100,00');
    await expect.element(page.getByTestId('value')).toHaveTextContent('100');

    await page.getByRole('button', { name: 'Preencher 300' }).click();
    await expect.element(input).toHaveValue('300,00');
  });

  it('CA13.4 — ao sair do campo completa as casas decimais, sem mudar o número', async () => {
    render(<Harness />);
    const input = page.getByLabelText('Preço');

    await userEvent.fill(input, '100');
    await expect.element(input).toHaveValue('100');
    await userEvent.tab();
    await expect.element(input).toHaveValue('100,00');
    await expect.element(page.getByTestId('value')).toHaveTextContent('100');
  });
});
