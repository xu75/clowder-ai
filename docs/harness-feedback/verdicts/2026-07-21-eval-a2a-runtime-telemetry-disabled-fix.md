---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-07-21-eval-a2a-runtime-telemetry-disabled-fix
source_snapshot: "snapshot:bundle/2026-07-21-eval-a2a-runtime-telemetry-disabled-fix/snapshot"
---

# Live Verdict — 2026-07-21-eval-a2a-runtime-telemetry-disabled-fix

- Verdict: `fix`
- Phenomenon: Four consecutive eval artifacts from 2026-07-16 through 2026-07-20 show the acceptance runtime with OTel disabled because TELEMETRY_HMAC_SALT is not configured: all five F167 components remain no-data even as counter_window.duration_hours grows from 18.59 to 91.74, while telemetry health still reports healthy. No newer raw snapshot exists, so the unresolved stale evidence gap itself prevents current rate or Grounding Phase O distribution evaluation.
- Harness: F167/f167-runtime-eval-telemetry (A2A runtime eval telemetry prerequisites and health gating)
- Owner ask: Fix runtime prerequisite handling: make telemetry health or the eval:a2a publish-prerequisite gate report degraded/skip whenever OTel or required stores are unavailable; coordinate the operator-managed TELEMETRY_HMAC_SALT configuration and acceptance restart without cats editing runtime config; then produce a fresh snapshot with metrics, history, trace stats, and grounding samples readable.
- Re-eval: A fresh eval:a2a snapshot has counter_window.duration_hours >= 2; metrics, metrics history, trace stats, and grounding samples are readable; L1, C1, C2, route-serial, and grounding-phase-o confidence are above no-data; grounding.check_total, grounding.verdict_total, and grounding.mismatch_sample_count are present; telemetry health does not report healthy while disabled; and legacyScheduledTaskIds remains empty. at 2026-08-02T03:00:00Z

Evidence:
- snapshot:bundle/2026-07-21-eval-a2a-runtime-telemetry-disabled-fix/snapshot
- attribution:bundle/2026-07-21-eval-a2a-runtime-telemetry-disabled-fix/AR-2026-07-20-001
- metric:telemetryEnabled
- metric:unavailableRequiredSurfaces
- metric:noDataCoreComponents
- metric:noDataGroundingComponents
- metric:counterWindowHours
- metric:legacyScheduledTaskCount
- metadata:eval-F167-2026-07-20/generatedAt
- attribution:AR-2026-07-20-001/evidence/grounding-phase-o

Counterarguments:
- The increasing counter window proves denominator plumbing is present, but no counter exists to divide by, so it does not satisfy acceptance or justify keep_observe.
- The earlier build/fix verdicts already describe this failure mode, but the acceptance condition remains open and the only prior retry PR was closed for missing source-thread provenance, so this is completion of the same unresolved verdict rather than a duplicate finding.
- Grounding mismatch_sample_count cannot be treated as zero or healthy because the endpoint and counters are absent; no-data is a telemetry gap.
- Legacy scheduled-task cleanup is healthy with an empty ID list and disabled cleanup status, so duplicate scheduling is not the cause of the runtime telemetry failure.
