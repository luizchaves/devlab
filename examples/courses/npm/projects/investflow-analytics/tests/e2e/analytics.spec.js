import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync(new URL('../../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((p) => p.trim()))
);

const PASSWORD = 'senha-de-teste';
const email = `e2e-analytics-${Date.now()}@example.com`;

async function signUpAndIn(page) {
  await page.goto('/signup.html');
  await page.fill('[name=fullName]', 'Ana E2E');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/signin\.html/);
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/dashboard\.html$/);
}

// #region flow
test.describe
  .serial('Sprint 6: matriz e painel admin', () => {
    test('a matriz nasce dos aportes e das cotacoes, com lacuna nos meses sem dado (CA06.1, CA06.2)', async ({
      page,
    }) => {
      await signUpAndIn(page);

      await page.click('[data-new-asset]');
      await page.fill('[name=ticker]', 'PETR4');
      await page.fill('[name=name]', 'Petrobras');
      await page.selectOption('[name=category]', 'acoes');
      await page.click('[data-asset-form] button[type=submit]');
      await page.click('tr[data-ticker="PETR4"] a');

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

      // A cotacao de hoje vem da Edge Function (provedor simulado: 38,42).
      await page.goto('/dashboard.html');
      await page.click('[data-update-quotes]');
      await expect(page.locator('[data-toast]')).toContainText('1 atualizado(s)');

      await page.goto('/analytics.html');
      const row = page.locator('[data-matrix] tr').first();
      await expect(row).toBeVisible();
      // So o mes atual tem cotacao: as outras celulas sao lacuna, nao 0%.
      const cells = row.locator('td');
      await expect(cells).toHaveCount(14);
      const dashes = await cells.filter({ hasText: '—' }).count();
      expect(dashes).toBeGreaterThanOrEqual(10);
      await expect(page.locator('[data-allocation] li[data-category="acoes"]')).toContainText(
        'Ações'
      );
    });

    test('investidor e mandado de volta ao abrir o admin (CA06.4)', async ({ page }) => {
      await page.goto('/signin.html');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/dashboard\.html$/);

      await page.goto('/admin.html');
      await expect(page).toHaveURL(/dashboard\.html$/);
    });

    test('admin ve totais e status, nunca posicoes (CA06.5, TK06-7)', async ({ page }) => {
      // A promocao e operacao (chave de servico), nunca uma tela.
      const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
      const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const me = users.users.find((u) => u.email === email);
      await admin.from('profiles').update({ role: 'admin' }).eq('id', me.id);

      await page.goto('/signin.html');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/dashboard\.html$/);

      const responses = [];
      page.on('response', (r) => {
        if (r.url().includes('/rest/v1/')) responses.push(r);
      });
      await page.goto('/admin.html');

      await expect(page.locator('[data-metric="aum"]')).toContainText('R$');
      await expect(page.locator('[data-metric="active_accounts"]')).not.toHaveText('—');
      await expect(page.locator('[data-check="database"]')).toHaveAttribute('data-status', 'up');
      await expect(page.locator('[data-check="quotes"]')).toHaveAttribute('data-status', 'up');

      // RNF05: nenhuma resposta da API para o painel traz ticker ou quantidade de carteira.
      const bodies = await Promise.all(responses.map((r) => r.text().catch(() => '')));
      expect(bodies.join('\n')).not.toMatch(/"ticker"|"quantity"/);
    });
  });
// #endregion
