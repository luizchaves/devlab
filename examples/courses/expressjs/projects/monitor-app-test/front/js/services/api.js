import Auth from '../lib/auth.js';

const domain = '/api';

/**
 * O cabecalho `Authorization` fica em um lugar so. Quando o token muda de
 * formato ou de lugar, nenhuma tela precisa ser tocada.
 */
function headers({ json = true, auth = true } = {}) {
  return {
    ...(json ? { 'Content-Type': 'application/json; charset=UTF-8' } : {}),
    ...(auth ? { Authorization: `Bearer ${Auth.getToken()}` } : {}),
  };
}

/** Um 401 significa token ausente, invalido ou expirado: a sessao acabou. */
function handleUnauthorized(res) {
  if (res.status === 401) {
    Auth.signout();
  }

  return res;
}

async function create(resource, data, { auth = true } = {}) {
  const config = {
    method: 'POST',
    headers: headers({ json: Boolean(data), auth }),
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const res = handleUnauthorized(await fetch(`${domain}${resource}`, config));

  return await res.json();
}

async function read(resource) {
  const res = handleUnauthorized(
    await fetch(`${domain}${resource}`, { headers: headers({ json: false }) })
  );

  return await res.json();
}

async function update(resource, data) {
  const config = { method: 'PUT', headers: headers(), body: JSON.stringify(data) };

  const res = handleUnauthorized(await fetch(`${domain}${resource}`, config));

  return await res.json();
}

async function remove(resource) {
  const config = { method: 'DELETE', headers: headers({ json: false }) };

  handleUnauthorized(await fetch(`${domain}${resource}`, config));

  return true;
}

export default { create, read, update, remove };
