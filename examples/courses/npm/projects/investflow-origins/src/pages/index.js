import { formatBRL } from '../lib/portfolio.js';
import { initTheme } from '../lib/theme.js';
import { getSession } from '../services/auth.js';

initTheme();

// #region session
// 1. Verificação de sessão para links da landing page
async function checkAuth() {
  // O SDK devolve { data: { session } }: a sessao esta um nivel abaixo de data.
  const {
    data: { session },
  } = await getSession();
  if (session?.user) {
    const brandLinks = document.querySelectorAll('[data-brand-link]');
    for (const link of brandLinks) {
      link.href = '/dashboard';
    }

    const authActions = document.querySelector('[data-auth-actions]');
    if (authActions) {
      authActions.innerHTML = `
        <a href="/dashboard" class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition">Ir para a Carteira</a>
      `;
    }

    const heroCtas = document.querySelectorAll('[data-hero-cta]');
    for (const cta of heroCtas) {
      cta.textContent = 'Acessar Carteira';
      cta.href = '/dashboard';
    }
  }
}

// #endregion

// 2. Simulador Interativo de Juros Compostos em tempo real
function setupSimulator() {
  const inputInitial = document.getElementById('sim-initial');
  const inputMonthly = document.getElementById('sim-monthly');
  const inputRate = document.getElementById('sim-rate');
  const inputYears = document.getElementById('sim-years');

  const elTotal = document.getElementById('sim-result-total');
  const elInvested = document.getElementById('sim-result-invested');
  const elInterest = document.getElementById('sim-result-interest');
  const elBarInvested = document.getElementById('sim-bar-invested');
  const elBarInterest = document.getElementById('sim-bar-interest');
  const elMultiplier = document.getElementById('sim-result-multiplier');

  if (!inputInitial || !inputMonthly || !inputRate || !inputYears) return;

  function calculate() {
    const initial = Math.max(0, Number(inputInitial.value) || 0);
    const monthly = Math.max(0, Number(inputMonthly.value) || 0);
    const annualRate = Math.max(0, Number(inputRate.value) || 0) / 100;
    const years = Math.max(1, Math.min(50, Number(inputYears.value) || 1));

    const totalMonths = Math.round(years * 12);
    // Taxa mensal equivalente
    const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

    let total = initial;
    for (let m = 1; m <= totalMonths; m++) {
      total = total * (1 + monthlyRate) + monthly;
    }

    const totalInvested = initial + monthly * totalMonths;
    const totalInterest = Math.max(0, total - totalInvested);

    if (elTotal) elTotal.textContent = formatBRL(total);
    if (elInvested) elInvested.textContent = formatBRL(totalInvested);
    if (elInterest) elInterest.textContent = formatBRL(totalInterest);

    if (elBarInvested && elBarInterest && total > 0) {
      const investedPct = (totalInvested / total) * 100;
      const interestPct = (totalInterest / total) * 100;
      elBarInvested.style.width = `${Math.max(2, Math.min(98, investedPct)).toFixed(1)}%`;
      elBarInterest.style.width = `${Math.max(2, Math.min(98, interestPct)).toFixed(1)}%`;
    }

    if (elMultiplier && totalInvested > 0) {
      const mult = (total / totalInvested).toFixed(1);
      elMultiplier.textContent = `${mult}x o valor investido`;
    }
  }

  inputInitial.addEventListener('input', calculate);
  inputMonthly.addEventListener('input', calculate);
  inputRate.addEventListener('input', calculate);
  inputYears.addEventListener('input', calculate);

  calculate();
}

await checkAuth();
setupSimulator();
