---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-21-eval-friction-provenance-route-stale-fix
source_snapshot: "snapshot:bundle/2026-08-21-eval-friction-provenance-route-stale-fix/snapshot"
---

# Live Verdict — 2026-08-21-eval-friction-provenance-route-stale-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-18 to 2026-08-21 friction window needs replayable evidence packaging. Cross-domain evidence publishing has improved because PR #47, #48, and #49 include Source thread, but eval:friction's latest own PR #46 still omitted sourceThreadId and PR #11 remains unchanged with a failed Build, so the F245 repair loop is still open.
- Harness: F245/friction-rollup-publisher-source-thread-provenance (eval:friction rollup evidence publisher, sourceRefs freshness, and repair-route traceability)
- Root cause: Root cause is a mixed environment_drift and execution_gap: sourceThreadId stamping appears restored on the current-main a2a publication path, but eval:friction's own latest published PR still lacked sourceThreadId, the sourceRefs freshness repair PR remains stale and unmergeable, and owner delivery is still blocked by provider auth/budget failures. (confidence medium)
- Owner ask: Preserve the now-working sourceThreadId publication path, then either repair eval:friction's route if today's PR still lacks sourceThreadId or keep it on current-main if today's PR verifies. Rebase or replace PR #11 with green CI, restore the owner execution route, and preserve or assign the dirty primary checkout before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-08-24T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-21-eval-friction-provenance-route-stale-fix/snapshot
- attribution:bundle/2026-08-21-eval-friction-provenance-route-stale-fix/eval-F245-2026-08-21:no-finding
- metric:github.pr11.stale_hours
- metric:publisher.current_window_missing_source_thread_pr_count
- metric:publisher.current_window_source_thread_stamped_pr_count
- metric:eval_friction.last_verified_raw_rollup_signal_count
- metric:eval_friction.last_verified_raw_rollup_cluster_count
- metric:owner_dispatch.provider_auth_403_unique_request_ids
- metric:scheduled_prompt.stale_source_refs_selector_count

Counterarguments:
- The cross-domain publisher path improved, so a regressed classification would overstate the traceability picture; the verdict remains fix because eval:friction itself has not yet produced a traceable merged evidence PR after #46.
- An empty raw rollup window by itself would support keep_observe, but lifecycle failures remain actionable and repeatedly block mandatory PR handling.
- The scheduled task prompt still carries the old 2025 sample selector, but this publish call uses the fresh 2026-08-18 to 2026-08-21 selector, so today's replay input is current.