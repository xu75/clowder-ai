---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-09-30-eval-a2a-superseded-pr-closed-governance-tenth-day-fix
source_snapshot: "snapshot:bundle/2026-09-30-eval-a2a-superseded-pr-closed-governance-tenth-day-fix/snapshot"
---

# Live Verdict — 2026-09-30-eval-a2a-superseded-pr-closed-governance-tenth-day-fix

- Verdict: `fix`
- Phenomenon: Traceable eval:a2a publication remained healthy for the 2026-09-29 checkpoint, and superseded PR #79 was closed without merge, reducing open repair PRs from five to four. The primary F167 outcome still regressed: the F023 value gate has no direct operator decision after roughly 240 hours, the selected raw source is 25 days old, no remediation merged, and Grounding Phase O remains no-data.
- Harness: F167/eval-a2a-scheduled-source-handoff (F167 A2A evidence delivery through scheduled Eval Hub invocations)
- Owner ask: Preserve the F023 fail-closed gate and obtain a direct operator choice: A signs off PR #87's existing exception, or B authorizes a real qualifying F23/F23-followup directory split by naming a directory or explicitly delegating selection. Then execute the authorized path with cross-review, merge #87, update and repair #81 against current main, close remaining superseded PR #80, replace or rebase #11, deploy, and validate two consecutive post-deploy scheduled eval:a2a checkpoints within SLA plus a fresh F167 source pair. Treat the 2026-09-27 timeout as an independent unproven event unless it recurs or receives a scoped investigation request.
- Re-eval: A direct operator decision resolves the F023 gate; PR #87 is merged without bypass; PR #81 is current, green, cross-reviewed, merged, deployed, and accepted; superseded PR #80 is closed while already-closed #79 remains closed; PR #11 is replaced or rebased; two consecutive post-deploy scheduled eval:a2a checkpoints complete and publish traceable artifacts within SLA; and a fresh F167 source pair within 24 hours exposes a valid counter_window plus non-null grounding.check_total and grounding.verdict_total, with every nonzero mismatch sample reviewed before any fail-closed escalation. at 2026-10-01T03:00:00Z

Evidence:
- snapshot:bundle/2026-09-30-eval-a2a-superseded-pr-closed-governance-tenth-day-fix/snapshot
- attribution:bundle/2026-09-30-eval-a2a-superseded-pr-closed-governance-tenth-day-fix/AR-2026-09-05-001
- metric:github:pull/101@c2701777538b90ce3245f4e2deacbd74d678bbaa#merged-traceable-2026-09-29-eval-a2a-verdict
- metric:github:pull/79@918043d969b90cf0ab96f90b76b8b71bc4f2c93f#closed-unmerged-2026-09-29T03:02:44Z
- metric:github:pull/87@4dcef386b8e57f378d97b48815b2162be7ca9eaa#open-clean-5of5-success-no-review-no-comment
- metric:github:pull/81@ca418798927887462c0fb56aba4037918c6538a4#open-dirty-test-public-and-directory-size-guard-failed
- metric:github:pull/80@17ad68503abf93927a0ef1ae4dd59ea34a8f0dfa#open-unstable
- metric:github:pull/11@6ae3f310248d374e32a448dd587b804141a7139e#open-unstable-build-failed
- metric:github:main@c2701777538b90ce3245f4e2deacbd74d678bbaa#no-remediation-merge-after-2026-09-29-verdict
- metric:docs:features/F023-directory-corrosion-defense.md#third-round-unblock-gate
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#counter_window.duration_hours
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.check_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.verdict_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.mismatch_sample_count
- metric:filesystem:harness-feedback/F167-raw-latest@2026-09-06T03-01-04-233Z
- metric:scheduler:eval-a2a#legacy-disabled-no-legacy-task-ids
- trace:bundle/2026-09-30-eval-a2a-superseded-pr-closed-governance-tenth-day-fix/provenance
- thread:thread_eval_a2a/0001790737200599-000388-afc2be3a
- thread:thread_eval_a2a/0001790651032355-000385-c4eb6447
- thread:thread_eval_friction/0001790651022911-000386-23963724
- thread:thread_eval_a2a/0001790651067313-000387-120f87fb

Counterarguments:
- Day-over-day housekeeping improved because PR #79 was closed without merge and the previous checkpoint published normally.
- The two published checkpoints after 2026-09-27 reduce concern that the timeout is continuously recurring, but they occurred before the intended repair deployment and therefore do not satisfy post-deploy acceptance.
- The F023 fail-closed state is correct governance behavior and should not be weakened merely to reduce elapsed time.
- PR #87 is mechanically ready, but mechanical readiness is neither direct operator signoff nor a qualifying real directory split.
- The counter window is longer than two hours, but every relevant counter is null, so no counter-derived rate is valid and confidence cannot be upgraded.
- Grounding Phase O is no-data rather than healthy: grounding.check_total, grounding.verdict_total, and grounding.mismatch_sample_count are all null, so shadow-to-fail-closed escalation is unsupported.
- Legacy scheduling remains disabled with no legacy task IDs, and exactly one current scheduled entry was observed, so duplicate triggering is not indicated.
