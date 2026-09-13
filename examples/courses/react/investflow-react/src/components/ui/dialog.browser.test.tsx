import { page, userEvent } from 'vitest/browser';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button } from './button';
import { Dialog } from './dialog';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Novo ativo" description="Preencha os dados.">
        <p>Conteúdo do diálogo</p>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('abre com título e descrição acessíveis e fecha pelo botão', async () => {
    render(<Harness />);
    await page.getByRole('button', { name: 'Abrir' }).click();

    const dialog = page.getByRole('dialog', { name: 'Novo ativo' });
    await expect.element(dialog).toBeVisible();
    await expect.element(dialog).toHaveAccessibleDescription('Preencha os dados.');

    await page.getByRole('button', { name: 'Fechar' }).click();
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
  });

  it('CA11.8 — Esc fecha o diálogo sem salvar', async () => {
    render(<Harness />);
    await page.getByRole('button', { name: 'Abrir' }).click();
    await expect.element(page.getByRole('dialog')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
  });
});
