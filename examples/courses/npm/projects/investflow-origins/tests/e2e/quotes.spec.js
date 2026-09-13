import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-cotacoes-${Date.now()}@example.com`;

// #region flow
test('criar ativo cotavel atualiza a cotacao e o botao permite rodar de novo (TK04-6, TK04-9)', async ({
  page,
}) => {
  await page.goto('/signup');
  await page.fill('[name=fullName]', 'Ana E2E');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/signin/);
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.click('[data-new-asset]');
  await page.fill('[name=ticker]', 'HGLG11');
  await page.fill('[name=name]', 'CSHG Logistica');
  await page.selectOption('[name=category]', 'fiis');
  await page.click('[data-asset-form] button[type=submit]');
  await expect(page.locator('[data-toast]')).toContainText('Ativo salvo.');
  await expect(page.locator('[data-toast]')).toContainText('atualizado(s)');
  await expect(page.locator('tr[data-ticker="HGLG11"] td').nth(5)).toContainText('R$');

  await page.click('[data-update-quotes]');

  await expect(page.locator('[data-toast]')).toContainText('atualizado(s)');
  await expect(page.locator('tr[data-ticker="HGLG11"] td').nth(5)).toContainText('R$');
});
// #endregion
