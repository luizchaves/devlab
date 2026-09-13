import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/ui/button';

describe('Button', () => {
  it('renders an accessible button with variants', () => {
    render(<Button variant="secondary">Salvar</Button>);

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });
});
