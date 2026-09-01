import crypto from 'node:crypto';

import { expect, test } from '@playwright/test';

function createValidUser() {
  const hash = crypto.randomBytes(20).toString('hex');

  return {
    name: `Valid ${hash}`,
    email: `valid-${hash}@email.com`,
    password: '12345678',
  };
}

test.describe('Monitor App', () => {
  let validUser;

  test.beforeAll(() => {
    validUser = createValidUser();
  });

  test('signs up, signs in, and manages hosts', async ({ page }) => {
    // Cadastro
    await page.goto('/signup.html');
    await page.getByRole('textbox', { name: 'Nome' }).fill(validUser.name);
    await page.getByRole('textbox', { name: 'E-mail' }).fill(validUser.email);
    await page.getByRole('textbox', { name: 'Senha', exact: true }).fill(validUser.password);
    await page.getByRole('textbox', { name: 'Confirmar senha' }).fill(validUser.password);
    await page.getByRole('button', { name: 'Criar conta' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();

    // Login
    await page.getByRole('textbox', { name: 'E-mail' }).fill(validUser.email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(validUser.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('heading', { name: 'Hosts monitorados' })).toBeVisible();

    // Cadastro de host
    await page.getByText('Cadastrar novo host').click();
    await page.getByRole('textbox', { name: 'Nome' }).fill('Google DNS');
    await page.getByRole('textbox', { name: 'Endereço' }).fill('8.8.8.8');
    await page.getByRole('textbox', { name: 'Tags' }).fill('infra, dns');
    await page.getByRole('button', { name: 'Cadastrar host' }).click();
    await expect(page.getByRole('heading', { name: 'Google DNS' })).toBeVisible();
    await expect(page.getByText('infra')).toBeVisible();

    // Histórico e medição sob demanda
    await page.getByRole('link', { name: 'Histórico' }).first().click();
    await page.getByRole('button', { name: 'Medir agora' }).click();
    await expect(page.getByRole('cell', { name: 'sucesso' }).first()).toBeVisible();

    // Sessão
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('does not allow access without a token', async ({ page }) => {
    await page.goto('/index.html');

    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });
});
