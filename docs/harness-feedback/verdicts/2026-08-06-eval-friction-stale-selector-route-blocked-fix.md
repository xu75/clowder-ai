---
feature_ids: [F245]
topics: [harness-eval, eval-friction, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:friction
packet_id: 2026-08-06-eval-friction-stale-selector-route-blocked-fix
source_snapshot: "snapshot:bundle/2026-08-06-eval-friction-stale-selector-route-blocked-fix/snapshot"
---

# Live Verdict — 2026-08-06-eval-friction-stale-selector-route-blocked-fix

- Verdict: `fix`
- Phenomenon: The fresh 2026-08-03 to 2026-08-06 evaluation window still arrives with the stale 2025-10-01 sourceRefs template in the scheduled prompt, while the existing PR #11 sourceRefs fix remains unchanged and three owner handoff attempts in this window failed with @opus provider prepaid-budget/auth 403. The in-band rollup is expected to show no fresh F245 paw-feel cluster after the prior meta-marker finding, but the repair route and scheduler freshness blockers remain open.
- Harness: F245/friction-source-refs-and-owner-route (friction rollup scheduler sourceRefs and owner-route closure)
- Root cause: environment_drift plus harness_misfit: the scheduled eval prompt still carries a stale hard-coded selector and the owner execution route is blocked by provider prepaid-budget/auth 403; the underlying PR #11 freshness fix has not been refreshed or merged, so the repair loop cannot close even if the rollup no longer produces the prior paw-feel meta-marker cluster. (confidence high)
- Owner ask: Restore the owner execution route or assign a reachable owner, rebase PR #11 or an equivalent sourceRefs freshness fix onto current main, rerun CI, and verify the next eval:friction publish uses a current window with sourceThreadId in provenance. Also preserve or assign the dirty main worktree artifacts before any clean-main runtime restart.
- Re-eval: next eval at 2026-08-09T03:00:00.000Z

Evidence:
- snapshot:bundle/2026-08-06-eval-friction-stale-selector-route-blocked-fix/snapshot
- attribution:bundle/2026-08-06-eval-friction-stale-selector-route-blocked-fix/eval-F245-2026-08-06:no-finding
- metric:friction-rollup.cluster_count
- metric:scheduledPrompt.staleSourceRefs.currentFire
- metric:github.pr11.staleHours
- metric:threadObserved.ownerHandoffAuthFailures.uniqueRequestIds
- metric:provenance.sourceThreadId.postPublishRequired

Counterarguments:
- No new in-band F245 cluster may appear in the fresh rollup; the verdict is driven by unclosed repair and route freshness blockers, not a newly fabricated cluster.
- The stale selector text in the task may be documentation/example drift rather than the runtime selector used by the MCP tool; repeated scheduled prompts still make it an eval harness contract risk.
- Owner route 403 is partly outside F245's code boundary, but the eval lifecycle requires a reachable owner path before actionable verdicts can close.