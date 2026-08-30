async function create(resource, data) {
  resource = `${API_URL}/${resource}`;

  const options = {
    headers: {
      apikey: API_TOKEN,
      Authorization: `Bearer ${API_TOKEN}`,
      Prefer: 'return=representation',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  };

  const res = await fetch(resource, options);

  const createdData = await res.json();

  return createdData?.[0];
}
