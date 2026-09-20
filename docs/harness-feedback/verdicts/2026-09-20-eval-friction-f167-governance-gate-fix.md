---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-09-20-eval-friction-f167-governance-gate-fix
source_snapshot: "snapshot:bundle/2026-09-20-eval-friction-f167-governance-gate-fix/snapshot"
---

# Live Verdict — 2026-09-20-eval-friction-f167-governance-gate-fix

- Verdict: `fix`
- Phenomenon: Fresh eval verdict publication remains traceable in the 2026-09-17 to 2026-09-20 window, but the F167 repair loop is still not closed: PR #87 is a clean governance unblocker with all checks green yet remains unmerged, PR #81 is still open with two failing checks, PR #11 remains unchanged with Build failed, and the old untraceable verdict backlog still has eleven open PRs. The friction rollup selector must be replayed for the fresh window because the scheduled prompt still shows the stale 2025 example selector.
- Harness: F245/harness-eval (Friction Signal Eval / eval-domain repair-loop friction)
- Root cause: The active verdict publication path is now producing traceable evidence, but the repair loop is fragmented across an unmerged green governance PR (#87), a still-red F167 implementation PR (#81), a stale sourceRefs repair PR (#11), and an old open untraceable evidence backlog. This is primarily execution_gap with residual harness_misfit from the stale scheduled prompt selector. (confidence medium)
- Owner ask: Merge or otherwise resolve the green governance unblocker PR #87, update PR #81 so its baseline no longer carries failing governance checks, and complete final cross-review/merge of the F167 allowResumeFallback repair. Separately close, replace, or document-retain the remaining untraceable verdict backlog (#58/#60/#61/#62/#64/#66/#67/#69/#70/#71/#75), repair or supersede PR #11 for fresh sourceRefs generation, and remove or clearly mark the stale 2025 sample selector in scheduled eval prompts. Preserve the dirty primary checkout and do not overwrite the unassigned f167 propagation test file.
- Re-eval: next eval at 2026-09-23T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-09-20-eval-friction-f167-governance-gate-fix/snapshot
- attribution:bundle/2026-09-20-eval-friction-f167-governance-gate-fix/eval-F245-2026-09-20:no-finding
- metric:pr11StaleHours=1295.748889
- metric:pr81AgeHours=92.901111
- metric:pr81FailedChecks=2
- metric:pr87AgeHours=18.559167
- metric:pr87FailedChecks=0
- metric:currentWindowMergedTraceableVerdictPrs=4
- metric:currentWindowMissingSourceThreadVerdictPrs=0
- metric:openUntraceableVerdictPrs=11
- metric:scheduledPromptStaleSelectorFires=1

Counterarguments:
- Compared with 2026-09-17, publication traceability is healthier: PR #82 through #85 are merged and include Source thread lines, so this is not a publisher outage verdict.
- PR #87 has all checks green, so the governance blocker has a concrete resolution path; the remaining issue is merge/order-of-operations, not lack of a fix candidate.
- PR #81's failing checks are governance-baseline failures rather than F167 code failures, so the owner action should preserve review scope instead of mixing unrelated governance changes into the F167 PR.