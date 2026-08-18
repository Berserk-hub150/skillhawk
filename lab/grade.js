import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { scanTarget } from '../src/scanner.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const challenge = path.join(here, 'challenge-01', 'SKILL.md');
const EXPECTED_TEMPLATE_RULES = ['SH001', 'SH004', 'SH009'];
const REQUIRED_TEXT = [
  '# Deployment Helper',
  '## Goal',
  '## Installation',
  '## Authentication',
  '## Safety',
];

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : null;
}

function fail(message) {
  console.error(`\nSkillHawk Security Lab: FAILED\n${message}`);
  process.exitCode = 1;
}

function printFindings(report) {
  if (!report.findings.length) return;
  console.error('\nFindings to remediate:');
  for (const finding of report.findings) {
    console.error(
      `- ${finding.severity.toUpperCase()} ${finding.ruleId} at ${finding.file}:${finding.line} — ${finding.title}`,
    );
    console.error(`  ${finding.snippet}`);
    console.error(`  Fix: ${finding.advice}`);
  }
}

async function validateStructure(content) {
  if (content.length < 260) {
    throw new Error('The challenge file is too short. Keep a meaningful deployment skill instead of deleting the content.');
  }

  for (const required of REQUIRED_TEXT) {
    if (!content.includes(required)) {
      throw new Error(`Required content is missing: ${required}`);
    }
  }
}

async function writeCertificate(file, report) {
  const output = path.resolve(file);
  await fs.mkdir(path.dirname(output), { recursive: true });

  const actor = process.env.GITHUB_ACTOR || 'local-user';
  const repository = process.env.GITHUB_REPOSITORY || 'local-checkout';
  const sha = process.env.GITHUB_SHA || 'local';
  const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : 'local-run';

  const certificate = [
    'SKILLHAWK SECURITY LAB — COMPLETION CERTIFICATE',
    '',
    `Participant: ${actor}`,
    `Repository: ${repository}`,
    `Commit: ${sha}`,
    `Completed: ${new Date().toISOString()}`,
    `Challenge: 01 — Repair a dangerous deployment skill`,
    `Score: ${report.score}/100`,
    `Findings: ${report.findings.length}`,
    `Workflow: ${runUrl}`,
    '',
    'This artifact records completion of the SkillHawk educational lab.',
    'It is not a professional certification or a security credential.',
    '',
  ].join('\n');

  await fs.writeFile(output, certificate, 'utf8');
  console.log(`Certificate written to ${output}`);
}

async function main() {
  const content = await fs.readFile(challenge, 'utf8');
  const report = await scanTarget(challenge);
  const expectVulnerable = process.argv.includes('--expect-vulnerable');

  if (expectVulnerable) {
    const found = new Set(report.findings.map((finding) => finding.ruleId));
    const missing = EXPECTED_TEMPLATE_RULES.filter((rule) => !found.has(rule));

    if (missing.length) {
      fail(`Starter template integrity check failed. Missing expected rules: ${missing.join(', ')}`);
      return;
    }

    console.log('SkillHawk Security Lab template: OK');
    console.log(`Expected vulnerable starter rules present: ${EXPECTED_TEMPLATE_RULES.join(', ')}`);
    return;
  }

  try {
    await validateStructure(content);
  } catch (error) {
    fail(error.message);
    return;
  }

  if (report.findings.length > 0) {
    printFindings(report);
    fail(`SkillHawk still reports ${report.findings.length} finding(s). Rewrite the unsafe instructions and try again.`);
    return;
  }

  if (report.score !== 100 || report.risk !== 'clean') {
    fail(`Expected a clean 100/100 report, got ${report.score}/100 with risk ${report.risk}.`);
    return;
  }

  console.log('\nSkillHawk Security Lab: PASSED');
  console.log('Findings: 0');
  console.log('Score: 100/100');
  console.log('Challenge 01 complete.');

  const certificatePath = valueAfter('--certificate');
  if (certificatePath) await writeCertificate(certificatePath, report);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
