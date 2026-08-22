async function remove(resource, id) {
  resource = `${resource}?id=eq.${id}`;

  const { error } = await API.delete(resource);

  if (error) {
    throw error;
  } else {
    return true;
  }
}
