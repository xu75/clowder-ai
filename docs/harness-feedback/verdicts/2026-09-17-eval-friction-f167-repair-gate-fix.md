---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-09-17-eval-friction-f167-repair-gate-fix
source_snapshot: "snapshot:bundle/2026-09-17-eval-friction-f167-repair-gate-fix/snapshot"
---

# Live Verdict — 2026-09-17-eval-friction-f167-repair-gate-fix

- Verdict: `fix`
- Phenomenon: Fresh eval verdict publication is traceable again in the current window, but the repair loop remains blocked: the merged eval:a2a evidence PR #78 confirms the seven-day Codex resume/source-freshness failure, PR #81 is still open with failing CI checks, PR #11 remains unchanged with Build failed, and eleven older untraceable verdict PRs are still open. The friction rollup selector must be replayed for the fresh 2026-09-14 to 2026-09-17 window; the scheduled prompt still shows a stale 2025 example selector that the evaluator must override.
- Harness: F245/harness-eval (Friction Signal Eval / eval-domain repair-loop friction)
- Root cause: The publication provenance portion appears repaired for new verdict evidence, but the eval control-plane repair loop still has an execution gap: PR #81 has not cleared CI/review/merge, PR #11 still carries the stale sourceRefs fix with failed Build, and the old untraceable evidence backlog is not yet closed or replaced. (confidence medium)
- Owner ask: Keep the recovered sourceThreadId path for eval:friction evidence PRs; remove or clearly mark the stale 2025 sample selector from scheduled eval prompts; close or replace the remaining untraceable verdict backlog (#58/#60/#61/#62/#64/#66/#67/#69/#70/#71/#75); and coordinate with the F167 owner/reviewer flow so PR #81 either clears CI and review or is repaired before the next eval. Preserve the dirty primary checkout; do not clean or overwrite the unassigned Dare/ACL/Web/MCP files.
- Re-eval: next eval at 2026-09-20T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-09-17-eval-friction-f167-repair-gate-fix/snapshot
- attribution:bundle/2026-09-17-eval-friction-f167-repair-gate-fix/eval-F245-2026-09-17:no-finding
- metric:pr11StaleHours=1223.748889
- metric:pr81AgeHours=20.901111
- metric:pr81FailedChecks=2
- metric:currentWindowMergedTraceableVerdictPrs=1
- metric:currentWindowMissingSourceThreadVerdictPrs=0
- metric:openUntraceableVerdictPrs=11
- metric:scheduledPromptStaleSelectorFires=1

Counterarguments:
- New evidence publication did improve: PR #76 and PR #78 are traceable and merged, so the verdict should not claim that all active publisher routes are still stale.
- The current PR #81 check failures may be routine review churn, especially because the PR is only about 20.9 hours old at this checkpoint.
- The scheduled prompt's 2025 sourceRefs block may be meant as schema documentation, but repeated manual overrides show it is still a live evaluator-friction source unless clarified.