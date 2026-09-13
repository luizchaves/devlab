import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { CATEGORIES, CATEGORY_LABELS } from '@/core/portfolio';
import { Badge } from './badge';

describe('Badge', () => {
  it('CA01.5 — cada uma das categorias tem um badge com cor própria', async () => {
    render(
      <div>
        {CATEGORIES.map((category) => (
          <Badge key={category} tone={category} data-testid={category}>
            {CATEGORY_LABELS[category]}
          </Badge>
        ))}
      </div>
    );

    const classes = new Set<string>();
    for (const category of CATEGORIES) {
      const badge = page.getByTestId(category);
      await expect.element(badge).toHaveTextContent(CATEGORY_LABELS[category]);
      classes.add((badge.element() as HTMLElement).className.match(/bg-\w+-100/)?.[0] ?? '');
    }
    expect(classes.size).toBe(CATEGORIES.length);
  });
});
