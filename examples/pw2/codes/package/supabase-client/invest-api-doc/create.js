async function create(resource, data) {
  const { data: createdData, error } = await supabase
    .from(resource)
    .insert(data)
    .select('*');

  if (error) {
    throw error;
  }

  return createdData?.[0];
}
