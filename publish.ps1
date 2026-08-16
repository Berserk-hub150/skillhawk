$ErrorActionPreference = "Stop"

$Owner = "Berserk-hub150"
$Repo = "skillhawk"
$Full = "$Owner/$Repo"

Write-Host "=== Publishing SkillHawk to GitHub ===" -ForegroundColor Cyan

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) is not installed or not in PATH."
}

gh auth status

if (-not (Test-Path .git)) {
    git init -b main
}

git add .
if (git status --porcelain) {
    git commit -m "feat: launch SkillHawk agent security scanner"
}

$exists = $false
gh repo view $Full --json name 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    $exists = $true
}

if (-not $exists) {
    gh repo create $Full --public --source . --remote origin --push --description "Catch dangerous AI agent skills before they catch you. Zero-dependency security scanner for Agent Skills, SKILL.md and MCP configs."
} else {
    Write-Host "Repository $Full already exists; pushing current main branch." -ForegroundColor Yellow
    if (-not (git remote | Select-String -SimpleMatch "origin")) {
        git remote add origin "https://github.com/$Full.git"
    }
    git push -u origin main
}

gh repo edit $Full `
    --description "Catch dangerous AI agent skills before they catch you. Zero-dependency security scanner for Agent Skills, SKILL.md and MCP configs." `
    --add-topic ai-agents `
    --add-topic agent-skills `
    --add-topic mcp `
    --add-topic security `
    --add-topic static-analysis `
    --add-topic claude-code `
    --add-topic codex `
    --add-topic open-source

$labels = @(
    @{ Name = "good first issue"; Color = "7057ff"; Description = "Good for newcomers" },
    @{ Name = "help wanted"; Color = "008672"; Description = "Extra attention is needed" },
    @{ Name = "rule"; Color = "d93f0b"; Description = "Detection rule improvement" },
    @{ Name = "false positive"; Color = "fbca04"; Description = "Potentially noisy detection" }
)
foreach ($label in $labels) {
    gh label create $label.Name --repo $Full --color $label.Color --description $label.Description --force | Out-Null
}

$issues = @(
    @{
        Title = "Add SARIF output for GitHub Code Scanning"
        Body = @"
## Goal
Add a `--sarif` output mode so SkillHawk findings can appear directly in GitHub Code Scanning.

## Acceptance criteria
- Convert every finding into SARIF 2.1.0.
- Preserve rule ID, severity, file, and line.
- Add tests with a small fixture.
- Document a GitHub Actions example.

This is intentionally scoped for a first contribution.
"@
    },
    @{
        Title = "Add MCP config fixtures and structural checks"
        Body = @"
## Goal
Add safe and unsafe MCP configuration fixtures and detect risky command definitions structurally rather than only line-by-line.

## Acceptance criteria
- Add at least one safe and one unsafe fixture.
- Parse JSON without executing anything.
- Add tests.
- Keep error messages explainable.
"@
    },
    @{
        Title = "Reduce false positives for security documentation"
        Body = @"
## Goal
Security documentation may mention dangerous commands as examples. Design a conservative suppression mechanism for fenced examples or explicit SkillHawk ignore comments.

## Acceptance criteria
- Propose a simple syntax.
- Add positive and negative tests.
- Never suppress findings silently without an explicit rule.
"@
    }
)

$existingTitles = gh issue list --repo $Full --limit 100 --json title --jq '.[].title'
foreach ($issue in $issues) {
    if ($existingTitles -notcontains $issue.Title) {
        gh issue create --repo $Full --title $issue.Title --body $issue.Body --label "good first issue,help wanted" | Out-Null
    }
}

Write-Host "" 
Write-Host "SkillHawk published: https://github.com/$Full" -ForegroundColor Green
Write-Host "Next: open the repo, enable Discussions, and pin it on your profile." -ForegroundColor Cyan
