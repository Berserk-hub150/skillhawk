# SkillHawk Weekly Challenge

A small bonus challenge that can be rotated regularly without changing the 10-level core ladder.

## Current challenge

Open [`current/SKILL.md`](current/SKILL.md), repair the unsafe instruction, and push the change to your fork.

The fork workflow detects changes under `lab/weekly/` and grades the current weekly challenge automatically.

You can also run it locally:

```bash
node lab/grade.js --weekly
```

A weekly challenge is intentionally separate from the 10 core levels: it gives returning fork owners a reason to sync their fork and come back for a new exercise.

## Maintainer rotation

When publishing a new weekly challenge:

1. archive the previous prompt under a dated folder if you want to keep history;
2. replace `current/SKILL.md` with one focused unsafe pattern;
3. update the weekly title in `lab/grade.js` if needed;
4. run `npm run lab:template` before merging.

Keep weekly tasks small enough to solve in a few minutes and never include live credentials, real malicious infrastructure, or executable payloads.
