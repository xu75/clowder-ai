---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-10-02-eval-a2a-merge-wakeup-missed-fix
source_snapshot: "snapshot:bundle/2026-10-02-eval-a2a-merge-wakeup-missed-fix/snapshot"
---

# Live Verdict — 2026-10-02-eval-a2a-merge-wakeup-missed-fix

- Verdict: `fix`
- Phenomenon: PR #87 improved from a failing Public Test to a current-SHA cross-reviewed, five-check-green merge-ready state, but the intent=merge PR-tracking handoff did not wake its owner and the PR remained open for 23.476111 hours after the final check passed. The persisted tracking task still points at an older head and has no pass fingerprint, while raw F167 and Grounding Phase O telemetry remain stale/no-data.
- Harness: F167/eval-a2a-scheduled-source-handoff (F167 A2A evidence delivery and event-backed PR handoff through scheduled Eval Hub invocations)
- Owner ask: First, recheck PR #87 at head bbf4cf57a08ac354ae02c4efeaa258c9a6481168 and execute its merge-gate now because review 5374558489 covers that exact SHA and all five required checks are green; do not wait for the already-missed callback. Then reproduce why tracking task 0001790740761624-000401-13171b47 remained intent=merge with ci.headSha=2070a07d and no pass fingerprint after the PR advanced to bbf4cf57, inspect cicd-check scheduler/fetch/delivery evidence, and land a red-green F139/F140 regression test and fix that persists the current head/pass fingerprint and wakes exactly once after active re-registration plus a new-head terminal pass. After #87 lands, update PR #81 onto current main, resolve conflicts and required checks, obtain continuity review, merge/deploy, close superseded #80, and replace or rebase #11.
- Re-eval: PR #87 is merged at bbf4cf57 or any changed head has fresh review and green checks; the PR-tracking repair has a failing-then-passing test for active re-registration, head change, and intent=merge terminal pass proving exactly one wake plus persisted current head/pass fingerprint; PR #81 is current, green, reviewed, merged, and deployed; #80 is closed and #11 replaced or rebased; two consecutive post-deploy scheduled eval:a2a invocations publish traceable verdicts within SLA; and a fresh F167 snapshot/attribution pair no older than 24 hours contains a valid counter_window plus non-null grounding.check_total and grounding.verdict_total, with every nonzero mismatch sample reviewed before any fail-closed escalation. at 2026-10-03T03:00:00Z

Evidence:
- snapshot:bundle/2026-10-02-eval-a2a-merge-wakeup-missed-fix/snapshot
- attribution:bundle/2026-10-02-eval-a2a-merge-wakeup-missed-fix/AR-2026-09-05-001
- metric:github:pull/103@d463402caa6f62f40e67be96550ab34c69126b2a#merged-traceable-2026-10-01-eval-a2a-verdict
- metric:github:pull/87@bbf4cf57a08ac354ae02c4efeaa258c9a6481168#open-clean-current-sha-reviewed-five-required-checks-green
- metric:github:pull/87/review/5374558489#scoped-continuity-approved-current-head
- metric:github:actions/36809822339/job/110202165879#test-public-success-2026-10-01T03-31-26Z
- metric:task:0001790740761624-000401-13171b47#intent-merge-ci-head-stale-at-2070a07d-no-pass-fingerprint
- metric:github:pull/81@ca418798927887462c0fb56aba4037918c6538a4#open-conflicting-test-public-and-directory-size-guard-failed
- metric:github:pull/80@17ad68503abf93927a0ef1ae4dd59ea34a8f0dfa#open-superseded-three-required-checks-failed
- metric:github:pull/11@6ae3f310248d374e32a448dd587b804141a7139e#open-build-failed-stale
- metric:code:packages/api/src/routes/callbacks.ts#active-reregister-preserves-existing-ci-boundary
- metric:code:packages/api/src/infrastructure/email/CiCdCheckTaskSpec.ts#intent-merge-pass-wake-contract
- metric:code:packages/api/src/infrastructure/email/CiCdRouter.ts#pending-and-pass-must-persist-current-head
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#counter_window.duration_hours
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.check_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.verdict_total
- metric:snapshot:2026-09-05T03-04-16-604Z-F167-eval.yaml#grounding.mismatch_sample_count
- metric:filesystem:harness-feedback/F167-raw-latest@2026-09-06T03-01-04-233Z
- metric:scheduler:eval-a2a#legacy-disabled-no-legacy-task-ids
- trace:task/0001790740761624-000401-13171b47#intent-merge-current-pr-bbf4cf57-but-ci-head-2070a07d
- trace:thread_eval_friction/0001790824996537-000442-a3ae6150#event-driven-wait-armed-no-subsequent-ci-callback
- trace:github:actions/36809822339/job/110202165879#terminal-pass-without-owner-wake

Counterarguments:
- The code repair itself improved materially: #87 went from one failed required check to five green checks and retained exact-SHA cross-review.
- The stale ci.headSha field alone does not prove a re-registration bug because CiCdRouter routes on poll.headSha; it proves that no successful current-head poll/delivery transition was persisted, while the exact failing stage remains unresolved.
- A scheduler outage or transient GitHub fetch failure could explain the missed wake without a defect in intent=merge routing semantics.
- A manual merge of #87 can unblock the repair chain immediately, but it would not close the event-backed handoff regression that left a merge-ready PR idle for nearly a day.
- The selected counter window is 1020.900449 hours, above two hours, but all relevant counters are null, so no counter-derived rate is valid.
- Grounding Phase O remains no-data rather than healthy: grounding.check_total, grounding.verdict_total, and grounding.mismatch_sample_count are null, so no distribution supports shadow-to-fail-closed escalation.
- Legacy scheduling remains disabled with no legacy task IDs, so duplicate legacy triggers are not implicated.
