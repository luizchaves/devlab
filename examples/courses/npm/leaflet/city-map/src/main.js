import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

const joaoPessoa = [-7.1195, -34.845];
const route = [
  [-7.1154, -34.8641],
  [-7.1212, -34.8524],
  [-7.1195, -34.845],
  [-7.1135, -34.8369],
];

const map = L.map('map').setView(joaoPessoa, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

L.marker(joaoPessoa)
  .addTo(map)
  .bindPopup('Centro de João Pessoa: ponto central do roteiro.')
  .openPopup();

L.polyline(route, {
  color: '#2563eb',
  weight: 5,
  opacity: 0.85,
}).addTo(map);

map.fitBounds(route, { padding: [32, 32] });
