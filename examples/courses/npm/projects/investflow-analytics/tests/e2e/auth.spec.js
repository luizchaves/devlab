import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-${Date.now()}@example.com`;

// #region flow
test.describe
  .serial('Sprint 2: cadastro, sessao e paginas privadas', () => {
    test('pagina privada sem sessao redireciona para o login (CA02.4)', async ({ page }) => {
      await page.goto('/dashboard.html');

      await expect(page).toHaveURL(/signin\.html$/);
    });

    test('cadastro leva ao login com aviso (CA02.1)', async ({ page }) => {
      await page.goto('/signup.html');
      await page.fill('[name=fullName]', 'Ana E2E');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');

      await expect(page).toHaveURL(/signin\.html\?registered=1$/);
      await expect(page.locator('[data-notice]')).toBeVisible();
    });

    test('senha errada e e-mail inexistente mostram a mesma mensagem (CA02.2)', async ({
      page,
    }) => {
      await page.goto('/signin.html');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', 'errada-errada');
      await page.click('button[type=submit]');
      await expect(page.locator('[data-error]')).toHaveText('E-mail ou senha invalidos');

      await page.fill('[name=email]', `ninguem-${Date.now()}@example.com`);
      await page.click('button[type=submit]');
      // O submit limpa a caixa antes de enviar; esperar a mensagem voltar prova a resposta nova.
      await expect(page.locator('[data-error]')).toHaveText('E-mail ou senha invalidos');
      await expect(page).toHaveURL(/signin\.html$/);
    });

    test('login, sessao mantida na recarga e logout (CA02.2, CA02.3, CA02.5)', async ({ page }) => {
      await page.goto('/signin.html');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');

      await expect(page).toHaveURL(/dashboard\.html$/);
      await expect(page.locator('[data-user-email]')).toHaveText(email);

      // CA02.3: a sessao vive no localStorage, sob a chave do SDK.
      await page.reload();
      await expect(page.locator('[data-user-email]')).toHaveText(email);
      const keys = await page.evaluate(() => Object.keys(localStorage));
      expect(keys.some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))).toBe(true);

      // CA02.5: sair apaga a sessao e a pagina privada volta a redirecionar.
      await page.click('[data-sign-out]');
      await expect(page).toHaveURL(/signin\.html$/);
      await page.goto('/analytics.html');
      await expect(page).toHaveURL(/signin\.html$/);
    });
  });
// #endregion
