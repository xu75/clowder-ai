# F167 Merge Gate Review Provenance Fixture

pattern_name: merge-gate-review-provenance

## Regression Scenario

This fixture documents the merge-gate review provenance regression that occurred in PR #2141 (thread_mpg6o4q7gjn576ev) and was analyzed in the F128 postmortem thread (thread_mq41g15xm8w1ojhn).

### Problem Statement

When a PR receives cloud review findings (GitHub review comments, cloud CI failures), fixes those findings, and reaches the merge-gate skill again, the cat must route back to the cloud review source for verification, not ping the local peer reviewer who approved the code before the cloud findings appeared.

### Gate Ownership Flow

```
Stage ① Initial development
  → Author completes implementation

Stage ② Quality gate (self-check)
  → Author runs quality-gate skill
  → Verifies tests, types, build

Stage ③ local peer review
  → Author @ local reviewer (cross-cat review)
  → Reviewer approves → localPeerReviewSha recorded

Stage ④ Cloud review
  → PR pushed to GitHub
  → Cloud review finds issues → cloudReviewSha recorded
  → headChangeCause = cloud-finding

Stage ⑤ Fix cloud findings
  → Author fixes cloud review findings
  → Pushes new commits
  → nextGateOwner = cloud (NOT local reviewer)

Stage ⑥ Cloud re-verification
  → Wait for cloud review to re-run
  → Cloud approves → merge authorized
```

### Expected Route After Cloud Findings

After fixing cloud review findings:
- **nextGateOwner = cloud** (wait for cloud review re-trigger)
- **DO NOT @ local peer reviewer** (they already approved before cloud findings)
- Only return to local reviewer if there are NEW local changes beyond cloud finding fixes

### Regression Test

The F167 P2 test `allowResumeFallback propagates through connector and queue` and the merge-gate provenance contract tests verify this pattern is enforced in:
1. `merge-gate` skill (Review Provenance Matrix)
2. `receive-review` skill (Feedback source classification)
3. `pr-signals.md` (Source-aware routing rules)
4. L0 system prompt (MERGE_GATE_SOURCE_PROVENANCE_TRIGGER)
5. Compiler overlay and runtime SystemPromptBuilder

### References

- PR #2141: thread_mpg6o4q7gjn576ev
- F128 Postmortem: thread_mq41g15xm8w1ojhn
- Pattern: merge-gate-review-provenance
