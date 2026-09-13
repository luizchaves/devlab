import { expect, test, type Page } from '@playwright/test';

const account = { name: 'Lia Beatriz E2E', email: `lia-${Date.now()}@example.com`, password: 'segredo123' };

test.describe.configure({ mode: 'serial' });

async function signIn(page: Page) {
  await page.goto('/signin');
  await page.getByLabel('E-mail').fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// #region flow
test.describe('perfil e experiência', () => {
  test('CA11.11, CA11.5, CA11.6 — mostrar senha, cadastro e a barra comum com o menu do usuário', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('Nome completo').fill(account.name);
    await page.getByLabel('E-mail').fill(account.email);
    const password = page.getByLabel('Senha', { exact: true });
    await password.fill(account.password);

    // CA11.11: o olho troca o tipo do campo, e o texto digitado continua lá.
    await expect(password).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Mostrar senha' }).click();
    await expect(password).toHaveAttribute('type', 'text');
    await expect(password).toHaveValue(account.password);
    await page.getByRole('button', { name: 'Criar conta' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // CA11.5: os cinco links, e nada de admin para um investidor.
    const nav = page.getByRole('navigation', { name: 'Principal', exact: true });
    for (const label of ['Carteira', 'Rentabilidade', 'Proventos', 'Aportes', 'Origem']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
    await expect(nav.getByRole('link', { name: 'Painel Admin' })).toHaveCount(0);

    // CA11.6: primeiro nome, inicial no lugar da foto, "Meu perfil" e "Sair"; Esc fecha.
    const menuButton = page.getByRole('button', { name: /Menu de Lia/ });
    await expect(menuButton).toContainText('Lia');
    await expect(page.locator('[data-navbar-avatar-initial]')).toHaveText('L');
    await menuButton.click();
    await expect(page.getByRole('menuitem', { name: 'Meu perfil' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Sair' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menuitem', { name: 'Sair' })).toHaveCount(0);

    await page.goto('/origins');
    await expect(nav.getByRole('link', { name: 'Origem' })).toHaveAttribute('aria-current', 'page');
  });

  test('CA11.1, CA11.2, CA11.3 — perfil: nome, avatar e remoção', async ({ page }) => {
    await signIn(page);
    await page.goto('/profile');
    await expect(page.locator('#email')).toHaveValue(account.email);
    await expect(page.locator('[data-profile-role]')).toContainText('Investidor');
    await expect(page.locator('#createdAt')).not.toHaveValue('');

    // CA11.1: nome em branco é recusado; nome válido muda a barra.
    await page.getByLabel('Nome completo').fill('   ');
    await page.locator('[data-save-profile]').click();
    await expect(page.locator('p[role="alert"]')).toContainText('em branco');
    await page.getByLabel('Nome completo').fill('Beatriz E2E');
    await page.locator('[data-save-profile]').click();
    await expect(page.getByText('Perfil atualizado.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Menu de Beatriz/ })).toBeVisible();

    // CA11.2: o avatar sobe para o bucket público e aparece na barra.
    await page.locator('[data-avatar-input]').setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) });
    await expect(page.getByText('Foto de perfil atualizada.')).toBeVisible();
    await expect(page.locator('[data-navbar-avatar-img]')).toHaveAttribute('src', /\/storage\/v1\/object\/public\/avatars\//);

    // CA11.3: remover devolve a inicial.
    await page.locator('[data-avatar-remove]').click();
    await expect(page.getByText('Foto de perfil removida.')).toBeVisible();
    await expect(page.locator('[data-navbar-avatar-initial]')).toHaveText('B');
  });

  test('CA11.9, CA11.10 — tema em ciclo e valores ocultos persistem entre páginas', async ({ page }) => {
    await signIn(page);
    const theme = page.locator('[data-theme-toggle]');
    const html = page.locator('html');

    // CA11.9: automático → claro → escuro → automático, gravado no localStorage.
    await expect(theme).toHaveAttribute('aria-label', /Automático/);
    await theme.click();
    await expect(theme).toHaveAttribute('aria-label', /Claro/);
    await expect(html).toHaveAttribute('data-theme', 'light');
    await theme.click();
    await expect(theme).toHaveAttribute('aria-label', /Escuro/);
    await expect(html).toHaveAttribute('data-theme', 'dark');
    expect(JSON.parse(await page.evaluate(() => localStorage.getItem('investflow:preferences') ?? '{}')).state.theme).toBe('dark');
    await page.goto('/analytics');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await theme.click();
    await expect(theme).toHaveAttribute('aria-label', /Automático/);

    // CA11.10: ocultar mascara os valores, sobrevive à navegação e alcança o que renderiza depois.
    await page.locator('[data-privacy-toggle]').click();
    await expect(page.locator('[data-kpi="value"]')).toHaveText('••••••');
    await page.goto('/dashboard');
    await expect(page.locator('[data-kpi="value"]')).toHaveText('••••••');
    await page.locator('[data-privacy-toggle]').click();
    await expect(page.locator('[data-kpi="value"]')).toContainText('R$');
  });
});
// #endregion
