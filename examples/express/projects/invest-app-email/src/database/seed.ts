import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import prisma from '@/database/database.ts';
import User from '@/models/User.ts';

async function main() {
  const file = resolve('prisma', 'seeders.json');

  const seed = JSON.parse(readFileSync(file, 'utf-8')) as {
    categories: { name: string; color: string }[];
  };

  for (const category of seed.categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Usuario padrao para a etapa poder criar investimentos antes de existir
  // login. A partir da etapa 8 o dono vem do token.
  const existing = await prisma.user.findUnique({ where: { email: 'admin@email.com' } });

  if (!existing) {
    await User.create({ name: 'Admin', email: 'admin@email.com', password: 'admin123' });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
