# SkillHawk Community Automation

SkillHawk maintains a bounded pool of useful browser-first contribution tasks backed by a large deterministic catalog.

## Flow

`272-task catalog → good first issue → comment/auto-claim → browser edit → PR → automatic task/path/schema validation → CI → fast merge → contributor metrics`

Only unfinished tasks may be offered again. A task closed as completed is never reset merely to create a fresh issue.

## Inventory

- 16 curated legacy tasks in `community/backlog/tasks.json`.
- 16 SkillHawk-specific categories × 16 contribution angles in `community/backlog/catalog.json`.
- 256 generated tasks plus the 16 legacy tasks = **272 distinct opportunities**.
- Generated task IDs begin at `MC-100` and map deterministically to one category/angle pair.

## Workflows

- `community-issue-factory.yml` runs every ~17 minutes and keeps at most 12 open micro-contribution issues.
- The factory also accepts manual and HTTP `repository_dispatch` triggers and skips its scheduled fallback when a dispatch already ran recently.
- `community-auto-assign.yml` assigns the first interested commenter and acknowledges the claim.
- `community-pr-guard.yml` validates the exact task path, JSON schema, placeholder replacement, basic secret-safety checks, and issue link.
- `community-fast-merge.yml` can squash-merge only a validated one-file micro-contribution after CI succeeds.
- `community-stale-requeue.yml` checks hourly and releases genuinely abandoned work after its inactivity window.
- `community-pr-welcome.yml` identifies first-time SkillHawk PR authors and gives immediate status guidance.
- `community-author-index.yml` periodically/backfill-indexes all historical PR authors in one consolidated file.
- `community-contributor-ledger.yml` records unique merged micro-contributors.
- `community-metrics.yml` stores a daily public snapshot of stars, forks, open tasks, and merged micro-contributions.

## Labels and categories

The factory creates and uses newcomer/discovery labels including `good first issue`, `help wanted`, `community`, `up-for-grabs`, `first-timers-only`, `low hanging fruit`, `enhancement`, `micro-contribution`, `beginner-friendly`, `type: task`, and one `category:*` label. `hacktoberfest` is only attached during September/October.

## Automation identity

By default the factory uses `GITHUB_TOKEN`. Maintainers may configure `COMMUNITY_AUTOMATION_TOKEN` when a separate repository-scoped automation token is technically useful. Generated issues always contain an explicit automation marker and notice, regardless of which token is used.

## External scheduler

See `docs/COMMUNITY_EXTERNAL_SCHEDULER.md`. GitHub's authenticated `repository_dispatch` endpoint is the external HTTP entry point, so no separate web service is required.

## Engagement behavior

SkillHawk uses deterministic acknowledgement reactions as functional feedback: one reaction for a successful issue claim and limited welcome reactions for a micro-PR. It does not create random reaction bursts.

## Completed work

Completed contributions stay completed. The system can re-offer tasks closed as abandoned (`not_planned`) but does not reset completed tasks, delete completed contributions to manufacture more work, or require a star for acceptance.
