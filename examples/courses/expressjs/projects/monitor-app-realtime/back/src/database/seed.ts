import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import prisma from '@/database/database.ts';
import { hashPassword } from '@/utils/password.ts';

interface Seed {
  user: { name: string; email: string; password: string };
  tags: { name: string; color: string }[];
  hosts: { name: string; address: string; tags: string[] }[];
}

async function main() {
  const file = resolve('prisma', 'seeders.json');

  const seed = JSON.parse(readFileSync(file, 'utf-8')) as Seed;

  // Todo host precisa de um dono; o seed cria a conta de demonstracao.
  const user = await prisma.user.upsert({
    where: { email: seed.user.email },
    update: {},
    create: { ...seed.user, password: hashPassword(seed.user.password) },
  });

  for (const tag of seed.tags) {
    await prisma.tag.upsert({ where: { name: tag.name }, update: {}, create: tag });
  }

  for (const { tags, ...host } of seed.hosts) {
    await prisma.host.create({
      data: {
        ...host,
        userId: user.id,
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
