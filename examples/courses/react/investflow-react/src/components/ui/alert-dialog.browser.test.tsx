import { page, userEvent } from 'vitest/browser';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AlertDialog } from './alert-dialog';
import { Button } from './button';

function Harness({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Excluir ativo</Button>
      <AlertDialog open={open} onOpenChange={setOpen} title="Excluir PETR4?" description="Os lançamentos vão junto." onConfirm={onConfirm} />
    </>
  );
}

describe('AlertDialog', () => {
  it('CA03.12 — pede confirmação e só chama onConfirm no botão vermelho', async () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);

    await page.getByRole('button', { name: 'Excluir ativo' }).click();
    await expect.element(page.getByRole('alertdialog', { name: 'Excluir PETR4?' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    await page.getByRole('button', { name: 'Excluir ativo' }).click();
    await page.getByRole('button', { name: 'Excluir', exact: true }).click();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('Esc fecha sem confirmar', async () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    await page.getByRole('button', { name: 'Excluir ativo' }).click();

    await userEvent.keyboard('{Escape}');
    await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
