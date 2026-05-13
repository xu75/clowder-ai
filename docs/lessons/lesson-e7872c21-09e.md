---
anchor: lesson-e7872c21-09e
doc_kind: lesson
materialized_from: e7872c21-09e
created: 2026-05-13
---

TrendLock 40优化复盘：不要把研究 sweep 的 pure_trend_gate 结果直接当作线上 production strategy 结果。BTC sweep_btc_signal_exec 验证的是 MSTR 同构假设（长周期信号 + 短周期执行）在纯趋势闸门抽象中方向有效；线上页面使用 strategies/btc_ma_trend/signal.py + pipeline/backtest.py，语义是 crossover entry + min_hold exit，且 fee_rate=0.001 per side。跨策略结论必须先声明 abstraction/pipeline、fee model、window、metric。
