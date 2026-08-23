# Contributing to SkillHawk

Contributions are intentionally kept beginner-friendly.

## Fastest path: Security Lab

New to SkillHawk? Start with the browser-first [SkillHawk Security Lab](lab/README.md):

1. fork the repository;
2. repair `lab/challenge-01/SKILL.md` in the browser;
3. push the change;
4. let GitHub Actions grade it;
5. continue through the 10-level ladder;
6. unlock the Defender completion artifact;
7. optionally open a tiny PR to join the [Hall of Defenders](lab/DEFENDERS.md).

The core lab requires no local setup.

## Browser-only micro-contributions

SkillHawk has a **272-task community catalog** spanning 16 security/documentation categories. The issue factory runs about every 17 minutes and keeps a bounded set of newcomer tasks available instead of opening the whole catalog at once.

1. Open the [current micro-contributions](https://github.com/Berserk-hub150/skillhawk/issues?q=is%3Aissue+is%3Aopen+label%3Amicro-contribution).
2. Pick an unassigned `good first issue` / `up-for-grabs` task.
3. Comment on it; the auto-assign workflow claims it for you.
4. Fork SkillHawk if needed.
5. Create the single JSON file shown in the issue directly from the GitHub web editor.
6. Replace `REPLACE_ME` with a short original tip when the task requests one.
7. Open a PR using the `MC-###` task ID and `Closes #...`.
8. The community guard validates the exact path, JSON schema, task link, and basic secret-safety checks automatically.
9. When validation and CI pass, eligible one-file tasks can use the fast merge path.

The generated categories cover finding titles, finding evidence, remediation, false positives, rule design, severity, safe fixtures, privacy, CLI UX, MCP, SKILL.md, documentation, testing, SARIF, education, and threat modeling.

A star is appreciated if the project is useful to you, but it is never required for contribution or merge.

Read [Community Automation](docs/COMMUNITY_AUTOMATION.md), [External Scheduler](docs/COMMUNITY_EXTERNAL_SCHEDULER.md), and [Community Discoverability Report](docs/COMMUNITY_DISCOVERY_REPORT.md) for the exact lifecycle.

## Fast path for code contributions

1. Fork the repository.
2. Create a branch: `git switch -c fix/my-change`.
3. Run `npm test`.
4. Add or update a test for behavior changes.
5. Open a pull request with a short explanation and a before/after example.

## Great first code contributions

- Add a detection rule with one positive and one negative test.
- Improve Windows/PowerShell detection.
- Add MCP configuration fixtures.
- Reduce false positives in an existing rule.
- Improve terminal output or documentation.
- Add a small Security Lab challenge or hint improvement.

Rules live in `src/rules.js`; each rule has an ID, severity, title, remediation advice, and a regular expression. Keep rules narrow and explainable.
