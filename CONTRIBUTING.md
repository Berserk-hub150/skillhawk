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

## Fast path for code contributions

1. Fork the repository.
2. Create a branch: `git switch -c fix/my-change`.
3. Run `npm test`.
4. Add or update a test for behavior changes.
5. Open a pull request with a short explanation and a before/after example.

## Great first contributions

- Add a detection rule with one positive and one negative test.
- Improve Windows/PowerShell detection.
- Add MCP configuration fixtures.
- Reduce false positives in an existing rule.
- Improve terminal output or documentation.
- Add a small Security Lab challenge or hint improvement.

Rules live in `src/rules.js`; each rule has an ID, severity, title, remediation advice, and a regular expression. Keep rules narrow and explainable.

## Browser-only micro-contributions

SkillHawk automatically keeps a small pool of genuine `good first issue` + `micro-contribution` tasks available.

1. Open the [current micro-contributions](https://github.com/Berserk-hub150/skillhawk/issues?q=is%3Aissue+is%3Aopen+label%3Amicro-contribution).
2. Comment on an unassigned task to claim it automatically.
3. Fork the repository if needed.
4. Create the single JSON file shown in the issue directly from the GitHub web editor.
5. Open a PR using the `MC-###` task ID and `Closes #...`.
6. The community guard validates the file and issue link automatically.

These tasks are designed to take about two minutes and require no local setup. A star is appreciated if the project is useful to you, but it is never a requirement for contribution.

Read [Community Automation](docs/COMMUNITY_AUTOMATION.md) for the exact lifecycle and safeguards.
