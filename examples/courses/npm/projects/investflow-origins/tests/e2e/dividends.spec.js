import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync(new URL('../../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((p) => p.trim()))
);
// So os testes usam a chave de servico: aqui, para semear os eventos de
// proventos sem depender do provedor externo.
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const PASSWORD = 'senha-de-teste';
const email = `e2e-proventos-${Date.now()}@example.com`;

async function signIn(page) {
  await page.goto('/signin');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/dashboard$/);
}

// #region flow
test.describe
  .serial('Sprint 9: proventos e movimentacoes', () => {
    test('a aba Proventos aparece so em ativo elegivel e credita pela data ex (CA09.8, CA09.5)', async ({
      page,
    }) => {
      await page.goto('/signup');
      await page.fill('[name=fullName]', 'Ana E2E');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/\/signin/);
      await signIn(page);

      await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
      await page.click('[data-new-asset]');
      await page.selectOption('[name=category]', 'fiis');
      await page.fill('[name=ticker]', 'HGLG11');
      await page.fill('[name=name]', 'CSHG Logistica');
      await page.click('[data-asset-form] button[type=submit]');
      await expect(page.locator('tr[data-ticker="HGLG11"]')).toBeVisible();

      await page.click('tr[data-ticker="HGLG11"] a');
      await page.click('[data-new-transaction]');
      await page.fill('[name=quantity]', '100');
      await page.fill('[name=price]', '150');
      await page.fill('[name=transactionDate]', '2026-01-10');
      await page.click('[data-transaction-form] button[type=submit]');
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('100');

      // Tres eventos: um antes da compra (sem direito), dois depois (R$ 1,10 x 100 cada).
      // O ativo desta conta e o HGLG11 mais recente: cada rodada cria uma conta nova.
      const { data: asset } = await admin
        .from('assets')
        .select('id')
        .eq('ticker', 'HGLG11')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      const { error } = await admin.from('dividends_history').insert([
        { asset_id: asset.id, rate: 1.5, ex_date: '2026-01-05', payment_date: '2026-01-15' },
        { asset_id: asset.id, rate: 1.1, ex_date: '2026-02-27', payment_date: '2026-03-14' },
        { asset_id: asset.id, rate: 1.1, ex_date: '2026-03-31', payment_date: '2026-04-15' },
      ]);
      expect(error).toBeNull();

      await page.reload();
      await expect(page.locator('[data-tab-btn="dividends"]')).toBeVisible();
      await page.click('[data-tab-btn="dividends"]');
      await expect(page).toHaveURL(/tab=dividends/);
      await expect(page.locator('[data-dividends-rows] tr')).toHaveCount(2);
      await expect(page.locator('[data-dividends-footer]')).toContainText('220,00');
      await expect(page.locator('[data-kpi-card="totalReturn"]')).toBeVisible();

      // Renda fixa nao tem proventos por cota: sem aba, sem card de retorno total.
      await page.goto('/dashboard');
      await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
      await page.click('[data-new-asset]');
      await page.selectOption('[name=category]', 'renda_fixa');
      await page.fill('[name=ticker]', 'CDB-E2E');
      await page.fill('[name=name]', 'CDB E2E');
      await page.click('[data-asset-form] button[type=submit]');
      await page.click('tr[data-ticker="CDB-E2E"] a');
      await expect(page.locator('[data-field=name]')).toHaveText('CDB E2E');
      await expect(page.locator('[data-tab-btn="dividends"]')).toBeHidden();
      await expect(page.locator('[data-kpi-card="totalReturn"]')).toBeHidden();
    });

    test('dividends.html: KPIs, matriz e maiores pagadores (CA09.6, CA09.7)', async ({ page }) => {
      await signIn(page);
      await page.goto('/dividends');

      await expect(page.locator('[data-kpi="total-dividends"]')).toHaveText('R$ 220,00');
      await expect(page.locator('[data-kpi="avg-yoc"]')).toContainText('1,47%');
      await expect(page.locator('[data-dividends-tbody] tr')).toHaveCount(2);
      await expect(page.locator('[data-top-dividends]')).toContainText('HGLG11');

      await page.click('[data-dividends-view="matrix"]');
      await expect(page).toHaveURL(/view=matrix/);
      await expect(page.locator('[data-dividends-matrix]')).toContainText('2026');
      await expect(page.locator('[data-dividends-matrix]')).toContainText('220,00');

      // O filtro por ativo vale para KPIs e extrato ao mesmo tempo.
      const hglg = await page
        .locator('[data-filter-asset] option', { hasText: 'HGLG11' })
        .getAttribute('value');
      await page.selectOption('[data-filter-asset]', hglg);
      await expect(page).toHaveURL(/asset=/);
      await expect(page.locator('[data-kpi="total-dividends"]')).toHaveText('R$ 220,00');
    });

    test('o toggle "Com proventos" entra no lucro da carteira (CA09.9)', async ({ page }) => {
      await signIn(page);
      await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');

      await page.click('[data-dividends-include="true"]');
      await expect(page).toHaveURL(/dividends=true/);
      await expect(page.locator('[data-assets-footer]')).toContainText('+ R$ 220,00');

      await page.click('[data-dividends-include="false"]');
      await expect(page).not.toHaveURL(/dividends=/);
      await expect(page.locator('[data-assets-footer]')).not.toContainText('+ R$ 220,00');
    });

    test('movements.html: KPIs de fluxo, extrato e registro pela pagina (CA09.12, CA09.13, CA09.14, CA09.15)', async ({
      page,
    }) => {
      await signIn(page);
      await page.goto('/movements');

      await expect(page.locator('[data-kpi="total-buys"]')).toHaveText('R$ 15.000,00');
      await expect(page.locator('[data-kpi="net-invested"]')).toHaveText('R$ 15.000,00');
      await expect(page.locator('[data-kpi="count"]')).toHaveText('1 lançamento');
      const row = page.locator('[data-movements-tbody] tr').first();
      await expect(row).toContainText('HGLG11');
      await expect(row).toContainText('Compra');
      await expect(row).toContainText('10/01/2026');

      // CA09.13: a janela do grafico fica na URL.
      await page.click('[data-movements-range="2y"]');
      await expect(page).toHaveURL(/range=2y/);
      await expect(page.locator('[data-movements-chart] svg')).toBeVisible();

      // CA09.15: registrar pela pagina.
      await page.click('[data-new-transaction]');
      const cdb = await page
        .locator('[name=assetId] option', { hasText: 'CDB E2E' })
        .getAttribute('value');
      await page.selectOption('[name=assetId]', cdb);
      await page.selectOption('[name=type]', 'buy');
      await page.fill('[name=quantity]', '1000');
      await page.fill('[name=price]', '1');
      await page.fill('[name=transactionDate]', '2026-05-05');
      await page.click('[data-transaction-form] button[type=submit]');
      await expect(page.locator('[data-transaction-dialog]')).toBeHidden();

      await expect(page.locator('[data-kpi="count"]')).toHaveText('2 lançamentos');
      await expect(page.locator('[data-kpi="total-buys"]')).toHaveText('R$ 16.000,00');
    });
  });
// #endregion
