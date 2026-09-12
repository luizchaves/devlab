import { expect, test } from '@playwright/test';

const PASSWORD = 'senha-de-teste';
const email = `e2e-comprovante-${Date.now()}@example.com`;

// #region flow
test('anexa um comprovante ao aporte e abre a URL assinada (CA05.1, CA05.3, CA05.5)', async ({
  page,
  context,
}) => {
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

  await page.click('[data-new-asset]');
  await page.fill('[name=ticker]', 'CDB-BB');
  await page.fill('[name=name]', 'CDB Banco do Brasil');
  await page.selectOption('[name=category]', 'renda_fixa');
  await page.click('[data-asset-form] button[type=submit]');
  await page.click('tr[data-ticker="CDB-BB"] a');
  await expect(page).toHaveURL(/asset\.html\?id=/);

  await page.click('[data-new-transaction]');
  await page.fill('[name=quantity]', '1');
  await page.fill('[name=price]', '1000');
  await page.fill('[name=transactionDate]', '2026-03-01');
  await page.setInputFiles('[name=receipt]', {
    name: 'nota.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 nota de corretagem'),
  });
  await page.click('[data-transaction-form] button[type=submit]');

  const button = page.locator('[data-receipt]');
  await expect(button).toBeVisible();
  // O path guardado e <user>/<transacao>/<uuid>.pdf, nunca uma URL.
  await expect(button).toHaveAttribute(
    'data-receipt',
    /^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.pdf$/
  );

  // O PDF abriria em outra aba; o teste captura a URL que window.open recebe.
  await page.evaluate(() => {
    window.open = (url) => {
      window.__openedUrl = url;
      return null;
    };
  });
  await button.click();
  await expect
    .poll(() => page.evaluate(() => window.__openedUrl))
    .toContain('/storage/v1/object/sign/receipts/');
  expect(await page.evaluate(() => window.__openedUrl)).toContain('token=');

  // E a URL assinada de fato entrega o arquivo.
  const url = await page.evaluate(() => window.__openedUrl);
  const res = await page.request.get(url);
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('%PDF');
});

test('um tipo fora da lista e recusado antes do upload (CA05.2)', async ({ page }) => {
  await page.goto('/signin.html');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/dashboard\.html$/);
  await page.click('tr[data-ticker="CDB-BB"] a');

  await page.click('[data-new-transaction]');
  await page.fill('[name=quantity]', '1');
  await page.fill('[name=price]', '10');
  await page.setInputFiles('[name=receipt]', {
    name: 'virus.exe',
    mimeType: 'application/x-msdownload',
    buffer: Buffer.from('MZ'),
  });
  await page.click('[data-transaction-form] button[type=submit]');

  await expect(page.locator('[data-transaction-form] [data-error]')).toHaveText(
    'Envie um PDF, PNG ou JPG'
  );
  await expect(page.locator('[data-transactions] tr')).toHaveCount(1);
});
// #endregion
