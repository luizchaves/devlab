async function read(resource, id) {
  if (id) {
    resource = `${resource}?id=eq.${id}`;
  }

  const { data } = await API.get(resource);

  return data;
}
