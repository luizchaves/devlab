import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import Host from '@/models/Host.ts';
import type { HostInput } from '@/types/Host.d.ts';

async function up() {
  const file = resolve('src', 'database', 'seeders.json');

  const seed = JSON.parse(readFileSync(file, 'utf-8')) as { hosts: HostInput[] };

  for (const host of seed.hosts) {
    await Host.create(host);
  }
}

export default { up };
