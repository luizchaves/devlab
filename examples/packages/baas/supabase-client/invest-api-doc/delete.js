async function remove(resource, id) {
  const { error } = await supabase.from(resource).delete().eq('id', id);

  if (error) {
    throw error;
  } else {
    return true;
  }
}
