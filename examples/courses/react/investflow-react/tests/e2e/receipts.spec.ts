import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Fábio Investidor', email: `fabio-${Date.now()}@example.com`, password: 'segredo123' };

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
test.describe('comprovantes', () => {
  test('CA05.1, CA05.3, CA05.5 — anexa um comprovante ao aporte e abre a URL assinada', async ({ page, context }) => {
    await signUp(page);

    await page.locator('[data-new-asset]').click();
    const assetForm = page.locator('[data-asset-form]');
    await assetForm.getByLabel('Categoria').selectOption('renda_fixa');
    await assetForm.getByLabel('Ticker').fill('CDB-BB');
    await assetForm.getByLabel('Nome').fill('CDB Banco do Brasil');
    await assetForm.getByRole('button', { name: 'Cadastrar' }).click();
    await page.locator('tr[data-ticker="CDB-BB"] a').click();

    await page.locator('[data-new-transaction]').click();
    const form = page.locator('[data-transaction-form]');
    await form.getByLabel('Quantidade').fill('1');
    await form.getByLabel(/Preço unitário/).fill('1000');
    await form.getByLabel('Data').fill('2026-03-01');
    await form.getByLabel(/Comprovante/).setInputFiles({ name: 'nota.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 nota de corretagem') });
    await form.getByRole('button', { name: 'Registrar' }).click();
    await expect(form).toBeHidden();

    // O path guardado é <user>/<transação>/<uuid>.pdf, nunca uma URL.
    const button = page.locator('[data-receipt]');
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('data-receipt', /^[a-z0-9]+\/[a-z0-9]+\/[0-9a-f-]{36}\.pdf$/);

    // O PDF abre em outra aba com a URL assinada (o navegador a trata como download,
    // então o teste captura a requisição em vez de esperar a navegação).
    const [request] = await Promise.all([
      context.waitForEvent('request', (r) => r.url().includes('/storage/v1/object/sign/receipts/')),
      button.click(),
    ]);
    expect(request.url()).toContain('token=');
    const response = await page.request.get(request.url());
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('%PDF');
  });

  test('CA05.2 — um tipo fora da lista é recusado antes do upload', async ({ page }) => {
    await signIn(page);
    await page.locator('tr[data-ticker="CDB-BB"] a').click();

    await page.locator('[data-new-transaction]').click();
    const form = page.locator('[data-transaction-form]');
    await form.getByLabel('Quantidade').fill('1');
    await form.getByLabel(/Preço unitário/).fill('10');
    await form.getByLabel(/Comprovante/).setInputFiles({ name: 'virus.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') });
    await form.getByRole('button', { name: 'Registrar' }).click();

    await expect(form.getByRole('alert')).toHaveText('Envie um PDF, PNG ou JPG.');
    await expect(form).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-transactions] tr')).toHaveCount(1);
  });
});
// #endregion
