// Netlify Functions v2: mesmo contrato de Request e Response, com a rota declarada
// em uma configuração exportada ao lado da função.
export { default } from '../../handler.js';

export const config = { path: '/api/quote' };
