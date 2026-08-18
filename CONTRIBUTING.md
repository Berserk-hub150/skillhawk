# Contributing to SkillHawk

Contributions are intentionally kept beginner-friendly.

## Try the Security Lab first

If you are new to SkillHawk, the fastest hands-on introduction is the browser-first [SkillHawk Security Lab](lab/README.md):

1. fork the repository;
2. repair the intentionally unsafe `lab/challenge-01/SKILL.md`;
3. push the change;
4. let GitHub Actions grade it;
5. reach 0 findings / 100 score and download the completion artifact.

No local setup is required for the lab.

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

Rules live in `src/rules.js`; each rule has an ID, severity, title, remediation advice, and a regular expression. Keep rules narrow and explainable.
