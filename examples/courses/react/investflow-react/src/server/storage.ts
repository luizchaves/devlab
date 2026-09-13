import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// #region client
/**
 * Cliente do Supabase Storage com a service role: só existe no servidor
 * (RNF02). Sem RLS no caminho, quem confere o dono é o código que chama.
 */
const globalForStorage = globalThis as unknown as { supabaseAdmin?: SupabaseClient };

export function supabaseAdmin(): SupabaseClient {
  if (!globalForStorage.supabaseAdmin) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.');
    globalForStorage.supabaseAdmin = createClient(url, key, { auth: { persistSession: false } });
  }
  return globalForStorage.supabaseAdmin;
}
// #endregion

// #region buckets
export const RECEIPTS_BUCKET = 'receipts';

/** Garante o bucket com os mesmos limites do `config.toml`; idempotente. */
export async function ensureReceiptsBucket() {
  const storage = supabaseAdmin().storage;
  const { data } = await storage.getBucket(RECEIPTS_BUCKET);
  if (data) return;
  await storage.createBucket(RECEIPTS_BUCKET, {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
  });
}
// #endregion
