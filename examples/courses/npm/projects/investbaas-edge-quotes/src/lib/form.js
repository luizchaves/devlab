// #region show-error
/** Mostra uma mensagem no elemento [data-error] do formulario. */
export function showError(form, message) {
  const box = form.querySelector('[data-error]');

  box.textContent = message;
  box.hidden = !message;
}
// #endregion
