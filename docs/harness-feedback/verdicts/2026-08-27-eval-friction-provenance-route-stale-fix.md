---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-27-eval-friction-provenance-route-stale-fix
source_snapshot: "snapshot:bundle/2026-08-27-eval-friction-provenance-route-stale-fix/snapshot"
---

# Live Verdict — 2026-08-27-eval-friction-provenance-route-stale-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-24 to 2026-08-27 friction window needs replayable evidence packaging, but the publication and repair lifecycle remains unresolved: eval:friction's latest PR #55 still omitted sourceThreadId, the current-window a2a PR #58 is still open and also omits Source thread, and PR #11 remains unchanged with a failed Build. Valid a2a PRs #56 and #57 show sourceThreadId stamping can work, so the remaining issue is route-specific drift plus stalled owner/sourceRefs remediation.
- Harness: F245/friction-rollup-publisher-source-thread-provenance (eval:friction rollup evidence publisher, sourceRefs freshness, and repair-route traceability)
- Root cause: Root cause remains route-specific environment drift plus execution gap: some current-main evidence PRs stamp Source thread, but eval:friction's route and an open a2a PR still omit it; PR #11 remains unmergeable; owner delivery remains blocked by provider auth/budget failures. (confidence high)
- Owner ask: Repair eval:friction's publishing route so it stamps sourceThreadId=thread_eval_friction like valid a2a evidence PRs, close or replace any open untraceable verdict PRs, and rebase or replace PR #11 with green CI. Restore the owner execution route and preserve or assign the dirty primary checkout before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-08-30T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-27-eval-friction-provenance-route-stale-fix/snapshot
- attribution:bundle/2026-08-27-eval-friction-provenance-route-stale-fix/eval-F245-2026-08-27:no-finding
- metric:github.pr11.stale_hours
- metric:publisher.current_window_missing_source_thread_pr_count
- metric:publisher.current_window_source_thread_stamped_pr_count
- metric:publisher.current_window_open_untraceable_pr_count
- metric:eval_friction.last_verified_raw_rollup_signal_count
- metric:eval_friction.last_verified_raw_rollup_cluster_count
- metric:owner_dispatch.provider_auth_403_unique_request_ids
- metric:scheduled_prompt.stale_source_refs_selector_count

Counterarguments:
- Valid a2a PRs #56 and #57 prove part of the publication path is healthy, so the finding should stay scoped to route-specific drift instead of condemning the whole verdict publisher.
- An empty raw rollup window by itself would support keep_observe, but repeated lifecycle failures remain actionable and block mandatory PR handling.
- The scheduled task prompt still carries the old 2025 sample selector, but this publish call uses the fresh 2026-08-24 to 2026-08-27 selector, so today's replay input is current.