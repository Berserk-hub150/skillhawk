import fs from 'node:fs';
import { scanTarget, meetsThreshold } from './scanner.js';
import { formatHuman } from './format.js';

const target = process.env.INPUT_PATH || '.';
const failOn = (process.env['INPUT_FAIL-ON'] || 'high').toLowerCase();
const format = (process.env.INPUT_FORMAT || 'text').toLowerCase();

try {
  const report = await scanTarget(target);
  const rendered = format === 'json' ? JSON.stringify(report, null, 2) : formatHuman(report, { color: false });
  console.log(rendered);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `score=${report.score}\nrisk=${report.risk}\nfindings=${report.findings.length}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## SkillHawk\n\n**Security score:** ${report.score}/100 (${report.grade})  \n**Risk:** ${report.risk.toUpperCase()}  \n**Findings:** ${report.findings.length}\n`,
    );
  }

  if (meetsThreshold(report, failOn)) {
    console.error(`SkillHawk failed: risk ${report.risk} meets --fail-on ${failOn}.`);
    process.exitCode = 2;
  }
} catch (error) {
  console.error(`SkillHawk error: ${error.message}`);
  process.exitCode = 1;
}
