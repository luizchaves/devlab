import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Eva Investidora', email: `eva-${Date.now()}@example.com`, password: 'segredo123' };

test.describe.configure({ mode: 'serial' });

/** Nenhuma página pode rolar na horizontal em tela estreita (CA12.1). */
async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'largura do documento além da viewport').toBeLessThanOrEqual(0);
}

async function signUp(page: Page) {
  await page.goto('/signup');
  await page.getByLabel('Nome completo').fill(account.name);
  await page.getByLabel('E-mail').fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// #region flow
test.describe('RNF07 · design responsivo (celular)', () => {
  test('CA12.1 — landing, login e cadastro cabem na largura do celular', async ({ page }) => {
    for (const path of ['/', '/signin', '/signup']) {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    }
  });

  test('CA12.2 — a barra estreita expõe os links por um menu acessível', async ({ page }) => {
    await signUp(page);
    await expectNoHorizontalScroll(page);

    const toggle = page.locator('[data-menu-toggle]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#mobile-nav')).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const menu = page.locator('#mobile-nav');
    await expect(menu).toBeVisible();
    for (const label of ['Carteira', 'Rentabilidade', 'Proventos', 'Aportes', 'Origem']) {
      await expect(menu.getByRole('link', { name: label })).toBeVisible();
    }
    // O menu do usuário continua alcançável.
    await expect(page.getByRole('button', { name: /Eva/ })).toBeVisible();
  });

  test('CA12.3, CA12.4 — tabela com colunas essenciais e diálogo na largura da tela', async ({ page }) => {
    await page.goto('/signin');
    await page.getByLabel('E-mail').fill(account.email);
    await page.getByLabel('Senha', { exact: true }).fill(account.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // CA12.4: o diálogo cabe na viewport e os campos ficam empilhados.
    await page.locator('[data-new-asset]').click();
    const dialog = page.getByRole('dialog', { name: 'Novo ativo' });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    const submit = dialog.getByRole('button', { name: 'Cadastrar' });
    expect((await submit.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Ticker').fill('PETR4');
    await form.getByLabel('Nome').fill('Petrobras');
    await form.getByLabel('Corretora').fill('XP');
    await submit.click();
    await expect(form).toBeHidden();

    // CA12.3: ativo, valor, rentabilidade e ações visíveis; corretora e emissor escondidos.
    const row = page.locator('tr[data-ticker="PETR4"]');
    await expect(row).toBeVisible();
    await expect(row.getByRole('link', { name: /PETR4/ })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Editar PETR4' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Valor (R$)' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Corretora' })).toBeHidden();
    await expect(page.getByRole('columnheader', { name: 'Emissor' })).toBeHidden();
    await expectNoHorizontalScroll(page);

    // A tela do ativo mostra o conteúdo completo, ainda sem rolagem horizontal.
    await row.getByRole('link', { name: /PETR4/ }).click();
    await expect(page.locator('[data-field=broker]')).toHaveText('XP');
    await expectNoHorizontalScroll(page);

    // O diálogo de lançamento, com o campo de comprovante, também cabe na tela.
    await page.locator('[data-new-transaction]').click();
    const txDialog = page.getByRole('dialog', { name: 'Novo lançamento' });
    await expect(txDialog).toBeVisible();
    expect((await txDialog.boundingBox())!.width).toBeLessThanOrEqual(viewport.width);
    await expect(txDialog.getByLabel(/Comprovante/)).toBeVisible();
    await page.keyboard.press('Escape');

    // Rentabilidade: a matriz rola dentro do card, a página não (CA12.1).
    await page.goto('/analytics');
    await expect(page.getByRole('heading', { name: 'Rentabilidade', exact: true })).toBeVisible();
    await expectNoHorizontalScroll(page);

    // Origem, proventos e aportes cabem na tela.
    for (const [path, selector] of [
      ['/origins', '[data-treemap]'],
      ['/dividends', '[data-top-dividends]'],
      ['/movements', '[data-movements-chart]'],
      ['/profile', '[data-save-profile]'],
    ]) {
      await page.goto(path);
      await expect(page.locator(selector)).toBeVisible();
      await expectNoHorizontalScroll(page);
    }
  });
});
// #endregion
