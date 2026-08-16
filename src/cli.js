#!/usr/bin/env node
import { scanTarget, meetsThreshold } from './scanner.js';
import { formatHuman } from './format.js';

const VALID_THRESHOLDS = new Set(['critical', 'high', 'medium', 'low', 'none']);

function usage() {
  return `SkillHawk — security scanner for AI agent skills and MCP configs

Usage:
  skillhawk scan <path-or-github-url> [--json] [--fail-on <severity>] [--no-color]

Examples:
  skillhawk scan .
  skillhawk scan ./SKILL.md --json
  skillhawk scan https://github.com/owner/repo --fail-on high

Severities: critical, high, medium, low, none`;
}

function parseArgs(argv) {
  const args = [...argv];
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) return { help: true };
  if (args.includes('--version') || args.includes('-v')) return { version: true };

  const command = args.shift();
  if (command !== 'scan') throw new Error(`Unknown command: ${command}`);
  const target = args.shift();
  if (!target) throw new Error('Missing scan target.');

  let json = false;
  let color = process.stdout.isTTY && !process.env.NO_COLOR;
  let failOn = 'none';

  while (args.length) {
    const arg = args.shift();
    if (arg === '--json') json = true;
    else if (arg === '--no-color') color = false;
    else if (arg === '--fail-on') {
      failOn = (args.shift() || '').toLowerCase();
      if (!VALID_THRESHOLDS.has(failOn)) throw new Error(`Invalid --fail-on value: ${failOn}`);
    } else throw new Error(`Unknown option: ${arg}`);
  }

  return { target, json, color, failOn };
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(usage());
      return;
    }
    if (options.version) {
      console.log('0.1.0');
      return;
    }

    const report = await scanTarget(options.target);
    console.log(options.json ? JSON.stringify(report, null, 2) : formatHuman(report, { color: options.color }));
    if (meetsThreshold(report, options.failOn)) process.exitCode = 2;
  } catch (error) {
    console.error(`SkillHawk error: ${error.message}`);
    process.exitCode = 1;
  }
}

await main();
