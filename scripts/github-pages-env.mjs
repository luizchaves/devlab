#!/usr/bin/env node
/**
 * Imprime as variaveis de publicacao no formato aceito por `$GITHUB_ENV`, para
 * que todos os steps do workflow usem o mesmo ambiente.
 */
import { BASE_PATH, REPO_BRANCH, REPO_URL, SITE_URL } from '../site.config.mjs';

const values = {
  SITE_URL,
  BASE_PATH,
  REPO_URL,
  REPO_BRANCH,
};

for (const [key, value] of Object.entries(values)) {
  if (value) console.log(`${key}=${value}`);
}
