---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-10-01-eval-a2a-f023-autonomy-unblocked-test-path-fix
source_snapshot: "snapshot:bundle/2026-10-01-eval-a2a-f023-autonomy-unblocked-test-path-fix/snapshot"
---

# Live Verdict — 2026-10-01-eval-a2a-f023-autonomy-unblocked-test-path-fix

- Verdict: `fix`
- Phenomenon: The F023 gate moved from a ten-day false human-decision block to an owner-executed real invocation split with completed cross-review, so repair governance improved. PR #87 remains unmerged because Test (Public) deterministically exposed four hard-coded pre-split source paths; PR #81, PR #11, raw F167 freshness, and Grounding Phase O telemetry remain unresolved.
- Harness: F167/eval-a2a-scheduled-source-handoff (F167 A2A evidence delivery through scheduled Eval Hub invocations)
- Owner ask: On PR #87, update the four F153 source-inspection tests in packages/api/test/telemetry/mention-dispatch-trace.test.js to the new registry/queue/reconciliation paths, rerun the full Public Test, push a new SHA, and request delta re-review; merge #87 only after all checks are green. Then update PR #81 onto current main, resolve conflicts and required checks, obtain continuity review, merge and deploy, close superseded PR #80, replace or rebase PR #11, and run post-deploy F167 acceptance.
- Re-eval: PR #87 is merged after the four hard-coded source-path tests are corrected and all required checks pass; PR #81 is current, green, cross-reviewed, merged, and deployed; superseded PR #80 is closed; PR #11 is replaced or rebased; two consecutive post-deploy scheduled eval:a2a invocations complete and publish traceable verdicts within SLA; and a fresh F167 snapshot/attribution pair within 24 hours contains a valid counter_window plus non-null grounding.check_total and grounding.verdict_total, with every nonzero mismatch sample reviewed before any fail-closed escalation. at 2026-10-02T03:00:00Z

Evidence:
- snapshot:bundle/2026-10-01-eval-a2a-f023-autonomy-unblocked-test-path-fix/snapshot
- attribution:bundle/2026-10-01-eval-a2a-f023-autonomy-unblocked-test-path-fix/AR-2026-09-05-001
- metric:github:pull/102@8cec27c34e16a2cf47b9b2ad75017236898c5ca9#merged-traceable-2026-09-30-eval-a2a-verdict
- metric:github:pull/87@7bf3816f7213bc23131ee039580ef4adea4db488#open-cross-reviewed-test-public-failed
- metric:github:actions/36668841802/job/109739334999#four-f153-hardcoded-pre-split-source-path-failures
- metric:github:pull/81@ca418798927887462c0fb56aba4037918c6538a4#open-conflicting-test-public-and-directory-size-guard-failed
- metric:github:pull/80@17ad68503abf93927a0ef1ae4dd59ea34a8f0dfa#open-unstable-superseded
- metric:github:pull/11@6ae3f310248d374e32a448dd587b804141a7139e#open-build-failed-stale
- metric:docs:features/F023-directory-corrosion-defense.md#third-round-unblock-gate-b-satisfied
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#counter_window.duration_hours
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.check_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.verdict_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.mismatch_sample_count
- metric:filesystem:harness-feedback/F167-raw-latest@2026-09-06T03-01-04-233Z
- metric:scheduler:eval-a2a#legacy-disabled-no-legacy-task-ids
- trace:github:actions/36668841802/job/109739334999#f153-hardcoded-pre-split-source-path-failures
- thread:thread_eval_a2a/0001790738194556-000396-9b023652
- thread:thread_eval_friction/0001790742962652-000417-7c43e29d

Counterarguments:
- Day-over-day governance materially improved because F023 path B was correctly reinterpreted, the invocation directory was actually split, its exception was removed, and cross-review completed.
- PR #87 is close to merge and the four failing tests are mechanical path updates, so the current fix verdict should not be read as a return to the prior governance deadlock.
- The required-check count worsened from six to seven because the full suite found a real migration omission; exposing that omission is healthy fail-closed behavior.
- The selected counter window is 1020.900449 hours, well above two hours, but all relevant counters are null, so no counter-derived rate is valid.
- Grounding Phase O remains no-data rather than healthy: grounding.check_total, grounding.verdict_total, and grounding.mismatch_sample_count are null, so no mismatch distribution supports shadow-to-fail-closed escalation.
- Legacy scheduling remains disabled with no legacy task IDs, so the current daily entry does not indicate duplicate triggering.
