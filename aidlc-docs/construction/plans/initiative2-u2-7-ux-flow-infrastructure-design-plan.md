# U2-7 UX 改修フロー — Infrastructure Design 実行プラン（回答記録）

> per-unit ループ Infrastructure Design 段。Infra 申し送り（vitest 物理配置・CI step 位置・.pen 版管理）を実配置確定。

## 質問ゲート回答（2026-06-22 確定）

| ID | 論点 | 確定 | 内容 |
|---|---|---|---|
| **IDQ7-1** | vitest 配置 | **A** | 既存 `vite.config.ts` に `test` ブロック統合（`vitest/config` defineConfig・node 環境・`test:unit`=vitest run）。単一 config・最小フットプリント。 |
| **IDQ7-2** | e2e 配置 | **A** | 独立 `tests/e2e/` 新設＋playwright.config に **e2e プロジェクト追加**（VRT=tests/vrt と関心分離・`test:e2e`=--project=e2e／`test:vrt`=--project=chromium）。 |
| **IDQ7-3** | .pen 版管理 | **A** | `BusDelayAlerts/design/llocana-ux.pen` を **git 追跡**（暗号化・MCP 経由のみ）。書き出し画像は portal/assets。 |

## CI step 位置（NQ7-2=A から導出・質問せず）

- **build job**: install 後に `test:unit` step 追加（pin整合→install→unit→raw-hex→build）。
- **vrt job**: playwright install 後に `test:e2e` step 追加（install→playwright install→e2e→VRT→artifact）。
- 既存2 job 維持・fail-fast・SHA pin/permissions 継承。

## 現状調査（接地）

- `figuds-build.yml`= build job（pin整合/install/raw-hex/build）＋vrt job（install/playwright install/test:vrt/artifact・SHA pin・permissions: contents:read）。
- `playwright.config.ts`= testDir `./tests/vrt`・chromium(Pixel 5)・webServer vite dev 5173・maxDiffPixelRatio 0.02。
- `vite.config.ts` 既存・`vitest.config` 未存在。

## 生成成果物（infrastructure-design/）

1. **infrastructure-design.md** — LC→実配置表（navigation.ts/RouteDetail.tsx/navigation.test.ts/tests/e2e/figuds-build.yml/design/llocana-ux.pen/portal）＋vitest 配置（IDQ7-1=A）＋e2e 配置（IDQ7-2=A）＋.pen 版管理（IDQ7-3=A）＋CI 結線＋配備影響（配布非影響）＋N/A。
2. **deployment-architecture.md** — 配備構成図＋UX 改修フロー6手順（capture→review→reflect→verify→portal→record）＋品質ゲート一覧＋ロールバック（局所 revert）＋承認ゲート＋N/A。

**次**: Infrastructure Design 承認待ち（次=Code Generation＝decideBackTarget 抽出・RouteDetail 結線・二層テスト・portal ux-refine・.pen〔MCP〕）。
