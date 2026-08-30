---
feature_ids: [F192, F236]
topics: [harness-eval, eval-anchor-first, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:anchor-first
packet_id: 2026-08-30-anchor-first-stale-selector-keep-observe
source_snapshot: "snapshot:bundle/2026-08-30-anchor-first-stale-selector-keep-observe/snapshot"
---

# Live Verdict — 2026-08-30-anchor-first-stale-selector-keep-observe

- Verdict: `keep_observe`
- Phenomenon: The 2026-08-30 eval still resolves the fixed 2025-10-01T00:00:00Z to 2025-10-02T00:00:00Z anchor telemetry selector, so the preview-drill attribution join has no preview events for all four preview tools. With per-tool open-rate, charsSaved, drillChars, netBenefit, adoption, and orphanDrills all empty or zero, this run cannot support sunset or fix on the runtime feature itself.
- Harness: F236/anchor-telemetry-rollup (Anchor-first preview/drill open-rate telemetry rollup)
- Owner ask: Keep anchor-first enabled and do not sunset any preview tool from this run. Treat this as another stale-selector eval-pipeline data point: before the next weekly eval, make the scheduled sourceRefs resolve to the actual latest 24h window so pending-mentions, thread-context, list-tasks, and get-message can be evaluated on live preview/drill data.
- Re-eval: A future eval uses a current 24h selector and reports non-empty per-tool preview counts, previewedItems, drilledUniqueItems, open-rate, charsSaved, drillChars, netBenefit, adoptionCounts, and orphanDrills; task-outcome cross-reference remains free of anchor-correlated corrected_success or needs_investigation regressions. at 2026-09-06T03:00:00Z

Sunset Signal Assessment:

Open-Rate Detail:
- Orphan drills: 0

Adoption Detail:
- explicitAnchorCalls=0; explicitFullCalls=0; uniqueCatsExplicitAnchor=0
- defaultAnchorCalls=0; defaultFullCalls=0
- legacyEquivalentAnchorCalls=0; legacyEquivalentFullCalls=0
- unknownModeCalls=0

Evidence:
- snapshot:bundle/2026-08-30-anchor-first-stale-selector-keep-observe/snapshot
- attribution:bundle/2026-08-30-anchor-first-stale-selector-keep-observe/eval-F236-2026-08-30:no-finding
- metric:anchor.preview_events
- metric:anchor.previewed_items
- metric:anchor.drilled_unique_items
- metric:anchor.open_rate_by_item
- metric:anchor.chars_saved
- metric:anchor.drill_chars
- metric:anchor.double_sided_net_benefit
- metric:anchor.orphan_drills
- metric:anchor.adoption_counts
- metric:anchor.track1_volume_sanity
- metric:task_outcome.blindness_evidence
- trace:anchor-telemetry-snapshot:1759276800000-1759363200000
- trace:baseline-verdict:2026-08-23-anchor-first-stale-selector-keep-observe
- trace:task-outcome-thread:latest-visible-verdict-2026-06-14

Counterarguments:
- The zero per-tool result should not be interpreted as proof that anchor-first is healthy; it is insufficient data caused by the stale selector.
- Track-1 aggregate volume indicates related tool usage exists, but it does not expose item-level preview to drill causality and therefore cannot establish anchor tax.
- The absence of task-outcome verdict files in main and the last visible task-outcome thread verdict from 2026-06-14 mean blindness evidence is unavailable, not disproven.
