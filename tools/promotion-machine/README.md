# SkillHawk Promotion Machine

A human-approved outreach pipeline for finding genuinely relevant GitHub repositories where SkillHawk may be useful.

## Goals

- Discover relevant repositories around AI agent security, Agent Skills, `SKILL.md`, MCP security, Claude Code, Codex, Cursor, prompt injection, and agent supply-chain security.
- Rank candidates by relevance and repository quality.
- Generate a proposed minimal contribution and PR copy.
- Deduplicate previous targets.
- Never automate stars, follows, reactions, or rank manipulation.
- Never mass-open pull requests. Publishing remains an explicit human action.

## Workflow

```text
GitHub discovery
  -> relevance scoring
  -> policy / contribution-guide checks
  -> deduplication
  -> candidate report
  -> human review
  -> prepare one minimal contribution
  -> human-approved PR
```

## Recommended target classes

1. `awesome-*` lists focused on AI agent security, MCP security, agent skills, prompt injection, or AI security tooling.
2. Educational security labs and course resource lists where a static scanner or hands-on lab is directly relevant.
3. Agent tooling repositories that already maintain a security-tools/resource section.
4. Repositories using `SKILL.md` or MCP configuration where maintainers explicitly welcome security integrations.

Avoid repositories where SkillHawk would be only tangentially related.

## Review gate

A candidate should only advance when all of these are true:

- The repository is active and public.
- SkillHawk clearly fits an existing section or documented need.
- The repository accepts outside contributions.
- The proposed change is minimal and useful to that project.
- The same project has not already been contacted.
- The PR text is specific to the target repository, not generic bulk outreach.

## Suggested scoring

| Signal | Points |
|---|---:|
| Exact agent-skills / `SKILL.md` security focus | +35 |
| MCP security focus | +30 |
| AI-agent security tools/resources section | +25 |
| Explicit contribution instructions | +10 |
| Active in last 90 days | +10 |
| SkillHawk already present | reject |
| Archived/read-only | reject |
| Tangential relevance only | reject |

Recommended review threshold: **60/100**.

## PR style

Keep every proposal narrow. Example:

```markdown
Add SkillHawk to agent security tools

Thanks for maintaining this collection of agent-security resources.

I'd like to suggest [SkillHawk](https://github.com/Berserk-hub150/skillhawk), an open-source static scanner and hands-on lab for AI Agent Skills, `SKILL.md`, and MCP configurations. It detects risky instruction patterns without executing the target and includes a reproducible public benchmark.

I followed the existing list format and kept the change to a single resource entry. Please feel free to suggest changes or close the PR if it is not a fit.
```

## Safety rails

This pipeline intentionally excludes:

- automated starring/following;
- star-for-star or follow-for-follow campaigns;
- bulk unsolicited issue creation;
- automatic PR publication across large numbers of repositories;
- misleading claims about adoption or security guarantees;
- bypassing repository contribution rules.

The useful automation is in **research, ranking, drafting, deduplication, and preparation**. The final outreach action remains human-approved.
