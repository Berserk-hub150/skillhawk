# Contributing to SkillHawk

Contributions are intentionally kept beginner-friendly.

## Fast path

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
