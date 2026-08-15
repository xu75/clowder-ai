---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-15-eval-friction-provenance-route-stale-fix
source_snapshot: "snapshot:bundle/2026-08-15-eval-friction-provenance-route-stale-fix/snapshot"
---

# Live Verdict — 2026-08-15-eval-friction-provenance-route-stale-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-12 to 2026-08-15 friction window needs evidence packaging, but eval:friction publishing is still blocked by traceability regressions: the latest eval:friction PR #33 and the current-window stale live publisher PRs #34, #36, and #38 omit sourceThreadId, while PR #11 remains unchanged with a failed Build. This is a repair-route and publisher-runtime failure, not evidence of a high-friction user cluster.
- Harness: F245/friction-rollup-publisher-source-thread-provenance (eval:friction rollup evidence publisher, sourceRefs freshness, and repair-route traceability)
- Root cause: Root cause is environment_drift plus execution_gap: the live publisher still runs stale code that omits sourceThreadId, the sourceRefs freshness repair PR remains unmerged with a failed Build, and the designated owner route is blocked by provider auth/budget 403. The rollup generator itself has not shown a user-friction cluster in the prior comparable windows. (confidence high)
- Owner ask: Restore or replace the owner execution route, get PR #11 or an equivalent current-sourceRefs fix rebased onto current main with green CI, and restart or reroute eval:friction publishing through a current-main path that stamps sourceThreadId=thread_eval_friction into provenance.json and PR body. Preserve or assign the dirty primary checkout artifacts before any clean-main API/MCP restart.
- Re-eval: next eval at 2026-08-18T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-15-eval-friction-provenance-route-stale-fix/snapshot
- attribution:bundle/2026-08-15-eval-friction-provenance-route-stale-fix/eval-F245-2026-08-15:no-finding
- metric:github.pr11.stale_hours
- metric:publisher.current_window_missing_source_thread_pr_count
- metric:eval_friction.latest_raw_rollup_signal_count
- metric:eval_friction.latest_raw_rollup_cluster_count
- metric:owner_dispatch.provider_auth_403_unique_request_ids
- metric:scheduled_prompt.stale_source_refs_selector_count

Counterarguments:
- An empty rollup window alone would normally support keep_observe; the fix verdict is based on repeated PR traceability failures and stale repair routing, not on fabricated cluster severity.
- The owner route 403 is partly external to F245, but it prevents the documented actionable-verdict lifecycle from reaching the owner and therefore belongs in this repair-route verdict.
- The scheduled task template still contains the old 2025 selector, but the publish call used the fresh 2026-08-12 to 2026-08-15 selector, so today's source evidence is replayable even though the prompt remains stale.