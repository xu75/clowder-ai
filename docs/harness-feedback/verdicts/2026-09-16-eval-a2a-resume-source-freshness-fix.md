---
feature_ids: [F192, F167]
topics: [harness-eval, eval-a2a, live-verdict]
doc_kind: harness-feedback
feedback_type: live-verdict
domain_id: eval:a2a
packet_id: 2026-09-16-eval-a2a-resume-source-freshness-fix
source_snapshot: "snapshot:bundle/2026-09-16-eval-a2a-resume-source-freshness-fix/snapshot"
---

# Live Verdict — 2026-09-16-eval-a2a-resume-source-freshness-fix

- Verdict: `fix`
- Phenomenon: The eval:a2a schedule completed seven consecutive daily attempts (2026-09-09 through 2026-09-15) with the same Codex resume failure, `thread/resume failed: paginated_threads is not supported yet`, so no verdict was published and no fresh F167 raw evidence appeared after 2026-09-06. The assigned 2026-09-05 source is already-consumed historical evidence: its 1020.900449-hour counter window has null core and Grounding Phase O counters, so it supports neither counter rates nor fail-closed escalation.
- Harness: F167/eval-a2a-scheduled-source-handoff (F167 A2A evidence delivery through the scheduled Eval Hub invocation)
- Owner ask: Harden scheduled eval resume and source freshness: validate/log the selected Codex CLI path and version, detect unsupported thread-history capability errors and start a fresh evaluator session instead of retrying the same persisted session indefinitely, add a regression test for the seven-day failure mode, and repair or replace PR 11 so every eval:a2a checkpoint receives a newly generated F167 snapshot/attribution pair before analysis. Preserve the dirty primary checkout; perform implementation in an isolated worktree.
- Re-eval: Two consecutive daily eval:a2a checkpoints complete without thread/resume capability errors, each generates a new F167 snapshot/attribution pair no older than 24 hours, publishes traceable evidence with provenance.sourceThreadId, and reports core plus Grounding Phase O counters or an explicit current telemetry gap. legacyScheduledTaskIds must remain empty with legacy cleanup disabled. at 2026-09-17T03:00:00Z

Evidence:
- snapshot:bundle/2026-09-16-eval-a2a-resume-source-freshness-fix/snapshot
- attribution:bundle/2026-09-16-eval-a2a-resume-source-freshness-fix/AR-2026-09-05-001
- metric:2026-09-05T03-04-16-604Z-F167-eval.yaml#counter_window.duration_hours
- metric:2026-09-05T03-04-16-604Z-F167-eval.yaml#components.grounding-phase-o.activation_counts.grounding.check_total
- metric:2026-09-05T03-04-16-604Z-F167-eval.yaml#components.grounding-phase-o.activation_counts.grounding.verdict_total
- metric:2026-09-05T03-04-16-604Z-F167-eval.yaml#components.grounding-phase-o.friction_counts.grounding.mismatch_sample_count
- metric:thread_eval_a2a#2026-09-09..2026-09-15-cli-resume-failure-streak
- metric:scheduler/eval-a2a/legacy-disabled
- thread_eval_a2a/0001788922806041-000025-74f6b3bd
- thread_eval_a2a/0001789009202617-000029-7e08be3a
- thread_eval_a2a/0001789095606624-000034-e8e4c616
- thread_eval_a2a/0001789182002211-000039-8d0797f0
- thread_eval_a2a/0001789268408003-000050-2d81657c
- thread_eval_a2a/0001789354803633-000055-fc54819e
- thread_eval_a2a/0001789441202241-000068-7925d64b
- runtime/codex/invocation/7b949282-0a9d-4817-acc9-01bec897b56c
- runtime/codex/invocation/a3066292-8a9d-4e26-8a3c-407f17e49995
- runtime/codex/invocation/d2148e42-bdde-4d98-90c3-53fb8b6d5fe1
- runtime/codex/invocation/8667e60d-3670-4179-9711-327b120c67a3
- runtime/codex/invocation/c801926b-d421-4288-9fe1-6cfea22cbf39
- runtime/codex/invocation/5ab24e9e-975b-4e16-824d-619e3fd67a1f
- runtime/codex/invocation/44694867-593d-4518-9757-0b9177e40159
- github/xu75/clowder-ai/pull/77@cb5a5487e08db9bd9deffb291ea98050a6d94ed0
- github/xu75/clowder-ai/pull/11@6ae3f310248d374e32a448dd587b804141a7139e
- github/openai/codex/issues/40796
- runtime/codex-cli/0.154.0-installed-2026-09-15T12:30:13+0800
- runtime/api/pid-5736-started-2026-09-15T22:01:09+0800

Counterarguments:
- The matching openai/codex issue is first-hand user evidence in the official repository but concerns Codex Desktop on Windows, not Cat Cafe's direct macOS CLI invocation; it is corroboration, not proof of the local cause.
- The 2026-09-16 invocation is running after the CLI install and API restart, so the resume fault may already be transiently recovered; one live run does not establish two-checkpoint durability or source freshness.
- Because no fresh raw F167 evidence exists after 2026-09-06, this packet cannot judge current L1, C1, C2, route-serial, or Grounding Phase O effectiveness.
- The scheduled payload declares no legacy task IDs and disabled legacy cleanup, and the observed cadence is one attempt per day, so duplicate legacy triggers do not explain the failure streak.
