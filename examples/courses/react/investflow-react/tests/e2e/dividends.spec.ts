import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Júlia Investidora', email: `julia-${Date.now()}@example.com`, password: 'segredo123' };

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
  await page.goto('/dashboard');
  await page.locator('[data-new-asset]').click();
  const form = page.locator('[data-asset-form]');
  await form.getByLabel('Categoria').selectOption(category);
  await form.getByLabel('Ticker').fill(ticker);
  await form.getByLabel('Nome').fill(name);
  await form.getByRole('button', { name: 'Cadastrar' }).click();
  await expect(form).toBeHidden();
}

// #region flow
test.describe('proventos e movimentações', () => {
  test('CA09.8, CA09.5, CA09.2 — a aba Proventos aparece só em ativo elegível e credita pela data ex', async ({ page }) => {
    await signUp(page);
    await createAsset(page, { ticker: 'HGLG11', name: 'CSHG Logística', category: 'fiis' });
    await page.locator('tr[data-ticker="HGLG11"] a').click();

    await page.locator('[data-new-transaction]').click();
    const tx = page.locator('[data-transaction-form]');
    await tx.getByLabel('Quantidade').fill('100');
    await tx.getByLabel(/Preço unitário/).fill('150');
    await tx.getByLabel('Data').fill('2026-01-10');
    await tx.getByRole('button', { name: 'Registrar' }).click();
    await expect(tx).toBeHidden();
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('100');

    // Três eventos no provedor simulado: um antes da compra (sem direito), dois depois (R$ 1,10 × 100 cada).
    await page.locator('[data-tab-btn="dividends"]').click();
    await expect(page).toHaveURL(/tab=dividends/);
    await page.locator('[data-sync-dividends]').click();
    await expect(page.locator('[data-dividends-rows] tr')).toHaveCount(2);
    await expect(page.locator('[data-dividends-footer]')).toContainText('220,00');
    await expect(page.locator('[data-kpi-card="totalReturn"]')).toBeVisible();

    // Renda fixa não tem proventos por cota: sem aba, sem card de retorno total.
    await createAsset(page, { ticker: 'CDB-E2E', name: 'CDB E2E', category: 'renda_fixa' });
    await page.locator('tr[data-ticker="CDB-E2E"] a').click();
    await expect(page.locator('[data-field=name]')).toHaveText('CDB E2E');
    await expect(page.locator('[data-tab-btn="dividends"]')).toHaveCount(0);
    await expect(page.locator('[data-kpi-card="totalReturn"]')).toHaveCount(0);
  });

  test('CA09.6, CA09.7 — página de proventos: KPIs, matriz, maiores pagadores e filtro por ativo', async ({ page }) => {
    await signIn(page);
    await page.goto('/dividends');

    await expect(page.locator('[data-kpi="total-dividends"]')).toHaveText('R$ 220,00');
    await expect(page.locator('[data-kpi="avg-yoc"]')).toContainText('1,47%');
    await expect(page.locator('[data-dividends-tbody] tr')).toHaveCount(2);
    await expect(page.locator('[data-top-dividends]')).toContainText('HGLG11');

    await page.locator('[data-dividends-view="matrix"]').click();
    await expect(page).toHaveURL(/view=matrix/);
    await expect(page.locator('[data-dividends-matrix]')).toContainText('2026');
    await expect(page.locator('[data-dividends-matrix]')).toContainText('220,00');

    const option = await page.locator('[data-filter-asset] option', { hasText: 'HGLG11' }).getAttribute('value');
    await page.locator('[data-filter-asset]').selectOption(option!);
    await expect(page).toHaveURL(/asset=/);
    await expect(page.locator('[data-kpi="total-dividends"]')).toHaveText('R$ 220,00');
  });

  test('CA09.9, CA09.10, CA09.11 — o toggle "Com proventos" entra no lucro, na matriz e na terceira série', async ({ page }) => {
    await signIn(page);
    await page.locator('[data-dividends-include="true"]').click();
    await expect(page).toHaveURL(/dividends=true/);
    await expect(page.locator('[data-assets-footer]')).toContainText('+ R$ 220,00');
    await page.locator('[data-dividends-include="false"]').click();
    await expect(page).not.toHaveURL(/dividends=/);
    await expect(page.locator('[data-assets-footer]')).not.toContainText('+ R$ 220,00');

    await page.goto('/analytics?dividends=true');
    await expect(page.locator('[data-kpi="dividends"]')).toHaveText('R$ 220,00');
    await expect(page.locator('[data-evolution] svg path[data-series="Valor + Proventos"]')).toHaveCount(1);
  });

  test('CA09.12, CA09.13, CA09.14, CA09.15 — aportes: KPIs de fluxo, janela na URL, extrato e registro pela página', async ({ page }) => {
    await signIn(page);
    await page.goto('/movements');

    await expect(page.locator('[data-kpi="total-buys"]')).toHaveText('R$ 15.000,00');
    await expect(page.locator('[data-kpi="net-invested"]')).toHaveText('R$ 15.000,00');
    await expect(page.locator('[data-kpi="count"]')).toHaveText('1 lançamento');
    const row = page.locator('[data-movements-tbody] tr').first();
    await expect(row).toContainText('HGLG11');
    await expect(row).toContainText('Compra');
    await expect(row).toContainText('10/01/2026');

    await page.locator('[data-movements-range="2y"]').click();
    await expect(page).toHaveURL(/range=2y/);
    await expect(page.locator('[data-movements-chart] svg')).toBeVisible();

    await page.locator('[data-new-transaction]').click();
    const form = page.locator('[data-transaction-form]');
    const cdb = await form.locator('[name=assetId] option', { hasText: 'CDB E2E' }).getAttribute('value');
    await form.getByLabel('Ativo').selectOption(cdb!);
    await form.getByLabel('Quantidade').fill('1000');
    await form.getByLabel('Preço unitário').fill('1');
    await form.getByLabel('Data').fill('2026-05-05');
    await form.getByRole('button', { name: 'Registrar' }).click();
    await expect(form).toBeHidden();
    await expect(page.locator('[data-kpi="count"]')).toHaveText('2 lançamentos');
    await expect(page.locator('[data-kpi="total-buys"]')).toHaveText('R$ 16.000,00');
  });
});
// #endregion
