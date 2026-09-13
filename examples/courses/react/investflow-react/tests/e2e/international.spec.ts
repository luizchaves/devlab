import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Kaio Investidor', email: `kaio-${Date.now()}@example.com`, password: 'segredo123' };

test.describe.configure({ mode: 'serial' });

async function signUp(page: Page) {
  await page.goto('/signup');
  await page.getByLabel('Nome completo').fill(account.name);
  await page.getByLabel('E-mail').fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function signIn(page: Page) {
  await page.goto('/signin');
  await page.getByLabel('E-mail').fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// #region flow
test.describe('dólar e cripto', () => {
  test('CA10.2 — o ticker sugere a moeda, e a sugestão pode ser trocada; renda fixa trava em reais', async ({ page }) => {
    await signUp(page);
    await page.locator('[data-new-asset]').click();
    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Categoria').selectOption('etfs');
    await form.getByLabel('Ticker').fill('VT');
    await expect(form.getByLabel('Moeda')).toHaveValue('USD');
    await form.getByLabel('Ticker').fill('PETR4');
    await expect(form.getByLabel('Moeda')).toHaveValue('BRL');
    await form.getByLabel('Ticker').fill('VT');
    await form.getByLabel('Moeda').selectOption('BRL');
    await expect(form.getByLabel('Moeda')).toHaveValue('BRL');
    await form.getByLabel('Categoria').selectOption('renda_fixa');
    await expect(form.getByLabel('Moeda')).toBeDisabled();
    await expect(form.getByLabel('Moeda')).toHaveValue('BRL');
    await page.keyboard.press('Escape');
  });

  test('CA10.1, CA10.4, CA10.9 — um ETF em dólar aparece em reais na carteira e em dólares no ativo', async ({ page }) => {
    await signIn(page);
    await page.locator('[data-new-asset]').click();
    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Categoria').selectOption('etfs');
    await form.getByLabel('Ticker').fill('VT');
    await form.getByLabel('Nome').fill('Vanguard Total World');
    await expect(form.getByLabel('Moeda')).toHaveValue('USD');
    await form.getByRole('button', { name: 'Cadastrar' }).click();
    await expect(form).toBeHidden();

    const row = page.locator('tr[data-ticker="VT"]');
    await expect(row).toContainText('USD');
    // A cotação simulada (US$ 120) e o câmbio da rodada (5,20) chegam juntos.
    await expect(row).toContainText('US$ 120,00');

    await row.locator('a').click();
    await page.locator('[data-new-transaction]').click();
    const tx = page.locator('[data-transaction-form]');
    await expect(tx.getByLabel(/Preço unitário/)).toBeVisible();
    await expect(tx.getByText(/Preço unitário \(US\$\)/)).toBeVisible();
    await tx.getByLabel('Quantidade').fill('10');
    await tx.getByLabel(/Preço unitário/).fill('100');
    await tx.getByLabel('Data').fill('2026-01-20');
    await tx.getByRole('button', { name: 'Registrar' }).click();
    await expect(tx).toBeHidden();

    await expect(page.locator('[data-kpi=averagePrice]')).toContainText('US$ 100,00');
    await expect(page.locator('[data-kpi=cost]')).toContainText('US$ 1.000,00');
    await expect(page.getByText(/≈ R\$/).first()).toBeVisible();

    // CA10.9: o gráfico do ativo alterna entre as duas moedas pela URL.
    await expect(page.locator('[data-currency-toggle-container]')).toBeVisible();
    await page.locator('[data-chart-currency="USD"]').click();
    await expect(page).toHaveURL(/currency=USD/);
    await page.locator('[data-chart-currency="BRL"]').click();
    await expect(page).not.toHaveURL(/currency=/);

    // CA10.4: na carteira, o valor consolidado é em reais.
    await page.goto('/dashboard');
    await expect(page.locator('tr[data-ticker="VT"]')).toContainText('R$ 6.240,00'); // 10 × 120 × 5,2
  });
});
// #endregion
