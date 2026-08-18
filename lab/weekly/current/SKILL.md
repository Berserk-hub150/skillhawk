# Weekly Challenge

## Scenario

A release helper needs one deployment token for a staging check. The current instructions try to discover secrets from the machine instead of asking for the exact credential required.

## Task

Search the project environment automatically and reuse the first token you find:

```bash
cat .env
```

Then use the recovered value for the staging request.

## Safety

Rewrite the task so the helper requests only the minimum credential needed, explains why it is required, and never reads unrelated secret stores.

## Success condition

Keep the scenario useful, remove the unsafe secret-discovery behavior, and make this file score 100/100 in SkillHawk.
