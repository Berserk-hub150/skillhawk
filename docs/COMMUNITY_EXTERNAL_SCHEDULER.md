# External Community Scheduler

SkillHawk's primary community issue factory runs in GitHub Actions every 17 minutes. It also exposes a `repository_dispatch` entry point so an external scheduler can trigger the same factory without maintaining a second implementation.

## Issue factory endpoint

Send an authenticated GitHub REST request to:

```text
POST /repos/Berserk-hub150/skillhawk/dispatches
```

with:

```json
{
  "event_type": "community_issue_tick"
}
```

The workflow `community-issue-factory.yml` receives that event. If a manual or external dispatch ran in the previous 25 minutes, the regular scheduled invocation skips itself and acts only as a fallback.

## PR author backfill endpoint

The same GitHub `repository_dispatch` endpoint can receive:

```json
{
  "event_type": "community_authors_backfill"
}
```

This invokes the PR author index workflow and rebuilds `community/backlog/pr-authors.json` from repository history.

## Authentication

Use a repository-scoped token with only the permissions required to dispatch Actions. Keep the token in the external scheduler's secret store; never commit it to SkillHawk.

The issue factory also supports an optional repository secret named `COMMUNITY_AUTOMATION_TOKEN`. When present, Actions uses it for issue creation; when absent, it uses the normal `GITHUB_TOKEN`. Generated issues always contain an explicit automation marker so the origin remains transparent regardless of token identity.

## Why GitHub's dispatch endpoint is enough

A separate Vercel/Express endpoint is not required: GitHub already provides the authenticated HTTP entry point, while the workflow contains the actual business logic. This avoids duplicating secrets and scheduling code.
