import { supabase } from '../lib/supabase-client.js';

// #region create
export async function createTransaction({ assetId, type, quantity, price, transactionDate }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      asset_id: assetId,
      type,
      quantity,
      price,
      transaction_date: transactionDate,
    })
    .select()
    .single();
}
// #endregion

// #region mutate
export async function updateTransaction(id, { type, quantity, price, transactionDate }) {
  const changes = {
    type,
    quantity,
    price,
    transaction_date: transactionDate,
  };

  return supabase.from('transactions').update(changes).eq('id', id).select().single();
}

export async function deleteTransaction(id) {
  return supabase.from('transactions').delete().eq('id', id);
}
// #endregion

// #region list
/** Lista todas as transações do usuário logado, da mais recente para a mais antiga. */
export function listTransactions() {
  return supabase
    .from('transactions')
    .select('id, asset_id, type, quantity, price, transaction_date, receipt_path')
    .order('transaction_date', { ascending: false });
}
// #endregion
