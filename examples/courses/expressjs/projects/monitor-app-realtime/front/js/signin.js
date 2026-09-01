import Auth from './lib/auth.js';
import API from './services/api.js';

const form = document.querySelector('#signin-form');

const feedback = document.querySelector('#signin-feedback');

form.onsubmit = async (event) => {
  event.preventDefault();

  const credentials = Object.fromEntries(new FormData(form));

  // O login e a unica chamada que sai sem token — ele ainda nao existe.
  const response = await API.create('/signin', credentials, { auth: false });

  if (!response.token) {
    feedback.innerText = response.error ?? 'Não foi possível entrar';

    return;
  }

  Auth.signin(response.token);
};
