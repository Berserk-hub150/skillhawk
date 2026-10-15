#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const stateDir = path.join(root, '.local');
const target = process.argv[2];

if (!target || !/^[^/]+\/[^/]+$/.test(target)) {
  console.error('Usage: node prepare.mjs OWNER/REPO');
  process.exit(1);
}

function ghJson(args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
}

function api(endpoint) {
  return ghJson(['api', '-X', 'GET', endpoint]);
}

function decodeContent(data) {
  return Buffer.from((data.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
}

function fetchOptional(fullName, paths) {
  for (const candidate of paths) {
    try {
      const data = api(`repos/${fullName}/contents/${candidate}`);
      if (data?.content) return { path: candidate, text: decodeContent(data) };
    } catch {}
  }
  return null;
}

function insertEntry(readme, entry) {
  const preferred = [
    /^(##+\s+.*tools\s*(?:&|and)\s*frameworks.*)$/im,
    /^(##+\s+.*tools\s+and\s+code.*)$/im,
    /^(##+\s+.*security\s+tools.*)$/im,
    /^(##+\s+.*tools.*)$/im,
    /^(##+\s+.*other\s+useful\s+resources.*)$/im,
    /^(##+\s+.*resources.*)$/im
  ];

  for (const pattern of preferred) {
    const match = readme.match(pattern);
    if (!match || match.index == null) continue;
    const headingStart = match.index;
    const headingEnd = headingStart + match[0].length;
    const level = (match[0].match(/^#+/) || ['##'])[0].length;
    const after = readme.slice(headingEnd);
    const nextHeading = new RegExp(`\\n#{1,${level}}\\s+`, 'm').exec(after);
    const sectionEnd = nextHeading ? headingEnd + nextHeading.index : readme.length;
    const beforeSectionEnd = readme.slice(0, sectionEnd).replace(/\s*$/, '');
    const rest = readme.slice(sectionEnd);
    return {
      text: `${beforeSectionEnd}\n${entry}\n\n${rest.replace(/^\n*/, '')}`,
      section: match[0].trim()
    };
  }

  return null;
}

fs.mkdirSync(stateDir, { recursive: true });
const candidatesFile = path.join(stateDir, 'candidates.json');
let candidate = null;
if (fs.existsSync(candidatesFile)) {
  const data = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));
  candidate = (data.candidates || []).find(c => c.repo.toLowerCase() === target.toLowerCase()) || null;
}

const repo = api(`repos/${target}`);
if (repo.archived || repo.disabled) throw new Error('Refusing archived/disabled repository.');

const readmeData = api(`repos/${target}/readme`);
const originalReadme = decodeContent(readmeData);
if (/skillhawk|berserk-hub150\/skillhawk/i.test(originalReadme)) {
  throw new Error('SkillHawk is already present in the README.');
}

const guidelines = fetchOptional(target, [
  'CONTRIBUTING.md',
  'CONTRIBUTING.MD',
  '.github/CONTRIBUTING.md',
  'docs/CONTRIBUTING.md'
]);

const entry = '- **[SkillHawk](https://github.com/Berserk-hub150/skillhawk)** — Open-source static security scanner and hands-on lab for AI Agent Skills, `SKILL.md`, and MCP configurations; detects risky shell, credential, privilege-escalation, exfiltration, and prompt-injection patterns without executing the target.';
const insertion = insertEntry(originalReadme, entry);

if (!insertion) {
  throw new Error('No clearly relevant tools/resources section found. Review manually instead of forcing an insertion.');
}

const safeName = target.replace('/', '__');
const outDir = path.join(stateDir, 'prepared', safeName);
fs.mkdirSync(outDir, { recursive: true });

const title = 'Add SkillHawk to agent security tools';
const body = `Thanks for maintaining this collection of security resources.\n\nI'd like to suggest [SkillHawk](https://github.com/Berserk-hub150/skillhawk), an open-source static security scanner and hands-on lab for AI Agent Skills, \`SKILL.md\`, and MCP configurations. It detects risky instruction patterns without executing the target and includes a reproducible public benchmark.\n\nI followed the existing list format and kept the change to a single resource entry under ${insertion.section}.\n\nPlease feel free to suggest changes or close the PR if it is not a fit.\n`;

fs.writeFileSync(path.join(outDir, 'README.proposed.md'), insertion.text);
fs.writeFileSync(path.join(outDir, 'PR.md'), body);
if (guidelines) fs.writeFileSync(path.join(outDir, 'CONTRIBUTING.review.md'), guidelines.text);

const manifest = {
  generatedAt: new Date().toISOString(),
  target,
  targetUrl: repo.html_url,
  defaultBranch: repo.default_branch,
  readmePath: readmeData.path,
  readmeSha: readmeData.sha,
  section: insertion.section,
  title,
  score: candidate?.score ?? null,
  scoreReasons: candidate?.reasons ?? [],
  guidelinesPath: guidelines?.path ?? null,
  files: {
    proposedReadme: 'README.proposed.md',
    prBody: 'PR.md',
    guidelines: guidelines ? 'CONTRIBUTING.review.md' : null
  }
};
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`Prepared: ${target}`);
console.log(`Section:  ${insertion.section}`);
if (candidate) console.log(`Score:    ${candidate.score}`);
console.log(`Folder:   ${outDir}`);
console.log('\nReview README.proposed.md and CONTRIBUTING.review.md (when present).');
console.log(`Publishing is a separate one-target command with explicit confirmation.`);
