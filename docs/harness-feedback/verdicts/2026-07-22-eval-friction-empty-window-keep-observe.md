---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-07-22-eval-friction-empty-window-keep-observe
source_snapshot: "snapshot:bundle/2026-07-22-eval-friction-empty-window-keep-observe/snapshot"
---

# Live Verdict — 2026-07-22-eval-friction-empty-window-keep-observe

- Verdict: `keep_observe`
- Phenomenon: The requested 24h friction-rollup window from 2025-10-01T00:00:00.000Z to 2025-10-02T00:00:00.000Z produced 0 friction signals, 0 clusters, and no actionableCandidates or referenceOnly clusters. Because this selector is historical relative to the 2026-07-22 scheduled fire, the result is valid for the supplied replay window but weak as a freshness trend.
- Harness: F245/friction-rollup (friction rollup (Top-N + sensorForm))
- Root cause: No active 7-class root cause is supported by the supplied rollup window because no friction signals or clusters surfaced. The only caveat is an environment_drift risk in the scheduled selector itself, since the replay window is far older than the 2026-07-22 fire. (confidence low)
- Owner ask: Keep the every-3d friction rollup under observation and do not open a repair thread for this empty supplied window; separately check selector freshness if future scheduled fires keep using 2025-10-01..2025-10-02 instead of the current cadence window.
- Re-eval: next eval at 2026-07-25T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-07-22-eval-friction-empty-window-keep-observe/snapshot
- attribution:bundle/2026-07-22-eval-friction-empty-window-keep-observe/eval-F245-2026-07-22:no-finding
- metric:friction-rollup.cluster_count
- metric:friction-rollup.top_cluster_count
- metric:friction-rollup.tail_cluster_count
- metric:friction-rollup.tail_signal_count

Counterarguments:
- The selector window is historical relative to the 2026-07-22 scheduled fire, so an empty report may reflect scheduling or config drift rather than actual recent low friction.
- The local preview had degraded clustering because embedding was not injected, so a non-empty future window should be reviewed with extra caution.
- The publish base blocker previously prevented PR creation, so this cycle needs PR verification after publish before it can be considered complete.