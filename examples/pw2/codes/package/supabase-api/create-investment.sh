$ SUPABASE_KEY=abc
$ curl -X POST 'https://xyz.supabase.co/rest/v1/investments' \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{ "name": "Tesouro Selic 2029", "value": 10000, "origin": "Tesouro Nacional", "category": "Pós", "interest": "100% Selic" }'
