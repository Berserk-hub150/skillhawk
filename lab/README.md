# SkillHawk Security Lab v2

A browser-first AI Agent Security challenge ladder built around a real static-analysis scanner.

**Fork → fix one unsafe `SKILL.md` → push → GitHub Actions grades it → progress is stored in your fork.**

No local setup is required for the core path.

## Start in under 60 seconds

1. **Fork SkillHawk:** https://github.com/Berserk-hub150/skillhawk/fork
2. Open your fork and enable **Actions** if GitHub asks you to.
3. Open `lab/challenge-01/SKILL.md`.
4. Click the pencil icon and rewrite the unsafe instruction.
5. Commit directly to your fork.
6. Open **Actions → SkillHawk Security Lab**.
7. If the level passes, your progress advances to the next level.

The workflow grades only the core challenge files you changed, then rebuilds the full progress dashboard.

## 10-level ladder

| Level | Difficulty | Focus |
|---:|---|---|
| 1 | Beginner | Remote install chain |
| 2 | Beginner | Credential scavenging |
| 3 | Beginner | Destructive cleanup |
| 4 | Intermediate | Persistence / autostart |
| 5 | Intermediate | Privilege escalation |
| 6 | Intermediate | Silent outbound upload |
| 7 | Intermediate | World-writable permissions |
| 8 | Advanced | Prompt-injection instructions |
| 9 | Advanced | Dynamic shell execution |
| 10 | Advanced | Unpinned package execution |

Each level starts intentionally unsafe. Preserve its useful purpose and required headings while replacing the dangerous instruction with a safer alternative.

## Progress lives with your fork

`lab/progress.json` is a deterministic progress snapshot generated from the actual challenge files in your fork.

A successful level run attempts to commit the updated snapshot back to your fork automatically. If your fork does not allow workflow write access, the same progress file is still available in the workflow artifact.

The workflow summary shows a ladder like:

```text
Level 1  ✅ Completed
Level 2  ✅ Completed
Level 3  ▶️ Current
Level 4  🔒 Locked
...
Overall  2/10
```

Levels count as completed in order, so solving a later file does not skip an unfinished earlier level.

## Completion badge

At **10/10**, the workflow generates:

- `skillhawk-defender.txt` — completion record;
- `skillhawk-defender.svg` — shareable visual badge;
- `skillhawk-defender.md` — Markdown completion card;
- `progress.json`, `progress.md`, and `progress.svg`.

These files are published in the `skillhawk-lab-progress` GitHub Actions artifact.

The badge is an **educational completion artifact**, not a professional certification or security credential.

## Hall of Defenders

After completing all 10 levels, open a tiny PR to add yourself to [`defenders.json`](defenders.json).

See **[Hall of Defenders instructions](DEFENDERS.md)**.

The registry validator checks username format, duplicate entries, date format, and that your evidence URL points to a SkillHawk Actions run in your fork.

## Weekly bonus challenge

Returning fork owners can also solve the **[current weekly challenge](weekly/README.md)**.

It does not affect the 10-level core ladder. It exists to give fork owners a reason to sync their fork and come back for a fresh short exercise.

## Local path

Clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/skillhawk.git
cd skillhawk
```

Show your current level and findings:

```bash
npm run lab
```

Grade one level directly:

```bash
node lab/grade.js --challenge 3
```

Generate the dashboard and artifacts locally:

```bash
npm run lab:progress
```

Grade the weekly challenge:

```bash
npm run lab:weekly
```

## Anti-cheat / integrity rules

The grader does not accept an empty file as a solution. Each challenge has required headings and a minimum meaningful length.

The upstream repository also runs a template-integrity check to ensure all 10 starter levels and the weekly challenge remain intentionally vulnerable in the expected way.

The goal is remediation, not hiding strings from the scanner.

## What happens after Level 10?

The intended path is:

**Visitor → Fork owner → Security Lab learner → Defender badge → Hall of Defenders PR → SkillHawk contributor**

After the lab, continue with the repository's `good first issue` and `help wanted` tasks to improve actual detection rules, tests, fixtures, documentation, and benchmark quality.
