// #region validate
export const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
export const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Validacao do cliente: existe para a pessoa, nao para a seguranca. Responde
 * antes de subir 5 MB pela rede. `file.type` e o MIME que o NAVEGADOR declara
 * a partir da extensao; quem fecha o caminho e o bucket (allowed_mime_types).
 */
export function validateReceipt(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Envie um PDF, PNG ou JPG';
  if (file.size > MAX_SIZE) return 'O arquivo pode ter no maximo 5 MB';
  return null;
}
// #endregion

// #region path
/**
 * O path e decisao do codigo, nunca do nome do arquivo:
 * <user_id>/<transaction_id>/<uuid>.<ext>. O primeiro segmento e o que a
 * policy confere; o segundo agrupa por transacao; o terceiro evita colisao e
 * esconde o nome original.
 */
export function receiptPath({ userId, transactionId, file }) {
  const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase();
  return `${userId}/${transactionId}/${crypto.randomUUID()}.${ext}`;
}
// #endregion
