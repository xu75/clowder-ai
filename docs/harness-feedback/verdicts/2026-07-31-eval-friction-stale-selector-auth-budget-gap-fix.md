---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-07-31-eval-friction-stale-selector-auth-budget-gap-fix
source_snapshot: "snapshot:bundle/2026-07-31-eval-friction-stale-selector-auth-budget-gap-fix/snapshot"
---

# Live Verdict — 2026-07-31-eval-friction-stale-selector-auth-budget-gap-fix

- Verdict: `fix`
- Phenomenon: The eval:friction scheduled prompt still supplies the hard-coded 2025-10-01 to 2025-10-02 sourceRefs after the 2026-07-25 stale-selector fix verdict, so the scheduler path has not yet delivered fresh replay context. I used the current every-3d window for this evidence PR, and the same 72h period also shows repeated 403 auth-budget failures in eval threads that are not reliably represented by the current four rollup channels.
- Harness: F245/friction-rollup-source-refs-and-auth-coverage (friction rollup sourceRefs freshness and auth-failure coverage)
- Root cause: harness_misfit: the scheduled invocation still exposes a stale example selector instead of generated current sourceRefs, and the current rollup source mix misses provider auth-budget failures unless they are manually reported or confirmed. The sourceRefs fix exists as PR #11 but has not reached the scheduling path. (confidence medium)
- Owner ask: Finish the stale-sourceRefs repair by getting PR #11 or an equivalent fix into the scheduler path, then add or route a first-class auth/runtime-failure signal source so repeated 403 precharge/authentication failures are visible to eval:friction without relying on manual paw-feel markers.
- Re-eval: next eval at 2026-08-03T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-07-31-eval-friction-stale-selector-auth-budget-gap-fix/snapshot
- attribution:bundle/2026-07-31-eval-friction-stale-selector-auth-budget-gap-fix/eval-F245-2026-07-31:no-finding
- metric:friction-rollup.cluster_count
- metric:friction-rollup.top_cluster_count
- metric:friction-rollup.tail_signal_count
- metric:scheduledPrompt.staleSourceRefs.currentFire
- metric:threadObserved.authBudgetFailures.uniqueRequestIds

Counterarguments:
- The current fresh selector may produce a valid empty rollup if none of the four channels observed confirmed friction, so the data-side verdict alone could be keep_observe.
- PR #11 already implements sourceRefs freshness but is still open, so this may be a merge-order delay rather than a new design defect.
- Budget/auth failures may be intentionally outside the initial F245 rollup scope, but repeated failures across eval threads make the blind spot operationally relevant.