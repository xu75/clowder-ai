---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-24-eval-friction-provenance-route-stale-fix
source_snapshot: "snapshot:bundle/2026-08-24-eval-friction-provenance-route-stale-fix/snapshot"
---

# Live Verdict — 2026-08-24-eval-friction-provenance-route-stale-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-21 to 2026-08-24 friction window needs replayable evidence packaging, but the publication lifecycle regressed again: eval:friction's latest PR #50 still omitted sourceThreadId, a current-window a2a first attempt #53 also omitted Source thread, and PR #11 remains unchanged with a failed Build. Valid a2a replacements #51 and #54 show the current-main path can stamp Source thread, but the F245 route has not produced a traceable merged evidence PR.
- Harness: F245/friction-rollup-publisher-source-thread-provenance (eval:friction rollup evidence publisher, sourceRefs freshness, and repair-route traceability)
- Root cause: Root cause remains a mixed environment_drift and execution_gap: current-main replacement publication can stamp Source thread, but stale or domain-specific publication routes still omit it, PR #11 is still unmergeable, and owner delivery is still blocked by provider auth/budget failures. (confidence high)
- Owner ask: Repair eval:friction's publishing route so it uses the same current-main sourceThreadId stamping behavior as valid a2a replacements, then rebase or replace PR #11 with green CI. Restore the owner execution route and preserve or assign the dirty primary checkout before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-08-27T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-24-eval-friction-provenance-route-stale-fix/snapshot
- attribution:bundle/2026-08-24-eval-friction-provenance-route-stale-fix/eval-F245-2026-08-24:no-finding
- metric:github.pr11.stale_hours
- metric:publisher.current_window_missing_source_thread_pr_count
- metric:publisher.current_window_source_thread_stamped_pr_count
- metric:eval_friction.last_verified_raw_rollup_signal_count
- metric:eval_friction.last_verified_raw_rollup_cluster_count
- metric:owner_dispatch.provider_auth_403_unique_request_ids
- metric:scheduled_prompt.stale_source_refs_selector_count

Counterarguments:
- A valid a2a replacement path exists, so the finding should not claim the entire verdict publisher is broken; the unresolved gap is the eval:friction route plus owner/sourceRefs closure.
- An empty raw rollup window by itself would support keep_observe, but repeated lifecycle failures remain actionable and block mandatory PR handling.
- The scheduled task prompt still carries the old 2025 sample selector, but this publish call uses the fresh 2026-08-21 to 2026-08-24 selector, so today's replay input is current.