# External Community Scheduler

SkillHawk's primary community issue factory runs in GitHub Actions every 17 minutes. It also exposes `repository_dispatch` entry points so an external scheduler can trigger the same workflows without maintaining a second implementation.

Send authenticated GitHub REST requests to:

```text
POST /repos/Berserk-hub150/skillhawk/dispatches
```

Supported event types:

| Event type | Action |
|---|---|
| `community_issue_tick` | Fill the bounded Good First Issue pool from the 272-task catalog |
| `community_authors_backfill` | Rebuild the historical PR-author index |
| `community_backlog_audit` | Check how many genuinely unused tasks remain |
| `community_archive_tick` | Run the 100-file community-content archive/compaction check |

Example payload:

```json
{
  "event_type": "community_issue_tick"
}
```

For the issue factory, if a manual or external dispatch ran in the previous 25 minutes, the regular scheduled invocation skips itself and acts only as a fallback.

## Authentication

Use a repository-scoped token with only the permissions required to dispatch Actions. Keep the token in the external scheduler's secret store; never commit it to SkillHawk.

The issue factory also supports an optional repository secret named `COMMUNITY_AUTOMATION_TOKEN`. When present, Actions uses it for issue creation; when absent, it uses the normal `GITHUB_TOKEN`. Generated issues always contain an explicit automation marker so the origin remains transparent regardless of token identity.

## Why GitHub's dispatch endpoint is enough

A separate Vercel/Express endpoint is not required: GitHub already provides the authenticated HTTP entry point, while the workflows contain the actual business logic. This avoids duplicating secrets and scheduling code.
