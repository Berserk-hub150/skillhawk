# SkillHawk Community Automation

SkillHawk keeps a small, bounded pool of useful browser-first contribution tasks.

## Flow

`backlog task → good first issue → claim → browser edit → PR → automatic validation → fast review/merge → completed`

Only unfinished tasks may be offered again. A task closed as completed is never recycled by the issue factory.

## Workflows

- `community-issue-factory.yml` keeps at most six open micro-contribution issues and runs hourly.
- `community-auto-assign.yml` assigns the first interested commenter.
- `community-pr-guard.yml` validates one-file contributor-note PRs and auto-links the matching issue from an `MC-###` task ID.
- `community-fast-merge.yml` can squash-merge only a validated one-file contributor-note PR when repository checks permit it.
- `community-stale-requeue.yml` releases genuinely abandoned work after a reasonable inactivity window.
- `community-pr-welcome.yml` gives contributors immediate status guidance.
- `community-contributor-ledger.yml` records unique merged micro-contributors.
- `community-metrics.yml` stores a daily public snapshot of stars, forks, open tasks, and merged micro-contributions.

## What this automation intentionally does not do

The automation does not create fake reactions, require stars, disguise bot activity as a human account, delete completed contributions to recreate work, or continuously churn completed issues for freshness.

Those signals are not necessary for a healthy contributor funnel. The goal is to make real useful work easy to discover and complete.
