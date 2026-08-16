# SkillHawk Benchmark

SkillHawk ships with a small, reproducible **synthetic benchmark** for its static detection rules.

The benchmark is intentionally transparent: it includes easy positives, benign negatives, and several hard cases that expose known false positives and false negatives. It is **not** an independent security audit and must not be interpreted as real-world malware detection accuracy.

## Current snapshot

| Metric | Result |
|---|---:|
| Fixtures | **48** |
| Malicious / suspicious fixtures | **32** |
| Safe fixtures | **16** |
| Detection rules | **12** |
| True positives | **30** |
| False positives | **2** |
| True negatives | **14** |
| False negatives | **2** |
| Precision | **93.75%** |
| Recall | **93.75%** |
| F1 | **93.75%** |
| Specificity | **87.50%** |
| Accuracy | **91.67%** |

This snapshot is reproduced by the repository CI benchmark job, not hand-entered from an unverified local run.

## Reproduce it

```bash
npm run benchmark
```

Machine-readable output:

```bash
npm run benchmark -- --json
```

The benchmark runs in CI as a regression gate. It currently requires at least 40 labeled fixtures and both precision and recall of at least 90%.

## Dataset design

The fixtures live in [`benchmark/fixtures.js`](benchmark/fixtures.js). They are synthetic and contain no live credentials or active harmful payloads.

The positive set covers all 12 current SkillHawk rules, including remote script execution, encoded commands, destructive filesystem operations, credential access, persistence, privilege escalation, outbound uploads, broad permissions, prompt-injection patterns, dynamic shell execution, unpinned `npx`, and recursive access.

The negative set contains normal agent instructions and hard negatives that mention dangerous strings in defensive documentation.

## Known false positives

Two safe fixtures deliberately document a current limitation of regex-only line scanning:

- **S15:** defensive documentation quotes a `curl ... | bash` command, which triggers `SH001`.
- **S16:** defensive documentation mentions `~/.ssh/id_rsa`, which triggers `SH004`.

These are useful regression targets for future context-aware suppression.

## Known false negatives

Two suspicious fixtures document coverage gaps:

- **M31:** PowerShell `iwr ... | iex` download-and-execute chain.
- **M32:** Python `requests.get(...); exec(...)` remote execution chain.

These are intentionally retained so benchmark improvements represent real rule improvements rather than deleting difficult cases.

## Metric definitions

- **Precision:** TP / (TP + FP)
- **Recall:** TP / (TP + FN)
- **F1:** harmonic mean of precision and recall
- **Specificity:** TN / (TN + FP)
- **Accuracy:** (TP + TN) / all fixtures

## Scope and limitations

This benchmark measures the current labeled synthetic fixture set only. Real repositories are more complex, and SkillHawk remains a first-pass heuristic static scanner. A clean result is not proof of safety, and a finding is not proof of malicious intent.
