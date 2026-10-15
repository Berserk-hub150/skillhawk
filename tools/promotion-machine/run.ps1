param(
  [Parameter(Mandatory=$true)]
  [ValidateSet('discover','prepare','publish')]
  [string]$Mode,

  [string]$Target
)

$ErrorActionPreference = 'Stop'
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw 'Node.js is required.'
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw 'GitHub CLI (gh) is required. Install it and run: gh auth login'
}

switch ($Mode) {
  'discover' {
    node (Join-Path $Here 'discover.mjs')
  }
  'prepare' {
    if (-not $Target) { throw 'Usage: .\run.ps1 prepare owner/repo' }
    node (Join-Path $Here 'prepare.mjs') $Target
  }
  'publish' {
    if (-not $Target) { throw 'Usage: .\run.ps1 publish owner/repo' }
    Write-Host ''
    Write-Host 'FINAL HUMAN GATE' -ForegroundColor Yellow
    Write-Host "Target: $Target"
    Write-Host 'Before continuing, review:'
    Write-Host "  tools/promotion-machine/.local/prepared/$($Target.Replace('/','__'))/README.proposed.md"
    Write-Host "  tools/promotion-machine/.local/prepared/$($Target.Replace('/','__'))/CONTRIBUTING.review.md (if present)"
    Write-Host ''
    $answer = Read-Host "Type the exact repository '$Target' to publish ONE PR"
    if ($answer -ne $Target) { throw 'Cancelled.' }

    node (Join-Path $Here 'publish.mjs') $Target "--confirm=$Target" --reviewed-guidelines --reviewed-patch
  }
}
