import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const pageRoutes = [
  'signin',
  'signup',
  'dashboard',
  'analytics',
  'movements',
  'dividends',
  'origins',
  'asset',
  'admin',
  'profile',
];

function cleanUrlsPlugin() {
  const rewrite = (req, _res, next) => {
    if (!req.url) return next();
    const [pathname, search] = req.url.split('?');
    const query = search ? `?${search}` : '';

    if (pathname === '/' || pathname === '/index' || pathname === '/index.html') {
      req.url = `/pages/index.html${query}`;
      return next();
    }

    const clean = pathname
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    if (clean === 'index') {
      req.url = `/pages/index.html${query}`;
      return next();
    }
    if (pageRoutes.includes(clean)) {
      req.url = `/pages/${clean}.html${query}`;
      return next();
    }
    if (pathname.startsWith('/pages/')) {
      return next();
    }
    next();
  };

  return {
    name: 'clean-urls-plugin',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

// Aplicacao multipagina: cada HTML em pages/ e uma entrada do build.
export default defineConfig({
  plugins: [tailwindcss(), cleanUrlsPlugin()],
  build: {
    // O modulo das paginas privadas usa `await` no topo (ES2022).
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'pages/index.html'),
        signin: resolve(import.meta.dirname, 'pages/signin.html'),
        signup: resolve(import.meta.dirname, 'pages/signup.html'),
        dashboard: resolve(import.meta.dirname, 'pages/dashboard.html'),
        analytics: resolve(import.meta.dirname, 'pages/analytics.html'),
        movements: resolve(import.meta.dirname, 'pages/movements.html'),
        dividends: resolve(import.meta.dirname, 'pages/dividends.html'),
        admin: resolve(import.meta.dirname, 'pages/admin.html'),
        asset: resolve(import.meta.dirname, 'pages/asset.html'),
        origins: resolve(import.meta.dirname, 'pages/origins.html'),
        profile: resolve(import.meta.dirname, 'pages/profile.html'),
      },
    },
  },
});
