async function create(resource, data) {
  const { data: createdData } = await API.post(resource, data);

  return createdData?.[0];
}
