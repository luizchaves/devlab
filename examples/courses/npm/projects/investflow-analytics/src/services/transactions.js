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
