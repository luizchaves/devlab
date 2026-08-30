import { randomUUID } from 'node:crypto';

import Database from '@/database/database.ts';
import type { Host, HostInput } from '@/types/Host.d.ts';

function mapRow(row: Record<string, unknown>): Host {
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
  };
}

async function create({ name, address }: HostInput): Promise<Host> {
  if (!name || !address) {
    throw new Error('Unable to create host');
  }

  const db = await Database.connect();

  const id = randomUUID();

  const sql = `
    INSERT INTO
      hosts (id, name, address)
    VALUES
      (?, ?, ?)
  `;

  // Os valores viajam separados do SQL: e o `?` que impede a injecao.
  await db.run(sql, [id, name, address]);

  return await readById(id);
}

async function read(field?: 'name', value?: string): Promise<Host[]> {
  const db = await Database.connect();

  if (field && value) {
    const sql = `
      SELECT id, name, address
      FROM hosts
      WHERE ${field} LIKE ?
    `;

    const rows = await db.all(sql, [`%${value}%`]);

    return rows.map(mapRow);
  }

  const rows = await db.all('SELECT id, name, address FROM hosts');

  return rows.map(mapRow);
}

async function readById(id: string): Promise<Host> {
  const db = await Database.connect();

  const sql = `
    SELECT id, name, address
    FROM hosts
    WHERE id = ?
  `;

  const row = await db.get(sql, [id]);

  if (!row) {
    throw new Error('Host not found');
  }

  return mapRow(row);
}

async function update({ id, name, address }: HostInput & { id?: string }): Promise<Host> {
  if (!id || !name || !address) {
    throw new Error('Unable to update host');
  }

  const db = await Database.connect();

  const sql = `
    UPDATE hosts
    SET name = ?, address = ?
    WHERE id = ?
  `;

  const { changes } = await db.run(sql, [name, address, id]);

  if (changes !== 1) {
    throw new Error('Host not found');
  }

  return await readById(id);
}

async function remove(id: string): Promise<boolean> {
  const db = await Database.connect();

  const { changes } = await db.run('DELETE FROM hosts WHERE id = ?', [id]);

  if (changes !== 1) {
    throw new Error('Host not found');
  }

  return true;
}

export default { create, read, readById, update, remove };
