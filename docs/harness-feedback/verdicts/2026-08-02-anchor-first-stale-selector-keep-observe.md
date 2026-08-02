---
feature_ids: [F192, F236]
topics: [harness-eval, eval-anchor-first, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:anchor-first
packet_id: 2026-08-02-anchor-first-stale-selector-keep-observe
source_snapshot: "snapshot:bundle/2026-08-02-anchor-first-stale-selector-keep-observe/snapshot"
---

# Live Verdict — 2026-08-02-anchor-first-stale-selector-keep-observe

- Verdict: `keep_observe`
- Phenomenon: The weekly eval received the same 2025-10-01T00:00:00Z to 2025-10-02T00:00:00Z selector as the previous run, while anchor-first telemetry is resolved from a 24h in-memory event buffer. This produces another insufficient/empty sample window, so per-tool open-rate, netBenefit, adoption, and blindness conclusions are not actionable.
- Harness: F236/anchor-telemetry-rollup (anchor-first preview/drill open-rate rollup)
- Owner ask: Keep F236 anchor-first preview/drill behavior enabled; do not sunset any preview tool based on this run. Before the next weekly eval, update the eval sourceRefs/scheduler to pass the actual latest 24h window so per-tool open-rate, netBenefit, adoption, and blindness cross-checks are meaningful.
- Re-eval: Re-run eval:anchor-first with a current 24h selector; keep observing if per-tool samples are non-empty and neither anchorTax nor task-outcome blindness correlation appears, escalate to fix/delete_sunset only under the defined signal mapping. at 2026-08-09T03:00:00Z

Sunset Signal Assessment:

Open-Rate Detail:
- Orphan drills: 0

Adoption Detail:
- explicitAnchorCalls=0; explicitFullCalls=0; uniqueCatsExplicitAnchor=0
- defaultAnchorCalls=0; defaultFullCalls=0
- legacyEquivalentAnchorCalls=0; legacyEquivalentFullCalls=0
- unknownModeCalls=0

Evidence:
- snapshot:bundle/2026-08-02-anchor-first-stale-selector-keep-observe/snapshot
- attribution:bundle/2026-08-02-anchor-first-stale-selector-keep-observe/eval-F236-2026-08-02:no-finding
- metric:anchor.preview_events
- metric:anchor.anchor_tax_tools
- metric:anchor.orphan_drills
- metric:task_outcome.blindness_evidence
- trace:anchor-telemetry-snapshot:1759276800000-1759363200000
- trace:baseline-verdict:2026-07-26-anchor-first-empty-window-keep-observe

Counterarguments:
- This keep_observe verdict is not evidence that anchor-first is healthy; it is an insufficient-data result caused by the stale selector.
- A repeated stale selector may warrant a separate fix against the eval scheduling/sourceRefs pipeline even though the F236 verdict mapping says insufficient data remains keep_observe.
- Recent task-outcome thread activity contains scheduled prompts without visible completed verdicts, so blindness absence is a lack of current evidence rather than proof of no judgment degradation.
