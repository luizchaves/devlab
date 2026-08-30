import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import prisma from '@/database/database.ts';

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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
