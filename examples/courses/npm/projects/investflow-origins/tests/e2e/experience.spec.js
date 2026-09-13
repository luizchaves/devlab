import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-perfil-${Date.now()}@example.com`;
// Um PNG de 1x1 pixel, o menor avatar valido.
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

async function signIn(page) {
  await page.goto('/signin');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
}

// #region flow
test.describe
  .serial('Sprint 11: perfil e experiencia', () => {
    test('mostrar senha, cadastro e a barra comum com o menu do usuario (CA11.11, CA11.5, CA11.6)', async ({
      page,
    }) => {
      await page.goto('/signup');
      await page.fill('[name=fullName]', 'Ana Beatriz E2E');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      // CA11.11: o olho troca o tipo do campo, e o texto digitado continua la.
      await expect(page.locator('[name=password]')).toHaveAttribute('type', 'password');
      await page.click('[data-toggle-password]');
      await expect(page.locator('[name=password]')).toHaveAttribute('type', 'text');
      await expect(page.locator('[name=password]')).toHaveValue(PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/\/signin/);
      await signIn(page);

      // CA11.5: os cinco links, e nada de admin para um investidor.
      const nav = page.locator('header nav');
      for (const label of ['Carteira', 'Rentabilidade', 'Proventos', 'Aportes', 'Origem']) {
        await expect(nav.getByRole('link', { name: label })).toBeVisible();
      }
      await expect(page.locator('[data-admin-nav]')).toHaveCount(0);

      // CA11.6: primeiro nome, inicial no lugar da foto, "Meu Perfil" e "Sair"; Esc fecha.
      await expect(page.locator('[data-user-menu-btn]')).toContainText('Ana');
      await expect(page.locator('[data-navbar-avatar-initial]')).toHaveText('A');
      await page.click('[data-user-menu-btn]');
      await expect(page.locator('[data-user-menu]')).toBeVisible();
      await expect(page.locator('[data-user-menu]')).toContainText('Meu Perfil');
      await expect(page.locator('[data-user-menu]')).toContainText('Sair da Conta');
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-user-menu]')).toBeHidden();

      // A mesma barra em outra pagina privada.
      await page.goto('/origins');
      await expect(page.locator('header nav').getByRole('link', { name: 'Origem' })).toBeVisible();
    });

    test('perfil: nome, avatar e remocao (CA11.1, CA11.2, CA11.3)', async ({ page }) => {
      await signIn(page);
      await page.goto('/profile');

      await expect(page.locator('#email')).toHaveValue(email);
      await expect(page.locator('[data-profile-role-badge]')).toContainText(/investidor/i);
      await expect(page.locator('#createdAt')).not.toHaveValue('');

      // CA11.1: nome em branco e recusado; nome valido muda a barra.
      await page.fill('[name=fullName]', '   ');
      await page.click('[data-save-btn]');
      await expect(page.locator('[data-error]')).toContainText('em branco');
      await page.fill('[name=fullName]', 'Beatriz E2E');
      await page.click('[data-save-btn]');
      await expect(page.locator('[data-toast]')).toContainText('Perfil atualizado');
      await expect(page.locator('[data-user-menu-btn]')).toContainText('Beatriz');

      // CA11.2: o avatar sobe para o bucket publico e aparece na barra.
      await page.setInputFiles('[data-avatar-input]', {
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: PNG_1X1,
      });
      await expect(page.locator('[data-toast]')).toContainText('Foto de perfil atualizada');
      await expect(page.locator('[data-navbar-avatar-img]')).toHaveAttribute(
        'src',
        /\/storage\/v1\/object\/public\/avatars\//
      );

      // CA11.3: remover devolve a inicial.
      await page.click('[data-avatar-remove-btn]');
      await expect(page.locator('[data-toast]')).toContainText('removida');
      await expect(page.locator('[data-navbar-avatar-initial]')).toHaveText('B');
    });

    test('tema em ciclo e valores ocultos persistem entre paginas (CA11.9, CA11.10)', async ({
      page,
    }) => {
      await signIn(page);

      // CA11.9: automatico -> claro -> escuro -> automatico, gravado no localStorage.
      const theme = page.locator('header [data-theme-toggle]');
      await expect(theme).toHaveAttribute('aria-label', /Automático/);
      await theme.click();
      await expect(theme).toHaveAttribute('aria-label', /Claro/);
      await expect(page.locator('html')).not.toHaveClass(/(^| )dark( |$)/);
      await theme.click();
      await expect(theme).toHaveAttribute('aria-label', /Escuro/);
      await expect(page.locator('html')).toHaveClass(/(^| )dark( |$)/);
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
      await page.goto('/analytics');
      await expect(page.locator('html')).toHaveClass(/(^| )dark( |$)/);
      await page.locator('header [data-theme-toggle]').click();
      await expect(page.locator('header [data-theme-toggle]')).toHaveAttribute(
        'aria-label',
        /Automático/
      );

      // CA11.10: ocultar mascara os KPIs, sobrevive a navegacao e volta ao mostrar.
      // Primeiro, um valor de verdade na carteira.
      await page.goto('/dashboard');
      await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
      await page.click('[data-new-asset]');
      await page.selectOption('[name=category]', 'renda_fixa');
      await page.fill('[name=ticker]', 'CDB-E2E');
      await page.fill('[name=name]', 'CDB E2E');
      await page.click('[data-asset-form] button[type=submit]');
      await page.click('tr[data-ticker="CDB-E2E"] a');
      await page.click('[data-new-transaction]');
      await page.fill('[name=quantity]', '1000');
      await page.fill('[name=price]', '1');
      await page.fill('[name=transactionDate]', '2026-01-15');
      await page.click('[data-transaction-form] button[type=submit]');
      await expect(page.locator('[data-kpi=cost]')).toContainText('1.000,00');

      await page.goto('/dashboard');
      await expect(page.locator('[data-kpi=value]')).toContainText('R$ 1.000,00');
      await page.click('[data-privacy-toggle]');
      await expect(page.locator('[data-privacy-toggle]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[data-kpi=value]')).toHaveText('••••••');
      await page.goto('/analytics');
      await expect(page.locator('[data-kpi=value]')).toHaveText('••••••');
      await page.click('[data-privacy-toggle]');
      await expect(page.locator('[data-kpi=value]')).toContainText('R$');
    });

    test('a landing reconhece a sessao e o dialogo fecha pelo fundo (CA11.7, CA11.8)', async ({
      page,
    }) => {
      await page.goto('/');
      await expect(page.locator('[data-auth-actions]')).toContainText('Entrar');
      await signIn(page);

      await page.goto('/');
      await expect(page.locator('[data-auth-actions]')).toContainText('Ir para a Carteira');
      await expect(page.locator('[data-hero-cta]').first()).toHaveText('Acessar Carteira');
      await expect(page.locator('[data-brand-link]').first()).toHaveAttribute('href', '/dashboard');

      // CA11.8: clicar no proprio <dialog> (o fundo) fecha sem salvar.
      await page.goto('/dashboard');
      await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
      await page.click('[data-new-asset]');
      await expect(page.locator('[data-asset-dialog]')).toBeVisible();
      await page.locator('[data-asset-dialog]').click({ position: { x: 2, y: 2 } });
      await expect(page.locator('[data-asset-dialog]')).toBeHidden();
      await expect(page.locator('[data-assets] tr')).toHaveCount(1);
    });
  });
// #endregion
