import { expect, test } from '@playwright/test';

test('dashboard exposes the main React experience', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carteira conectada' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ativos' })).toBeVisible();
});
