import Auth from './lib/auth.js';
import { formatLatency, latencyRatio } from './lib/format.js';
import API from './services/api.js';

const grid = document.querySelector('#host-grid');

const form = document.querySelector('#host-form');

const tagFilter = document.querySelector('#tag-filter');

/** O host guarda o historico; a medicao mais recente e a primeira da lista. */
function lastPing(host) {
  return host.pings?.[0];
}

function Tag({ name, color }) {
  return `<span class="tag" style="--tag-color: ${color}">${name}</span>`;
}

function HostCard(host) {
  const { id, name, address, tags = [] } = host;

  const ping = lastPing(host);

  const status = ping?.success ? 'status-online' : ping ? 'status-offline' : 'status-unknown';

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
        <span class="font-semibold text-slate-900 host-latency">${formatLatency(ping?.latency)}</span>
      </div>
      <div class="mt-2 latency-bar" style="--latency: ${latencyRatio(ping?.latency)}"></div>
    </div>
    <div class="flex gap-2">${tags.map(Tag).join('')}</div>
    <div class="flex gap-2">
      <a class="btn btn-soft" href="host.html?id=${id}">Histórico</a>
      <button class="btn btn-soft host-remove" type="button">Remover</button>
    </div>
  </article>`;
}

function createHostCard(host) {
  grid.insertAdjacentHTML('beforeend', HostCard(host));

  loadHandleRemoveHost(host.id);
}

function updateMetrics(hosts) {
  const latencies = hosts
    .map((host) => lastPing(host)?.latency)
    .filter((value) => typeof value === 'number');

  const average = latencies.length
    ? Math.round(latencies.reduce((total, value) => total + value, 0) / latencies.length)
    : undefined;

  document.querySelector('#metric-total').innerText = hosts.length;

  document.querySelector('#metric-online').innerText = `${latencies.length} de ${hosts.length}`;

  document.querySelector('#metric-latency').innerText = formatLatency(average);
}

async function loadHostCards() {
  const tag = tagFilter.value.trim();

  const hosts = await API.read(`/hosts${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`);

  grid.innerHTML = '';

  for (const host of hosts) {
    createHostCard(host);
  }

  updateMetrics(hosts);
}

function loadHandleCreateHost() {
  form.onsubmit = async (event) => {
    event.preventDefault();

    const { name, address, tags } = Object.fromEntries(new FormData(form));

    await API.create('/hosts', {
      name,
      address,
      // O campo e um texto separado por virgula; a API espera uma lista.
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

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

function loadHandleTagFilter() {
  tagFilter.oninput = () => loadHostCards();
}

function loadHandleSignout() {
  document.querySelector('#signout').onclick = () => Auth.signout();
}

// Sem token nao ha o que carregar: `isAuthenticated` redireciona para o login.
if (Auth.isAuthenticated()) {
  loadHostCards();

  loadHandleCreateHost();

  loadHandleTagFilter();

  loadHandleSignout();
}
