# CLI version-outdated diagnostics palette gap

### Bug 诊断胶囊：`cli_version_outdated` 缺少前端 palette

| 栏位 | 内容 |
|------|------|
| **1. 现象** | 期望：`origin/main` 可以完成 Web production build，并为 `cli_version_outdated` 渲染结构化 CLI diagnostics。实际：Next.js typecheck 报 `REASON_PALETTE` 缺少该键，所有基于 main 的 PR Build 必红。 |
| **2. 证据** | `origin/main` commit `f2bcd0a41` 新增 `CliErrorReasonCode` 值，但未同步 `packages/web/src/components/CliDiagnosticsPanel.tsx`；GitHub PR #9 Build job `89750694948` 与本地干净 `pnpm --filter @cat-cafe/web build` 均复现。 |
| **3. 问题假设或根因** | 根因已确认：共享 discriminated union 扩展后，前端穷举 consumer `Record<CliErrorReasonCode, Palette>` 漏同步；现有 AC-B4 测试的手写 reason-code 列表也漏了该值。 |
| **4. 诊断策略** | 对照共享 union、palette keys 与 AC-B4 reason-code fixtures；先让组件测试对新增 reason code 变红，再补最小 palette 映射。 |
| **5. 超时策略** | 若最小映射不能同时恢复 targeted test 与 Web build，停止扩展修补，逆向检查其他 `Record<CliErrorReasonCode, ...>` consumer。 |
| **6. 预警策略** | 若出现第二个遗漏 consumer 或三个以上并行映射表，改为统一从共享 metadata 派生，而不是继续逐点补键。 |
| **7. 用户可见交互修正** | Codex 版本过旧错误会显示已分类的配置修复型 banner，而不是未知错误 fallback。 |
| **8. 验收** | `CliDiagnosticsPanel.test.ts` 覆盖 `cli_version_outdated` 且通过；`pnpm --filter @cat-cafe/web build` 通过；相关 CLI diagnostics 测试无回归。 |
