---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-09-05-eval-friction-provenance-backlog-fix
source_snapshot: "snapshot:bundle/2026-09-05-eval-friction-provenance-backlog-fix/snapshot"
---

# Live Verdict — 2026-09-05-eval-friction-provenance-backlog-fix

- Verdict: `fix`
- Phenomenon: The fresh eval:friction rollup window is empty, but the surrounding verdict publication surface regressed: current-window verdict PRs repeatedly omit sourceThreadId, the open untraceable evidence backlog continues to grow, and the scheduled prompt still carries a stale sample selector. This is an actionable harness/publisher traceability failure rather than a user-facing high-friction cluster.
- Harness: F245/harness-eval (Friction Signal Eval / verdict publication traceability)
- Root cause: Most likely environment_drift plus execution_gap: the central source-thread provenance fix exists in git history, but the active eval:friction publisher/runtime route is not consistently executing it, while stale PR #11 and provider budget/auth failures prevent normal owner remediation from closing the loop. (confidence medium)
- Owner ask: Repair the eval:friction verdict publication route so both PR body and provenance.json stamp sourceThreadId=thread_eval_friction; close or replace the untraceable evidence backlog (#58/#60/#61/#62/#64/#66/#67/#69/#70/#71); rebase or replace PR #11 with green CI if it remains the intended sourceRefs fix; and keep the dirty primary checkout preserved before any operator-managed clean-main restart.
- Re-eval: next eval at 2026-09-08T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-09-05-eval-friction-provenance-backlog-fix/snapshot
- attribution:bundle/2026-09-05-eval-friction-provenance-backlog-fix/eval-F245-2026-09-05:no-finding
- metric:pr11StaleHours=935.748889
- metric:currentWindowMissingSourceThreadPrs=4
- metric:currentWindowSourceThreadStampedPrs=0
- metric:currentWindowOpenUntraceablePrs=3
- metric:totalOpenUntraceablePrs=10
- metric:ownerDispatchAuth403UniqueRequestIds=3
- metric:scheduledPromptStaleSelectorFires=1
- metric:lastVerifiedRollupSignalCount=0
- metric:lastVerifiedRollupClusterCount=0

Counterarguments:
- The current rollup has signalCount=0 and clusterCount=0, so the user-facing friction surface may still be quiet; the fix verdict is scoped to harness traceability and lifecycle debt.
- Closed fail-closed PRs are expected when provenance is missing, so their existence alone is not a production incident; the regression is the repeated recurrence and growing open backlog.
- Provider 403 is an external/operator funding issue, not a code bug by itself; it is included because it blocks the mandatory owner handoff lifecycle and keeps remediation from completing.