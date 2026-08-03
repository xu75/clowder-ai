---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-03-eval-friction-paw-feel-meta-marker-fix
source_snapshot: "snapshot:bundle/2026-08-03-eval-friction-paw-feel-meta-marker-fix/snapshot"
---

# Live Verdict — 2026-08-03-eval-friction-paw-feel-meta-marker-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-07-31 to 2026-08-03 rollup produced one medium paw-feel actionableCandidate, but its only member is the previous eval:friction owner handoff message quoting the marker format as metadata, so F245 is treating a code-span example as a real friction signal. The same run still received stale 2025 sourceRefs in the scheduled prompt and owner handoffs to @opus are failing with 403 prepaid-budget authentication, so both the data source and repair route need fixing before the next cycle.
- Harness: F245/paw-feel-marker-intent-filter-and-owner-route (paw-feel marker extraction, sourceRefs freshness, and owner-route execution)
- Root cause: harness_misfit plus environment_drift: PawFeelAdapter extracts marker syntax from code-span/meta instructions without checking surrounding context, while the live scheduler still has stale sourceRefs and the active owner route cannot execute because @opus provider authentication fails for prepaid-budget. This turns both evidence collection and repair handoff into self-generated noise. (confidence high)
- Owner ask: Preserve or assign the dirty main worktree artifacts, restore the @opus provider prepaid-budget/auth state, restart API/MCP from clean origin/main, then fix F245 so PawFeelAdapter ignores marker syntax inside code spans or explicit examples and get PR #11 or an equivalent current-sourceRefs scheduler fix into the live path.
- Re-eval: next eval at 2026-08-06T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-03-eval-friction-paw-feel-meta-marker-fix/snapshot
- attribution:bundle/2026-08-03-eval-friction-paw-feel-meta-marker-fix/FR-2026-08-03-3eb416223e9e
- metric:friction-rollup.cluster_count
- metric:friction-rollup.top_cluster_count
- metric:friction-rollup.cluster_3eb416223e9e
- metric:scheduledPrompt.staleSourceRefs.currentFire
- metric:threadObserved.ownerHandoffAuthFailures.uniqueRequestIds

Counterarguments:
- The generated actionableCandidate is real according to the current parser, so this is a parser semantics issue rather than a publish tool failure.
- A narrow data-only verdict could ask for only PawFeelAdapter filtering, but sourceRefs staleness and owner-route 403 are simultaneous closure blockers in the same cycle.
- If the operator deliberately wants marker examples to be captured, the example-writing convention would need a different escape syntax; current behavior is still too noisy for eval evidence.