import { supabase } from '../lib/supabase-client.js';

// #region views
// Sem filtro de user_id: as views sao security_invoker e o RLS entrega so o dono.
export function monthlyReturns() {
  return supabase
    .from('monthly_returns')
    .select('month, value, net_flow, return_brl')
    .order('month');
}

export function allocationByCategory() {
  return supabase
    .from('allocation_by_category')
    .select('category, value')
    .order('value', { ascending: false });
}
// #endregion
