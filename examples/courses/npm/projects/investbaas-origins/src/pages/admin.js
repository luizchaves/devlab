import { requireAdmin } from '../guards/require-admin.js';
import { formatBRL } from '../lib/portfolio.js';
import { adminMetrics, checks } from '../services/admin.js';
import { onSessionEnd, signOut } from '../services/auth.js';

// #region admin
// A guarda por papel vem antes de tudo: investidor volta para a carteira.
const session = await requireAdmin();
document.querySelector('[data-user-email]').textContent = session.user.email;
document.querySelector('[data-sign-out]').addEventListener('click', async () => {
  await signOut();
  window.location.replace('./signin.html');
});
onSessionEnd(() => window.location.replace('./signin.html'));

const { data: metrics } = await adminMetrics();
const metric = (name) => document.querySelector(`[data-metric="${name}"]`);
metric('active_accounts').textContent = metrics ? String(metrics.active_accounts) : '—';
metric('aum').textContent = metrics ? formatBRL(Number(metrics.aum)) : '—';
metric('last_quote_run').textContent = metrics?.last_quote_run
  ? new Date(metrics.last_quote_run).toLocaleString('pt-BR')
  : 'nunca';
// #endregion

// #region status
// Um indicador que falha nao derruba os outros: cada resultado vira verde ou vermelho.
const results = await Promise.allSettled(Object.values(checks).map((check) => check()));
Object.keys(checks).forEach((name, i) => {
  const ok = results[i].status === 'fulfilled' && results[i].value;
  const item = document.querySelector(`[data-check="${name}"]`);
  item.dataset.status = ok ? 'up' : 'down';
  item.querySelector('[data-light]').textContent = ok ? '🟢' : '🔴';
});
// #endregion
