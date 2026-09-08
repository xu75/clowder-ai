---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-09-08-eval-friction-provenance-backlog-fix
source_snapshot: "snapshot:bundle/2026-09-08-eval-friction-provenance-backlog-fix/snapshot"
---

# Live Verdict — 2026-09-08-eval-friction-provenance-backlog-fix

- Verdict: `fix`
- Phenomenon: The eval:friction rollup must be replayed for the fresh 2026-09-05 to 2026-09-08 window, but the surrounding publication lifecycle remains broken: the latest eval:friction evidence PR (#72) was fail-closed for missing sourceThreadId, two current-window eval:a2a verdict PRs remain open without a Source thread line, and the open untraceable verdict backlog grew from ten to twelve. The scheduled prompt still embeds the stale 2025 sample selector, so the evaluator must override it to preserve replay freshness.
- Harness: F245/harness-eval (Friction Signal Eval / verdict publication traceability)
- Root cause: The strongest current attribution remains environment_drift plus execution_gap: PR #9's central source-thread fix is present on main history, but active verdict publisher routes still generate PRs without Source thread provenance; stale PR #11 continues to block the sourceRefs freshness repair; and provider budget/auth failures keep owner handoff from executing. (confidence medium)
- Owner ask: Repair the eval:friction verdict publication route so both PR body and provenance.json stamp sourceThreadId=thread_eval_friction; close or replace untraceable verdict backlog (#58/#60/#61/#62/#64/#66/#67/#69/#70/#71/#73/#75); rebase or replace PR #11 with green CI if it remains the intended sourceRefs fix; remove the stale 2025 sample selector from scheduled eval prompts or prove it is inert; and keep the dirty primary checkout preserved before any operator-managed clean-main restart.
- Re-eval: next eval at 2026-09-11T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-09-08-eval-friction-provenance-backlog-fix/snapshot
- attribution:bundle/2026-09-08-eval-friction-provenance-backlog-fix/eval-F245-2026-09-08:no-finding
- metric:pr11StaleHours=1007.748889
- metric:currentWindowMissingSourceThreadPrs=3
- metric:currentWindowSourceThreadStampedPrs=1
- metric:currentWindowOpenUntraceablePrs=2
- metric:totalOpenUntraceablePrs=12
- metric:latestEvalFrictionMissingSourceThreadPrs=1
- metric:ownerDispatchAuth403UniqueRequestIds=2
- metric:scheduledPromptStaleSelectorFires=1

Counterarguments:
- Current-window counts partially improved because #74 was traceable and merged, so not every eval publication path is failing; the regression call depends on the growing open untraceable backlog and unchanged PR #11, not on a blanket publisher outage claim.
- The scheduled prompt's stale selector may be illustrative text rather than the actual selector consumed by the tool; however, its repeated presence has already caused confusion and must be removed or clearly marked non-operative.
- Provider 403 is an external admission/funding blocker rather than a code defect, but it remains part of the lifecycle finding because mandatory owner handoff cannot complete while it persists.