import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-origem-${Date.now()}@example.com`;

async function signIn(page) {
  await page.goto('/signin.html');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/dashboard\.html$/);
}

async function newAsset(page, { ticker, name, category, broker, issuer }) {
  await page.click('[data-new-asset]');
  await page.fill('[name=ticker]', ticker);
  await page.fill('[name=name]', name);
  await page.selectOption('[name=category]', category);
  await page.fill('[name=brokerName]', broker);
  await page.fill('[name=issuer]', issuer);
  await page.click('[data-asset-form] button[type=submit]');
  await expect(page.locator(`tr[data-ticker="${ticker}"]`)).toBeVisible();
}

// #region flow
test.describe
  .serial('Sprint 7: origem e evolucao', () => {
    test('o treemap agrupa por corretora, categoria e emissor sem recarregar (CA07.1, CA07.2)', async ({
      page,
    }) => {
      await page.goto('/signup.html');
      await page.fill('[name=fullName]', 'Ana E2E');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/signin\.html/);
      await signIn(page);

      await newAsset(page, {
        ticker: 'PETR4',
        name: 'Petrobras',
        category: 'acoes',
        broker: 'XP',
        issuer: 'Petrobras',
      });
      await newAsset(page, {
        ticker: 'CDB-BB',
        name: 'CDB BB',
        category: 'renda_fixa',
        broker: 'Banco do Brasil',
        issuer: 'Banco do Brasil',
      });

      // Aportes e a cotacao do PETR4 (o CDB fica com preco manual nulo: fora do treemap).
      for (const [ticker, qty, price] of [
        ['PETR4', '100', '30'],
        ['CDB-BB', '1000', '1'],
      ]) {
        await page.goto('/dashboard.html');
        await page.click(`tr[data-ticker="${ticker}"] a`);
        await page.click('[data-new-transaction]');
        await page.fill('[name=quantity]', qty);
        await page.fill('[name=price]', price);
        await page.click('[data-transaction-form] button[type=submit]');
        await expect(page.locator('[data-transaction-dialog]')).toBeHidden();
      }
      await page.goto('/dashboard.html');
      await page.click('[data-update-quotes]');
      await expect(page.locator('[data-toast]')).toContainText('1 atualizado(s)');

      await page.goto('/origins.html');
      await expect(page.locator('[data-treemap] svg g')).toHaveCount(1);
      await expect(page.locator('[data-legend] li[data-label="XP"]')).toContainText('100,0%');

      await page.selectOption('[data-dimension]', 'issuer');
      await expect(page).toHaveURL(/origins\.html$/);
      await expect(page.locator('[data-treemap]')).toHaveAttribute('data-dimension', 'issuer');
      await expect(page.locator('[data-legend] li[data-label="Petrobras"]')).toBeVisible();

      await page.selectOption('[data-dimension]', 'category');
      await expect(page.locator('[data-legend] li[data-label="Ações"]')).toBeVisible();
    });

    test('a linha de aportes e a de valor aparecem na carteira e no ativo (CA07.4, CA07.5)', async ({
      page,
    }) => {
      await signIn(page);

      await page.goto('/analytics.html');
      // Um mes so: a linha e um ponto (caixa de zero pixels), entao o teste confere o path, nao a visibilidade.
      await expect(
        page.locator('[data-evolution] svg path[data-series="Aportado"]')
      ).toHaveAttribute('d', /^M/);
      await expect(
        page.locator('[data-evolution] svg path[data-series="Valor de mercado"]')
      ).toHaveAttribute('d', /^M/);

      await page.goto('/dashboard.html');
      await page.click('tr[data-ticker="PETR4"] a');
      await expect(page.locator('[data-evolution] svg circle')).toHaveCount(2);
    });
  });
// #endregion
