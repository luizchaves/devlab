import Auth from './lib/auth.js';
import { subscribe } from './lib/events.js';
import { formatDateTime, formatLatency } from './lib/format.js';
import API from './services/api.js';

const hostId = new URLSearchParams(window.location.search).get('id');

/**
 * Converte as medicoes em um `d` de `<path>`: o tempo cresce da esquerda para
 * a direita e a latencia e invertida, porque no SVG o eixo Y cresce para baixo.
 */
function toPath(pings, width = 300, height = 80) {
  const points = [...pings].reverse();

  if (points.length < 2) return '';

  const max = Math.max(...points.map((ping) => ping.latency ?? 0), 1);

  const step = width / (points.length - 1);

  return points
    .map((ping, index) => {
      const y = height - ((ping.latency ?? 0) / max) * height;

      return `${index === 0 ? 'M' : 'L'} ${(index * step).toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function PingRow(ping) {
  const status = ping.success ? 'status-online' : 'status-offline';

  return `<tr>
    <td>${formatDateTime(ping.createdAt)}</td>
    <td><span class="status-dot ${status}"></span> ${ping.success ? 'sucesso' : 'falha'}</td>
    <td>${formatLatency(ping.latency)}</td>
  </tr>`;
}

function renderHost(host) {
  document.querySelector('#host-name').innerText = host.name;

  document.querySelector('#host-address').innerText = host.address;
}

function renderPings(pings) {
  const [last] = pings;

  const successes = pings.filter((ping) => ping.success);

  const latencies = successes.map((ping) => ping.latency).filter(Number.isFinite);

  const average = latencies.length
    ? Math.round(latencies.reduce((total, value) => total + value, 0) / latencies.length)
    : undefined;

  document.querySelector('#host-status').className = `status-dot ${
    last?.success ? 'status-online' : last ? 'status-offline' : 'status-unknown'
  }`;

  document.querySelector('#host-status-label').innerText = last?.success
    ? 'Online'
    : last
      ? 'Offline'
      : 'Sem medições';

  document.querySelector('#metric-last').innerText = formatLatency(last?.latency);

  document.querySelector('#metric-average').innerText = formatLatency(average);

  document.querySelector('#metric-uptime').innerText = pings.length
    ? `${((successes.length / pings.length) * 100).toFixed(1)}%`
    : '—';

  document.querySelector('#latency-line').setAttribute('d', toPath(successes));

  document.querySelector('#ping-rows').innerHTML = pings.map(PingRow).join('');
}

async function loadHost() {
  if (!hostId) return;

  const host = await API.read(`/hosts/${hostId}`);

  renderHost(host);

  renderPings(await API.read(`/hosts/${hostId}/pings`));
}

/**
 * O agendador mede sozinho a cada minuto; este botao antecipa uma rodada para
 * o host aberto na tela.
 */
function loadHandleCheckNow() {
  const button = document.querySelector('#check-now');

  button.onclick = async () => {
    button.disabled = true;

    await API.create(`/hosts/${hostId}/pings`);

    await loadHost();

    button.disabled = false;
  };
}

/** Na tela de um host so, a medicao dele recarrega o historico. */
function loadLiveUpdates() {
  subscribe((event) => {
    if (event.hostId === hostId) loadHost();
  }).catch((error) => console.error('Fluxo interrompido', error));
}

function loadHandleSignout() {
  document.querySelector('#signout').onclick = () => Auth.signout();
}

if (Auth.isAuthenticated()) {
  loadHost();

  loadHandleCheckNow();

  loadHandleSignout();

  loadLiveUpdates();
}
