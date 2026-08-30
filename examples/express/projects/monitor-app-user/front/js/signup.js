import API from './services/api.js';

const form = document.querySelector('#signup-form');

const feedback = document.querySelector('#signup-feedback');

/**
 * A API devolve `issues` no formato do Zod. A primeira mensagem ja e suficiente
 * para orientar quem esta preenchendo o formulario.
 */
function firstIssue(response) {
  return response?.issues?.[0]?.message ?? response?.error;
}

form.onsubmit = async (event) => {
  event.preventDefault();

  const user = Object.fromEntries(new FormData(form));

  const response = await API.create('/users', user);

  const message = firstIssue(response);

  if (message) {
    feedback.innerText = message;

    return;
  }

  window.location.href = 'signin.html';
};
