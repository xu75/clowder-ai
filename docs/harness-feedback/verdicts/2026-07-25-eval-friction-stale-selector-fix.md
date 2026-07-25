---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-07-25-eval-friction-stale-selector-fix
source_snapshot: "snapshot:bundle/2026-07-25-eval-friction-stale-selector-fix/snapshot"
---

# Live Verdict — 2026-07-25-eval-friction-stale-selector-fix

- Verdict: `fix`
- Phenomenon: The supplied eval:friction sourceRefs again point at the historical 2025-10-01T00:00:00.000Z to 2025-10-02T00:00:00.000Z window, 296 days before the 2026-07-25 scheduled fire, so the rollup reports 0 signals and cannot evaluate current friction. This repeats the exact stale-selector caveat recorded in the 2026-07-22 verdict, turning the issue from observation into a repairable scheduling/invocation defect.
- Harness: F245/friction-rollup-source-refs (friction rollup scheduled sourceRefs selector)
- Root cause: harness_misfit: the eval:friction invocation instructions provide a hard-coded replay selector instead of a dynamically computed current cadence window, so scheduled eval cats keep publishing evidence for an old empty period rather than the period under evaluation. (confidence high)
- Owner ask: Fix eval:friction scheduled invocation/sourceRefs generation so every-3d fires provide a current replayable rollup window, or change the instructions to explicitly tell the eval cat how to compute the current window instead of copying the stale 2025-10-01 example.
- Re-eval: next eval at 2026-07-28T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-07-25-eval-friction-stale-selector-fix/snapshot
- attribution:bundle/2026-07-25-eval-friction-stale-selector-fix/eval-F245-2026-07-25:no-finding
- metric:friction-rollup.cluster_count
- metric:friction-rollup.top_cluster_count
- metric:friction-rollup.tail_cluster_count
- metric:friction-rollup.tail_signal_count

Counterarguments:
- The rollup for the supplied selector is genuinely empty, so a narrow interpretation could still call this keep_observe for data friction alone.
- The hard-coded selector may have been intended as an example, but the scheduled prompt says the eval cat must supply that exact JSON, which has now caused repeated stale-window publishing.
- The local preview reports degraded clustering due to missing embedding injection, but the root issue here is the stale raw window and does not depend on clustering quality.