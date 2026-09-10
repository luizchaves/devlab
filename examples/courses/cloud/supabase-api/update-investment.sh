$ SUPABASE_KEY=abc
$ curl -X PATCH 'https://xyz.supabase.co/rest/v1/investments?some_column=eq.someValue' \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}"\
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{ "value": 15000 }'
