// #region validate
export const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
export const MAX_SIZE = 5 * 1024 * 1024;

export type FileLike = { type: string; size: number; name: string };

/**
 * Validação do cliente: existe para a pessoa, não para a segurança. Responde
 * antes de subir 5 MB pela rede. `type` é o MIME que o navegador declara a
 * partir da extensão; quem fecha o caminho é o bucket (`allowed_mime_types`)
 * e a mesma checagem repetida no servidor (CA05.2).
 */
export function validateReceipt(file: Pick<FileLike, 'type' | 'size'>): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Envie um PDF, PNG ou JPG.';
  if (file.size > MAX_SIZE) return 'O arquivo pode ter no máximo 5 MB.';
  return null;
}
// #endregion

// #region path
/**
 * O path é decisão do código, nunca do nome do arquivo:
 * `<userId>/<transactionId>/<uuid>.<ext>` (CA05.5). O primeiro segmento diz o
 * dono; o segundo agrupa por lançamento; o terceiro evita colisão e esconde o
 * nome original.
 */
export function receiptPath({ userId, transactionId, fileName, uuid = crypto.randomUUID() }: { userId: string; transactionId: string; fileName: string; uuid?: string }) {
  const ext = (fileName.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  return `${userId}/${transactionId}/${uuid}.${ext}`;
}
// #endregion

// #region avatar
export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

/** Avatar: PNG, JPG, WEBP ou GIF até 2 MB (CA11.2). */
export function validateAvatar(file: Pick<FileLike, 'type' | 'size'>): string | null {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) return 'Envie uma imagem PNG, JPG, WEBP ou GIF.';
  if (file.size > MAX_AVATAR_SIZE) return 'A imagem pode ter no máximo 2 MB.';
  return null;
}
// #endregion
