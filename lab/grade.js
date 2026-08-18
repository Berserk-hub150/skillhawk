import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { scanTarget } from '../src/scanner.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const challenges = JSON.parse(await fs.readFile(path.join(here, 'challenges.json'), 'utf8'));
const weekly = {
  id: 'weekly',
  slug: 'weekly/current',
  title: 'Weekly Challenge — hidden credential leak',
  difficulty: 'Bonus',
  expectedRules: ['SH004'],
  requiredText: ['# Weekly Challenge', '## Scenario', '## Task', '## Safety'],
  minLength: 220,
};

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : null;
}

function challengePath(challenge) {
  return path.join(here, challenge.slug, 'SKILL.md');
}

function fail(message) {
  console.error(`\nSkillHawk Security Lab: FAILED\n${message}`);
  process.exitCode = 1;
}

function isClean(result) {
  return result.structureOk && result.report.findings.length === 0 && result.report.score === 100 && result.report.risk === 'clean';
}

function printFindings(result) {
  if (!result.report.findings.length) return;
  console.error(`\n${result.challenge.id}. ${result.challenge.title}`);
  for (const finding of result.report.findings) {
    console.error(
      `- ${finding.severity.toUpperCase()} ${finding.ruleId} at ${finding.file}:${finding.line} — ${finding.title}`,
    );
    console.error(`  ${finding.snippet}`);
    console.error(`  Fix: ${finding.advice}`);
  }
}

async function inspectChallenge(challenge) {
  const file = challengePath(challenge);
  const content = await fs.readFile(file, 'utf8');
  const structureErrors = [];

  if (content.length < challenge.minLength) {
    structureErrors.push(`File is too short (${content.length} chars; minimum ${challenge.minLength}).`);
  }

  for (const required of challenge.requiredText) {
    if (!content.includes(required)) structureErrors.push(`Required content is missing: ${required}`);
  }

  const report = await scanTarget(file);
  return {
    challenge,
    file,
    content,
    structureOk: structureErrors.length === 0,
    structureErrors,
    report,
  };
}

async function inspectAll() {
  const results = [];
  for (const challenge of challenges) results.push(await inspectChallenge(challenge));
  return results;
}

function buildProgress(results) {
  let completed = 0;
  for (const result of results) {
    if (!isClean(result)) break;
    completed += 1;
  }

  const current = completed < results.length ? completed + 1 : null;
  const rows = results.map((result, index) => {
    let status = 'locked';
    if (index < completed) status = 'completed';
    else if (index === completed && completed < results.length) status = 'current';

    return {
      id: result.challenge.id,
      title: result.challenge.title,
      difficulty: result.challenge.difficulty,
      status,
      score: result.report.score,
      findings: result.report.findings.length,
    };
  });

  return {
    lab: 'SkillHawk Security Lab',
    version: 2,
    totalChallenges: results.length,
    completed,
    current,
    status: completed === results.length ? 'defender' : 'in-progress',
    challenges: rows,
  };
}

function progressMarkdown(progress) {
  const lines = [
    '# SkillHawk Security Lab progress',
    '',
    `**Overall:** ${progress.completed}/${progress.totalChallenges} challenges completed`,
    '',
    '| Level | Difficulty | Challenge | Status |',
    '|---:|---|---|---|',
  ];

  for (const row of progress.challenges) {
    const status = row.status === 'completed' ? '✅ Completed' : row.status === 'current' ? '▶️ Current' : '🔒 Locked';
    lines.push(`| ${row.id} | ${row.difficulty} | ${row.title} | ${status} |`);
  }

  if (progress.completed === progress.totalChallenges) {
    lines.push('', '**AI Agent Security Defender unlocked.**');
  } else {
    lines.push('', `Next: repair \`lab/challenge-${String(progress.current).padStart(2, '0')}/SKILL.md\`.`);
  }

  return `${lines.join('\n')}\n`;
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function progressSvg(progress) {
  const percent = Math.round((progress.completed / progress.totalChallenges) * 100);
  const label = progress.completed === progress.totalChallenges
    ? 'SkillHawk Defender — 10/10'
    : `SkillHawk Lab — ${progress.completed}/${progress.totalChallenges}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="430" height="90" role="img" aria-label="${xmlEscape(label)}">
  <rect width="430" height="90" rx="12" fill="#111827"/>
  <text x="22" y="34" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" font-weight="700">SkillHawk Security Lab</text>
  <text x="22" y="61" fill="#d1d5db" font-family="Arial, sans-serif" font-size="15">${xmlEscape(label)} · ${percent}% complete</text>
  <rect x="300" y="20" width="105" height="48" rx="10" fill="#1f2937"/>
  <text x="352" y="50" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="700">${progress.completed}/${progress.totalChallenges}</text>
</svg>\n`;
}

async function writeProgress(file, progress) {
  const output = path.resolve(file);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(progress, null, 2)}\n`, 'utf8');
  console.log(`Progress snapshot written to ${output}`);
}

async function writeArtifacts(directory, progress) {
  const output = path.resolve(directory);
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(path.join(output, 'progress.json'), `${JSON.stringify(progress, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(output, 'progress.md'), progressMarkdown(progress), 'utf8');
  await fs.writeFile(path.join(output, 'progress.svg'), progressSvg(progress), 'utf8');

  if (progress.completed !== progress.totalChallenges) return;

  const actor = process.env.GITHUB_ACTOR || 'local-user';
  const repository = process.env.GITHUB_REPOSITORY || 'local-checkout';
  const sha = process.env.GITHUB_SHA || 'local';
  const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : 'local-run';
  const completedAt = new Date().toISOString();

  const certificate = [
    'SKILLHAWK SECURITY LAB — AI AGENT SECURITY DEFENDER',
    '',
    `Participant: ${actor}`,
    `Repository: ${repository}`,
    `Commit: ${sha}`,
    `Completed: ${completedAt}`,
    'Challenges: 10/10',
    'Final score: 100%',
    `Workflow: ${runUrl}`,
    '',
    'This artifact records completion of the SkillHawk educational lab.',
    'It is not a professional certification or a security credential.',
    '',
  ].join('\n');

  const defenderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="220" role="img" aria-label="SkillHawk AI Agent Security Defender">
  <rect width="760" height="220" rx="18" fill="#111827"/>
  <text x="380" y="58" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700">SkillHawk Security Lab</text>
  <text x="380" y="101" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" font-size="21">AI Agent Security Defender</text>
  <text x="380" y="142" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="25" font-weight="700">10 / 10 challenges completed</text>
  <text x="380" y="178" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">${xmlEscape(actor)} · educational completion badge</text>
</svg>\n`;

  const defenderMd = [
    '# SkillHawk AI Agent Security Defender',
    '',
    `Completed by **@${actor}** on ${completedAt}.`,
    '',
    '- 10/10 security challenges completed',
    '- final SkillHawk score: 100%',
    `- evidence: ${runUrl}`,
    '',
    '> Educational completion badge; not a professional certification.',
    '',
  ].join('\n');

  await fs.writeFile(path.join(output, 'skillhawk-defender.txt'), certificate, 'utf8');
  await fs.writeFile(path.join(output, 'skillhawk-defender.svg'), defenderSvg, 'utf8');
  await fs.writeFile(path.join(output, 'skillhawk-defender.md'), defenderMd, 'utf8');
  console.log(`Defender artifacts written to ${output}`);
}

async function verifyTemplates() {
  const all = await inspectAll();
  const failures = [];

  for (const result of all) {
    if (!result.structureOk) {
      failures.push(`Level ${result.challenge.id}: ${result.structureErrors.join('; ')}`);
      continue;
    }
    const found = new Set(result.report.findings.map((finding) => finding.ruleId));
    const missing = result.challenge.expectedRules.filter((rule) => !found.has(rule));
    if (missing.length) failures.push(`Level ${result.challenge.id}: missing ${missing.join(', ')}`);
  }

  const weeklyResult = await inspectChallenge(weekly);
  const weeklyFound = new Set(weeklyResult.report.findings.map((finding) => finding.ruleId));
  const weeklyMissing = weekly.expectedRules.filter((rule) => !weeklyFound.has(rule));
  if (!weeklyResult.structureOk) failures.push(`Weekly: ${weeklyResult.structureErrors.join('; ')}`);
  if (weeklyMissing.length) failures.push(`Weekly: missing ${weeklyMissing.join(', ')}`);

  if (failures.length) {
    fail(`Starter-template integrity failed:\n${failures.map((item) => `- ${item}`).join('\n')}`);
    return;
  }

  console.log('SkillHawk Security Lab v2 templates: OK');
  console.log('10 core challenge vulnerabilities + weekly challenge are present.');
}

async function gradeOne(challenge) {
  const result = await inspectChallenge(challenge);

  if (!result.structureOk) {
    fail(result.structureErrors.join('\n'));
    return false;
  }

  if (!isClean(result)) {
    printFindings(result);
    fail(`${challenge.title} still has ${result.report.findings.length} finding(s). Rewrite the unsafe instruction and try again.`);
    return false;
  }

  console.log(`\nPASSED — ${challenge.title}`);
  console.log('Findings: 0');
  console.log('Score: 100/100');
  return true;
}

async function main() {
  if (process.argv.includes('--expect-vulnerable')) {
    await verifyTemplates();
    return;
  }

  if (process.argv.includes('--weekly')) {
    await gradeOne(weekly);
    return;
  }

  const requested = valueAfter('--challenge');
  if (requested) {
    const number = Number(requested);
    const challenge = challenges.find((item) => item.id === number);
    if (!challenge) {
      fail(`Unknown challenge: ${requested}. Choose 1-${challenges.length}.`);
      return;
    }
    await gradeOne(challenge);
    return;
  }

  const results = await inspectAll();
  const progress = buildProgress(results);

  const progressFile = valueAfter('--write-progress');
  if (progressFile) await writeProgress(progressFile, progress);

  const artifactsDir = valueAfter('--artifacts');
  if (artifactsDir) await writeArtifacts(artifactsDir, progress);

  console.log(`\nSkillHawk Security Lab: ${progress.completed}/${progress.totalChallenges} complete`);
  if (progress.completed === progress.totalChallenges) {
    console.log('AI Agent Security Defender unlocked.');
    return;
  }

  if (process.argv.includes('--progress-only')) {
    console.log(`Next challenge: ${progress.current}`);
    return;
  }

  const current = results[progress.completed];
  printFindings(current);
  fail(`Level ${progress.current} is the current challenge. Repair it, then rerun npm run lab.`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
