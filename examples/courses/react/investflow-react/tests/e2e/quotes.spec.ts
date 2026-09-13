import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Dora Investidora', email: `dora-${Date.now()}@example.com`, password: 'segredo123' };

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

async function createAsset(page: Page, { ticker, name, category }: { ticker: string; name: string; category: string }) {
  await page.locator('[data-new-asset]').click();
  const form = page.locator('[data-asset-form]');
  await form.getByLabel('Categoria').selectOption(category);
  if (ticker) await form.getByLabel('Ticker').fill(ticker);
  await form.getByLabel('Nome').fill(name);
  await form.getByRole('button', { name: 'Cadastrar' }).click();
  await expect(form).toBeHidden();
}

// #region flow
test.describe('cotações (provedor fake)', () => {
  test('CA04.4 — cadastrar um ativo cotado já traz a cotação, sem clique manual', async ({ page }) => {
    await signUp(page);
    await createAsset(page, { ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });

    const row = page.locator('tr[data-ticker="PETR4"]');
    await expect(row).toContainText('R$ 38,42');
  });

  test('CA04.5, CA08.10, CA08.11 — provedor sem o ticker avisa, mantém o ativo e abre a cotação manual', async ({ page }) => {
    await signIn(page);
    await createAsset(page, { ticker: 'XPTO3', name: 'Desconhecida', category: 'acoes' });

    await expect(page.getByText(/Cotação de XPTO3 não foi atualizada/)).toBeVisible();
    const row = page.locator('tr[data-ticker="XPTO3"]');
    await expect(row).toBeVisible();

    await row.locator('a').click();
    await page.locator('[data-new-transaction]').click();
    const tx = page.locator('[data-transaction-form]');
    await tx.getByLabel('Quantidade').fill('300');
    await tx.getByLabel(/Preço unitário/).fill('20');
    await tx.getByRole('button', { name: 'Registrar' }).click();
    await expect(tx).toBeHidden();

    await page.locator('[data-update-price]').click();
    const priceForm = page.locator('[data-price-form]');
    await expect(priceForm).toBeVisible();
    await expect(priceForm.locator('[data-price-warning]')).toContainText('XPTO3');
    await priceForm.getByLabel(/Cotação/).fill('25');
    await priceForm.getByRole('button', { name: 'Salvar' }).click();
    await expect(priceForm).toBeHidden();

    await expect(page.locator('[data-kpi=currentPrice]')).toContainText('25,00');
    await expect(page.locator('[data-kpi=value]')).toContainText('7.500,00');
  });

  test('CA08.12, CA08.8 — o saldo manual de renda fixa vira lançamento e o ativo vale o saldo', async ({ page }) => {
    await signIn(page);
    await createAsset(page, { ticker: '', name: 'CDB Inter', category: 'renda_fixa' });

    const row = page.locator('tr[data-ticker^="RF-CDBINTER"]');
    await expect(row).toBeVisible();
    await row.locator('a').click();

    await page.locator('[data-update-price]').click();
    const priceForm = page.locator('[data-price-form]');
    await priceForm.getByLabel(/Saldo atual/).fill('1250.5');
    await priceForm.getByRole('button', { name: 'Salvar' }).click();
    await expect(priceForm).toBeHidden();

    await expect(page.locator('[data-transactions] tr')).toHaveCount(1);
    await expect(page.locator('[data-transactions] tr').first()).toContainText('Saldo');
    await expect(page.locator('[data-kpi=value]')).toContainText('1.250,50');
  });

  test('CA10.15 — "Atualizar cotações" na carteira responde com o resumo da rodada', async ({ page }) => {
    await signIn(page);
    await page.locator('[data-update-quotes]').click();

    // Com o fechamento do dia já salvo (PETR4 pelo provedor, XPTO3 à mão), a rodada
    // não consulta de novo e responde "0 atualizada(s)"; em pregão aberto, atualiza PETR4.
    await expect(page.getByText(/cotação\(ões\) atualizada\(s\)|atualizado\(s\); sem cotação/)).toBeVisible();
  });
});
// #endregion
