import { showError } from '../lib/form.js';
import { signIn } from '../services/auth.js';

const form = document.querySelector('form');

if (new URLSearchParams(window.location.search).has('registered')) {
  document.querySelector('[data-notice]').hidden = false;
}

// #region submit
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError(form, '');

  const { error } = await signIn({
    email: form.elements.email.value,
    password: form.elements.password.value,
  });

  if (error) {
    // A mesma frase para e-mail inexistente e senha errada.
    return showError(form, error.message);
  }

  window.location.href = './dashboard.html';
});
// #endregion
