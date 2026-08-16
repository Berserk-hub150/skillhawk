import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { RULES, SEVERITY_RANK, SEVERITY_WEIGHT } from './rules.js';

const execFileAsync = promisify(execFile);
const MAX_FILE_BYTES = 1024 * 1024;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.venv', 'vendor']);
const TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.json', '.jsonc', '.yaml', '.yml', '.toml',
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.rb', '.go',
  '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd', '.ini', '.cfg'
]);
const SPECIAL_FILES = new Set([
  'skill.md', 'package.json', 'mcp.json', '.mcp.json', 'claude_desktop_config.json',
  'dockerfile', 'makefile', 'gemfile', 'requirements.txt'
]);

export function normalizeGitHubRepoUrl(value) {
  const match = String(value).match(/^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
  if (!match) return null;
  return `https://github.com/${match[1]}/${match[2]}.git`;
}

function shouldScanFile(filePath) {
  const base = path.basename(filePath).toLowerCase();
  return SPECIAL_FILES.has(base) || TEXT_EXTENSIONS.has(path.extname(base));
}

function globToRegex(pattern) {
  let source = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        source += '.*';
        i += 1;
      } else source += '[^/]*';
    } else if (char === '?') source += '[^/]';
    else source += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${source}$`);
}

async function loadIgnorePatterns(root) {
  try {
    const content = await fs.readFile(path.join(root, '.skillhawkignore'), 'utf8');
    return content
      .split(/\r?\n/)
      .map((line) => line.trim().replaceAll('\\', '/'))
      .filter((line) => line && !line.startsWith('#'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function isIgnored(relativePath, patterns) {
  const rel = relativePath.replaceAll('\\', '/');
  return patterns.some((raw) => {
    const pattern = raw.replace(/^\.\//, '');
    if (pattern.endsWith('/')) return rel === pattern.slice(0, -1) || rel.startsWith(pattern);
    if (!pattern.includes('*') && !pattern.includes('?')) return rel === pattern || rel.startsWith(`${pattern}/`);
    return globToRegex(pattern).test(rel);
  });
}

async function collectFiles(target, ignorePatterns = []) {
  const stats = await fs.stat(target);
  if (stats.isFile()) return shouldScanFile(target) ? [target] : [];

  const result = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.isDirectory() && entry.name !== '.github') {
        if (SKIP_DIRS.has(entry.name)) continue;
      }
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const relative = path.relative(target, full).replaceAll('\\', '/');
      if (isIgnored(relative, ignorePatterns)) continue;
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && shouldScanFile(full)) result.push(full);
    }
  }
  await walk(target);
  return result;
}

export function scanTextContent(content, file = '<memory>') {
  const findings = [];
  const lines = String(content).split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const rule of RULES) {
      const match = line.match(rule.pattern);
      if (!match) continue;
      findings.push({
        ruleId: rule.id,
        severity: rule.severity,
        title: rule.title,
        advice: rule.advice,
        file,
        line: i + 1,
        snippet: line.trim().slice(0, 220),
      });
    }
  }
  return findings;
}

function summarize(findings, filesScanned, skippedFiles, targetLabel) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const finding of findings) counts[finding.severity] += 1;

  const deductions = Object.entries(counts).reduce(
    (sum, [severity, count]) => sum + Math.min(count, 3) * SEVERITY_WEIGHT[severity],
    0,
  );
  const score = Math.max(0, 100 - deductions);
  const grade = score >= 95 ? 'A+' : score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const risk = findings.reduce(
    (max, item) => SEVERITY_RANK[item.severity] > SEVERITY_RANK[max] ? item.severity : max,
    'clean',
  );

  return {
    tool: 'SkillHawk',
    version: '0.2.0',
    target: targetLabel,
    filesScanned,
    skippedFiles,
    score,
    grade,
    risk,
    counts,
    findings,
  };
}

async function scanLocalPath(localTarget, targetLabel = localTarget) {
  const absolute = path.resolve(localTarget);
  const stat = await fs.stat(absolute);
  const ignorePatterns = stat.isDirectory() ? await loadIgnorePatterns(absolute) : [];
  const files = await collectFiles(absolute, ignorePatterns);
  const findings = [];
  let skippedFiles = 0;

  for (const file of files) {
    const stat = await fs.stat(file);
    if (stat.size > MAX_FILE_BYTES) {
      skippedFiles += 1;
      continue;
    }
    const content = await fs.readFile(file, 'utf8');
    const relative = path.relative(absolute, file) || path.basename(file);
    findings.push(...scanTextContent(content, relative.replaceAll('\\', '/')));
  }

  return summarize(findings, files.length - skippedFiles, skippedFiles, targetLabel);
}

export async function scanTarget(target) {
  const repoUrl = normalizeGitHubRepoUrl(target);
  if (!repoUrl) return scanLocalPath(target);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'skillhawk-'));
  const checkout = path.join(tempRoot, 'repo');
  try {
    await execFileAsync('git', ['clone', '--depth', '1', '--quiet', repoUrl, checkout], {
      timeout: 60_000,
      windowsHide: true,
    });
    return await scanLocalPath(checkout, target);
  } catch (error) {
    const message = error?.code === 'ENOENT'
      ? 'Git is required to scan a GitHub URL. Install Git or scan a local checkout instead.'
      : `Could not clone ${target}: ${error.message}`;
    throw new Error(message);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

export function meetsThreshold(report, threshold) {
  if (!threshold || threshold === 'none') return false;
  return SEVERITY_RANK[report.risk] >= SEVERITY_RANK[threshold];
}
