---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-09-29-eval-a2a-publication-recovered-governance-ninth-day-fix
source_snapshot: "snapshot:bundle/2026-09-29-eval-a2a-publication-recovered-governance-ninth-day-fix/snapshot"
---

# Live Verdict — 2026-09-29-eval-a2a-publication-recovered-governance-ninth-day-fix

- Verdict: `fix`
- Phenomenon: Traceable verdict publication recovered on 2026-09-28 after the missed 2026-09-27 checkpoint. The primary F167 outcome still regressed, however: the F023 gate has no direct operator decision after roughly 216 hours, all five repair PRs remain open, the selected raw source is 24 days old, and Grounding Phase O remains no-data.
- Harness: F167/eval-a2a-scheduled-source-handoff (F167 A2A evidence delivery through scheduled Eval Hub invocations)
- Owner ask: Preserve the F023 fail-closed gate and obtain a direct operator choice: A signs off #87's existing exception, or B authorizes a real qualifying directory split by naming a directory or explicitly delegating selection. After that decision, execute the authorized path with cross-review, merge #87, update and repair #81 against current main, close superseded #79/#80, replace or rebase #11, and validate fresh runtime telemetry. Treat the 2026-09-27 timeout as a separate unproven event; do not attribute it to #81 or open an owner implementation task without a scoped investigation request or recurrence evidence.
- Re-eval: The current checkpoint and the next scheduled eval:a2a checkpoint both complete and publish traceable artifacts within SLA; a direct operator decision resolves the F023 gate; #87 is merged without bypass; #81 is current, green, cross-reviewed, merged, deployed, and accepted; #79/#80 are closed; #11 is replaced or rebased; and a fresh F167 source pair within 24 hours exposes a valid counter_window plus non-null grounding.check_total and grounding.verdict_total, with any nonzero mismatch sample reviewed before fail-closed escalation. at 2026-09-30T03:00:00Z

Evidence:
- snapshot:bundle/2026-09-29-eval-a2a-publication-recovered-governance-ninth-day-fix/snapshot
- attribution:bundle/2026-09-29-eval-a2a-publication-recovered-governance-ninth-day-fix/AR-2026-09-05-001
- metric:github:pull/99@388d7da1112702dc8e708b73f494a3a97428e31d#merged-traceable-2026-09-28-eval-a2a-verdict
- metric:github:pull/87@4dcef386b8e57f378d97b48815b2162be7ca9eaa#open-clean-5of5-success-no-review-no-comment
- metric:github:pull/81@ca418798927887462c0fb56aba4037918c6538a4#open-dirty-test-public-and-directory-size-guard-failed
- metric:github:pull/11@6ae3f310248d374e32a448dd587b804141a7139e#open-unstable-build-failed
- metric:github:pull/79@918043d969b90cf0ab96f90b76b8b71bc4f2c93f#open
- metric:github:pull/80@17ad68503abf93927a0ef1ae4dd59ea34a8f0dfa#open
- metric:github:main@388d7da1112702dc8e708b73f494a3a97428e31d#no-remediation-merge-after-2026-09-28-verdict
- metric:docs:features/F023-directory-corrosion-defense.md#third-round-unblock-gate
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#counter_window.duration_hours
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.check_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.verdict_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.mismatch_sample_count
- metric:filesystem:harness-feedback/F167-raw-latest@2026-09-06T03-01-04-233Z
- metric:scheduler:eval-a2a#legacy-disabled-no-legacy-task-ids
- trace:bundle/2026-09-29-eval-a2a-publication-recovered-governance-ninth-day-fix/provenance
- thread:thread_eval_a2a/0001790650800642-000377-4ccd5e9f
- thread:thread_eval_a2a/0001790564679679-000371-bb59a696
- thread:thread_eval_a2a/0001790564734753-000373-e114cc10
- thread:thread_eval_a2a/0001790565009832-000375-db33c67d
- thread:thread_eval_a2a/0001790565083754-000376-1e9861d1

Counterarguments:
- Publication improved day-over-day because the 2026-09-28 traceable verdict merged after the 2026-09-27 miss.
- One recovered checkpoint does not establish that the 1800-second timeout cannot recur.
- The F023 fail-closed state is correct governance behavior and should not be weakened to improve elapsed time.
- PR #87 is mechanically ready, but mechanical readiness is not operator signoff or a real qualifying split.
- The counter window is much longer than two hours, but all relevant counters are null, so no counter-derived rate is valid.
- Grounding Phase O remains no-data rather than a healthy distribution; shadow-to-fail-closed escalation is unsupported.
- Legacy scheduling is disabled with no legacy task IDs, and one current entry was observed, so duplicate triggering is not indicated.
