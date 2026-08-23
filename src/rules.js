export const SEVERITY_WEIGHT = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
};

export const SEVERITY_RANK = {
  clean: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const RULES = [
  {
    id: 'SH001',
    severity: 'critical',
    title: 'Remote script piped directly into a shell',
    advice: 'Download the artifact first, verify its origin/integrity, then execute it explicitly.',
    pattern: /\b(?:curl|wget)\b[^\n|]{0,400}\|\s*(?:sudo\s+)?(?:ba|z|fi)?sh\b/i,
  },
  {
    id: 'SH002',
    severity: 'critical',
    title: 'Encoded or obfuscated command execution',
    advice: 'Avoid encoded execution. Keep commands reviewable in plain text.',
    pattern: /(?:powershell(?:\.exe)?\s+[^\n]{0,120}-(?:enc|encodedcommand)\b|base64\s+(?:--decode|-d)[^\n|]{0,160}\|\s*(?:ba|z)?sh\b)/i,
  },
  {
    id: 'SH003',
    severity: 'high',
    title: 'Destructive filesystem command',
    advice: 'Narrow deletion to an explicit project-local path and require user confirmation.',
    pattern: /(?:\brm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*\s+(?:\/|~|\$HOME)|\bRemove-Item\b[^\n]{0,180}-(?:Recurse|r)\b[^\n]{0,180}-(?:Force|fo)\b|\b(?:del|rd|rmdir)\b[^\n]{0,120}\/(?:s|q)\b)/i,
  },
  {
    id: 'SH004',
    severity: 'high',
    title: 'Sensitive credential or key access',
    advice: 'Request the minimum secret explicitly and never read unrelated credential stores.',
    pattern: /(?:~\/\.ssh|\.ssh\/(?:id_[a-z0-9_-]+|config|known_hosts)|(?:^|[\/\s\"'=])\.env(?:\b|[\/\\])|credentials\.json|\.aws\/credentials|\.config\/gh\/hosts\.yml|\b(?:GITHUB_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|AWS_SECRET_ACCESS_KEY)\b)/i,
  },
  {
    id: 'SH005',
    severity: 'high',
    title: 'Persistence or autostart modification',
    advice: 'Agent skills should not establish persistence without an explicit, user-approved reason.',
    pattern: /(?:\bcrontab\b|systemctl\s+enable\b|schtasks(?:\.exe)?\s+\/create\b|CurrentVersion\\Run\b|LaunchAgents\b|Startup\\)/i,
  },
  {
    id: 'SH006',
    severity: 'high',
    title: 'Privilege escalation',
    advice: 'Avoid elevated execution; scope permissions to the smallest required operation.',
    pattern: /(?:\bsudo\s+(?:-S\s+)?(?:sh|bash|zsh|powershell|pwsh|rm|chmod|chown|tee)\b|Start-Process\b[^\n]{0,160}-Verb\s+RunAs\b)/i,
  },
  {
    id: 'SH007',
    severity: 'medium',
    title: 'Outbound data upload or POST request',
    advice: 'Document what data leaves the machine, where it goes, and why it is required.',
    pattern: /(?:\bcurl\b[^\n]{0,240}(?:-X\s*POST|--request\s+POST|-F\s|--form\s|--data(?:-binary|-raw)?\s)|Invoke-(?:WebRequest|RestMethod)\b[^\n]{0,240}-Method\s+(?:Post|Put)\b)/i,
  },
  {
    id: 'SH008',
    severity: 'medium',
    title: 'Broad permission change',
    advice: 'Use least-privilege file permissions instead of world-writable access.',
    pattern: /\bchmod\s+(?:-R\s+)?777\b/i,
  },
  {
    id: 'SH009',
    severity: 'medium',
    title: 'Prompt-injection style instruction',
    advice: 'Do not instruct an agent to override higher-priority instructions or conceal behavior.',
    pattern: /(?:ignore\s+(?:all\s+)?(?:previous|prior|system)\s+instructions|reveal\s+(?:the\s+)?system\s+prompt|do\s+not\s+(?:tell|inform|show)\s+(?:the\s+)?user|hide\s+(?:this|these)\s+(?:actions?|commands?|instructions?))/i,
  },
  {
    id: 'SH010',
    severity: 'medium',
    title: 'Shell spawned from a language runtime',
    advice: 'Prefer structured APIs and fixed argument lists over dynamic shell execution.',
    pattern: /(?:child_process\.(?:exec|execSync)\s*\(|subprocess\.(?:run|Popen|call)\s*\([^\n]{0,180}shell\s*=\s*True|os\.system\s*\()/i,
  },
  {
    id: 'SH011',
    severity: 'low',
    title: 'Unpinned package execution',
    advice: 'Pin package versions or commit SHAs for reproducible agent tooling.',
    pattern: /\bnpx\s+(?:-y\s+)?(?![^\s@]+@(?:\d|[a-f0-9]{7,40}\b))[@a-z0-9_.\/-]+\b/i,
  },
  {

    id: 'SH012',
    severity: 'low',
    title: 'Wildcard or recursive access',
    advice: 'Restrict file access to the smallest directory or glob the skill actually needs.',
    pattern: /(?:\bfind\s+[\/~.]\s+|Get-ChildItem\b[^\n]{0,140}-(?:Recurse|r)\b|glob\s*\([^\n]{0,100}\*\*)/i,
  },
  {
    id: 'SH013',
    severity: 'high',
    title: 'Remote content executed via Python exec/eval',
    advice: 'Never exec or eval content fetched over the network. Parse and validate it explicitly instead.',
    pattern: /(?:\bexec\s*\([^)]{0,200}requests\.(?:get|post|request)\s*\(|requests\.(?:get|post|request)\s*\([^\n]{0,200}\)[^\n]{0,60}\.(?:text|content)\b[\s\S]{0,150}\b(?:exec|eval)\s*\()/i,
  },
  {
    id: 'SH014',
    severity: 'critical',
    title: 'PowerShell download piped to Invoke-Expression',
    advice: 'Download the script first, verify its origin and integrity, then execute it explicitly.',
    pattern: /\b(?:Invoke-WebRequest|iwr)\b[^\n|]{0,400}\|\s*(?:Invoke-Expression|iex)\b/i,
  }
];
