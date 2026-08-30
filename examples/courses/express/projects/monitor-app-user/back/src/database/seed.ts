import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import prisma from '@/database/database.ts';

interface Seed {
  tags: { name: string; color: string }[];
  hosts: { name: string; address: string; tags: string[] }[];
}

async function main() {
  const file = resolve('prisma', 'seeders.json');

  const seed = JSON.parse(readFileSync(file, 'utf-8')) as Seed;

  for (const tag of seed.tags) {
    await prisma.tag.upsert({ where: { name: tag.name }, update: {}, create: tag });
  }

  for (const { tags, ...host } of seed.hosts) {
    await prisma.host.create({
      data: {
        ...host,
        tags: { connect: tags.map((name) => ({ name })) },
        // Historico inicial: quatro medicoes espacadas de um minuto.
        pings: {
          create: Array.from({ length: 4 }, (_, index) => ({
            latency: 10 + index * 4,
            success: true,
            createdAt: new Date(Date.now() - index * 60_000),
          })),
        },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
