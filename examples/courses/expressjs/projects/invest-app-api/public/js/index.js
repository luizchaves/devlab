import { formatCurrency } from './lib/format.js';
import API from './services/api.js';

let removedHostId;

const offcanvas = document.querySelector('.offcanvas');
const modal = document.querySelector('.modal');

// O painel lateral e o dialogo sao dois elementos com o utilitario `hidden`
// alternado por estes dois objetos — nao ha biblioteca de componentes no
// projeto, e o Tailwind faz o resto.
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
        <span class="investment-name block text-xl font-extrabold">${investment.name}</span>
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
    <div>
      <span class="text-sm font-bold">Valor</span>
      <div class="investment-value text-2xl font-extrabold">${formatCurrency(investment.value / 100)}</div>
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

function updateInvestmentCard({ id, name, value }) {
  document.querySelector(`#investment-${id} .investment-name`).innerText = name;

  document.querySelector(`#investment-${id} .investment-value`).innerText = formatCurrency(
    value / 100
  );
}

function loadHandleFormSubmit(type, id) {
  const form = document.querySelector('form');

  form.onsubmit = async (event) => {
    event.preventDefault();

    const investment = Object.fromEntries(new FormData(form));

    investment.value = Number(investment.value) * 100;

    if (type === 'create') {
      const createdInvestment = await API.create('/investments', investment);

      createInvestmentCard(createdInvestment);
    } else if (type === 'update') {
      const updatedInvestment = await API.update(`/investments/${id}`, investment);

      updateInvestmentCard(updatedInvestment);
    }

    form.reset();

    document.querySelector('#offcanvas-close').click();

    loadPortfolioTotal();
  };
}

function loadHandleCreateInvestment() {
  const button = document.querySelector('.btn.create-investment');

  button.onclick = () => {
    bsOffcanvas.show();

    loadHandleFormSubmit('create');
  };
}

function loadHandleUpdateInvestment(id) {
  const iconPencil = document.querySelector(`#investment-${id} .icon-pencil`);

  iconPencil.onclick = async () => {
    const investment = await API.read(`/investments/${id}`);

    const { name, value } = investment;

    document.querySelector('form #name').value = name;

    document.querySelector('form #value').value = value / 100;

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

loadInvestmentCards();

loadHandleCreateInvestment();

loadHandleRemoveInvestment();
