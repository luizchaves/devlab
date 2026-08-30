import 'bootstrap';
import { InvestmentCard } from './components/InvestmentCard';
import { investments } from './data';

import 'bootstrap/dist/css/bootstrap.css';

const investmentsGrid = document.querySelector('.investments');

investmentsGrid.innerHTML = investments.map((investment) => InvestmentCard(investment)).join('');
