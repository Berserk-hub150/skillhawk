# SkillHawk Community Discoverability Report

## Goal

Make useful beginner contributions easy to discover, claim, validate, and merge while measuring whether the contributor funnel is healthy.

## Current funnel

`272-task catalog → bounded open issue pool → auto-claim → browser-only JSON PR → automatic task/path/schema validation → CI → fast merge → contributor metrics`

## Implemented discovery surfaces

Generated micro-issues use the following core labels:

- `good first issue`
- `help wanted`
- `community`
- `low hanging fruit`
- `up-for-grabs`
- `first-timers-only`
- `enhancement`
- `micro-contribution`
- `beginner-friendly`
- `type: task`
- `category:<category>`

The `hacktoberfest` label is created by the factory and added only during September/October so it is not misleading outside the contribution season.

## Task inventory

The catalog contains 16 SkillHawk-specific categories and 16 reusable review angles, producing 256 generated tasks. The original 16 curated tasks remain available, for a total inventory of 272 distinct tasks.

The generated categories are finding titles, finding evidence, remediation guidance, false-positive resistance, rule design, severity calibration, safe fixtures, privacy/redaction, CLI experience, MCP guidance, SKILL.md guidance, security documentation, testing guidance, SARIF quality, security education, and threat modeling.

## Scheduling

The factory is scheduled with `*/17 * * * *`. It also accepts `workflow_dispatch` and `repository_dispatch` (`community_issue_tick`). A scheduled run checks for a manual/external dispatch in the previous 25 minutes and skips when one already handled the pool.

## Metrics to watch

The existing community metrics workflow records stars, forks, open micro-contributions, and merged micro-contributions. Useful operational ratios include:

- claim rate: claimed issues / generated issues;
- completion rate: completed micro-issues / claimed micro-issues;
- first-PR conversion: first-time PR authors / unique claimants;
- validation pass rate: fast-path eligible PRs / micro-contribution PRs;
- median time from PR open to merge;
- abandoned-task rate;
- repeat-contributor rate.

These are contributor-experience measurements, not claims about GitHub's recommendation algorithm.

## Repository topics

Suggested repository topics, kept relevant to the actual project and contributor experience:

`agent-skills`, `ai-agents`, `mcp`, `security`, `static-analysis`, `open-source`, `good-first-issue`, `beginner-friendly`, `first-contributions`, `contributions-welcome`, `help-wanted`, `security-tools`, `developer-tools`, `nodejs`, `javascript`, `github-actions`, `claude-code`, `codex`, `skill-md`, `ai-security`.

Repository topics are repository metadata and are intentionally documented here so maintainers can review them before changing public metadata.

## Guardrails

Automation should improve contributor throughput without fabricating social proof. SkillHawk therefore uses deterministic acknowledgement reactions, explicit automation markers, never requires a star for acceptance, does not reset completed work to create fresh issues, and does not delete completed contributions merely to make them contributable again.
