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

## Micro-contributions

If you prefer a 2–5 minute first PR, pick an open `good first issue` or `micro-contribution` task. These are intentionally small and should remain focused on one useful change.

If you arrived through an issue and have never used SkillHawk before, the Security Lab is the quickest way to understand what the scanner reports before contributing code.
