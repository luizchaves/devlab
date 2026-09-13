import { requireSession } from '../guards/require-session.js';
import { onSessionEnd, signOut } from '../services/auth.js';

// #region private
// Importado por dashboard, analytics e admin: sem sessao, nada abaixo executa.
const session = await requireSession();

document.querySelector('[data-user-email]').textContent = session.user.email;

document.querySelector('[data-sign-out]').addEventListener('click', async () => {
  await signOut();
  window.location.replace('./signin.html');
});

onSessionEnd(() => window.location.replace('./signin.html'));
// #endregion
