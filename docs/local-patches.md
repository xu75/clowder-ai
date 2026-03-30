---
doc_kind: tracking
created: 2026-03-30
---

# Local Patches (upstream divergence tracking)

Tracks commits that are **local customizations** not intended for upstream.
During `sync` from upstream, these need to be rebased or re-applied.

## Active Patches

### Feishu QR Code Bind Flow

> **Status**: active | **Since**: 2026-03-29 | **Branch**: feat/feishu-qr-bind

飞书扫码绑定 connector 的完整流程，Clowder 特有业务功能。

**Commits** (oldest first):
| Commit | Description |
|--------|-------------|
| `d85f0fb` | feat(connector): support feishu qr bind flow in hub |
| `2beb523` | fix(ci): format HubConnectorConfigTab for biome |
| `321e8c7` | fix(review): tighten connector save hint and stabilize feishu qr polling |
| `09391f9` | fix(test): isolate env vars in Feishu QR credential-persist test |

**Files touched** (conflict risk during sync):
- `packages/api/src/routes/connector-hub.ts` — 215 lines added (new routes)
- `packages/web/src/components/HubConnectorConfigTab.tsx` — import + render changes
- `packages/web/src/components/FeishuQrPanel.tsx` — new file
- `packages/api/test/connector-hub-route.test.js` — new test
- `packages/web/src/components/__tests__/feishu-qr-panel.test.tsx` — new test
- `packages/web/src/components/__tests__/hub-connector-config-tab.test.tsx` — new test

### Connector Admin Hint

> **Status**: PR'd upstream (zts212653/clowder-ai#308) | **Since**: 2026-03-30

管理员权限报错时显示 open_id hint。

**Commits**:
| Commit | Description |
|--------|-------------|
| `80824d6` | fix(connector): show open_id hint when non-admin uses permission commands |

**Files touched**:
- `packages/api/src/infrastructure/connectors/ConnectorCommandLayer.ts`

**Action**: upstream 合并后，下次 sync 自动消除。可在 sync 后从此文档移除。

## Resolved Patches

_None yet._

---

## Sync Checklist

每次从上游 sync 后：
1. `git rebase` active patches onto new sync commit
2. 解决冲突时参照上面的 files-touched 列表
3. 检查 PR'd 的 patch 是否已被上游合并 → 移到 Resolved
4. 跑 `pnpm check && pnpm lint && pnpm test` 确认无回归
