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
