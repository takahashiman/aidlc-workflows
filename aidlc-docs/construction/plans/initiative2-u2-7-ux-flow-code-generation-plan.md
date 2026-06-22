# U2-7 UX 改修フロー — Code Generation 実装プラン（Part 1）

> 設計確定（FD/NFR-Req/NFR-Design/Infra 全承認）を実装へ。原則 **Pencil＝設計参照／実装が正典／既存非回帰**。
> repo: **BusDelayAlerts**（コード・テスト・CI・.pen）／**aidlc-workflows**（portal 導線・docs）。
> **実コードの commit/push・`.pen` 最終確定はユーザー承認後**（Initiative #2 運用方針）。

## 実装スコープ境界

- **対象**: 代表1フロー（Home→RouteDetail→SettingsNotifications）の **最小UX改善1点＝C1（RouteDetail 戻りの堅牢化）** のみ。
- **非対象**: 他画面・機能仕様変更・新機能・スタイル変更（U2-2/U2-3 完了済は触らない）・生HEX 持込（BR-UX-8）。
- **状態表現不変**: 遅延状態の色/ラベル（Core status-pill 委譲）は変更しない（BR-FLOW-3）。

## 実装 10 step

| # | 成果物 | 内容 | LC / ルール |
|---|---|---|---|
| **S1** | `src/app/lib/navigation.ts`（新規） | 純粋関数 `decideBackTarget(locationKey: string): 'back' \| 'home'`（`'default'`→`'home'`／他→`'back'`）。副作用なし・JSDoc | LC-BackDecision / SP7-2 / BR-FLOW-1 |
| **S2** | `src/app/pages/RouteDetail.tsx`（改修） | `useLocation()` 追加・`handleBack` を `decideBackTarget(location.key)` で分岐（`'home'`→`navigate('/', {replace:true})`／`'back'`→`navigate(-1)`）。**motion/レイアウト/RouteDetailScreen は不変** | LC-RouteDetailBinding / SP7-1 / SP7-5 |
| **S3** | `vite.config.ts`＋`package.json` | vite.config を `vitest/config` defineConfig に切替え `test` ブロック追記（`environment:'node'`・`include:['src/**/*.test.ts']`）。scripts に `test:unit`=`vitest run`／`test:e2e`=`playwright test --project=e2e`／`test:vrt`=`playwright test --project=chromium`（分離）。devDep `vitest` 追加 | IDQ7-1=A / IDQ7-2=A |
| **S4** | `src/app/lib/navigation.test.ts`（新規） | vitest 単体: `decideBackTarget('default')==='home'`／任意 key→`'back'`／空文字・境界。実装が正典・モック不要 | LC-UnitTest / SP7-3 / NRD7-REL-3 |
| **S5** | `playwright.config.ts`（改修） | projects に **e2e プロジェクト追加**（`testDir:'./tests/e2e'`・スクショ制約なし）。既存 chromium(vrt) を `testDir:'./tests/vrt'` に明示。webServer 共有 | IDQ7-2=A / LC-E2E,LC-VRT |
| **S6** | `tests/e2e/back-navigation.spec.ts`（新規） | ①Home→カード→RouteDetail→戻る→`/`(Home) 着地（通常・非回帰）②`/routes/detail/:busId` 直アクセス→戻る→`/`(Home) 着地（C1 フォールバック）。URL/到達先アサート | LC-E2E / SP7-3 / NRD7-REL-1/2 |
| **S7** | `.github/workflows/figuds-build.yml`（改修） | build job の install 後に `test:unit` step／vrt job の playwright install 後に `test:e2e` step を追加（fail-fast・SHA pin/permissions 継承・job コメント更新「VRT＋戻り e2e」） | LC-CIWire / NQ7-2=A |
| **S8** | `design/llocana-ux.pen`（新規・MCP）＋書き出し | pencil MCP で代表3画面の **as-is/to-be** を表現（S1-Home/S2-RouteDetail/S3-Notifications・遷移注記・to-be=C1）。書き出し画像を `aidlc-workflows/portal/assets/` へ。生HEX 持込なし | LC-PenArtifact / SP7-6 / BR-UX-5,6 |
| **S9** | `portal/`（aidlc-workflows・改修） | usage GUIDES に `ux-refine` 1本追加（ねらい/前提 VSCode×Pencil/①確認②差替③反映/記録/参照＋書き出し画像）。usageIndex 結線・シナリオA「あわよくば」入口から導線。既存 nav/usage/ia テスト非回帰 | LC-PortalGuide / SP7-7 / BR-UX-7 |
| **S10** | 検証＋docs＋state | ローカル: `vite build`／`test:unit`（vitest 導入後）／生HEX0 確認。**e2e/VRT 実描画は CI Linux**（ローカル Playwright 未導入）。docs=`construction/u2-7-ux-flow/code/{implementation-summary.md,non-regression-checklist.md}`・dev-flow-journal Step 8（UX 改修フロー確立・あわよくば）。state/audit 更新 | LC-Record / US-X4 |

## 検証方針（二層・SP7-3）

- **単体（vitest）**: `test:unit` ローカル実行可（vitest 導入後・node 環境）。
- **機能 e2e（Playwright）**: 戻り2経路。**ローカル Playwright 未導入→CI Linux 初回実行**（IDQ 設計どおり）。
- **VRT（既存）**: main-routes ベースライン緑維持（視覚非回帰）。改修は分岐1点＝視覚不変想定。
- 三者全緑が反映合格条件（BR-REV-1）。

## 承認後の実行（commit/push 等）

- BusDelayAlerts working tree 変更（S1-S7）・`design/llocana-ux.pen`（S8）・aidlc-workflows portal/docs（S9-S10）は **commit/push 承認後**。
- e2e/VRT ベースライン・CI 緑確認は push 後の figuds-build.yml（CI Linux）。

**次**: 本 Code Generation 実装プラン承認待ち（承認で Part 2 実装＝10 step）。
