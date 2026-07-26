---
feature_ids: [F192, F236]
topics: [harness-eval, eval-anchor-first, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:anchor-first
packet_id: 2026-07-26-anchor-first-empty-window-keep-observe
source_snapshot: "snapshot:bundle/2026-07-26-anchor-first-empty-window-keep-observe/snapshot"
---

# Live Verdict — 2026-07-26-anchor-first-empty-window-keep-observe

- Verdict: `keep_observe`
- Phenomenon: The replay selector covers 2025-10-01T00:00:00Z to 2025-10-02T00:00:00Z, while anchor-first telemetry is resolved from a 24h in-memory event buffer. The resulting rollup is expected to have insufficient or empty preview samples, and the latest readable task-outcome evidence does not establish anchor-correlated blindness.
- Harness: F236/anchor-telemetry-rollup (anchor-first preview/drill open-rate rollup)
- Owner ask: Keep F236 anchor-first preview/drill telemetry enabled for observation; do not sunset any tool from this run. For the next weekly eval, use a current 24h selector so per-tool preview counts, anchor-tax signals, and task-outcome blindness cross-checks are meaningful.
- Re-eval: Re-run eval:anchor-first with a current 24h selector; keep observing if no tool has anchorTax and no task-outcome blindness correlation, escalate to fix/delete_sunset only if the defined dual signals appear. at 2026-08-02T03:00:00Z

Sunset Signal Assessment:

Open-Rate Detail:
- Orphan drills: 0

Adoption Detail:
- explicitAnchorCalls=0; explicitFullCalls=0; uniqueCatsExplicitAnchor=0
- defaultAnchorCalls=0; defaultFullCalls=0
- legacyEquivalentAnchorCalls=0; legacyEquivalentFullCalls=0
- unknownModeCalls=0

Evidence:
- snapshot:bundle/2026-07-26-anchor-first-empty-window-keep-observe/snapshot
- attribution:bundle/2026-07-26-anchor-first-empty-window-keep-observe/eval-F236-2026-07-26:no-finding
- metric:anchor.preview_events
- metric:anchor.anchor_tax_tools
- metric:task_outcome.blindness_evidence
- trace:anchor-telemetry-snapshot:1759276800000-1759363200000

Counterarguments:
- An empty rollup reflects stale-window sampling, not evidence that anchor-first is healthy.
- The latest task-outcome evidence available in thread context may not include unmerged or unindexed newer verdicts.
- If adoption is dominated by defaults rather than explicit anchor calls, a future non-empty rollup may require a separate adoption-quality interpretation.
