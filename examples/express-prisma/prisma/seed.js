import prisma from '../src/lib/prisma.js';

const seed = async () => {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { name: 'Ana', email: 'ana@example.com' },
      { name: 'Bruno', email: 'bruno@example.com' },
    ],
  });

  console.log('Banco populado com sucesso.');
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
