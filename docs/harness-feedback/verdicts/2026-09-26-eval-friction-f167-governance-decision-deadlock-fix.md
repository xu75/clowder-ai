---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-09-26-eval-friction-f167-governance-decision-deadlock-fix
source_snapshot: "snapshot:bundle/2026-09-26-eval-friction-f167-governance-decision-deadlock-fix/snapshot"
---

# Live Verdict — 2026-09-26-eval-friction-f167-governance-decision-deadlock-fix

- Verdict: `fix`
- Phenomenon: The 2026-09-23 to 2026-09-26 friction window does not show a new independent product cluster, and current-window verdict publication remains traceable: PR #93 through #96 are merged docs/evidence PRs with source-thread evidence. The active friction is now a governance decision deadlock: PR #87 remains green/open with zero comment or review after the F023 P1 gate rejection, PR #81 remains open with stale failing governance checks, PR #11 remains a stale Build-failed sourceRefs repair, and the scheduled eval prompt still embeds the stale 2025 selector.
- Harness: F245/friction-rollup (Friction Signal Eval / eval-domain repair-loop friction)
- Root cause: Primary root cause is vision_gap: the remaining blocker is an explicit governance value choice under F023, but the system has no bounded default or timeout path after repeated operator escalation, so daily/every-3d evals keep restating the same A/B decision while source freshness and deployment validation age. There is a secondary execution_gap because the F167 owner path did not convert the Decision Packet into either signoff or a qualifying split, and a residual harness_misfit because the scheduled prompt still includes a stale 2025 selector that evaluators must override. (confidence high)
- Owner ask: Treat this as a governance decision deadlock, not a CI wait. Keep PR #87 fail-closed until F023 is satisfied. Ask the operator for exactly one of two actions: A) explicit PR #87 signoff with a complete Decision Packet for another TTL unblock, or B) explicit authorization of a qualifying F23/F23-followup directory split (or permission for the owner to choose one). Do not use harness-eval as the B path because it is F192, not F23-followup. After the gate is satisfied, merge #87, update #81 to current origin/main, resolve conflict and governance failures, run CI plus continuity review, merge/deploy, close superseded #79/#80, and replace/rebase #11 so the scheduled eval prompt no longer carries the stale 2025 selector. Preserve the unassigned primary-checkout F167 propagation test until ownership is explicit.
- Re-eval: next eval at 2026-09-29T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-09-26-eval-friction-f167-governance-decision-deadlock-fix/snapshot
- attribution:bundle/2026-09-26-eval-friction-f167-governance-decision-deadlock-fix/eval-F245-2026-09-26:no-finding
- metric:pr11StaleHours=1439.748889
- metric:pr81AgeHours=236.901111
- metric:pr81NoUpdateHours=163.136944
- metric:pr81FailedChecks=2
- metric:pr81Conflicting=1
- metric:pr87AgeHours=162.559167
- metric:pr87NoDecisionHours=143.878889
- metric:pr87FailedChecks=0
- metric:pr87CommentCount=0
- metric:pr87ReviewCount=0
- metric:publicTestExclusionEntries=41
- metric:directoryExceptionEntries=10
- metric:qualifyingF23Exceptions=8
- metric:currentWindowMergedTraceableVerdictPrs=4
- metric:currentWindowMissingSourceThreadVerdictPrs=0
- metric:openUntraceableVerdictPrs=11
- metric:scheduledPromptStaleSelectorFires=1

Counterarguments:
- Publication traceability remains healthy in the current window: PR #93 through #96 are merged docs/evidence PRs with source-thread provenance, so this is not an active publisher outage.
- PR #87 is technically mergeable with all checks green; the fix may be one operator comment rather than code, if the operator intentionally accepts the governance debt.
- The friction rollup may be empty/degraded for direct product signals, so the verdict must be framed as lifecycle/governance friction rather than a fabricated Top-N cluster.