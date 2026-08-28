$ SUPABASE_KEY=abc
$ curl -X DELETE 'https://xyz.supabase.co/rest/v1/investments?some_column=eq.someValue' \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}"
