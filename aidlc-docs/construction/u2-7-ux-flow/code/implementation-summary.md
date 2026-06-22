# U2-7 UX 改修フロー — Implementation Summary

> Code Generation Part 2（10 step）実装結果。原則 Pencil＝設計参照／実装が正典／既存非回帰。
> repo: **BusDelayAlerts**（working tree 未コミット）／**aidlc-workflows**（portal・docs）。

## 実装一覧（製品 BusDelayAlerts）

| step | ファイル | 変更 |
|---|---|---|
| S1 | `src/app/lib/navigation.ts`（新規） | 純粋関数 `decideBackTarget(locationKey): 'back'\|'home'`（`'default'`/空→home／他→back）。副作用なし |
| S2 | `src/app/pages/RouteDetail.tsx`（改修） | `useLocation()` 追加・`handleBack` を `decideBackTarget(location.key)` で分岐（home→`navigate('/',{replace:true})`／back→`navigate(-1)`）。**遷移 motion を Core トークン消費へ**（`duration: 0.3`→`motionDurationSec('--motion-duration-budget-nav',200)`＝300ms 生値→Core nav 200ms・C1 拡張）。レイアウト/RouteDetailScreen 不変 |
| S2-m | `src/app/lib/motion.ts`＋`motion.test.ts`（新規・C1 拡張） | Core 体感バジェット契約の消費＝`parseMsToSeconds`（純粋・ms/s/単位なし→秒・非数値 fallback）＋`motionDurationSec`（getComputedStyle 読取・SSR 縮退）。vitest 4ケース |
| S2' | `src/app/components/RouteDetailScreen.tsx`（テストフック） | 戻りボタンに `data-testid="route-detail-back"`（視覚/a11y/挙動不変） |
| S2'' | `src/app/components/RouteCard.tsx`（テストフック） | 状態リンクに `data-testid="route-card-status-link"`（視覚/a11y/挙動不変） |
| S3 | `vite.config.ts`（改修） | `vitest/config` defineConfig に切替・`test`（node 環境・`include src/**/*.test.ts`） |
| S3 | `package.json`（改修） | scripts `test:unit`=vitest run／`test:e2e`=playwright --project=e2e／`test:vrt`=--project=chromium（分離）。devDep `vitest@3.2.4` |
| S4 | `src/app/lib/navigation.test.ts`（新規） | vitest 単体4ケース（default→home／任意→back／未定義・空→home／参照透過） |
| S5 | `playwright.config.ts`（改修） | projects に `e2e`（testDir tests/e2e）追加・既存 `chromium` を testDir tests/vrt 明示・webServer 共有 |
| S6 | `tests/e2e/back-navigation.spec.ts`（新規） | ①通常フロー（カード→詳細→戻る=Home・非回帰）②直リンク（→戻る=Home フォールバック・C1）。onboarding は addInitScript で決定的化 |
| S7 | `.github/workflows/figuds-build.yml`（改修） | build job に `test:unit` step・vrt job に `test:e2e` step（fail-fast・SHA pin/permissions 継承） |
| S8 | `design/README.md`（新規）／`design/llocana-ux.pen`（**未生成**） | `.pen` 設計参照の git 追跡先・構成意図。**実 .pen 生成は Pencil 拡張でのファイルオープンが前提＝対話操作待ち**（後述） |

## 実装一覧（aidlc-workflows）

| step | ファイル | 変更 |
|---|---|---|
| S9 | `portal/src/usage.js`（改修） | GUIDES に `ux-refine`（operation グループ）追加＝確認→差替→反映＋VSCode×Pencil 手順。usageIndex に自動掲載・シナリオA「あわよくば」と連続 |
| S10 | 本書・`non-regression-checklist.md`・`dev-flow-journal.md`（Step 8） | docs |

## 検証結果（ローカル）

- **vitest 単体**: `npm run test:unit` → **8 pass / 0 fail**（navigation 4＋motion 4＝decideBackTarget 分岐／parseMsToSeconds ms→s）。
- **raw-hex guard**: `npm run check:rawhex` → **主要導線 生 HEX 0**（U2-3 退行なし）。
- **vite build**: `npm run build` → **PASS**（2088 modules・CSS gzip 30.23kB＝不変・JS 202.14kB・chunk 警告は既存）。
- **Playwright 設定**: `--project=e2e --list` → tests/e2e 2件認識／`--project=chromium --list` → tests/vrt 7件のみ（**プロジェクト分離正常**）。**e2e/VRT 実描画はローカル Playwright ブラウザ未導入のため CI Linux 初回実行**（IDQ 設計どおり）。
- **portal**: `npm test` → **42 pass / 0 fail**（ux-refine 追加で nav/usage/ia 非回帰）・`npm run build` → **PASS**。

## 残・申し送り

- **`.pen` 実生成（S8）**: pencil MCP は**エディタに .pen がオープンされている必要**があり、MCP 単独で新規作成不可。**ユーザーが VSCode Pencil 拡張で `design/llocana-ux.pen` を開く**操作後に、`batch_design` で as-is/to-be 作図→`export_nodes` で portal/assets へ書き出し→ux-refine ガイドから参照、を実施する。
- **e2e/VRT ベースライン**: CI Linux 初回実行（VRT ベースラインは既存どおり初回生成・a11y 該当なし）。
- **package-lock.json**: `npm install` 実行済で vitest 反映済（CI `npm ci` 整合）。
- **commit/push**: 製品・portal・docs すべて working tree 未コミット＝**ユーザー承認後**。
