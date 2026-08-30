import { randomUUID } from 'node:crypto';

import Database from '@/database/database.ts';
import type { Investment, InvestmentInput } from '@/types/Investment.d.ts';

function mapRow(row: Record<string, unknown>): Investment {
  return {
    id: row.id as string,
    name: row.name as string,
    value: row.value as number,
  };
}

async function create({ name, value }: InvestmentInput): Promise<Investment> {
  if (!name || !value) {
    throw new Error('Unable to create investment');
  }

  const db = await Database.connect();

  const id = randomUUID();

  const sql = `
    INSERT INTO
      investments (id, name, value)
    VALUES
      (?, ?, ?)
  `;

  await db.run(sql, [id, name, value]);

  return await readById(id);
}

async function read(field?: 'name', value?: string): Promise<Investment[]> {
  const db = await Database.connect();

  if (field && value) {
    const sql = `
      SELECT id, name, value
      FROM investments
      WHERE ${field} LIKE ?
    `;

    const rows = await db.all(sql, [`%${value}%`]);

    return rows.map(mapRow);
  }

  const rows = await db.all('SELECT id, name, value FROM investments');

  return rows.map(mapRow);
}

async function readById(id: string): Promise<Investment> {
  const db = await Database.connect();

  const sql = `
    SELECT id, name, value
    FROM investments
    WHERE id = ?
  `;

  const row = await db.get(sql, [id]);

  if (!row) {
    throw new Error('Investment not found');
  }

  return mapRow(row);
}

async function update({ id, name, value }: InvestmentInput & { id?: string }): Promise<Investment> {
  if (!id || !name || !value) {
    throw new Error('Unable to update investment');
  }

  const db = await Database.connect();

  const sql = `
    UPDATE investments
    SET name = ?, value = ?
    WHERE id = ?
  `;

  const { changes } = await db.run(sql, [name, value, id]);

  if (changes !== 1) {
    throw new Error('Investment not found');
  }

  return await readById(id);
}

async function remove(id: string): Promise<boolean> {
  const db = await Database.connect();

  const { changes } = await db.run('DELETE FROM investments WHERE id = ?', [id]);

  if (changes !== 1) {
    throw new Error('Investment not found');
  }

  return true;
}

export default { create, read, readById, update, remove };
