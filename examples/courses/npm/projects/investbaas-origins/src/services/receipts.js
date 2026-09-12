import { receiptPath } from '../lib/file-validation.js';
import { supabase } from '../lib/supabase-client.js';

// #region upload
/** Envia o arquivo e grava SO o path na transacao. A URL nasce a cada leitura. */
export async function uploadReceipt({ userId, transactionId, file }) {
  const path = receiptPath({ userId, transactionId, file });

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(path, file, { contentType: file.type });

  if (uploadError) return { data: null, error: uploadError };

  return supabase
    .from('transactions')
    .update({ receipt_path: path })
    .eq('id', transactionId)
    .select()
    .single();
}
// #endregion

// #region signed-url
/**
 * createSignedUrl so funciona para quem passa pela policy de select: pedir a
 * URL de um path alheio responde erro, nao link. Sessenta segundos bastam para
 * abrir o documento em uma aba.
 */
export async function receiptUrl(path, expiresIn = 60) {
  const { data, error } = await supabase.storage.from('receipts').createSignedUrl(path, expiresIn);

  return error ? { url: null, error } : { url: data.signedUrl, error: null };
}
// #endregion
