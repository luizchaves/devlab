import { InvestmentCard } from './components/InvestmentCard.js';
import { investments } from './data.js';

const investmentsGrid = document.querySelector('.investments');

investmentsGrid.innerHTML = investments.map((investment) => InvestmentCard(investment)).join('');
