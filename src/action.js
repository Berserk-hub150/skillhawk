import fs from 'node:fs';
import path from 'node:path';
import { scanTarget, meetsThreshold } from './scanner.js';
import { formatHuman } from './format.js';
import { toSarif } from './sarif.js';

const target = process.env.INPUT_PATH || '.';
const failOn = (process.env['INPUT_FAIL-ON'] || 'high').toLowerCase();
const format = (process.env.INPUT_FORMAT || 'text').toLowerCase();
const sarifFile = process.env['INPUT_SARIF-FILE'] || '';

try {
  const report = await scanTarget(target);
  const sarif = toSarif(report);
  const rendered = format === 'json'
    ? JSON.stringify(report, null, 2)
    : format === 'sarif'
      ? JSON.stringify(sarif, null, 2)
      : formatHuman(report, { color: false });

  console.log(rendered);

  if (sarifFile) {
    const dir = path.dirname(sarifFile);
    if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(sarifFile, `${JSON.stringify(sarif, null, 2)}\n`, 'utf8');
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `score=${report.score}\nrisk=${report.risk}\nfindings=${report.findings.length}\nsarif-file=${sarifFile}\n`,
    );
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## SkillHawk\n\n**Security score:** ${report.score}/100 (${report.grade})  \n**Risk:** ${report.risk.toUpperCase()}  \n**Findings:** ${report.findings.length}${sarifFile ? `  \n**SARIF:** \`${sarifFile}\`` : ''}\n`,
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
