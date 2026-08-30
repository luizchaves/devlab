const TOKEN_KEY = '@monitor-app:token';

/** Guarda a porta de entrada das paginas privadas. */
function isAuthenticated() {
  if (!getToken()) {
    window.location.href = 'signin.html';

    return false;
  }

  return true;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function signin(token) {
  localStorage.setItem(TOKEN_KEY, token);

  window.location.href = 'index.html';
}

function signout() {
  localStorage.removeItem(TOKEN_KEY);

  window.location.href = 'signin.html';
}

export default { isAuthenticated, getToken, signin, signout };
