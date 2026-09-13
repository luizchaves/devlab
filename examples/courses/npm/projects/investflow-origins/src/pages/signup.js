import { initPasswordToggle, showError } from '../lib/form.js';
import { initTheme } from '../lib/theme.js';
import { signUp } from '../services/auth.js';

initTheme();
// O olho do campo de senha: o botao ja esta no HTML, a funcao liga o clique.
initPasswordToggle();

// #region submit
const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError(form, '');

  const { error } = await signUp({
    fullName: form.elements.fullName.value,
    email: form.elements.email.value,
    password: form.elements.password.value,
  });

  if (error) {
    return showError(form, error.message);
  }

  // O cadastro nao autentica a tela: a pessoa entra pelo login.
  window.location.href = '/signin?registered=1';
});
// #endregion
