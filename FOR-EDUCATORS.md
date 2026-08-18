# SkillHawk for Educators

Use SkillHawk as a browser-first hands-on exercise for teaching AI-agent security, secure automation, prompt/instruction review, and defensive remediation.

**Students fork the repository, repair intentionally unsafe `SKILL.md` files, push their changes, and GitHub Actions grades the work automatically.**

No local development environment is required for the core lab.

> SkillHawk is an educational static-analysis project. The Defender badge generated at completion is an educational completion artifact, not a professional certification or security credential.

## Why use SkillHawk in a class or workshop?

SkillHawk gives every learner an isolated repository they own and can modify without touching the upstream project.

The learning loop is simple:

**Fork → enable Actions → inspect an unsafe instruction → repair it → commit → receive automatic feedback → continue to the next level.**

The core Security Lab includes 10 sequential challenges:

| Level | Difficulty | Security focus |
|---:|---|---|
| 1 | Beginner | Remote install chain |
| 2 | Beginner | Credential scavenging |
| 3 | Beginner | Destructive cleanup |
| 4 | Intermediate | Persistence / autostart |
| 5 | Intermediate | Privilege escalation |
| 6 | Intermediate | Silent outbound upload |
| 7 | Intermediate | World-writable permissions |
| 8 | Advanced | Prompt-injection instructions |
| 9 | Advanced | Dynamic shell execution |
| 10 | Advanced | Unpinned package execution |

Each challenge asks the learner to preserve the useful goal of the skill while replacing unsafe behavior with a safer alternative.

## Learning objectives

After completing the lab, learners should be able to:

- identify dangerous instructions in AI-agent skills and automation files;
- distinguish useful behavior from unsafe implementation details;
- remediate credential access, destructive commands, privilege escalation, persistence, outbound data transfer, and other risky patterns;
- explain why prompt-injection-style instructions and concealed actions are dangerous;
- use automated static-analysis feedback as part of a secure development workflow;
- work with forks, commits, GitHub Actions, and evidence from CI runs.

## Requirements

Learners need:

- a GitHub account;
- a modern web browser;
- permission to create a public fork and run GitHub Actions.

For the core path, learners do **not** need:

- Node.js;
- a local IDE;
- Docker;
- an API key;
- an AI model or external AI service.

## Student onboarding

Share this direct link with learners:

**https://github.com/Berserk-hub150/skillhawk/fork**

Then ask them to follow this exact order:

1. Fork SkillHawk into their own GitHub account.
2. Open the **Actions** tab in the fork.
3. If GitHub shows the fork-workflow warning, click **I understand my workflows, go ahead and enable them**.
4. Open `lab/challenge-01/SKILL.md`.
5. Click the pencil icon and repair the unsafe instruction without deleting the useful purpose or required headings.
6. Commit directly to the fork.
7. Open **Actions → SkillHawk Security Lab**.
8. Read the workflow summary and continue to the next unlocked level.

GitHub may disable Actions by default on a newly created fork. Enabling Actions **before the first challenge edit** avoids having to manually rerun the first grading workflow.

## 30-minute lesson

Recommended for an introduction, meetup, or short workshop.

**Goal:** complete Levels 1–3.

Suggested schedule:

| Time | Activity |
|---:|---|
| 0–5 min | Introduce AI-agent skills, least privilege, and unsafe instructions |
| 5–10 min | Students fork SkillHawk and enable Actions |
| 10–25 min | Students complete Levels 1–3 |
| 25–30 min | Review the three vulnerability classes and remediation choices |

Recommended discussion prompts:

- Why is downloading a script different from immediately piping it into a shell?
- Why should an automation never inspect unrelated credentials?
- How can a cleanup task preserve its purpose without becoming destructive?

## 60-minute lesson

Recommended for a university lab or security workshop.

**Goal:** complete Levels 1–6.

Suggested schedule:

| Time | Activity |
|---:|---|
| 0–10 min | Threat model: AI agents, local tools, credentials, shell access |
| 10–15 min | Fork and workflow onboarding |
| 15–45 min | Levels 1–6 |
| 45–55 min | Pair review: compare different safe remediations |
| 55–60 min | Debrief and explain the remaining advanced levels |

Optional extension: ask students to explain one false-positive risk that a static analyzer might encounter when scanning natural-language instructions.

## 90-minute / full lab

Recommended for a graded exercise, CTF-style session, or advanced workshop.

**Goal:** complete all 10 levels and generate the Defender completion package.

At 10/10, the workflow generates:

- `skillhawk-defender.svg`;
- `skillhawk-defender.md`;
- `skillhawk-defender.txt`;
- `progress.json`, `progress.md`, and `progress.svg`.

These files are published in the `skillhawk-lab-progress` GitHub Actions artifact.

Learners may optionally submit a tiny PR to join the [Hall of Defenders](lab/DEFENDERS.md) with evidence from their successful workflow run.

## Copy-paste assignment brief

You can paste the following directly into an LMS, classroom page, or workshop chat:

> ### AI Agent Security Lab — SkillHawk
>
> Your task is to secure a set of intentionally unsafe AI-agent skill instructions.
>
> 1. Fork SkillHawk: https://github.com/Berserk-hub150/skillhawk/fork
> 2. Open the Actions tab in your fork and enable workflows if GitHub asks.
> 3. Start with `lab/challenge-01/SKILL.md`.
> 4. Preserve the useful goal and required headings, but replace the unsafe behavior with a safer alternative.
> 5. Commit your change to your fork.
> 6. Check **Actions → SkillHawk Security Lab** for automatic grading.
> 7. Continue through the required number of levels.
>
> Submit:
>
> - the URL of your fork;
> - the URL of your latest successful **SkillHawk Security Lab** workflow run;
> - a short explanation of one vulnerability you repaired and why your replacement is safer.

## Suggested assessment rubric

A simple 10-point rubric:

| Criterion | Points |
|---|---:|
| Required lab level reached with successful workflow evidence | 4 |
| Remediation preserves the original useful behavior | 2 |
| Security reasoning is technically sound | 2 |
| Student can explain the risk and mitigation clearly | 1 |
| Submission includes reproducible fork / Actions evidence | 1 |

For a non-graded workshop, use completion of the required levels as the only success criterion.

## Evidence and progress

The workflow summary shows learner progress, for example:

```text
Level 1  ✅ Completed
Level 2  ✅ Completed
Level 3  ▶️ Current
Level 4  🔒 Locked
...
Overall  2/10
```

Progress is sequential. A learner cannot skip an unfinished earlier level by editing a later challenge.

`lab/progress.json` is generated from the actual challenge files in the learner's fork. The workflow attempts to persist it back to the fork and also publishes progress artifacts through GitHub Actions.

## Instructor checklist

Before the session:

- open the fork link in a logged-out or test GitHub account;
- confirm that the **Actions** enablement step is visible and understood;
- decide how many levels students must complete;
- decide whether students submit only workflow evidence or also a written explanation;
- share the direct fork URL rather than asking students to clone the upstream repository;
- keep the upstream starter challenge files unchanged so the intended vulnerabilities remain available.

During the session:

- remind learners not to delete challenge files or required sections;
- encourage them to explain the security tradeoff instead of only chasing a green workflow;
- if a workflow does not run, first check whether Actions were enabled in the fork;
- use the job summary as the primary progress view.

After the session:

- collect fork and workflow URLs;
- optionally ask learners to share their Defender badge after 10/10;
- optionally point advanced learners to `good first issue` and `help wanted` tasks in the upstream repository.

## Troubleshooting

### The student committed a fix but no workflow started

The most common cause is that GitHub Actions were still disabled in the fork.

Open **Actions** and enable workflows. If the first commit happened before Actions were enabled, either make another small valid challenge edit and commit it or manually run **SkillHawk Security Lab** from the Actions tab.

### The workflow is green but progress was not committed back to the fork

Some fork permission configurations may prevent the workflow token from pushing `lab/progress.json` back automatically. The generated progress files are still available in the workflow artifact and job summary.

### A later level does not count as completed

The ladder is sequential. Complete every earlier level first.

### A learner deletes the dangerous line and most of the document

The grader includes structural integrity checks. Challenges require expected headings and meaningful content; the goal is remediation, not deletion or string hiding.

## Safety and privacy notes

- The core lab uses intentionally unsafe **text fixtures** for educational analysis.
- The scanner performs static analysis and does not execute the dangerous instructions it reports.
- Students should never paste real secrets, credentials, private keys, tokens, personal data, or institutional confidential information into challenge files.
- The public Hall of Defenders is optional.
- Educators using institutional GitHub policies should verify that student forks and workflow logs comply with local privacy requirements.

## Advanced extensions

For students who finish early:

1. Complete the [weekly bonus challenge](lab/weekly/README.md).
2. Inspect SkillHawk's detection rules and discuss possible false positives and false negatives.
3. Run the benchmark and analyze precision / recall tradeoffs.
4. Propose a new synthetic malicious/safe fixture.
5. Pick a `good first issue` and contribute an improvement upstream.

The intended progression is:

**Learner → fork owner → Security Lab completer → Defender → upstream contributor.**

## Links for educators

- **Fork for students:** https://github.com/Berserk-hub150/skillhawk/fork
- **Security Lab:** [lab/README.md](lab/README.md)
- **Hall of Defenders:** [lab/DEFENDERS.md](lab/DEFENDERS.md)
- **Weekly challenge:** [lab/weekly/README.md](lab/weekly/README.md)
- **Benchmark:** [BENCHMARK.md](BENCHMARK.md)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)

If you use SkillHawk in a class, club, workshop, or security meetup, opening a Discussion with feedback about the exercise format is useful for improving future challenge levels.