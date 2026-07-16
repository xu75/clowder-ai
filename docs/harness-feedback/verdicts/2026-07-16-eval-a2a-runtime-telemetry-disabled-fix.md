---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-07-16-eval-a2a-runtime-telemetry-disabled-fix
source_snapshot: "snapshot:bundle/2026-07-16-eval-a2a-runtime-telemetry-disabled-fix/snapshot"
---

# Live Verdict — 2026-07-16-eval-a2a-runtime-telemetry-disabled-fix

- Verdict: `fix`
- Phenomenon: The June 30 build verdict's telemetry acceptance criteria remain unmet: after 18.59 hours of process uptime, OTel is disabled, all four required telemetry surfaces are unavailable, and all five F167 components—including grounding Phase O—remain unevaluable. The runtime nevertheless reports telemetry health as healthy.
- Harness: F167/f167-runtime-eval-telemetry (A2A runtime eval telemetry prerequisites and health gating)
- Owner ask: Fix runtime prerequisite handling: make telemetry health or the eval:a2a publish-prereq gate report degraded/skip when OTel or required stores are unavailable; coordinate the required operator-managed TELEMETRY_HMAC_SALT configuration and acceptance restart without cats editing runtime config; then produce a fresh snapshot with metrics, history, traces, and grounding samples readable.
- Re-eval: A fresh eval:a2a snapshot is generated within 72 hours with counter_window.duration_hours >= 2; metrics, metrics history, trace stats, and grounding samples all readable; L1/C1/C2/route-serial/grounding-phase-o confidence above no-data; grounding check/verdict/mismatch counters present (zero is acceptable only when the endpoint and counters are present); telemetry health no longer reports healthy while disabled; and legacyScheduledTaskIds remains empty. at 2026-07-19T03:00:00Z

Evidence:
- snapshot:bundle/2026-07-16-eval-a2a-runtime-telemetry-disabled-fix/snapshot
- attribution:bundle/2026-07-16-eval-a2a-runtime-telemetry-disabled-fix/AR-2026-07-16-001
- metric:telemetryEnabled
- metric:unavailableEndpoints
- metric:noDataCoreComponents
- metric:noDataGroundingComponents
- metric:counterWindowHours
- metric:legacyScheduledTaskCount
- metadata:eval-F167-2026-07-16/generatedAt
- attribution:AR-2026-07-16-001/evidence/grounding-phase-o

Counterarguments:
- The improved 18.59-hour counter window proves denominator plumbing is present, but no counter exists to divide by, so it does not satisfy acceptance.
- The absence of new daily raw artifacts may itself be the scheduler failure rather than telemetry wiring, but both paths require the same fail-closed prerequisite behavior before the next eval.
- Grounding mismatch_sample_count of zero cannot be treated as healthy because no grounding samples or counters were available.
