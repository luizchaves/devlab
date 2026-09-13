// #region show-error
/** Mostra uma mensagem no elemento [data-error] do formulario. */
export function showError(form, message) {
  const box = form.querySelector('[data-error]');
  if (!box) return;

  box.textContent = message;
  box.hidden = !message;
}
// #endregion

// #region password-toggle
/**
 * Inicializa a funcionalidade de alternar visualização de senha (mostrar/ocultar)
 * nos botões que possuem o atributo [data-toggle-password].
 */
export function initPasswordToggle(root = document) {
  const buttons = root.querySelectorAll('[data-toggle-password]');
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      const targetName = btn.dataset.togglePassword;
      const container = btn.closest('div') || root;
      const input = targetName
        ? root.querySelector(`#${targetName}`) ||
          root.querySelector(`input[name="${targetName}"]`) ||
          container.querySelector('input')
        : container.querySelector('input');

      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const eyeOpen = btn.querySelector('[data-eye-open]');
      const eyeClosed = btn.querySelector('[data-eye-closed]');

      if (eyeOpen && eyeClosed) {
        eyeOpen.classList.toggle('hidden', isPassword);
        eyeClosed.classList.toggle('hidden', !isPassword);
      }

      btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
      btn.setAttribute('title', isPassword ? 'Ocultar senha' : 'Mostrar senha');
    });
  }
}
// #endregion
