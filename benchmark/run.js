#!/usr/bin/env node
import { scanTextContent } from '../src/scanner.js';
import { RULES } from '../src/rules.js';
import { FIXTURES } from './fixtures.js';

const rows = FIXTURES.map((fixture) => {
  const findings = scanTextContent(fixture.text, `${fixture.id}.md`);
  const predicted = findings.length > 0 ? 'malicious' : 'safe';
  return {
    ...fixture,
    predicted,
    matchedRules: [...new Set(findings.map((finding) => finding.ruleId))],
  };
});

const tp = rows.filter((row) => row.label === 'malicious' && row.predicted === 'malicious').length;
const fn = rows.filter((row) => row.label === 'malicious' && row.predicted === 'safe').length;
const fp = rows.filter((row) => row.label === 'safe' && row.predicted === 'malicious').length;
const tn = rows.filter((row) => row.label === 'safe' && row.predicted === 'safe').length;

const ratio = (numerator, denominator) => denominator === 0 ? 0 : numerator / denominator;
const precision = ratio(tp, tp + fp);
const recall = ratio(tp, tp + fn);
const specificity = ratio(tn, tn + fp);
const accuracy = ratio(tp + tn, rows.length);
const f1 = precision + recall === 0 ? 0 : 2 * precision * recall / (precision + recall);
const pct = (value) => Number((value * 100).toFixed(2));

const result = {
  benchmark: 'SkillHawk synthetic labeled benchmark',
  fixtures: rows.length,
  maliciousFixtures: rows.filter((row) => row.label === 'malicious').length,
  safeFixtures: rows.filter((row) => row.label === 'safe').length,
  rules: RULES.length,
  confusionMatrix: { tp, fp, tn, fn },
  precision: pct(precision),
  recall: pct(recall),
  f1: pct(f1),
  specificity: pct(specificity),
  accuracy: pct(accuracy),
  falsePositives: rows
    .filter((row) => row.label === 'safe' && row.predicted === 'malicious')
    .map(({ id, note, matchedRules }) => ({ id, note, matchedRules })),
  falseNegatives: rows
    .filter((row) => row.label === 'malicious' && row.predicted === 'safe')
    .map(({ id, note }) => ({ id, note })),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log('SkillHawk benchmark');
  console.log('===================');
  console.log(`Fixtures:        ${result.fixtures} (${result.maliciousFixtures} malicious / ${result.safeFixtures} safe)`);
  console.log(`Rules:           ${result.rules}`);
  console.log(`TP / FP / TN / FN: ${tp} / ${fp} / ${tn} / ${fn}`);
  console.log(`Precision:       ${result.precision}%`);
  console.log(`Recall:          ${result.recall}%`);
  console.log(`F1:              ${result.f1}%`);
  console.log(`Specificity:     ${result.specificity}%`);
  console.log(`Accuracy:        ${result.accuracy}%`);
  console.log(`False positives: ${fp}`);
  console.log(`False negatives: ${fn}`);

  if (result.falsePositives.length) {
    console.log('\nKnown false positives:');
    for (const item of result.falsePositives) {
      console.log(`- ${item.id}: ${item.note || 'safe fixture triggered'} [${item.matchedRules.join(', ')}]`);
    }
  }

  if (result.falseNegatives.length) {
    console.log('\nKnown false negatives:');
    for (const item of result.falseNegatives) {
      console.log(`- ${item.id}: ${item.note || 'malicious fixture missed'}`);
    }
  }
}

// Keep the benchmark useful as a regression gate without pretending it is an external audit.
if (rows.length < 40 || precision < 0.90 || recall < 0.90) {
  process.exitCode = 1;
}
