const ICONS = {
  critical: '✖',
  high: '▲',
  medium: '●',
  low: '•',
  clean: '✓',
};

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
};

function colorize(text, color, enabled) {
  return enabled ? `${ANSI[color]}${text}${ANSI.reset}` : text;
}

function severityColor(severity) {
  if (severity === 'critical') return 'magenta';
  if (severity === 'high') return 'red';
  if (severity === 'medium') return 'yellow';
  if (severity === 'low') return 'cyan';
  return 'green';
}

export function formatHuman(report, { color = true } = {}) {
  const out = [];
  out.push(colorize('SkillHawk', 'bold', color) + colorize('  AI Agent Security Scanner', 'dim', color));
  out.push('');
  out.push(`Target: ${report.target}`);
  out.push(`Scanned: ${report.filesScanned} files${report.skippedFiles ? ` (${report.skippedFiles} oversized skipped)` : ''}`);
  out.push('');

  if (report.findings.length === 0) {
    out.push(colorize('✓ No suspicious patterns found.', 'green', color));
  } else {
    for (const item of report.findings) {
      const label = `${ICONS[item.severity]} ${item.severity.toUpperCase()} ${item.ruleId}`;
      out.push(`${colorize(label, severityColor(item.severity), color)}  ${item.title}`);
      out.push(`  ${item.file}:${item.line}`);
      if (item.snippet) out.push(colorize(`  ${item.snippet}`, 'dim', color));
      out.push(colorize(`  Fix: ${item.advice}`, 'dim', color));
      out.push('');
    }
  }

  const scoreColor = report.score >= 90 ? 'green' : report.score >= 70 ? 'yellow' : 'red';
  out.push(`${colorize(`Security score: ${report.score}/100 (${report.grade})`, scoreColor, color)}  Risk: ${report.risk.toUpperCase()}`);
  out.push(`Findings: ${report.counts.critical} critical · ${report.counts.high} high · ${report.counts.medium} medium · ${report.counts.low} low`);
  return out.join('\n');
}
