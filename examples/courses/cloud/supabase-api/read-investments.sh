$ SUPABASE_KEY=abc
$ curl 'https://xyz.supabase.co/rest/v1/investments?select=*' \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}"
