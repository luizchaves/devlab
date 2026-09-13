import { requireSession } from '../guards/require-session.js';
import { renderNavbar } from '../lib/navbar.js';
import { supabase } from '../lib/supabase-client.js';
import { initTheme } from '../lib/theme.js';
import { onSessionEnd, signOut } from '../services/auth.js';

// Inicializa o tema Dark/Light
initTheme();

// Renderiza a estrutura da barra de navegação imediatamente no primeiro paint
renderNavbar({ userEmail: '', role: 'investor' });

// Sem sessao valida, requireSession redireciona para signin.html
const session = await requireSession();

const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, role')
  .eq('id', session.user.id)
  .maybeSingle();

const userName =
  profile?.full_name ||
  session.user.user_metadata?.full_name ||
  session.user.user_metadata?.name ||
  '';

// Atualiza o navbar com o usuário autenticado, primeiro nome e perfil
renderNavbar({
  userEmail: session.user.email,
  userName,
  role: profile?.role,
});

for (const btn of document.querySelectorAll('[data-sign-out], [data-sign-out-menu]')) {
  btn.addEventListener('click', async () => {
    await signOut();
    window.location.replace('/signin');
  });
}

onSessionEnd(() => window.location.replace('/signin'));
// #endregion
