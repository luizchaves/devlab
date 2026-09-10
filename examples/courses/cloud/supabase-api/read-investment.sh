$ SUPABASE_KEY=abc
$ curl 'https://xyz.supabase.co/rest/v1/investments?id=eq.1' \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}"
