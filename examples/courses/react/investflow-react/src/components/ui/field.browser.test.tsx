import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Field } from './field';
import { Input } from './input';

describe('Field', () => {
  it('liga rótulo e dica ao controle', async () => {
    render(
      <Field label="E-mail" hint="Usaremos para entrar.">
        {(control) => <Input type="email" {...control} />}
      </Field>
    );

    const input = page.getByLabelText('E-mail');
    await expect.element(input).toHaveAccessibleDescription('Usaremos para entrar.');
    await expect.element(input).not.toHaveAttribute('aria-invalid');
  });

  it('anuncia o erro e marca o controle como inválido', async () => {
    render(
      <Field label="Senha" error="Informe a senha.">
        {(control) => <Input type="password" {...control} />}
      </Field>
    );

    const input = page.getByLabelText('Senha');
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
    await expect.element(page.getByRole('alert')).toHaveTextContent('Informe a senha.');
    await expect.element(input).toHaveAccessibleDescription('Informe a senha.');
  });
});
