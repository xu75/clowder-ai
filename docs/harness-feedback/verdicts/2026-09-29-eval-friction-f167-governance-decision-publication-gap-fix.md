---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-09-29-eval-friction-f167-governance-decision-publication-gap-fix
source_snapshot: "snapshot:bundle/2026-09-29-eval-friction-f167-governance-decision-publication-gap-fix/snapshot"
---

# Live Verdict — 2026-09-29-eval-friction-f167-governance-decision-publication-gap-fix

- Verdict: `fix`
- Phenomenon: The 2026-09-26 to 2026-09-29 friction window still shows no new independent product cluster, but the lifecycle friction worsened: the F023 governance decision remains unresolved for about 216 hours, #87/#81/#11 have not migrated, and the 2026-09-27 eval:a2a scheduled invocation timed out after 1800 seconds without producing a verdict PR before publication recovered on 2026-09-28. Current-window evidence publication is therefore partially healthy rather than fully healthy: PR #97, #98, and #99 are traceable docs/evidence PRs, but one daily checkpoint was missed.
- Harness: F245/friction-rollup (Friction Signal Eval / eval-domain repair-loop friction)
- Root cause: Primary root cause remains vision_gap: F023 requires an explicit operator value choice, and the process still has no timeout/default path after repeated escalation, so the remediation chain stays fail-closed while evidence freshness ages. A secondary execution_gap is now more visible because the owner path has not obtained signoff or a delegated/named split, and one scheduled eval:a2a checkpoint timed out without publication. Residual harness_misfit remains because the eval prompt still carries a stale 2025 selector that evaluators must override. (confidence high)
- Owner ask: Treat this as two parallel blockers. First, keep the F023 gate fail-closed and keep the operator request minimal: choose A (explicit PR #87 signoff with Decision Packet) or B (name/delegate a qualifying F23/F23-followup directory split). Do not restate the full Decision Packet and do not use harness-eval as the B path. Second, treat the 2026-09-27 1800s timeout as an independent publication-reliability regression until evidence proves it shares #81's root cause. After the F023 gate is satisfied, merge #87, update #81 to current main, fix conflicts and governance failures, require acceptance with two consecutive scheduled eval:a2a checkpoints publishing traceable verdicts within SLA, then close #79/#80 and replace or rebase #11. Preserve the unassigned primary-checkout F167 propagation test until ownership is explicit.
- Re-eval: next eval at 2026-10-02T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-09-29-eval-friction-f167-governance-decision-publication-gap-fix/snapshot
- attribution:bundle/2026-09-29-eval-friction-f167-governance-decision-publication-gap-fix/eval-F245-2026-09-29:no-finding
- metric:pr11StaleHours=1511.748889
- metric:pr81AgeHours=308.901111
- metric:pr81NoUpdateHours=235.136944
- metric:pr81FailedChecks=2
- metric:pr81Conflicting=1
- metric:pr87AgeHours=234.559167
- metric:pr87NoDecisionHours=215.878889
- metric:pr87FailedChecks=0
- metric:pr87CommentCount=0
- metric:pr87ReviewCount=0
- metric:currentWindowMergedTraceableVerdictPrs=3
- metric:currentWindowMissingDailyVerdictDays=1
- metric:currentWindowTimeouts=1
- metric:openUntraceableVerdictPrs=11
- metric:blockingOpenPrs=5
- metric:freshF167SourcePairWithin24h=0
- metric:publicTestExclusionEntries=41
- metric:directoryExceptionEntries=10
- metric:qualifyingF23Exceptions=8
- metric:scheduledPromptStaleSelectorFires=1

Counterarguments:
- The 9/27 timeout is a single missed checkpoint and 9/28 publication recovered, so it should be tracked as publication-reliability friction without over-claiming a recurring carrier defect.
- PR #87 remains mechanically mergeable with all checks green; the blocking condition is governance validity, not code readiness.
- The friction rollup itself may remain empty/degraded for direct product signals, so this verdict relies on lifecycle, GitHub, and eval-domain evidence rather than fabricating a Top-N cluster.