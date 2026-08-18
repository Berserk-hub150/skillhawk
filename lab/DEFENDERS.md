# Hall of Defenders

Complete all 10 core SkillHawk Security Lab levels, then add yourself to the public defender registry with one tiny pull request.

## Eligibility

Your fork must show:

- **10/10 core challenges completed**;
- a successful **SkillHawk Security Lab** GitHub Actions run;
- a generated `skillhawk-defender` completion artifact.

The badge and hall entry are educational completion records, not professional certifications.

## Join the hall

Edit [`defenders.json`](defenders.json) and append exactly one object:

```json
{
  "username": "YOUR-GITHUB-USERNAME",
  "completed": "YYYY-MM-DD",
  "evidence": "https://github.com/YOUR-GITHUB-USERNAME/skillhawk/actions/runs/RUN_ID"
}
```

Keep the JSON valid and open a pull request titled:

```text
lab: add YOUR-GITHUB-USERNAME to Hall of Defenders
```

CI validates username format, duplicate entries, date format, and that the evidence URL points to a SkillHawk workflow run in your fork.

Maintainers may verify the linked run before merging the hall entry.
