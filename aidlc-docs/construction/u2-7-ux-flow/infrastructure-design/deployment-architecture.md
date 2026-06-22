# U2-7 UX 改修フロー — Deployment Architecture

> 製品 BusDelayAlerts（コード・テスト・CI）と aidlc-workflows portal（導線）の配備。

## 1. 配備構成図（論理）

```
┌──────────────────────────── BusDelayAlerts repo ────────────────────────────┐
│  src/app/lib/navigation.ts ── decideBackTarget(locationKey)  ← 純粋（正典）   │
│  src/app/pages/RouteDetail.tsx ── handleBack 分岐（navigate -1 / '/'）        │
│  design/llocana-ux.pen ── as-is/to-be（git 追跡・MCP 経由）                   │
│                                                                              │
│  vite.config.ts（test 統合）  ─ test:unit ─▶ navigation.test.ts（vitest）     │
│  tests/e2e/back-navigation.spec.ts ─ test:e2e ─▶ Playwright(e2e project)      │
│  tests/vrt/main-routes.spec.ts ── test:vrt ─▶ Playwright(chromium/vrt・既存)  │
│                                                                              │
│  .github/workflows/figuds-build.yml                                          │
│    build job: pin整合→install→[unit]→raw-hex→build                           │
│    vrt  job : install→playwright install→[e2e]→VRT→artifact（fail-fast）      │
└──────────────────────────────────────────────────────────────────────────────┘
                         │ 書き出し画像（PNG）
                         ▼
┌──────────────────────── aidlc-workflows repo ─────────────────────────────┐
│  portal/assets/ ── ux-refine 用書き出し画像                                 │
│  portal/（usage GUIDES に ux-refine 追加）                                   │
│  portal-deploy.yml quality job（build→VRT＋a11y→deploy・既存で非回帰検査）   │
└────────────────────────────────────────────────────────────────────────────┘
```

## 2. UX 改修フロー手順（capture→review→reflect）

1. **capture**: pencil MCP で `design/llocana-ux.pen` に代表3画面の as-is/to-be を表現（Code Gen 段で実施）。
2. **review**: as-is/to-be 差分を確認し非回帰境界を線引き＝採用改善＝C1（戻り堅牢化）を確定。
3. **reflect**: `decideBackTarget` 抽出＋RouteDetail 結線（実装が正典）。
4. **verify**: `test:unit`（分岐）＋`test:e2e`（戻り2経路）＋`test:vrt`（視覚非回帰）が全緑。
5. **portal**: `.pen` 書き出し画像を portal へ・`ux-refine` ガイド結線。
6. **record**: dev-flow-journal に Step 追記（US-X4）。

## 3. 品質ゲート一覧

| ゲート | 実行 | 合格条件 |
|---|---|---|
| 単体（vitest） | build job `test:unit` | `decideBackTarget` 分岐＝履歴有→back／無→home |
| 機能 e2e | vrt job `test:e2e` | 戻り2経路とも Home 着地 |
| VRT | vrt job `test:vrt` | 既存 main-routes ベースライン差分なし（視覚非回帰） |
| raw-hex | build job `check:rawhex` | 主要導線 生 HEX 0（U2-3 退行なし） |
| portal 品質 | portal-deploy.yml quality | portal VRT/a11y 緑（ux-refine 追加分） |

## 4. ロールバック

- 改修は RouteDetail 戻り分岐＋純粋ヘルパー追加の局所変更＝**revert で既存挙動に即復帰**（`navigate(-1)` 単体へ）。テスト/CI 追加分も独立 step/dir で分離撤去可能。
- `.pen`・portal ガイドは設計参照／ドキュメントのため機能影響なし。

## 5. 承認・実行ゲート

- 実コード変更・テスト/CI 追加の **commit/push はユーザー承認後**（Initiative #2 運用方針）。
- `.pen` の実生成は Code Generation 段（MCP）。最終確定も承認後。

## 6. N/A

- 従来型インフラ（compute/storage/network/DB）・Scalability・Availability・DR＝該当なし。
