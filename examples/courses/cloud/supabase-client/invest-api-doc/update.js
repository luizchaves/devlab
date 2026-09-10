async function update(resource, id, data) {
  const { data: updatedData, error } = await supabase
    .from(resource)
    .update(data)
    .eq('id', id)
    .select('*');

  if (error) {
    throw error;
  }

  return updatedData?.[0];
}
