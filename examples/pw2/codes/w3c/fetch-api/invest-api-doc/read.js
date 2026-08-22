async function read(resource, id) {
  resource = id
    ? `${API_URL}/${resource}?id=eq.${id}`
    : `${API_URL}/${resource}`;

  const options = {
    headers: {
      apikey: API_TOKEN,
      Authorization: `Bearer ${API_TOKEN}`,
    },
    method: 'GET',
  };

  const res = await fetch(resource, options);

  return await res.json();
}
