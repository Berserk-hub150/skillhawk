# Quick start (Windows PowerShell)

From the SkillHawk repository root:

```powershell
cd tools\promotion-machine
Copy-Item config.example.json config.json

gh auth status
.\run.ps1 discover
```

Review the ranked list in:

```text
tools/promotion-machine/.local/candidates.json
```

Prepare one target:

```powershell
.\run.ps1 prepare LLMSecurity/awesome-agent-skills-security
```

Review the generated files under:

```text
tools/promotion-machine/.local/prepared/LLMSecurity__awesome-agent-skills-security/
```

In particular check:

- `README.proposed.md` — exact target README after the proposed single-entry change.
- `PR.md` — pull request body.
- `CONTRIBUTING.review.md` — target contribution rules when found.
- `manifest.json` — target, score, branch and source README SHA.

Only after reviewing those files, publish exactly one proposal:

```powershell
.\run.ps1 publish LLMSecurity/awesome-agent-skills-security
```

The launcher asks you to type the exact repository name before publication. The publisher also refuses when:

- the README changed after preparation;
- SkillHawk is already present;
- the repository was already contacted according to local history;
- the local 24-hour publication cap was reached;
- the target is archived/disabled;
- no suitable tools/resources section was found during preparation.

## Requirements

- Node.js 18+
- Git
- GitHub CLI (`gh`)
- authenticated GitHub CLI: `gh auth login`

No LLM API key is required for the core pipeline.
