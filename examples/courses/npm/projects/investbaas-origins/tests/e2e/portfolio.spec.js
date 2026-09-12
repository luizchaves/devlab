import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-carteira-${Date.now()}@example.com`;

async function signIn(page) {
  await page.goto('/signin.html');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  // Esperar a carteira abrir: um goto antes disso interromperia a navegacao do login.
  await expect(page).toHaveURL(/dashboard\.html$/);
}

async function signUpAndIn(page) {
  await page.goto('/signup.html');
  await page.fill('[name=fullName]', 'Ana E2E');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/signin\.html/);
  await signIn(page);
}

// #region flow
test.describe
  .serial('Sprint 3: carteira, aportes e tela do ativo', () => {
    test('carteira vazia, cadastro de ativo com corretora e emissor (CA03.1, CA03.7)', async ({
      page,
    }) => {
      await signUpAndIn(page);

      await expect(page.locator('[data-empty]')).toBeVisible();

      await page.click('[data-new-asset]');
      await page.fill('[name=ticker]', 'cdb-bb-2027');
      await page.fill('[name=name]', 'CDB Banco do Brasil 2027');
      await page.selectOption('[name=category]', 'renda_fixa');
      await page.fill('[name=brokerName]', 'Banco do Brasil');
      await page.fill('[name=issuer]', 'Banco do Brasil');
      await page.click('[data-asset-form] button[type=submit]');

      const row = page.locator('tr[data-ticker="CDB-BB-2027"]');
      await expect(row).toBeVisible();
      await expect(row).toContainText('Renda Fixa');
      await expect(row).toContainText('Banco do Brasil');
      await expect(page.locator('[data-empty]')).toBeHidden();
    });

    test('ticker repetido e recusado com mensagem (unique por dono)', async ({ page }) => {
      await signIn(page);

      await page.click('[data-new-asset]');
      await page.fill('[name=ticker]', 'CDB-BB-2027');
      await page.fill('[name=name]', 'De novo');
      await page.click('[data-asset-form] button[type=submit]');

      await expect(page.locator('[data-asset-form] [data-error]')).toHaveText(
        'Voce ja tem esse ticker'
      );
    });

    test('tela do ativo lista os aportes e recalcula a posicao (CA03.8, CA03.9, CA03.3)', async ({
      page,
    }) => {
      await signIn(page);

      await page.click('tr[data-ticker="CDB-BB-2027"] a');
      await expect(page).toHaveURL(/asset\.html\?id=/);
      await expect(page.locator('[data-field=name]')).toHaveText('CDB Banco do Brasil 2027');
      await expect(page.locator('[data-field=broker]')).toHaveText('Banco do Brasil');
      await expect(page.locator('[data-empty]')).toBeVisible();

      for (const [qty, price, date] of [
        ['100', '30', '2026-01-10'],
        ['100', '34', '2026-02-10'],
      ]) {
        await page.click('[data-new-transaction]');
        await page.fill('[name=quantity]', qty);
        await page.fill('[name=price]', price);
        await page.fill('[name=transactionDate]', date);
        await page.click('[data-transaction-form] button[type=submit]');
        await expect(page.locator('[data-transaction-dialog]')).toBeHidden();
      }

      await expect(page.locator('[data-transactions] tr')).toHaveCount(2);
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('200');
      await expect(page.locator('[data-kpi=averagePrice]')).toContainText('32,00');
      await expect(page.locator('[data-kpi=cost]')).toContainText('6.400,00');
      // A ultima linha mostra a posicao acumulada depois do lancamento.
      await expect(page.locator('[data-transactions] tr').last()).toContainText('200');
    });

    test('ativo de outra conta mostra nao encontrado (CA03.10)', async ({ page }) => {
      await signIn(page);

      await page.goto('/asset.html?id=00000000-0000-0000-0000-000000000000');
      await expect(page.locator('[data-not-found]')).toBeVisible();
      await expect(page.locator('[data-asset]')).toBeHidden();
    });
  });
// #endregion
