import prisma from '@/database/database.ts';
import type { Category } from '@/types/Category.d.ts';

async function read(where?: { name?: string }): Promise<Category[]> {
  const filters = where?.name ? { name: { contains: where.name } } : {};

  return await prisma.category.findMany({ where: filters });
}

async function readById(id: string): Promise<Category> {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
}

export default { read, readById };
