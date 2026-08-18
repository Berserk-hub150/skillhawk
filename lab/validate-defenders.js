import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(here, 'defenders.json');

function fail(message) {
  console.error(`Defender registry validation failed: ${message}`);
  process.exitCode = 1;
}

async function main() {
  const data = JSON.parse(await fs.readFile(file, 'utf8'));
  if (!data || !Array.isArray(data.defenders)) {
    fail('Expected an object with a defenders array.');
    return;
  }

  const seen = new Set();
  for (const [index, entry] of data.defenders.entries()) {
    const prefix = `defenders[${index}]`;
    if (!entry || typeof entry !== 'object') {
      fail(`${prefix} must be an object.`);
      return;
    }

    const username = String(entry.username || '');
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username)) {
      fail(`${prefix}.username is not a valid GitHub username.`);
      return;
    }

    const key = username.toLowerCase();
    if (seen.has(key)) {
      fail(`Duplicate defender username: ${username}`);
      return;
    }
    seen.add(key);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.completed || ''))) {
      fail(`${prefix}.completed must use YYYY-MM-DD.`);
      return;
    }

    const expectedPrefix = `https://github.com/${username}/skillhawk/actions/runs/`;
    if (!String(entry.evidence || '').startsWith(expectedPrefix)) {
      fail(`${prefix}.evidence must link to a successful SkillHawk fork workflow run under ${expectedPrefix}`);
      return;
    }
  }

  console.log(`Defender registry: OK (${data.defenders.length} entries)`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
