import { randomUUID } from 'node:crypto';

import { hosts } from '@/data/hosts.ts';
import type { Host, HostInput } from '@/types/Host.d.ts';

async function create({ name, address }: HostInput): Promise<Host> {
  if (!name || !address) {
    throw new Error('Unable to create host');
  }

  const newHost: Host = { id: randomUUID(), name, address };

  hosts.push(newHost);

  return newHost;
}

async function read(field?: keyof Host, value?: string): Promise<Host[]> {
  if (field && value) {
    return hosts.filter((host) => String(host[field]).includes(value));
  }

  return hosts;
}

async function readById(id: string): Promise<Host> {
  const host = hosts.find((item) => item.id === id);

  if (!host) {
    throw new Error('Host not found');
  }

  return host;
}

async function update({ id, name, address }: HostInput & { id?: string }): Promise<Host> {
  if (!id || !name || !address) {
    throw new Error('Unable to update host');
  }

  const index = hosts.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Host not found');
  }

  const updatedHost: Host = { id, name, address };

  hosts[index] = updatedHost;

  return updatedHost;
}

async function remove(id: string): Promise<boolean> {
  const index = hosts.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Host not found');
  }

  hosts.splice(index, 1);

  return true;
}

export default { create, read, readById, update, remove };
