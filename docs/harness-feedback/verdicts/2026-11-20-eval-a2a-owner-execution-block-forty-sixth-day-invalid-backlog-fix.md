---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-11-20-eval-a2a-owner-execution-block-forty-sixth-day-invalid-backlog-fix
source_snapshot: "snapshot:bundle/2026-11-20-eval-a2a-owner-execution-block-forty-sixth-day-invalid-backlog-fix/snapshot"
---

# Live Verdict — 2026-11-20-eval-a2a-owner-execution-block-forty-sixth-day-invalid-backlog-fix

- Verdict: `fix`
- Phenomenon: GitHub API and git transport recovered after two blocked scheduled checkpoints, but the F167 A2A repair chain still has no owner transition: task 0001790910664256-000456-e2794290 remains doing and is idle for 1151.792 hours. PRs #81, #11, and #153 retain unchanged heads, the invalid successor backlog remains twenty-five, and mandatory publication gaps have risen to five.
- Harness: F167/eval-a2a-owner-repair-chain (A2A owner routing, PR-tracking wake, and verdict evidence loop)
- Owner ask: Make task 0001790910664256-000456-e2794290 truthful and restore a funded owner path. Implement the active re-register regression, resolve PRs #81 and #11, deploy API+MCP from clean current main, publish one sourceThreadId-bearing non-author exact-head-reviewed replacement, supersede PRs #129-#153 plus any new invalid successor, and regenerate source evidence within 24 hours.
- Re-eval: Close only when the owner task is truthful, an owner invocation succeeds, the regression passes, a reviewed repair is deployed, PRs #81/#11 are resolved, one traceable replacement supersedes all invalid PRs, the five publication gaps are reconciled, and two consecutive eval runs publish traceable verdicts from source pairs no older than 24 hours. Grounding may escalate only with non-null counters and recurring high-confidence mismatch samples. at 2026-11-21T03:00:00Z

Evidence:
- snapshot:bundle/2026-11-20-eval-a2a-owner-execution-block-forty-sixth-day-invalid-backlog-fix/snapshot
- attribution:bundle/2026-11-20-eval-a2a-owner-execution-block-forty-sixth-day-invalid-backlog-fix/AR-2026-09-05-001
- metric:task:0001790910664256-000456-e2794290#status=doing&updatedAt=2026-10-03T03:12:27.526Z&idleHours=1151.792
- metric:github:transport#api=healthy&git=healthy&recoveredAfterScheduledOutages=2
- metric:github:pull/81#head=ca418798927887462c0fb56aba4037918c6538a4&mergeable=conflicting
- metric:github:pull/11#head=6ae3f310248d374e32a448dd587b804141a7139e&mergeStateStatus=unstable
- metric:github:pull/153#head=1f8b322d17012eee0eedf1099f5e808e9c1535c4&reviews=0&sourceThreadId=missing
- metric:github:pulls/129-153#knownUntraceableEvidencePrs=25
- metric:github:main#head=bfbeec37bbf32553388b06baaffdeeeb1b8dd721&committedAt=2026-10-18T03:01:30Z
- metric:runtime:pid/3409#artifact=dist/index.js&artifactMtime=2026-09-19T16:16:19+0800
- metric:snapshot:counter_window.duration_hours=1020.900449
- metric:snapshot:grounding-phase-o#check_total=null&verdict_total=null&mismatch_sample_count=null
- metric:owner-route:2026-11-17#quota403=request-202611170303274944376628268d9d6ClHDDx5s&observedFailures=47
- metric:scheduler:eval-a2a#mandatoryPublicationGaps=5
- metric:scheduler:eval-a2a#legacyScheduledTaskIds=0&legacyCleanupDisabled=1
- thread_eval_a2a/0001795057392264-000255-ff517470
- thread_eval_a2a/0001795143600088-000256-b7ab5991
- thread_eval_friction/0001794884603981-000244-c44f8937
- thread_eval_friction/0001794884604097-000245-6ff3850c

Counterarguments:
- GitHub transport recovered, so the temporary external blocker improved.
- Backlog and quota counts are flat before this publication; regression is driven by task age and the accumulated publication gap.
- PR #153 is Git-mergeable, but exact-head review and source-thread provenance remain absent.
- Legacy scheduled task IDs remain empty, so duplicate legacy triggers do not explain the failure.
