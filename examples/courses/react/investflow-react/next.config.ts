import type { NextConfig } from 'next';

// #region headers
/** Cabeçalhos de segurança da publicação (RF22), como o `vercel.json` da versão vanilla. */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  // O monorepo do DevLab tem outro lockfile acima; o Turbopack parte daqui.
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
// #endregion

export default nextConfig;
