---
anchor: lesson-cf82bc83-3eb
doc_kind: lesson
materialized_from: cf82bc83-3eb
created: 2026-05-16
---

nix 100优化 lesson: V1.1 FastRe 的核心定义是“月频出场 + 空仓期周频回场”，不是日频 QQQ>SMA225 hard gate。后续实验若用 `_fastre_signal` 必须先验证其与 `dual_momentum_riskon_b_fast_reentry_signal` 信号一致；否则会把日频 MA whipsaw 当成策略归因，导致 V2.0 报告错误放行。
