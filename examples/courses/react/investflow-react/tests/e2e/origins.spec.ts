import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Heitor Investidor', email: `heitor-${Date.now()}@example.com`, password: 'segredo123' };

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

async function createAsset(page: Page, a: { ticker: string; name: string; category: string; broker: string; issuer: string }) {
  await page.goto('/dashboard');
  await page.locator('[data-new-asset]').click();
  const form = page.locator('[data-asset-form]');
  await form.getByLabel('Categoria').selectOption(a.category);
  await form.getByLabel('Ticker').fill(a.ticker);
  await form.getByLabel('Nome').fill(a.name);
  await form.getByLabel('Corretora').fill(a.broker);
  await form.getByLabel('Emissor ou gestor').fill(a.issuer);
  await form.getByRole('button', { name: 'Cadastrar' }).click();
  await expect(form).toBeHidden();
}

async function addTransaction(page: Page, ticker: string, quantity: string, price: string, date: string) {
  await page.goto('/dashboard');
  await page.locator(`tr[data-ticker="${ticker}"] a`).click();
  await page.locator('[data-new-transaction]').click();
  const tx = page.locator('[data-transaction-form]');
  await tx.getByLabel('Quantidade').fill(quantity);
  await tx.getByLabel(/Preço unitário/).fill(price);
  await tx.getByLabel('Data').fill(date);
  await tx.getByRole('button', { name: 'Registrar' }).click();
  await expect(tx).toBeHidden();
}

// #region flow
test.describe('origem e evolução', () => {
  test('CA07.1, CA07.2 — o treemap agrupa por corretora, categoria e emissor sem recarregar', async ({ page }) => {
    await signUp(page);
    await createAsset(page, { ticker: 'PETR4', name: 'Petrobras', category: 'acoes', broker: 'XP', issuer: 'Petrobras' });
    await createAsset(page, { ticker: 'CDB-BB', name: 'CDB BB', category: 'renda_fixa', broker: 'Banco do Brasil', issuer: 'Banco do Brasil' });
    await addTransaction(page, 'PETR4', '100', '30', '2026-01-10');
    await addTransaction(page, 'CDB-BB', '1', '1000', '2026-01-05');

    await page.goto('/origins');
    await expect(page.locator('[data-treemap] svg [data-tile]')).toHaveCount(2);
    await expect(page.locator('[data-legend] li[data-label="XP"]')).toBeVisible();
    await expect(page.locator('[data-legend] li[data-label="Banco do Brasil"]')).toBeVisible();

    await page.locator('button[data-dimension="issuer"]').click();
    await expect(page).toHaveURL(/\/origins$/);
    await expect(page.locator('[data-treemap]')).toHaveAttribute('data-dimension', 'issuer');
    await expect(page.locator('[data-legend] li[data-label="Petrobras"]')).toBeVisible();

    await page.locator('button[data-dimension="category"]').click();
    await expect(page.locator('[data-legend] li[data-label="Ações"]')).toBeVisible();
    await expect(page.locator('[data-legend] li[data-label="Renda Fixa"]')).toBeVisible();
  });

  test('CA07.4, CA07.5 — a linha de aportes e a de valor aparecem na carteira e no ativo', async ({ page }) => {
    await signIn(page);
    await page.goto('/analytics');
    await expect(page.locator('[data-evolution] svg path[data-series="Aportado"]')).toHaveAttribute('d', /M/);
    await expect(page.locator('[data-evolution] svg path[data-series="Valor de mercado"]')).toHaveAttribute('d', /M/);

    await page.goto('/dashboard');
    await page.locator('tr[data-ticker="PETR4"] a').click();
    // Um mês com cotação (o atual, pelo provedor simulado): um ponto por série.
    await expect(page.locator('[data-evolution] svg circle')).toHaveCount(2);
  });

  test('CA07.7, CA07.8 — modo e janela trocam sem recarregar e ficam na URL', async ({ page }) => {
    await signIn(page);
    await page.goto('/analytics');
    await expect(page.locator('[data-evolution] svg')).toBeVisible();

    await page.locator('[data-timeline-mode="events"]').click();
    await expect(page).toHaveURL(/mode=events/);
    await expect(page.locator('[data-evolution] svg')).toBeVisible();

    await page.locator('[data-timeline-range="2y"]').click();
    await expect(page).toHaveURL(/mode=events&range=2y/);

    // Recarregar mantém a escolha (CA07.8).
    await page.reload();
    await expect(page.locator('[data-timeline-range="2y"]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('[data-timeline-mode="continuous"]').click();
    await page.locator('[data-timeline-range="all"]').click();
    await expect(page).toHaveURL(/\/analytics$/);
  });
});
// #endregion
