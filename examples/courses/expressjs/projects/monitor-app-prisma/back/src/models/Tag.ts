import prisma from '@/database/database.ts';
import type { Tag, TagInput } from '@/types/Tag.d.ts';

async function create({ name, color }: TagInput): Promise<Tag> {
  if (!name || !color) {
    throw new Error('Unable to create tag');
  }

  return await prisma.tag.create({ data: { name, color } });
}

async function read(where?: { name?: string }): Promise<Tag[]> {
  const filters = where?.name ? { name: { contains: where.name } } : {};

  return await prisma.tag.findMany({ where: filters, orderBy: { name: 'asc' } });
}

async function readById(id: string): Promise<Tag> {
  const tag = await prisma.tag.findUnique({ where: { id } });

  if (!tag) {
    throw new Error('Tag not found');
  }

  return tag;
}

export default { create, read, readById };
