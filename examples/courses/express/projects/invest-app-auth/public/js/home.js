import Auth from './lib/auth.js';
import { formatCurrency, formatDate } from './lib/format.js';
import API from './services/api.js';

let removedHostId;

const form = document.querySelector('form');
const offcanvas = document.querySelector('.offcanvas');
const modal = document.querySelector('.modal');

const bsOffcanvas = {
  show() {
    offcanvas.classList.remove('hidden');
    offcanvas.setAttribute('aria-hidden', 'false');
  },
  hide() {
    offcanvas.classList.add('hidden');
    offcanvas.setAttribute('aria-hidden', 'true');
  },
};

const confirmModal = {
  show() {
    modal.classList.remove('hidden');
  },
  hide() {
    modal.classList.add('hidden');
  },
};

function InvestmentCard(investment) {
  return `<article class="card investment-card p-5" id="investment-${investment.id}">
    <header class="flex items-start justify-between gap-4">
      <div>
        <span
          class="badge investment-category"
          style="background-color: ${investment.category.color}"
        >
          ${investment.category.name}
        </span>
        <span class="investment-name mt-1 block text-xl font-extrabold">${investment.name}</span>
      </div>
      <span class="flex items-center gap-2">
        <button class="icon-button icon-trash" type="button" aria-label="Remover investimento">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z" fill="currentColor" />
            <path d="M7 9h10l-.7 11H7.7L7 9Z" fill="currentColor" />
          </svg>
        </button>
        <button class="icon-button icon-pencil" type="button" aria-label="Editar investimento">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 17.5V21h3.5L18.1 10.4l-3.5-3.5L4 17.5Zm16.7-9.8a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0l-1.2 1.2 3.5 3.5 1.1-1.3Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </span>
    </header>
    <div class="grid gap-4">
      <div>
        <span class="text-sm font-bold">Valor</span>
        <div class="investment-value text-2xl font-extrabold">${formatCurrency(investment.value / 100)}</div>
      </div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-sm font-bold">Taxa</span>
          <span class="investment-interest block">${investment.interest}</span>
        </div>
        <div>
          <span class="text-sm font-bold">Data</span>
          <span class="investment-created-at block">${formatDate(investment.createdAt)}</span>
        </div>
      </div>
      <div>
        <span class="text-sm font-bold">Corretora</span>
        <span class="investment-broker block">${investment.broker.name}</span>
      </div>
    </div>
  </article>`;
}

function createInvestmentCard(investment) {
  document.querySelector('.investments p').style.display = 'none';

  const investmentContainer = document.querySelector(`#investment-grid`);

  investmentContainer.insertAdjacentHTML('beforeend', InvestmentCard(investment));

  loadHandleConfirmModal(investment.id);

  loadHandleUpdateInvestment(investment.id);
}

async function loadInvestmentCards() {
  const investments = await API.read('/investments');

  for (const investment of investments) {
    createInvestmentCard(investment);
  }

  updatePortfolioTotal(investments);
}

function updateInvestmentCard({ id, name, value, createdAt, category, broker, interest }) {
  document.querySelector(`#investment-${id} .investment-name`).innerText = name;

  document.querySelector(`#investment-${id} .investment-value`).innerText = formatCurrency(
    value / 100
  );

  document.querySelector(`#investment-${id} .investment-interest`).innerText = interest;

  document.querySelector(`#investment-${id} .investment-broker`).innerText = broker.name;

  document.querySelector(`#investment-${id} .investment-created-at`).innerText = createdAt;

  document.querySelector(`#investment-${id} .investment-category`).style.backgroundColor =
    category.color;

  document.querySelector(`#investment-${id} .investment-category`).innerText = category.name;

  loadPortfolioTotal();
}

function loadHandleFormSubmit(type, id) {
  form.onsubmit = async (event) => {
    event.preventDefault();

    const investment = Object.fromEntries(new FormData(form));

    investment.value = Number(investment.value) * 100;

    if (type === 'create') {
      const createdInvestment = await API.create('/investments', investment);

      createInvestmentCard(createdInvestment);

      loadPortfolioTotal();
    } else if (type === 'update') {
      const updatedInvestment = await API.update(`/investments/${id}`, investment);

      updateInvestmentCard(updatedInvestment);
    }

    form.reset();

    document.querySelector('#offcanvas-close').click();
  };
}

function loadHandleCreateInvestment() {
  const button = document.querySelector('.btn.create-investment');

  button.onclick = () => {
    form.reset();

    bsOffcanvas.show();

    loadHandleFormSubmit('create');
  };
}

function loadHandleUpdateInvestment(id) {
  const iconPencil = document.querySelector(`#investment-${id} .icon-pencil`);

  iconPencil.onclick = async () => {
    const investment = await API.read(`/investments/${id}`);

    const { name, value, interest, createdAt, categoryId, broker } = investment;

    document.querySelector('form #name').value = name;

    document.querySelector('form #value').value = value / 100;

    document.querySelector('form #interest').value = interest;

    document.querySelector('form #categoryId').value = categoryId;

    document.querySelector('form #createdAt').value = formatDate(createdAt, 'ymd');

    document.querySelector('form #broker').value = broker.name;

    bsOffcanvas.show();

    loadHandleFormSubmit('update', id);
  };
}

function loadHandleConfirmModal(id) {
  const iconTrash = document.querySelector(`#investment-${id} .icon-trash`);

  iconTrash.onclick = () => {
    removedHostId = id;

    confirmModal.show();
  };
}

function loadHandleRemoveInvestment() {
  const confirmBtn = document.querySelector('.modal .btn-primary');

  confirmBtn.onclick = async () => {
    await API.remove(`/investments/${removedHostId}`);

    document.querySelector(`#investment-${removedHostId}`).remove();

    confirmModal.hide();

    loadPortfolioTotal();
  };
}

async function loadCategoriesSelect() {
  const select = document.querySelector('#categoryId');

  const categories = await API.read('/categories');

  for (const category of categories) {
    const option = `<option value="${category.id}">${category.name}</option>`;

    select.insertAdjacentHTML('beforeend', option);
  }
}

async function loadUser() {
  const user = await API.read('/users/me');

  document.querySelector('#user-name').innerText = user.name;

}

window.signout = Auth.signout;

document.querySelector('#offcanvas-close').onclick = () => bsOffcanvas.hide();

document.querySelectorAll('[data-dismiss="modal"]').forEach((button) => {
  button.onclick = () => confirmModal.hide();
});

async function loadPortfolioTotal() {
  const investments = await API.read('/investments');

  updatePortfolioTotal(investments);
}

function updatePortfolioTotal(investments) {
  const total = investments.reduce((sum, investment) => sum + investment.value, 0);

  document.querySelector('#portfolio-total').innerText = formatCurrency(total / 100);
}

if (Auth.isAuthenticated()) {
  loadInvestmentCards();

  loadHandleCreateInvestment();

  loadCategoriesSelect();

  loadHandleRemoveInvestment();

  loadUser();
}
