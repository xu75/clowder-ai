---
feature_ids: [F192, F236]
topics: [harness-eval, eval-anchor-first, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:anchor-first
packet_id: 2026-08-09-anchor-first-stale-selector-keep-observe
source_snapshot: "snapshot:bundle/2026-08-09-anchor-first-stale-selector-keep-observe/snapshot"
---

# Live Verdict — 2026-08-09-anchor-first-stale-selector-keep-observe

- Verdict: `keep_observe`
- Phenomenon: The weekly eval again received the stale 2025-10-01T00:00:00Z to 2025-10-02T00:00:00Z selector, repeating the 2026-07-26 and 2026-08-02 empty join-window pattern. Because anchor-first preview/drill joins are resolved from a 24h in-memory event buffer, this run cannot make actionable per-tool open-rate, netBenefit, adoption, or blindness judgments.
- Harness: F236/anchor-telemetry-rollup (anchor-first preview/drill open-rate rollup)
- Owner ask: Keep F236 anchor-first preview/drill behavior enabled; do not sunset any preview tool from this run. Treat the repeated stale selector as an eval-pipeline follow-up: before the next weekly eval, make sourceRefs use the actual latest 24h window so per-tool open-rate, netBenefit, adoption, and task-outcome blindness checks become meaningful.
- Re-eval: Re-run eval:anchor-first with a current 24h selector; keep observing if per-tool samples are non-empty and neither anchorTax nor task-outcome blindness correlation appears, escalate to fix/delete_sunset only under the defined signal mapping. at 2026-08-16T03:00:00Z

Sunset Signal Assessment:

Open-Rate Detail:
- Orphan drills: 0

Adoption Detail:
- explicitAnchorCalls=0; explicitFullCalls=0; uniqueCatsExplicitAnchor=0
- defaultAnchorCalls=0; defaultFullCalls=0
- legacyEquivalentAnchorCalls=0; legacyEquivalentFullCalls=0
- unknownModeCalls=0

Evidence:
- snapshot:bundle/2026-08-09-anchor-first-stale-selector-keep-observe/snapshot
- attribution:bundle/2026-08-09-anchor-first-stale-selector-keep-observe/eval-F236-2026-08-09:no-finding
- metric:anchor.preview_events
- metric:anchor.anchor_tax_tools
- metric:anchor.orphan_drills
- metric:task_outcome.blindness_evidence
- metric:anchor.track1_volume_sanity
- trace:anchor-telemetry-snapshot:1759276800000-1759363200000
- trace:baseline-verdict:2026-08-02-anchor-first-stale-selector-keep-observe

Counterarguments:
- This keep_observe verdict is an insufficient-data result, not evidence that anchor-first is healthy.
- Three consecutive stale-selector runs suggest a separate eval scheduler/sourceRefs defect even though the F236 sunset mapping keeps insufficient samples at keep_observe.
- Track-1 aggregate counters can show volume while preview↔drill joins remain empty, so volume sanity alone is not enough to evaluate anchor tax or blindness.
