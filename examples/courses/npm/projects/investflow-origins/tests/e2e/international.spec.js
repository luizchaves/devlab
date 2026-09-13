import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-dolar-${Date.now()}@example.com`;

async function signIn(page) {
  await page.goto('/signin');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
}

// #region flow
test.describe
  .serial('Sprint 10: dolar e cripto', () => {
    test('o ticker sugere a moeda, e a sugestao pode ser trocada (CA10.2)', async ({ page }) => {
      await page.goto('/signup');
      await page.fill('[name=fullName]', 'Ana E2E');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/\/signin/);
      await signIn(page);

      await page.click('[data-new-asset]');
      await page.selectOption('[name=category]', 'etfs');
      await page.fill('[name=ticker]', 'VT');
      await expect(page.locator('[name=currency]')).toHaveValue('USD');
      await page.fill('[name=ticker]', 'PETR4');
      await expect(page.locator('[name=currency]')).toHaveValue('BRL');
      await page.fill('[name=ticker]', 'VT');
      await page.click('[data-currency-option="BRL"]');
      await expect(page.locator('[name=currency]')).toHaveValue('BRL');
      // Renda fixa e sempre em real: o campo de moeda some.
      await page.selectOption('[name=category]', 'renda_fixa');
      await expect(page.locator('[data-currency-field]')).toBeHidden();
      await expect(page.locator('[name=currency]')).toHaveValue('BRL');
      await page.click('[data-asset-form] [data-close]');
    });

    test('um ETF em dolar aparece em reais na carteira e em dolares no ativo (CA10.1, CA10.4, CA10.9)', async ({
      page,
    }) => {
      await signIn(page);

      await page.click('[data-new-asset]');
      await page.selectOption('[name=category]', 'etfs');
      await page.fill('[name=ticker]', 'VT');
      await page.fill('[name=name]', 'Vanguard Total World');
      await expect(page.locator('[name=currency]')).toHaveValue('USD');
      await page.click('[data-asset-form] button[type=submit]');
      // Cotado no provedor e convertido pela taxa que a mesma rodada gravou.
      await expect(page.locator('[data-toast]')).toContainText('1 atualizado(s)');
      const row = page.locator('tr[data-ticker="VT"]');
      await expect(row).toContainText('USD');
      await expect(row).toContainText('R$');

      await row.locator('a').click();
      await page.click('[data-new-transaction]');
      await expect(page.locator('[data-price-unit-label]')).toContainText('US$');
      await page.fill('[name=quantity]', '10');
      await page.fill('[name=price]', '100');
      await page.fill('[name=transactionDate]', '2026-01-20');
      await page.click('[data-transaction-form] button[type=submit]');
      await expect(page.locator('[data-transaction-dialog]')).toBeHidden();

      // Preco medio em dolar, com o equivalente em real por cima.
      await expect(page.locator('[data-kpi=averagePrice]')).toContainText('$100.00');
      await expect(page.locator('[data-kpi=averagePrice]')).toContainText('R$');
      await expect(page.locator('[data-kpi=cost]')).toContainText('R$');

      // CA10.9: o grafico do ativo alterna entre as duas moedas.
      await expect(page.locator('[data-currency-toggle-container]')).toBeVisible();
      await page.click('[data-chart-currency="USD"]');
      await expect(page).toHaveURL(/currency=USD/);
      await page.click('[data-chart-currency="BRL"]');
      await expect(page).not.toHaveURL(/currency=/);
    });
  });
// #endregion
