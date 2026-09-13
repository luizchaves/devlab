import { expect, test, type Page } from '@playwright/test';

const account = {
  name: 'Ana Investidora',
  email: `ana-${Date.now()}@example.com`,
  password: 'segredo123',
};

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/signin');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

// Os testes compartilham a conta criada no cadastro: ordem importa, um worker só.
test.describe.configure({ mode: 'serial' });

test.describe('landing e conta', () => {
  test('CA01.1, CA01.2 — a landing abre com o simulador e os links de navegação', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible();
    await expect(page.locator('#sim-initial')).toHaveValue('10000');
    await expect(page.locator('#sim-result-total')).toContainText('R$');

    // O simulador é interativo só depois da hidratação: repete até o React responder.
    await expect(async () => {
      await page.locator('#sim-monthly').fill('0');
      await page.locator('#sim-rate').fill('0');
      await expect(page.locator('#sim-result-total')).toHaveText('R$ 10.000,00', { timeout: 1000 });
    }).toPass();
  });

  test('CA02.4 — página privada sem sessão redireciona para o login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Fdashboard/);
  });

  test('CA02.1 — cadastro cria a conta e abre a carteira', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('Nome completo').fill(account.name);
    await page.getByLabel('E-mail').fill(account.email);
    await page.getByLabel('Senha', { exact: true }).fill(account.password);
    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('user-name')).toHaveText(account.name);
  });

  test('CA02.2 — senha errada e e-mail inexistente mostram a mesma mensagem', async ({ page }) => {
    await signIn(page, account.email, 'errada123');
    await expect(page.locator('p[role="alert"]')).toHaveText('E-mail ou senha inválidos.');

    await signIn(page, 'ninguem@example.com', account.password);
    await expect(page.locator('p[role="alert"]')).toHaveText('E-mail ou senha inválidos.');
  });

  test('CA02.3, CA02.5, CA11.7 — login, sessão mantida na recarga e logout', async ({ page }) => {
    await signIn(page, account.email, account.password);
    await expect(page).toHaveURL(/\/dashboard/);

    // CA02.3: recarregar mantém a sessão, sem voltar ao login.
    await page.reload();
    await expect(page.getByTestId('user-name')).toHaveText(account.name);

    // CA11.7: com sessão, a landing oferece "Acessar Carteira".
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Acessar Carteira' }).first()).toBeVisible();

    // CA02.5: sair encerra a sessão e a página privada volta a redirecionar.
    await page.goto('/dashboard');
    await expect(async () => {
      await page.getByRole('button', { name: /Ana/ }).click();
      await expect(page.getByRole('menuitem', { name: 'Sair' })).toBeVisible({ timeout: 1000 });
    }).toPass();
    await page.getByRole('menuitem', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/signin/);
  });
});
