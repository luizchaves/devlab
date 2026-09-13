import { showError } from '../lib/form.js';
import { signUp } from '../services/auth.js';

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
  window.location.href = './signin.html?registered=1';
});
// #endregion
