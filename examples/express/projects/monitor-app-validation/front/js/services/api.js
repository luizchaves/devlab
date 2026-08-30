const domain = '/api';

async function create(resource, data) {
  const url = `${domain}${resource}`;

  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };

  const res = await fetch(url, config);

  return await res.json();
}

async function read(resource) {
  const url = `${domain}${resource}`;

  const res = await fetch(url);

  return await res.json();
}

async function update(resource, data) {
  const url = `${domain}${resource}`;

  const config = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };

  const res = await fetch(url, config);

  return await res.json();
}

async function remove(resource) {
  const url = `${domain}${resource}`;

  await fetch(url, { method: 'DELETE' });

  return true;
}

export default { create, read, update, remove };
