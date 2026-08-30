---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-30-eval-friction-provenance-backlog-fix
source_snapshot: "snapshot:bundle/2026-08-30-eval-friction-provenance-backlog-fix/snapshot"
---

# Live Verdict — 2026-08-30-eval-friction-provenance-backlog-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-27 to 2026-08-30 friction window needs replayable evidence packaging, but the publication lifecycle has regressed into an untraceable PR backlog: eval:friction PR #59 omitted sourceThreadId and was closed, while a2a PRs #60, #61, and #62 remain open and also omit Source thread. PR #11 remains unchanged with a failed Build, so F245 still lacks a traceable merged evidence path and the sourceRefs remediation remains stalled.
- Harness: F245/friction-rollup-publisher-source-thread-provenance (eval:friction rollup evidence publisher, sourceRefs freshness, and repair-route traceability)
- Root cause: Root cause remains route-specific environment drift plus execution gap, now compounded by lifecycle backlog: several current-window verdict PRs are open without Source thread, eval:friction still publishes without sourceThreadId, and PR #11 remains unmergeable. Valid older a2a PRs #56 and #57 prove stamping can work on some path, so the fault is routing/deployment consistency rather than the entire evidence model. (confidence high)
- Owner ask: Repair eval:friction publishing so it stamps sourceThreadId=thread_eval_friction, close or replace the open untraceable verdict PR backlog (#58/#60/#61/#62 if still untraceable), and rebase or replace PR #11 with green CI. Preserve or assign the dirty primary checkout before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-09-02T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-30-eval-friction-provenance-backlog-fix/snapshot
- attribution:bundle/2026-08-30-eval-friction-provenance-backlog-fix/eval-F245-2026-08-30:no-finding
- metric:github.pr11.stale_hours
- metric:publisher.current_window_missing_source_thread_pr_count
- metric:publisher.current_window_source_thread_stamped_pr_count
- metric:publisher.current_window_open_untraceable_pr_count
- metric:publisher.total_open_untraceable_pr_count
- metric:eval_friction.last_verified_raw_rollup_signal_count
- metric:eval_friction.last_verified_raw_rollup_cluster_count
- metric:scheduled_prompt.stale_source_refs_selector_count

Counterarguments:
- Valid a2a PRs #56 and #57 prove sourceThreadId stamping is possible, so this verdict is scoped to route/deployment inconsistency and backlog handling, not the whole publisher schema.
- An empty raw rollup window by itself would support keep_observe, but repeated and now accumulating lifecycle failures remain actionable and block mandatory PR handling.
- The scheduled task prompt still carries the old 2025 sample selector, but this publish call uses the fresh 2026-08-27 to 2026-08-30 selector, so today's replay input is current.