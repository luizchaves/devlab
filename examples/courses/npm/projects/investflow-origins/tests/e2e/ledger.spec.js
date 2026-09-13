import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-lancamentos-${Date.now()}@example.com`;

async function signIn(page) {
  await page.goto('/signin');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function createAsset(page, { ticker, name, category }) {
  // private.js e dashboard.js tem await no topo: o botao so ganha o listener
  // depois que a carteira renderizou, e o KPI e a prova de que renderizou.
  await expect(page.locator('[data-kpi=activeAssets]')).toContainText('ativo');
  await page.click('[data-new-asset]');
  await page.selectOption('[name=category]', category);
  await page.fill('[name=ticker]', ticker);
  await page.fill('[name=name]', name);
  await page.click('[data-asset-form] button[type=submit]');
  await expect(page.locator('[data-asset-dialog]')).toBeHidden();
  await expect(page.locator(`tr[data-ticker="${ticker}"]`)).toBeVisible();
}

async function addTransaction(page, { type = 'buy', quantity, price, date }) {
  await page.click('[data-new-transaction]');
  await page.selectOption('[name=type]', type);
  await page.fill('[name=quantity]', quantity);
  await page.fill('[name=price]', price);
  await page.fill('[name=transactionDate]', date);
  await page.click('[data-transaction-form] button[type=submit]');
  await expect(page.locator('[data-transaction-dialog]')).toBeHidden();
}

// #region flow
test.describe
  .serial('Sprint 8: lancamentos, saldo e cotacao manual', () => {
    test('cadastro e renda fixa acompanhada pelo saldo (CA08.12, CA08.8, CA08.16)', async ({
      page,
    }) => {
      await page.goto('/signup');
      await page.fill('[name=fullName]', 'Ana E2E');
      await page.fill('[name=email]', email);
      await page.fill('[name=password]', PASSWORD);
      await page.click('button[type=submit]');
      await expect(page).toHaveURL(/\/signin/);
      await signIn(page);

      await createAsset(page, { ticker: 'CDB-INTER', name: 'CDB Inter', category: 'renda_fixa' });
      await page.click('tr[data-ticker="CDB-INTER"] a');
      await addTransaction(page, { quantity: '1000', price: '1', date: '2026-01-15' });
      await expect(page.locator('[data-kpi=cost]')).toContainText('1.000,00');
      // CA08.16: posicao aberta conta do primeiro aporte ate hoje.
      await expect(page.locator('[data-kpi=durationSub]')).toHaveText('Início em 15/01/2026');

      // CA08.12: em renda fixa, "atualizar" abre o saldo, e o saldo vira um lancamento update.
      await page.click('[data-update-price]');
      await expect(page.locator('[data-price-dialog]')).toBeVisible();
      await page.fill('[name=currentBalance]', '1080');
      await page.fill('[name=quoteDate]', '2026-06-30');
      await page.click('[data-price-form] button[type=submit]');
      await expect(page.locator('[data-price-dialog]')).toBeHidden();

      await expect(page.locator('[data-transactions] tr')).toHaveCount(2);
      await expect(page.locator('[data-transactions] tr').last()).toContainText('Atualização');
      // CA08.8: o ativo por saldo vale o proprio saldo.
      await expect(page.locator('[data-kpi=value]')).toContainText('1.080,00');
      await expect(page.locator('[data-kpi=cost]')).toContainText('1.080,00');
    });

    test('edita, resgata tudo e desfaz um lancamento (CA08.1, CA08.3, CA08.4, CA08.2)', async ({
      page,
    }) => {
      await signIn(page);
      // XPTO3 nao existe no provedor: e o ativo que vai precisar de cotacao manual.
      await createAsset(page, { ticker: 'XPTO3', name: 'Fora do provedor', category: 'acoes' });
      await expect(page.locator('[data-toast]')).toContainText('sem cotacao (XPTO3)');
      await page.click('tr[data-ticker="XPTO3"] a');

      await addTransaction(page, { quantity: '100', price: '10', date: '2026-01-10' });
      await addTransaction(page, { quantity: '100', price: '20', date: '2026-02-10' });
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('200');
      await expect(page.locator('[data-kpi=averagePrice]')).toContainText('15,00');

      // CA08.1: editar a segunda compra recalcula posicao e preco medio.
      const second = page.locator('[data-transactions] tr').filter({ hasText: '10/02/2026' });
      await second.locator('[data-edit-transaction]').click();
      await expect(page.locator('[data-transaction-form-title]')).toHaveText('Editar lançamento');
      await page.fill('[name=quantity]', '200');
      await page.click('[data-transaction-form] button[type=submit]');
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('300');
      await expect(page.locator('[data-kpi=averagePrice]')).toContainText('16,67');

      // CA08.3: resgate total preenche a quantidade disponivel; CA08.4: o realizado
      // e a diferenca para o preco medio (300 x (20 - 16,67) = 1.000).
      await page.click('[data-new-transaction]');
      await page.selectOption('[name=type]', 'sell');
      await page.check('#totalRedemption');
      await expect(page.locator('[name=quantity]')).toHaveValue('300');
      await page.fill('[name=price]', '20');
      await page.fill('[name=transactionDate]', '2026-03-10');
      await page.click('[data-transaction-form] button[type=submit]');
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('0');
      await expect(page.locator('[data-kpi=realized]')).toContainText('1.000,00');
      await expect(page.locator('[data-kpi=durationSub]')).toHaveText('Encerrado em 10/03/2026');

      // CA08.2: excluir a venda pede confirmacao e devolve a posicao.
      page.once('dialog', (dialog) => dialog.accept());
      await page
        .locator('[data-transactions] tr')
        .filter({ hasText: 'Venda' })
        .locator('[data-delete-transaction]')
        .click();
      await expect(page.locator('[data-transactions] tr')).toHaveCount(2);
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('300');
    });

    test('provedor sem o ticker abre a cotacao manual (CA08.10, CA08.11)', async ({ page }) => {
      await signIn(page);
      await page.goto('/asset?ticker=XPTO3');

      await page.click('[data-update-price]');
      await expect(page.locator('[data-price-dialog]')).toBeVisible();
      await expect(page.locator('[data-price-error]')).toContainText('XPTO3');
      await page.fill('[name=currentPrice]', '25');
      await page.click('[data-price-form] button[type=submit]');
      await expect(page.locator('[data-price-dialog]')).toBeHidden();

      await expect(page.locator('[data-kpi=currentPrice]')).toContainText('25,00');
      await expect(page.locator('[data-kpi=value]')).toContainText('7.500,00');
    });

    test('filtro, ordenacao, rodape e estado na URL (CA08.13, CA08.14, CA08.15, CA08.17)', async ({
      page,
    }) => {
      await signIn(page);
      // Zera XPTO3 de novo para ter um ativo encerrado na carteira.
      await page.goto('/asset?ticker=XPTO3');
      await addTransaction(page, {
        type: 'sell',
        quantity: '300',
        price: '25',
        date: '2026-04-10',
      });
      await expect(page.locator('[data-kpi=quantity]')).toHaveText('0');

      await page.goto('/dashboard');
      // CA08.13: o filtro padrao esconde o encerrado.
      await expect(page.locator('tr[data-ticker="CDB-INTER"]')).toBeVisible();
      await expect(page.locator('tr[data-ticker="XPTO3"]')).toHaveCount(0);
      await page.click('[data-filter="all"]');
      await expect(page.locator('tr[data-ticker="XPTO3"]')).toContainText('Zerado');
      await expect(page).toHaveURL(/filter=all/);

      // CA08.14: coluna numerica comeca do maior para o menor; o segundo clique inverte.
      await page.click('th[data-sort="value"]');
      await expect(page).toHaveURL(/sort=value&dir=desc/);
      await expect(page.locator('[data-assets] tr').first()).toHaveAttribute(
        'data-ticker',
        'CDB-INTER'
      );
      await page.click('th[data-sort="value"]');
      // asc e o padrao: some da URL (CA08.17), e o encerrado (valor zero) sobe.
      await expect(page).toHaveURL(/sort=value$/);
      await expect(page.locator('[data-assets] tr').first()).toHaveAttribute(
        'data-ticker',
        'XPTO3'
      );

      // CA08.15: o rodape soma so as posicoes abertas.
      await expect(page.locator('[data-assets-footer]')).toBeVisible();
      await expect(page.locator('[data-assets-footer]')).toContainText('1.080,00');

      // CA08.17: recarregar mantem filtro e ordenacao lidos da URL.
      await page.reload();
      await expect(page.locator('tr[data-ticker="XPTO3"]')).toBeVisible();
      await expect(page).toHaveURL(/filter=all&sort=value$/);
    });

    test('abre o ativo pelo ticker, sem diferenciar maiusculas (CA08.18)', async ({ page }) => {
      await signIn(page);

      await page.goto('/asset?ticker=cdb-inter');
      await expect(page.locator('[data-field=name]')).toHaveText('CDB Inter');

      await page.goto('/asset?ticker=NADA-AQUI');
      await expect(page.locator('[data-not-found]')).toBeVisible();
    });
  });
// #endregion
