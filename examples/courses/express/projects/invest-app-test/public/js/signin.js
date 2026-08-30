import Auth from './lib/auth.js';
import API from './services/api.js';

const form = document.querySelector('form');

window.handleSubmit = handleSubmit;

async function handleSubmit(event) {
  event.preventDefault();

  if (form.checkValidity()) {
    const user = Object.fromEntries(new FormData(form));

    const { auth, token } = await API.create('/signin', user, false);

    if (auth) {
      Auth.signin(token);
    } else {
      showToast('Error no login');
    }
  } else {
    form.classList.add('was-validated');
  }
}

function showToast(message) {
  const toast = document.querySelector('#liveToast');

  toast.querySelector('strong').innerText = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}
