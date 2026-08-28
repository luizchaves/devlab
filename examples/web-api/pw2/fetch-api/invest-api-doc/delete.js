async function remove(resource, id) {
  resource = `${API_URL}/${resource}?id=eq.${id}`;

  const options = {
    headers: {
      apikey: API_TOKEN,
      Authorization: `Bearer ${API_TOKEN}`,
    },
    method: 'DELETE',
  };

  const res = await fetch(resource, options);

  return res.ok;
}
