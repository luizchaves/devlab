// Cloudflare Workers: o módulo exporta um objeto com o método fetch, e o ambiente
// chega como segundo argumento em vez de process.env.
import handler from './handler.js';

export default {
  async fetch(request, env) {
    globalThis.process = { env };

    return handler(request);
  },
};
