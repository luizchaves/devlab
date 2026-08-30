import { formatLatency, latencyRatio } from './lib/format.js';
import API from './services/api.js';

const grid = document.querySelector('#host-grid');

const form = document.querySelector('#host-form');

function HostCard({ id, name, address, latency }) {
  const status = typeof latency === 'number' ? 'status-online' : 'status-offline';

  return `<article class="card host-card p-6" id="host-${id}">
    <div class="flex items-center justify-between gap-2">
      <div>
        <h2 class="font-semibold text-slate-900 host-name">${name}</h2>
        <p class="text-sm text-slate-500 host-address">${address}</p>
      </div>
      <span class="status-dot ${status}"></span>
    </div>
    <div>
      <div class="flex items-center justify-between text-xs text-slate-500">
        <span>Última latência</span>
        <span class="font-semibold text-slate-900 host-latency">${formatLatency(latency)}</span>
      </div>
      <div class="mt-2 latency-bar" style="--latency: ${latencyRatio(latency)}"></div>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-soft host-remove" type="button">Remover</button>
    </div>
  </article>`;
}

function createHostCard(host) {
  grid.insertAdjacentHTML('beforeend', HostCard(host));

  loadHandleRemoveHost(host.id);
}

function updateMetrics(hosts) {
  const latencies = hosts.map((host) => host.latency).filter((value) => typeof value === 'number');

  const average = latencies.length
    ? Math.round(latencies.reduce((total, value) => total + value, 0) / latencies.length)
    : undefined;

  document.querySelector('#metric-total').innerText = hosts.length;

  document.querySelector('#metric-online').innerText = `${latencies.length} de ${hosts.length}`;

  document.querySelector('#metric-latency').innerText = formatLatency(average);
}

async function loadHostCards() {
  const hosts = await API.read('/hosts');

  grid.innerHTML = '';

  for (const host of hosts) {
    createHostCard(host);
  }

  updateMetrics(hosts);
}

function loadHandleCreateHost() {
  form.onsubmit = async (event) => {
    event.preventDefault();

    const host = Object.fromEntries(new FormData(form));

    await API.create('/hosts', { name: host.name, address: host.address });

    form.reset();

    await loadHostCards();
  };
}

function loadHandleRemoveHost(id) {
  const button = document.querySelector(`#host-${id} .host-remove`);

  button.onclick = async () => {
    await API.remove(`/hosts/${id}`);

    await loadHostCards();
  };
}

loadHostCards();

loadHandleCreateHost();
