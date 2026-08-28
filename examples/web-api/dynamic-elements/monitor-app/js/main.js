import { HostTable } from './components/HostTable.js';
import { hosts } from './data.js';

const hostsCard = document.querySelector('.table-hosts .card-body');

hostsCard.innerHTML = HostTable(hosts);
