// #region backdrop
// Um clique cujo alvo e o proprio <dialog> so pode ter caido no fundo: o
// conteudo do dialogo e um filho e responderia como alvo.
const backdropCloseDialogs = new WeakSet();

export function closeDialogOnBackdropClick(dialog) {
  if (!dialog || backdropCloseDialogs.has(dialog)) return;

  backdropCloseDialogs.add(dialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}
// #endregion
