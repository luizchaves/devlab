async function update(resource, id, data) {
  resource = `${resource}?id=eq.${id}`;

  const { data: updatedData } = await API.patch(resource, data);

  return updatedData?.[0];
}
