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
- Phenomenon: Four consecutive sanitized F167 eval artifacts remain no-data while the counter window expanded from 18.59h to 91.74h; telemetry health still reported healthy although OTel and all required stores were unavailable. No newer raw snapshot exists after 2026-07-20, so the current day-over-day gap is itself part of the telemetry failure.
- Harness: F167/f167-runtime-eval-telemetry (A2A runtime eval telemetry prerequisites and health gating)
- Owner ask: Make F167 health and verdict-publish prerequisites fail closed or report degraded/skip when OTel or any required telemetry store is unavailable; coordinate the operator-managed TELEMETRY_HMAC_SALT configuration and isolated acceptance restart, then emit a fresh snapshot proving evaluable L1/C1/C2/route-serial and grounding Phase O counters.
- Re-eval: A fresh isolated acceptance snapshot reports telemetryEnabled=1, all four required telemetry surfaces available, non-null counters for the four core components, and grounding.check_total/verdict_total/mismatch_sample_count present; health must be degraded rather than healthy whenever those prerequisites are absent. at 2026-08-02T03:00:00Z

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
- No runtime traffic might explain zero activations, but it cannot explain 503 telemetry endpoints, null stores, and disabled OTel.
- Grounding may have seen no stateful calls, yet verdict_total and mismatch_sample_count are unavailable rather than valid zeroes, so the result remains a telemetry gap and cannot justify fail-closed grounding.
- Legacy scheduled tasks could duplicate evaluations, but the eval registry and current invocation both report no legacy task IDs and legacy cleanup disabled.
