import { requireAdmin } from '../guards/require-admin.js';
import { renderNavbar } from '../lib/navbar.js';
import { formatBRL } from '../lib/portfolio.js';
import { adminMetrics, checks } from '../services/admin.js';
import { onSessionEnd, signOut } from '../services/auth.js';

// #region admin
// A guarda por papel vem antes de tudo: investidor volta para a carteira.
const session = await requireAdmin();
renderNavbar({
  userEmail: session.user.email,
  userName: session.user.user_metadata?.full_name || 'Admin',
  role: 'admin',
  activePath: '/admin',
});

for (const btn of document.querySelectorAll('[data-sign-out], [data-sign-out-menu]')) {
  btn.addEventListener('click', async () => {
    await signOut();
    window.location.replace('/signin');
  });
}
onSessionEnd(() => window.location.replace('/signin'));

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
