import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-cotacoes-${Date.now()}@example.com`;

// #region flow
test('o botao Atualizar Cotacoes preenche a cotacao e mostra o resumo (TK04-6)', async ({
  page,
}) => {
  await page.goto('/signup.html');
  await page.fill('[name=fullName]', 'Ana E2E');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/signin\.html/);
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/dashboard\.html$/);

  await page.click('[data-new-asset]');
  await page.fill('[name=ticker]', 'PETR4');
  await page.fill('[name=name]', 'Petrobras');
  await page.selectOption('[name=category]', 'acoes');
  await page.click('[data-asset-form] button[type=submit]');
  await expect(page.locator('tr[data-ticker="PETR4"]')).toContainText('—');

  await page.click('[data-update-quotes]');

  await expect(page.locator('[data-toast]')).toContainText('atualizado(s)');
  await expect(page.locator('tr[data-ticker="PETR4"]')).toContainText('38,42');
});
// #endregion
