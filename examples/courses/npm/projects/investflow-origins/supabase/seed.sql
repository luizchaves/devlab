-- Seed público mínimo do InvestFlow.
-- Dados reais/confidenciais devem ficar fora do repositório.

DO $$
DECLARE
  v_admin_id uuid;
  v_broker_id uuid;
  v_asset_id uuid;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@example.com';

  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      v_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('senha-de-teste', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_admin_id,
      format('{"sub":"%s","email":"%s"}', v_admin_id::text, 'admin@example.com')::jsonb,
      'email',
      v_admin_id::text,
      now(),
      now(),
      now()
    );
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (v_admin_id, 'Admin', 'admin')
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;

  INSERT INTO public.brokers (user_id, name)
  VALUES (v_admin_id, 'Inter')
  ON CONFLICT (user_id, name) DO UPDATE
    SET name = EXCLUDED.name
  RETURNING id INTO v_broker_id;

  INSERT INTO public.assets (
    user_id,
    broker_id,
    ticker,
    name,
    category,
    issuer,
    currency,
    current_price
  ) VALUES (
    v_admin_id,
    v_broker_id,
    'TESOURO-RESERVA-2036',
    'Tesouro Reserva 2036',
    'renda_fixa',
    'Tesouro Nacional',
    'BRL',
    null
  )
  ON CONFLICT (user_id, ticker) DO UPDATE
    SET broker_id = EXCLUDED.broker_id,
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        issuer = EXCLUDED.issuer,
        currency = EXCLUDED.currency,
        current_price = EXCLUDED.current_price
  RETURNING id INTO v_asset_id;

  DELETE FROM public.transactions WHERE asset_id = v_asset_id;

  INSERT INTO public.transactions (
    user_id,
    asset_id,
    type,
    quantity,
    price,
    transaction_date
  ) VALUES (
    v_admin_id,
    v_asset_id,
    'update',
    1,
    1,
    '2026-09-07'
  );
END $$;
