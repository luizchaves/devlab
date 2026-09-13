import { receiptPath, validateReceipt } from '@/core/file-validation';
import { prisma } from './prisma';
import { HttpError } from './session';
import { ensureReceiptsBucket, RECEIPTS_BUCKET, supabaseAdmin } from './storage';

async function ownTransaction(userId: string, transactionId: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, userId }, select: { id: true, receiptPath: true } });
  if (!transaction) throw new HttpError(404, 'Lançamento não encontrado.');
  return transaction;
}

// #region upload
/**
 * Envia o arquivo para o bucket privado e grava SÓ o path no lançamento
 * (CA05.1, CA05.5). A validação do cliente se repete aqui: é a que vale.
 */
export async function uploadReceipt(userId: string, transactionId: string, file: File): Promise<string> {
  const invalid = validateReceipt(file);
  if (invalid) throw new HttpError(400, invalid);

  const transaction = await ownTransaction(userId, transactionId);
  const path = receiptPath({ userId, transactionId, fileName: file.name });

  await ensureReceiptsBucket();
  const { error } = await supabaseAdmin().storage.from(RECEIPTS_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new HttpError(502, `Storage recusou o arquivo: ${error.message}`);

  // Um comprovante por lançamento: o anterior sai do bucket.
  if (transaction.receiptPath) {
    await supabaseAdmin().storage.from(RECEIPTS_BUCKET).remove([transaction.receiptPath]);
  }

  await prisma.transaction.update({ where: { id: transactionId }, data: { receiptPath: path } });
  return path;
}
// #endregion

// #region signed-url
export const RECEIPT_URL_TTL = 60;

/**
 * URL assinada de 60 segundos, criada só depois de conferir que o lançamento
 * é do dono (CA05.3). Lançamento alheio responde 404, sem confirmar que o
 * objeto existe (CA05.4). A URL nasce a cada leitura; nunca é gravada.
 */
export async function receiptSignedUrl(userId: string, transactionId: string): Promise<{ url: string; expiresIn: number }> {
  const transaction = await ownTransaction(userId, transactionId);
  if (!transaction.receiptPath) throw new HttpError(404, 'Lançamento sem comprovante.');

  const { data, error } = await supabaseAdmin().storage.from(RECEIPTS_BUCKET).createSignedUrl(transaction.receiptPath, RECEIPT_URL_TTL);
  if (error || !data) throw new HttpError(502, 'Não foi possível gerar o link do comprovante.');

  return { url: data.signedUrl, expiresIn: RECEIPT_URL_TTL };
}
// #endregion
