import { expect, test, type Page } from '@playwright/test';
import { e2ePrisma } from './prisma';

const account = { name: 'Gabi Investidora', email: `gabi-${Date.now()}@example.com`, password: 'segredo123' };

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
test.describe('rentabilidade e painel admin', () => {
  test('CA06.1, CA06.2 — a matriz nasce dos aportes e das cotações, com lacuna nos meses sem dado', async ({ page }) => {
    await signUp(page);

    await page.locator('[data-new-asset]').click();
    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Ticker').fill('PETR4');
    await form.getByLabel('Nome').fill('Petrobras');
    await form.getByRole('button', { name: 'Cadastrar' }).click();
    // A cotação de hoje vem do provedor simulado (38,42) logo depois do cadastro.
    await expect(page.locator('tr[data-ticker="PETR4"]')).toContainText('R$ 38,42');
    await page.locator('tr[data-ticker="PETR4"] a').click();

    for (const [quantity, price, date] of [['100', '30', '2026-01-10'], ['100', '34', '2026-02-10']]) {
      await page.locator('[data-new-transaction]').click();
      const tx = page.locator('[data-transaction-form]');
      await tx.getByLabel('Quantidade').fill(quantity);
      await tx.getByLabel(/Preço unitário/).fill(price);
      await tx.getByLabel('Data').fill(date);
      await tx.getByRole('button', { name: 'Registrar' }).click();
      await expect(tx).toBeHidden();
    }

    await page.goto('/analytics');
    await expect(page.locator('[data-kpi=cost]')).toContainText('6.400,00');
    const row = page.locator('[data-matrix] tr').first();
    await expect(row).toBeVisible();
    // Só o mês atual tem cotação: as outras células são lacuna, não 0%.
    const cells = row.locator('td');
    await expect(cells).toHaveCount(15);
    expect(await cells.filter({ hasText: '—' }).count()).toBeGreaterThanOrEqual(10);
    await expect(page.locator('[data-allocation] li[data-category="acoes"]')).toContainText('Ações');
  });

  test('CA06.4 — investidor é mandado de volta ao abrir o admin, e a API responde 403', async ({ page }) => {
    await signIn(page);

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('link', { name: 'Painel Admin' })).toHaveCount(0);

    const response = await page.request.get('/api/admin/metrics');
    expect(response.status()).toBe(403);
  });

  test('CA06.5 — admin vê totais e status, nunca posições', async ({ page }) => {
    await e2ePrisma.user.update({ where: { email: account.email }, data: { role: 'ADMIN' } });
    await signIn(page);

    const responses: string[] = [];
    page.on('response', async (r) => {
      if (r.url().includes('/api/admin/')) responses.push(await r.text());
    });
    await page.goto('/admin');

    await expect(page.locator('[data-metric="aum"]')).toContainText('R$');
    await expect(page.locator('[data-metric="activeAccounts"]')).not.toHaveText('—');
    await expect(page.locator('[data-check="database"]')).toHaveAttribute('data-status', 'up');
    await expect(page.locator('[data-check="storage"]')).toHaveAttribute('data-status', 'up');
    await expect(page.locator('[data-check="quotes"]')).toHaveAttribute('data-status', 'up');

    // RNF05: a página não traz ticker nem quantidade de carteira de ninguém.
    expect(await page.content()).not.toMatch(/PETR4/);
    for (const body of responses) expect(body).not.toMatch(/PETR4|ticker|quantity/);
  });
});
// #endregion
