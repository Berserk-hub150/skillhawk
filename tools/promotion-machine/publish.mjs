#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const stateDir = path.join(root, '.local');
const target = process.argv[2];
const flags = new Set(process.argv.slice(3));
const confirm = process.argv.slice(3).find(x => x.startsWith('--confirm='))?.slice('--confirm='.length);

function die(message) {
  console.error(message);
  process.exit(1);
}

if (!target || !/^[^/]+\/[^/]+$/.test(target)) {
  die('Usage: node publish.mjs OWNER/REPO --confirm=OWNER/REPO --reviewed-guidelines --reviewed-patch');
}
if (confirm !== target) die('Refusing: --confirm must exactly match OWNER/REPO.');
if (!flags.has('--reviewed-guidelines')) die('Refusing: pass --reviewed-guidelines after checking contribution rules.');
if (!flags.has('--reviewed-patch')) die('Refusing: pass --reviewed-patch after checking the proposed README change.');

function run(bin, args, options = {}) {
  return execFileSync(bin, args, { encoding: 'utf8', stdio: options.quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit', cwd: options.cwd, ...options.extra });
}
function ghJson(args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
}

const safeName = target.replace('/', '__');
const prepared = path.join(stateDir, 'prepared', safeName);
const manifestPath = path.join(prepared, 'manifest.json');
if (!fs.existsSync(manifestPath)) die(`Nothing prepared for ${target}. Run prepare.mjs first.`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const historyPath = path.join(stateDir, 'history.json');
const history = fs.existsSync(historyPath) ? JSON.parse(fs.readFileSync(historyPath, 'utf8')) : [];
if (history.some(x => x.target.toLowerCase() === target.toLowerCase())) die('Refusing: this repository already exists in local outreach history.');

const configPath = fs.existsSync(path.join(root, 'config.json')) ? path.join(root, 'config.json') : path.join(root, 'config.example.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const cutoff = Date.now() - 24 * 60 * 60 * 1000;
const recent = history.filter(x => new Date(x.publishedAt).getTime() >= cutoff);
if (recent.length >= (config.maxApprovedPerBatch || 8)) {
  die(`Refusing: local 24h publication cap (${config.maxApprovedPerBatch || 8}) reached.`);
}

const freshReadme = ghJson(['api', '-X', 'GET', `repos/${target}/readme`]);
if (freshReadme.sha !== manifest.readmeSha) {
  die('Refusing: target README changed since preparation. Re-run discover/prepare and review again.');
}

const login = ghJson(['api', 'user']).login;
const [, repoName] = target.split('/');

try {
  execFileSync('gh', ['repo', 'fork', target, '--clone=false'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (error) {
  const msg = `${error.stdout || ''}\n${error.stderr || ''}`;
  if (!/already exists|already forked|exists in/i.test(msg)) throw error;
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'skillhawk-outreach-'));
const work = path.join(temp, repoName);
try {
  run('git', ['clone', `https://github.com/${login}/${repoName}.git`, work]);
  run('git', ['remote', 'add', 'upstream', `https://github.com/${target}.git`], { cwd: work });
  run('git', ['fetch', 'upstream', manifest.defaultBranch], { cwd: work });

  const branch = `skillhawk/outreach-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${target.split('/')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
  run('git', ['checkout', '-B', branch, `upstream/${manifest.defaultBranch}`], { cwd: work });

  const proposed = fs.readFileSync(path.join(prepared, 'README.proposed.md'), 'utf8');
  fs.writeFileSync(path.join(work, manifest.readmePath), proposed);

  run('git', ['diff', '--check'], { cwd: work });
  const diff = execFileSync('git', ['diff', '--', manifest.readmePath], { cwd: work, encoding: 'utf8' });
  if (!diff.trim()) die('No diff produced; refusing to publish.');
  console.log('\nFinal diff:\n');
  console.log(diff);

  run('git', ['add', manifest.readmePath], { cwd: work });
  run('git', ['commit', '-m', 'docs: add SkillHawk security tool'], { cwd: work });
  run('git', ['push', '-u', 'origin', branch], { cwd: work });

  const bodyFile = path.join(prepared, 'PR.md');
  const prUrl = execFileSync('gh', [
    'pr', 'create',
    '--repo', target,
    '--head', `${login}:${branch}`,
    '--base', manifest.defaultBranch,
    '--title', manifest.title,
    '--body-file', bodyFile
  ], { encoding: 'utf8', cwd: work, stdio: ['ignore', 'pipe', 'pipe'] }).trim();

  history.push({ target, publishedAt: new Date().toISOString(), prUrl, branch, score: manifest.score });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  console.log(`\nOpened one reviewed PR: ${prUrl}`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
