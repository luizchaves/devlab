import { supabase } from '../lib/supabase-client.js';

// #region find-or-create
/**
 * A corretora nasce quando um ativo a cita pela primeira vez. O upsert sobre
 * (user_id, name) e o que evita duas linhas para "XP" e "XP " com a mesma
 * conta: o nome e normalizado antes.
 */
export async function findOrCreateBroker(name, userId) {
  const normalized = name.trim();
  if (!normalized) return { data: null, error: null };

  return supabase
    .from('brokers')
    .upsert({ user_id: userId, name: normalized }, { onConflict: 'user_id,name' })
    .select('id, name')
    .single();
}

export async function listBrokers() {
  return supabase.from('brokers').select('id, name').order('name');
}
// #endregion
