#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const configPath = process.argv[2] || path.join(root, 'config.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : path.join(root, 'config.example.json'), 'utf8'));
const stateDir = path.join(root, '.local');
fs.mkdirSync(stateDir, { recursive: true });

function ghJson(args) {
  const out = execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(out);
}

function api(endpoint, fields = {}) {
  const args = ['api', '-X', 'GET', endpoint];
  for (const [key, value] of Object.entries(fields)) args.push('-f', `${key}=${value}`);
  return ghJson(args);
}

function lower(value) { return String(value || '').toLowerCase(); }

function scoreRepo(repo, readme) {
  const text = `${repo.name} ${repo.description || ''} ${repo.topics?.join(' ') || ''} ${readme}`.toLowerCase();
  if (repo.archived || repo.disabled) return { score: -999, reasons: ['archived/disabled'] };
  if (text.includes('berserk-hub150/skillhawk') || text.includes('skillhawk')) return { score: -999, reasons: ['SkillHawk already present'] };

  let score = 0;
  const reasons = [];
  const add = (points, reason) => { score += points; reasons.push(`${points > 0 ? '+' : ''}${points} ${reason}`); };

  if (/agent skills?|skill\.md/.test(text)) add(35, 'Agent Skills / SKILL.md focus');
  if (/mcp security|model context protocol.{0,30}security|security.{0,30}model context protocol/.test(text)) add(30, 'MCP security focus');
  if (/agent(ic)? security|ai agent security/.test(text)) add(25, 'AI-agent security focus');
  if (/prompt injection/.test(text)) add(15, 'prompt-injection relevance');
  if (/supply[- ]chain security/.test(text)) add(15, 'supply-chain security relevance');
  if (/tools( and| &)? frameworks|tools and code|security tools|resources/.test(text)) add(10, 'existing tools/resources section');
  if (/contribut(ing|ions?)|pull request|submit/.test(text)) add(10, 'contribution path visible');
  if (/awesome/.test(text)) add(5, 'curated awesome/resource list');

  const pushed = new Date(repo.pushed_at || 0).getTime();
  const days = (Date.now() - pushed) / 86400000;
  if (days <= 90) add(10, 'active in last 90 days');
  else if (days > 365) add(-15, 'inactive for over one year');

  for (const signal of config.rejectSignals || []) {
    if (text.includes(lower(signal))) add(-30, `reject signal: ${signal}`);
  }

  return { score, reasons };
}

function getReadme(fullName) {
  try {
    const data = api(`repos/${fullName}/readme`);
    if (!data.content) return '';
    return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8').slice(0, 120000);
  } catch {
    return '';
  }
}

const seen = new Map();
for (const query of config.queries) {
  process.stderr.write(`Searching: ${query}\n`);
  let result;
  try {
    result = api('search/repositories', { q: `${query} in:name,description,readme fork:false archived:false`, sort: 'updated', order: 'desc', per_page: 30 });
  } catch (error) {
    process.stderr.write(`Search failed: ${query}\n`);
    continue;
  }
  for (const repo of result.items || []) {
    if (repo.full_name === config.repo || seen.has(repo.full_name)) continue;
    seen.set(repo.full_name, repo);
  }
}

const candidates = [];
for (const repo of seen.values()) {
  const readme = getReadme(repo.full_name);
  const scored = scoreRepo(repo, readme);
  if (scored.score < config.minScore) continue;
  candidates.push({
    repo: repo.full_name,
    url: repo.html_url,
    score: scored.score,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    pushedAt: repo.pushed_at,
    description: repo.description,
    defaultBranch: repo.default_branch,
    reasons: scored.reasons
  });
}

candidates.sort((a, b) => b.score - a.score || b.stars - a.stars);
const trimmed = candidates.slice(0, config.maxCandidatesPerRun || 30);
const outPath = path.join(stateDir, 'candidates.json');
fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), candidates: trimmed }, null, 2));

console.log(`\nFound ${trimmed.length} candidates at or above ${config.minScore}/100.`);
console.log(`Saved: ${outPath}\n`);
for (const c of trimmed) {
  console.log(`${String(c.score).padStart(3)}  ★${String(c.stars).padEnd(7)} ${c.repo}`);
  console.log(`     ${c.reasons.join(' | ')}`);
}
