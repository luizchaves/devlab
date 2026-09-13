import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Caio Investidor', email: `caio-${Date.now()}@example.com`, password: 'segredo123' };

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
test.describe('carteira, aportes e tela do ativo', () => {
  test('CA03.1, CA03.7 — carteira vazia, cadastro de ativo com corretora e emissor', async ({ page }) => {
    await signUp(page);
    await expect(page.locator('[data-empty]')).toBeVisible();

    await page.locator('[data-new-asset]').click();
    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Ticker').fill('acao-bb-e2e');
    await form.getByLabel('Nome').fill('Ação Banco do Brasil E2E');
    await form.getByLabel('Categoria').selectOption('acoes');
    await form.getByLabel('Corretora').fill('Banco do Brasil');
    await form.getByLabel('Emissor ou gestor').fill('Banco do Brasil');
    await form.getByRole('button', { name: 'Cadastrar' }).click();

    const row = page.locator('tr[data-ticker="ACAO-BB-E2E"]');
    await expect(row).toBeVisible();
    await expect(row).toContainText('Ações');
    await expect(row).toContainText('Banco do Brasil');
    await expect(page.locator('[data-empty]')).toBeHidden();
  });

  test('ticker repetido é recusado com mensagem no campo', async ({ page }) => {
    await signIn(page);
    await page.locator('[data-new-asset]').click();
    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Ticker').fill('ACAO-BB-E2E');
    await form.getByLabel('Nome').fill('De novo');
    await form.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(form.getByRole('alert')).toHaveText('Você já tem esse ticker.');
  });

  test('CA03.8, CA03.9, CA03.3 — a tela do ativo lista os aportes e recalcula a posição', async ({ page }) => {
    await signIn(page);
    await page.locator('tr[data-ticker="ACAO-BB-E2E"] a').click();

    await expect(page).toHaveURL(/\/assets\//);
    await expect(page.locator('[data-field=name]')).toHaveText('Ação Banco do Brasil E2E');
    await expect(page.locator('[data-field=broker]')).toHaveText('Banco do Brasil');
    await expect(page.locator('[data-empty]')).toBeVisible();

    for (const [quantity, price, date] of [
      ['100', '30', '2026-01-10'],
      ['100', '34', '2026-02-10'],
    ]) {
      await page.locator('[data-new-transaction]').click();
      const form = page.locator('[data-transaction-form]');
      await form.getByLabel('Quantidade').fill(quantity);
      await form.getByLabel(/Preço unitário/).fill(price);
      await form.getByLabel('Data').fill(date);
      await form.getByRole('button', { name: 'Registrar' }).click();
      await expect(form).toBeHidden();
    }

    await expect(page.locator('[data-transactions] tr')).toHaveCount(2);
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('200');
    await expect(page.locator('[data-kpi=averagePrice]')).toContainText('32,00');
    await expect(page.locator('[data-kpi=cost]')).toContainText('6.400,00');
    // A última linha mostra a posição acumulada depois do lançamento.
    await expect(page.locator('[data-transactions] tr').last()).toContainText('200');
  });

  test('CA03.11, CA03.12 — edita e exclui ativo próprio pela carteira', async ({ page }) => {
    await signIn(page);
    await page.getByRole('button', { name: 'Editar ACAO-BB-E2E' }).click();
    await expect(page.getByRole('dialog', { name: 'Editar ativo' })).toBeVisible();

    const form = page.locator('[data-asset-form]');
    await form.getByLabel('Categoria').selectOption('renda_fixa');
    await form.getByLabel('Ticker').fill('tesouro-2029');
    await form.getByLabel('Nome').fill('Tesouro Selic 2029');
    await form.getByLabel('Corretora').fill('BTG');
    await form.getByLabel('Emissor ou gestor').fill('Tesouro Nacional');
    await form.getByRole('button', { name: 'Salvar' }).click();

    const updated = page.locator('tr[data-ticker="TESOURO-2029"]');
    await expect(updated).toBeVisible();
    await expect(updated).toContainText('Tesouro Selic 2029');
    await expect(updated).toContainText('BTG');
    await expect(updated).toContainText('Tesouro Nacional');
    // CA03.11: os lançamentos continuam lá depois da edição.
    await expect(updated).toContainText('200');

    await page.getByRole('button', { name: 'Excluir TESOURO-2029' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Excluir', exact: true }).click();
    await expect(page.locator('tr[data-ticker="TESOURO-2029"]')).toHaveCount(0);
    await expect(page.locator('[data-empty]')).toBeVisible();
  });

  test('CA03.10 — ativo de outra conta ou inexistente mostra não encontrado', async ({ page }) => {
    await signIn(page);
    await page.goto('/assets/nao-existe');

    await expect(page.locator('[data-not-found]')).toBeVisible();
    await expect(page.locator('[data-asset]')).toHaveCount(0);
  });
});
// #endregion
