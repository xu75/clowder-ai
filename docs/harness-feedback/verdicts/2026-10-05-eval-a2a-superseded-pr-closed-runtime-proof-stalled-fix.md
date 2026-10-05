---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-10-05-eval-a2a-superseded-pr-closed-runtime-proof-stalled-fix
source_snapshot: "snapshot:bundle/2026-10-05-eval-a2a-superseded-pr-closed-runtime-proof-stalled-fix/snapshot"
---

# Live Verdict — 2026-10-05-eval-a2a-superseded-pr-closed-runtime-proof-stalled-fix

- Verdict: `fix`
- Phenomenon: The repair chain made one bounded step when superseded PR #80 closed, reducing open repair PRs from three to two. The owner task nevertheless remains in static diagnosis with no update for about 47.8 hours after yesterday's routed wake failed on provider quota, while PR #81 and PR #11 are unchanged, deployment is absent, and the selected F167/Grounding evidence remains stale and no-data.
- Harness: F167/eval-a2a-repair-delivery-loop (F167 A2A repair delivery, tracked-PR wakeup, and post-deploy evidence loop)
- Owner ask: Continue task 0001790910664256-000456-e2794290 from static diagnosis into runtime proof: inspect the cicd-check run ledger and 2026-10-01T03:17Z-03:32Z logs, classify scheduler admission/null fetch/TaskStore wiring/delivery-or-state-write, then land a red-green fix proving active re-registration plus new-head intent=merge terminal pass persists the current head and <head>:pass fingerprint and wakes exactly once, including duplicate-poll and null-then-recovery coverage. Then update PR #81 onto current main, resolve conflicts and required checks, obtain continuity review, merge and deploy; keep #80 closed; replace or rebase #11; preserve the unowned F167 propagation test until ownership is assigned; and regenerate fresh F167/Grounding evidence.
- Re-eval: Runtime ledger/log evidence identifies the missed-wake causal layer; the red-green regression fix is merged with active re-registration, duplicate-poll, and null-then-recovery coverage; PR #81 is current, green, reviewed, merged, and deployed; #80 remains closed and #11 is replaced or rebased; two consecutive post-deploy eval:a2a checkpoints publish traceable verdicts within SLA; each consumes an F167 snapshot/attribution pair no older than 24 hours with a valid counter_window and non-null grounding.check_total plus grounding.verdict_total. Every nonzero mismatch sample is reviewed before fail-closed escalation, or the artifact explicitly records that no stateful calls occurred. at 2026-10-06T03:00:00Z

Evidence:
- snapshot:bundle/2026-10-05-eval-a2a-superseded-pr-closed-runtime-proof-stalled-fix/snapshot
- attribution:bundle/2026-10-05-eval-a2a-superseded-pr-closed-runtime-proof-stalled-fix/AR-2026-09-05-001
- metric:github:pull/109@4baa54a81314f9d27cc0db760feb7406f596de80#merged-cross-domain-verdict
- metric:github:pull/80@17ad68503abf93927a0ef1ae4dd59ea34a8f0dfa#closed-unmerged
- metric:github:pull/81@ca418798927887462c0fb56aba4037918c6538a4#open-dirty-stale-checks
- metric:github:pull/11@6ae3f310248d374e32a448dd587b804141a7139e#open-build-failed-stale
- metric:task:0001790910664256-000456-e2794290#doing-updated-2026-10-03T03:12:27.526Z
- metric:filesystem:harness-feedback/F167-raw-latest@2026-09-06T03-01-04-233Z
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#counter_window.duration_hours=1020.900449
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.check_total=null
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.verdict_total=null
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.mismatch_sample_count=null
- metric:scheduler:eval-a2a#legacyScheduledTaskIds-empty-legacyCleanup-disabled
- trace:thread_eval_friction/0001791083119713-000491-0719ffd4#2026-10-04-owner-handoff
- trace:thread_eval_friction/0001791083119811-000492-8afdf147#owner-wake-provider-quota-403
- trace:thread_eval_friction/0001790997411952-000474-29e58bd9#static-diagnosis-breakpoint

Counterarguments:
- Closing superseded PR #80 is real scope reduction and supports the improved direction even though it does not repair runtime behavior.
- The concurrent eval:friction PR #109 independently classifies the same loop as improved but still actionable, reducing the chance that this is an eval:a2a-only narrative.
- About 47.8 hours without a task update does not prove abandonment because the owner invocation hit an external provider quota failure.
- The stale selected artifact proves an evidence freshness gap, not the health of the currently deployed runtime.
- The counter window is longer than two hours, but all relevant core and Grounding counters are null, so no counter-derived rate or fail-closed escalation is valid.
- Legacy scheduling is disabled with no legacy task IDs, so duplicate legacy triggers are not implicated.
