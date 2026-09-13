import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  try {
    for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
      const [key, ...rest] = line.split('=');
      if (key && !key.startsWith('#') && rest.length) {
        process.env[key.trim()] ??= rest.join('=').trim();
      }
    }
  } catch {
    // Ambiente local sem .env: usa os defaults do Supabase CLI quando possível.
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY não configurada no .env');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PASSWORD = 'senha-de-teste';
const USER_EMAIL = 'admin@example.com';
const USER_NAME = 'Admin';
const BROKER_NAME = 'Inter';
const ASSET = {
  ticker: 'TESOURO-RESERVA-2036',
  name: 'Tesouro Reserva 2036',
  category: 'renda_fixa',
  issuer: 'Tesouro Nacional',
  value: 1,
};

async function ensureAdminUser() {
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.error('Erro ao listar usuários:', listError);
    process.exit(1);
  }

  const existingUser = users.users.find((user) => user.email === USER_EMAIL);

  if (existingUser) {
    console.log(`Usuário ${USER_EMAIL} encontrado (id: ${existingUser.id}).`);
    return existingUser.id;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: USER_EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: USER_NAME },
  });

  if (error) {
    console.error('Erro ao criar usuário admin:', error);
    process.exit(1);
  }

  console.log(`Usuário ${USER_EMAIL} criado com sucesso (id: ${data.user.id}).`);
  return data.user.id;
}

async function seed() {
  console.log('Iniciando seed público mínimo do InvestFlow...');

  const userId = await ensureAdminUser();

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({ id: userId, full_name: USER_NAME, role: 'admin' }, { onConflict: 'id' });

  if (profileError) {
    console.error('Erro ao salvar perfil admin:', profileError);
    process.exit(1);
  }

  const { data: broker, error: brokerError } = await supabaseAdmin
    .from('brokers')
    .upsert({ user_id: userId, name: BROKER_NAME }, { onConflict: 'user_id,name' })
    .select()
    .single();

  if (brokerError) {
    console.error('Erro ao salvar corretora:', brokerError);
    process.exit(1);
  }

  const { data: asset, error: assetError } = await supabaseAdmin
    .from('assets')
    .upsert(
      {
        user_id: userId,
        broker_id: broker.id,
        ticker: ASSET.ticker,
        name: ASSET.name,
        category: ASSET.category,
        issuer: ASSET.issuer,
        currency: 'BRL',
        current_price: null,
      },
      { onConflict: 'user_id,ticker' }
    )
    .select()
    .single();

  if (assetError) {
    console.error('Erro ao salvar ativo:', assetError);
    process.exit(1);
  }

  await supabaseAdmin.from('transactions').delete().eq('asset_id', asset.id);

  const { error: transactionError } = await supabaseAdmin.from('transactions').insert({
    user_id: userId,
    asset_id: asset.id,
    type: 'update',
    quantity: ASSET.value,
    price: 1,
    transaction_date: '2026-09-07',
  });

  if (transactionError) {
    console.error('Erro ao salvar atualização do ativo:', transactionError);
    process.exit(1);
  }

  console.log(
    `Seed concluído: ${USER_EMAIL} com ${ASSET.name} no valor de R$ ${ASSET.value.toFixed(2)}.`
  );
}

seed().catch((error) => {
  console.error('Falha inesperada no seed:', error);
  process.exit(1);
});
