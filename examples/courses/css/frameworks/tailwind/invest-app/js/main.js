import { InvestmentCard } from './components/InvestmentCard';
import { investments } from './data';

import '../css/style.css';

const investmentsGrid = document.querySelector('.investments');

investmentsGrid.innerHTML = investments.map((investment) => InvestmentCard(investment)).join('');
