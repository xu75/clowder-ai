---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-18-eval-friction-provenance-route-stale-fix
source_snapshot: "snapshot:bundle/2026-08-18-eval-friction-provenance-route-stale-fix/snapshot"
---

# Live Verdict — 2026-08-18-eval-friction-provenance-route-stale-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-15 to 2026-08-18 friction window requires replayable evidence packaging, but eval:friction is still blocked at the publication lifecycle: the last eval:friction PR #41 and the current-window live publisher PRs #40 and #44 omitted sourceThreadId, while PR #11 remains unchanged with a failed Build. This remains a traceability and repair-route failure rather than evidence of a high-friction user cluster.
- Harness: F245/friction-rollup-publisher-source-thread-provenance (eval:friction rollup evidence publisher, sourceRefs freshness, and repair-route traceability)
- Root cause: Root cause remains environment_drift plus execution_gap: live publisher paths continue to omit sourceThreadId, the sourceRefs freshness repair PR remains stale and unmergeable, and owner delivery is blocked by provider auth/budget failures. The rollup generator itself has only produced empty in-band windows in the latest verified eval:friction PRs. (confidence high)
- Owner ask: Restore or replace the owner execution route, get PR #11 or an equivalent current-sourceRefs fix rebased onto current main with green CI, and restart or reroute eval:friction publishing through a current-main path that stamps sourceThreadId=thread_eval_friction into provenance.json and PR body. Preserve or assign the dirty primary checkout artifacts before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-08-21T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-18-eval-friction-provenance-route-stale-fix/snapshot
- attribution:bundle/2026-08-18-eval-friction-provenance-route-stale-fix/eval-F245-2026-08-18:no-finding
- metric:github.pr11.stale_hours
- metric:publisher.current_window_missing_source_thread_pr_count
- metric:eval_friction.last_verified_raw_rollup_signal_count
- metric:eval_friction.last_verified_raw_rollup_cluster_count
- metric:owner_dispatch.provider_auth_403_unique_request_ids
- metric:scheduled_prompt.stale_source_refs_selector_count

Counterarguments:
- An empty raw rollup window by itself would support keep_observe; the fix verdict is based on repeated provenance and repair-route failures, not fabricated cluster severity.
- The owner route 403 is not wholly inside F245, but it blocks the mandatory actionable-verdict lifecycle and therefore remains part of this repair-route finding.
- The scheduled task prompt still carries the old 2025 sample selector, but this publish call uses the fresh 2026-08-15 to 2026-08-18 selector, so today's replay input is not stale.