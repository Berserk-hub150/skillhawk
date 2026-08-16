import { RULES } from './rules.js';

const LEVEL = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'note',
};

const SECURITY_SEVERITY = {
  critical: '9.5',
  high: '8.0',
  medium: '5.0',
  low: '2.0',
};

export function toSarif(report) {
  const rules = RULES.map((rule) => ({
    id: rule.id,
    name: rule.id,
    shortDescription: { text: rule.title },
    help: { text: rule.advice },
    defaultConfiguration: { level: LEVEL[rule.severity] || 'warning' },
    properties: {
      severity: rule.severity,
      'security-severity': SECURITY_SEVERITY[rule.severity] || '1.0',
      tags: ['security', 'ai-agent', 'skillhawk'],
    },
  }));

  const results = report.findings.map((finding) => ({
    ruleId: finding.ruleId,
    level: LEVEL[finding.severity] || 'warning',
    message: {
      text: `${finding.title}. ${finding.advice}`,
    },
    locations: [
      {
        physicalLocation: {
          artifactLocation: { uri: String(finding.file).replaceAll('\\', '/') },
          region: {
            startLine: finding.line,
            snippet: finding.snippet ? { text: finding.snippet } : undefined,
          },
        },
      },
    ],
    properties: {
      severity: finding.severity,
      snippet: finding.snippet,
    },
  }));

  return {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'SkillHawk',
            informationUri: 'https://github.com/Berserk-hub150/skillhawk',
            version: report.version,
            rules,
          },
        },
        results,
      },
    ],
  };
}
