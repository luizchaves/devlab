import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Iara Investidora', email: `iara-${Date.now()}@example.com`, password: 'segredo123' };

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
  if (ticker) await form.getByLabel('Ticker').fill(ticker);
  await form.getByLabel('Nome').fill(name);
  await form.getByRole('button', { name: 'Cadastrar' }).click();
  await expect(form).toBeHidden();
}

async function addTransaction(page: Page, { type = 'buy', quantity, price, date }: { type?: string; quantity: string; price: string; date: string }) {
  await page.locator('[data-new-transaction]').click();
  const tx = page.locator('[data-transaction-form]');
  await tx.getByLabel('Tipo').selectOption(type);
  await tx.getByLabel('Quantidade').fill(quantity);
  await tx.getByLabel(/Preço unitário/).fill(price);
  await tx.getByLabel('Data').fill(date);
  await tx.getByRole('button', { name: 'Registrar' }).click();
  await expect(tx).toBeHidden();
}

// #region flow
test.describe('lançamentos, saldo e organização', () => {
  test('CA08.1, CA08.3, CA08.4, CA08.2 — edita, resgata tudo e desfaz um lançamento', async ({ page }) => {
    await signUp(page);
    await createAsset(page, { ticker: 'XPTO3', name: 'Fora do provedor', category: 'acoes' });
    await page.locator('tr[data-ticker="XPTO3"] a').click();

    await addTransaction(page, { quantity: '100', price: '10', date: '2026-01-10' });
    await addTransaction(page, { quantity: '100', price: '20', date: '2026-02-10' });
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('200');
    await expect(page.locator('[data-kpi=averagePrice]')).toContainText('15,00');

    // CA08.1: editar a segunda compra recalcula posição e preço médio.
    await page.locator('[data-transactions] tr').filter({ hasText: '10/02/2026' }).locator('[data-edit-transaction]').click();
    const form = page.locator('[data-transaction-form]');
    await expect(page.getByRole('dialog', { name: 'Editar lançamento' })).toBeVisible();
    await form.getByLabel('Quantidade').fill('200');
    await form.getByRole('button', { name: 'Salvar' }).click();
    await expect(form).toBeHidden();
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('300');
    await expect(page.locator('[data-kpi=averagePrice]')).toContainText('16,67');

    // CA08.3: resgate total preenche a quantidade disponível; CA08.4: o realizado
    // é a diferença para o preço médio (300 × (20 − 16,67) = 1.000).
    await page.locator('[data-new-transaction]').click();
    await form.getByLabel('Tipo').selectOption('sell');
    await page.locator('#totalRedemption').check();
    await expect(form.getByLabel('Quantidade')).toHaveValue('300');
    await form.getByLabel(/Preço unitário/).fill('20');
    await form.getByLabel('Data').fill('2026-03-10');
    await form.getByRole('button', { name: 'Registrar' }).click();
    await expect(form).toBeHidden();
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('0');
    await expect(page.locator('[data-kpi=realized]')).toContainText('1.000,00');
    await expect(page.locator('[data-kpi=durationSub]')).toHaveText('Encerrado em 10/03/2026');

    // CA08.2: excluir a venda pede confirmação e devolve a posição.
    await page.locator('[data-transactions] tr').filter({ hasText: 'Venda' }).locator('[data-delete-transaction]').click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Excluir', exact: true }).click();
    await expect(page.locator('[data-transactions] tr')).toHaveCount(2);
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('300');
  });

  test('CA08.13, CA08.14, CA08.15, CA08.17 — filtro, ordenação, rodapé e estado na URL', async ({ page }) => {
    await signIn(page);
    await createAsset(page, { ticker: 'CDB-INTER', name: 'CDB Inter', category: 'renda_fixa' });
    await page.locator('tr[data-ticker="CDB-INTER"] a').click();
    await addTransaction(page, { quantity: '1', price: '1080', date: '2026-01-05' });

    // Zera XPTO3 para ter um ativo encerrado na carteira.
    await page.goto('/dashboard');
    await page.locator('tr[data-ticker="XPTO3"] a').click();
    await addTransaction(page, { type: 'sell', quantity: '300', price: '25', date: '2026-04-10' });
    await expect(page.locator('[data-kpi=quantity]')).toHaveText('0');

    await page.goto('/dashboard');
    // CA08.13: o filtro padrão esconde o encerrado.
    await expect(page.locator('tr[data-ticker="CDB-INTER"]')).toBeVisible();
    await expect(page.locator('tr[data-ticker="XPTO3"]')).toHaveCount(0);
    await page.locator('[data-filter="all"]').click();
    await expect(page.locator('tr[data-ticker="XPTO3"]')).toContainText('Encerrado');
    await expect(page).toHaveURL(/filter=all/);

    // CA08.14: coluna numérica começa do maior para o menor; o segundo clique inverte.
    await page.locator('th[data-sort="value"] button').click();
    await expect(page).toHaveURL(/sort=value&dir=desc/);
    await expect(page.locator('[data-assets] tr').first()).toHaveAttribute('data-ticker', 'CDB-INTER');
    await page.locator('th[data-sort="value"] button').click();
    // asc é o padrão: some da URL (CA08.17), e o encerrado (valor zero) sobe.
    await expect(page).toHaveURL(/sort=value$/);
    await expect(page.locator('[data-assets] tr').first()).toHaveAttribute('data-ticker', 'XPTO3');

    // CA08.15: o rodapé soma só as posições abertas.
    await expect(page.locator('[data-assets-footer]')).toContainText('1.080,00');

    // CA08.17: recarregar mantém filtro e ordenação lidos da URL.
    await page.reload();
    await expect(page.locator('tr[data-ticker="XPTO3"]')).toBeVisible();
    await expect(page).toHaveURL(/filter=all&sort=value$/);
    await expect(page.locator('th[data-sort="value"]')).toHaveAttribute('aria-sort', 'ascending');
  });

  test('CA08.18 — abre o ativo pelo ticker, sem diferenciar maiúsculas', async ({ page }) => {
    await signIn(page);

    await page.goto('/assets/cdb-inter');
    await expect(page.locator('[data-field=name]')).toHaveText('CDB Inter');

    await page.goto('/assets/NADA-AQUI');
    await expect(page.locator('[data-not-found]')).toBeVisible();
  });
});
// #endregion
