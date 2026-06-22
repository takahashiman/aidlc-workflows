# U2-7 UX 改修フロー — Infrastructure Design

> NFR Design の LC を実配置へ。確定: **IDQ7-1=A**（vite.config.ts に vitest `test` 統合）/ **IDQ7-2=A**（独立 `tests/e2e/`＋Playwright プロジェクト追加）/ **IDQ7-3=A**（`.pen` を製品 repo `design/` で git 追跡）。CI 結線は NQ7-2=A（figuds-build.yml 同梱）。

## LC → 実配置

| LC | 実配置（repo / パス） | 種別 |
|---|---|---|
| LC-BackDecision | BusDelayAlerts `src/app/lib/navigation.ts`（純粋 `decideBackTarget(locationKey): 'back'\|'home'`） | 製品コード（新規・最小） |
| LC-RouteDetailBinding | BusDelayAlerts `src/app/pages/RouteDetail.tsx`（`handleBack` を分岐・既存 motion/レイアウト不変） | 製品コード（局所改修） |
| LC-UnitTest | BusDelayAlerts `src/app/lib/navigation.test.ts`（vitest） | 単体テスト（新規） |
| LC-E2E | BusDelayAlerts `tests/e2e/back-navigation.spec.ts`（新規 dir） | 機能 e2e（新規） |
| LC-VRT | BusDelayAlerts `tests/vrt/main-routes.spec.ts`（既存・無改変） | VRT（再利用） |
| LC-CIWire | BusDelayAlerts `.github/workflows/figuds-build.yml`（build job に unit step・vrt job に e2e step） | CI（拡張） |
| LC-PenArtifact | BusDelayAlerts `design/llocana-ux.pen`（git 追跡・暗号化・MCP 経由）／書き出し画像→portal | 設計参照（新規） |
| LC-PortalGuide | aidlc-workflows `portal/`（usage GUIDES に `ux-refine`＋書き出し画像 `portal/assets/`） | ポータル（拡張） |
| LC-Record | aidlc-workflows `aidlc-docs/dev-flow-journal.md`（Step 追記） | 記録 |

## 1. vitest 配置（IDQ7-1=A）

- **config**: 既存 `vite.config.ts` を `vitest/config` の `defineConfig` に切替え、`test` ブロックを追記（`environment: 'node'`＝純粋関数のため jsdom 不要・`include: ['src/**/*.test.ts']`）。単一 config で vite と設定共有。
- **script**: `package.json` に `"test:unit": "vitest run"`（CI 非対話）。`vitest`（watch）は任意。
- **devDependency**: `vitest` を追加（ランタイム非依存・配布物に影響なし）。
- **対象**: LC-BackDecision のみ（純粋・node 環境で完結・React/router 不要＝モック最小）。

## 2. e2e 配置（IDQ7-2=A）

- **dir**: `tests/e2e/back-navigation.spec.ts` を新設（VRT=`tests/vrt` と分離）。
- **playwright.config.ts**: projects に **e2e プロジェクト追加**（`testDir: './tests/e2e'`・スクショ制約なし＝URL/到達先アサート）。既存 chromium(vrt) プロジェクトは `testDir: './tests/vrt'` に明示。webServer は既存（vite dev 5173）を共有。
- **script**: `"test:e2e": "playwright test --project=e2e"`／既存 `"test:vrt": "playwright test --project=chromium"`（プロジェクト分離で混在実行を回避）。
- **検証内容**: ①Home→カード→RouteDetail→戻る=Home（通常・非回帰）②`/routes/detail/:busId` 直アクセス→戻る=Home（C1 フォールバック）。

## 3. .pen 版管理（IDQ7-3=A）

- `BusDelayAlerts/design/llocana-ux.pen` を **git 追跡**（設計参照を実装と同じ repo でバージョン管理・FDQ7-3=B）。暗号化バイナリ・**編集は pencil MCP 経由のみ**（Read/Grep 禁止）。
- **書き出し画像**は aidlc-workflows `portal/assets/`（公開素材・`ux-refine` ガイド用）。`.gitignore` は既存（`src/styles/generated/` 除外）を維持＝design/ は除外しない。

## 4. CI 結線（NQ7-2=A・figuds-build.yml 拡張）

既存2 job を維持し step を追加（fail-fast）:

- **build job**: `Install`(npm ci) の後に **`test:unit` step 追加**（vitest・pin整合→install→**unit**→raw-hex→build）。純粋単体は軽量＝build job 内で完結。
- **vrt job**: `playwright install` 済の利点を活かし **`test:e2e` step を VRT 実行の前後に追加**（install→playwright install→**e2e**→VRT→artifact）。job 名コメントを「VRT＋戻り e2e」に更新。
- Actions SHA pin・`permissions: contents: read`・artifact アップロードは既存継承。

## 5. 配備への影響

- **配布物・ランタイム**: 影響なし（vitest は devDependency・e2e はテスト・`.pen` は設計参照）。本番バンドルは RouteDetail の分岐1点のみ（無視可能な増分）。
- **ポータル**: portal ビルドに `ux-refine` ガイド＋書き出し画像が加わる（既存 portal-deploy.yml の quality job/VRT/a11y で非回帰検査）。

## 6. N/A

- Compute/Storage/Network プロビジョニング・従来型インフラ・Scalability・Availability＝該当なし（静的 SPA・クライアント改修＋devtool）。
