import prisma from '@/database/database.ts';
import type { Image } from '@/types/Image.d.ts';

/**
 * O banco guarda o caminho, nao o binario. O arquivo vive em
 * `public/imgs/profile/`, servido por `express.static`.
 */
async function create({ userId, path }: { userId: string; path: string }): Promise<Image> {
  return await prisma.image.create({
    data: { path, user: { connect: { id: userId } } },
  });
}

// `userId` e `@unique` no schema: cada usuario tem no maximo um avatar, e por
// isso da para atualizar pelo dono, sem saber o id da imagem.
async function update({ userId, path }: { userId: string; path: string }): Promise<Image> {
  return await prisma.image.update({ where: { userId }, data: { path } });
}

export default { create, update };
