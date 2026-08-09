---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-09-eval-friction-publisher-provenance-route-blocked-fix
source_snapshot: "snapshot:bundle/2026-08-09-eval-friction-publisher-provenance-route-blocked-fix/snapshot"
---

# Live Verdict — 2026-08-09-eval-friction-publisher-provenance-route-blocked-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-06 to 2026-08-09 friction window is expected to remain in-band no-finding, but the previous eval:friction evidence PR #25 had to be closed because the live publisher omitted sourceThreadId from both provenance.json and PR body. In the same 72h window PR #11 stayed unchanged with the old Build failure and three more owner handoff attempts failed with @opus provider prepaid-budget/auth 403, so the eval:friction repair loop has regressed rather than closed.
- Harness: F245/friction-publisher-provenance-and-owner-route (eval:friction publisher traceability, sourceRefs freshness, and owner route)
- Root cause: environment_drift plus execution_gap and harness_misfit: the live eval:friction publisher path still appears stale enough to omit source-thread provenance, while the sourceRefs freshness repair PR has not been rebased or merged and the designated owner route remains blocked by provider prepaid-budget/auth. The raw friction rollup may be empty, but the eval lifecycle cannot produce a mergeable, traceable verdict or hand off repair work. (confidence high)
- Owner ask: Restore or replace the owner execution route, get PR #11 or an equivalent current-sourceRefs fix rebased onto current main with green CI, and restart or reroute eval:friction publishing through a current-main path that stamps sourceThreadId=thread_eval_friction into provenance.json and PR body. Preserve or assign the dirty main worktree artifacts before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-08-12T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-09-eval-friction-publisher-provenance-route-blocked-fix/snapshot
- attribution:bundle/2026-08-09-eval-friction-publisher-provenance-route-blocked-fix/eval-F245-2026-08-09:no-finding
- metric:friction-rollup.cluster_count
- metric:publisher.evalFrictionMissingSourceThreadIdPrCount
- metric:scheduledPrompt.staleSourceRefs.currentFire
- metric:github.pr11.staleHours
- metric:threadObserved.ownerHandoffAuthFailures.uniqueRequestIds

Counterarguments:
- The fresh rollup may contain zero in-band friction signals, so this verdict is about unclosed eval lifecycle blockers rather than a newly surfaced cluster.
- Closing invalid provenance PRs creates repeated unmerged evidence attempts; nevertheless merging traceability-broken verdicts would violate the domain contract.
- A provider billing/auth fix alone might restore owner dispatch without code changes, but PR #11 and the stale publisher/sourceRefs path still need closure verification.