import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="card-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.3)"/>
      <stop offset="100%" stop-color="rgba(129, 140, 248, 0.1)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle Grid Pattern -->
  <g opacity="0.05" stroke="#ffffff" stroke-width="1">
    <path d="M0 78.75H1200 M0 157.5H1200 M0 236.25H1200 M0 315H1200 M0 393.75H1200 M0 472.5H1200 M0 551.25H1200" />
    <path d="M150 0V630 M300 0V630 M450 0V630 M600 0V630 M750 0V630 M900 0V630 M1050 0V630" />
  </g>

  <!-- Decorative Glow Effects -->
  <circle cx="150" cy="150" r="250" fill="#38bdf8" opacity="0.12" filter="blur(80px)" />
  <circle cx="1050" cy="480" r="250" fill="#818cf8" opacity="0.12" filter="blur(80px)" />

  <!-- Main Card Container -->
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="#0f172a" opacity="0.7" stroke="url(#card-border)" stroke-width="2"/>

  <!-- Header Badge / Logo -->
  <g transform="translate(120, 130)">
    <rect width="140" height="40" rx="20" fill="url(#brand)" opacity="0.15"/>
    <rect width="140" height="40" rx="20" fill="none" stroke="url(#brand)" stroke-width="1.5"/>
    <text x="70" y="25" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" text-anchor="middle">DevLab</text>
  </g>

  <!-- Main Title -->
  <text x="120" y="240" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">
    Portal de Disciplinas &amp; Guias
  </text>
  <text x="120" y="300" fill="url(#brand)" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">
    de Programação
  </text>

  <!-- Description -->
  <text x="120" y="365" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400">
    Aulas interativas, código executável, slides e mapas mentais em um só lugar.
  </text>

  <!-- Tech Pills -->
  <g transform="translate(120, 430)">
    <!-- Pill 1 -->
    <g transform="translate(0, 0)">
      <rect width="130" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="65" y="23" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle">JavaScript</text>
    </g>
    <!-- Pill 2 -->
    <g transform="translate(142, 0)">
      <rect width="130" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="65" y="23" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle">TypeScript</text>
    </g>
    <!-- Pill 3 -->
    <g transform="translate(284, 0)">
      <rect width="130" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="65" y="23" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle">Node &amp; Express</text>
    </g>
    <!-- Pill 4 -->
    <g transform="translate(426, 0)">
      <rect width="100" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="50" y="23" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle">Python</text>
    </g>
    <!-- Pill 5 -->
    <g transform="translate(538, 0)">
      <rect width="110" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="55" y="23" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle">Web APIs</text>
    </g>
  </g>

  <!-- URL Footer -->
  <text x="1020" y="520" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" text-anchor="end">
    luizchaves.github.io/devlab
  </text>
</svg>
`;

const outputPath = resolve(process.cwd(), 'public/og-image.png');

sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath)
  .then(() => console.log('✓ OpenGraph image generated successfully at public/og-image.png'))
  .catch((err) => {
    console.error('Error generating OpenGraph image:', err);
    process.exit(1);
  });
