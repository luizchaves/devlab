import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button } from './button';

describe('Button', () => {
  it('renderiza um botão acessível e reage ao clique', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    const button = page.getByRole('button', { name: 'Salvar' });
    await expect.element(button).toBeVisible();
    await button.click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('aplica a variante e mescla classes externas sem duplicar utilitários', async () => {
    render(
      <Button variant="danger" className="h-12">
        Excluir
      </Button>
    );

    const button = page.getByRole('button', { name: 'Excluir' });
    await expect.element(button).toHaveClass('bg-rose-600');
    await expect.element(button).toHaveClass('h-12');
    await expect.element(button).not.toHaveClass('h-10');
  });

  it('em estado pendente fica desabilitado e ocupado', async () => {
    render(<Button pending>Enviando</Button>);

    const button = page.getByRole('button', { name: 'Enviando' });
    await expect.element(button).toBeDisabled();
    await expect.element(button).toHaveAttribute('aria-busy', 'true');
  });
});
