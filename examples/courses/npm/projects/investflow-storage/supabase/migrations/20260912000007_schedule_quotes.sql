-- Sprint 4 (TK04-8): execucao diaria com pg_cron + pg_net.

-- #region extensions
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
-- #endregion

-- #region schedule
-- A URL e o segredo nao entram na migration: quem opera chama esta funcao uma
-- vez, e a chave de servico fica no vault, nao na string do cron.
create function public.schedule_update_quotes(function_url text, secret_name text)
returns bigint
language plpgsql
security definer
set search_path = public, cron, vault
as $$
declare
  job_id bigint;
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'update-quotes-daily';

  select cron.schedule(
    'update-quotes-daily',
    '30 21 * * 1-5',  -- 18h30 em Brasilia, de segunda a sexta
    format(
      $job$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = %L)
        ),
        body := '{}'::jsonb
      );
      $job$,
      function_url, secret_name
    )
  ) into job_id;

  return job_id;
end;
$$;

-- O PostgreSQL concede EXECUTE a PUBLIC em toda funcao nova: uma conta comum
-- poderia agendar o job. Revogar e conceder so a operacao (chave de servico).
revoke execute on function public.schedule_update_quotes(text, text) from public, anon, authenticated;
grant execute on function public.schedule_update_quotes(text, text) to service_role;
-- #endregion
