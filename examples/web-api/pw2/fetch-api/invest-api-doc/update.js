async function update(resource, id, data) {
  resource = `${API_URL}/${resource}?id=eq.${id}`;

  const options = {
    headers: {
      apikey: API_TOKEN,
      Authorization: `Bearer ${API_TOKEN}`,
      Prefer: 'return=representation',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(data),
  };

  const res = await fetch(resource, options);

  const updatedData = await res.json();

  return updatedData?.[0];
}
