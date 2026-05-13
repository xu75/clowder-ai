---
anchor: lesson-8d4a37a4-d90
doc_kind: lesson
materialized_from: 8d4a37a4-d90
created: 2026-05-13
---

TrendLock 40 BTC hybrid execution sweep tested 1H execution with signal_interval=1h/4h/1d under two modes: long_close_signal (long K close confirmed, execute next 1H open) and exec_close_vs_signal_ma (1H close trigger against latest known long-cadence MA). Results in outputs/sweep_btc_signal_exec.csv. Conclusion: the MSTR-style long-signal + short-exec effect is only partially present on BTC. Best by return: 2y favors 1D MA with 1H trigger (freeze 20D, +64.1%); 3y favors 1D long-close signal (freeze 0D, +330.4%); 6y favors 4H long-close signal (freeze 3D, +2032.6%). 1D/4H long signals can beat pure 1H in longer windows, but strict long-close 4H execution is identical/timing-equivalent for BTC 24/7 because next 4H open equals next 1H open at the boundary.
