import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import Investment from '@/models/Investment.ts';
import type { InvestmentInput } from '@/types/Investment.d.ts';

async function up() {
  const file = resolve('src', 'database', 'seeders.json');

  const seed = JSON.parse(readFileSync(file, 'utf-8')) as {
    investments: InvestmentInput[];
  };

  for (const investment of seed.investments) {
    await Investment.create(investment);
  }
}

export default { up };
