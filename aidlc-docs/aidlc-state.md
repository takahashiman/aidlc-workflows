# AI-DLC State Tracking

> ⚠️ **本ファイルは2つのイニシアチブを記録**: 下記 `## Project Information` 以降は
> **イニシアチブ#1（FIG-UDS 循環システム・Construction 全 Unit 完了）**の記録（保全）。
> **イニシアチブ#2（次期・dogfooding＋ポータル綿密化）は末尾の「🆕 INITIATIVE #2」節**を参照。
> 現在アクティブなのは #2（2026-06-18 起動）。

---

## 🆕 INITIATIVE #2 — 実開発 dogfooding ＋ ポータル提供方法の綿密化（OPERATIONS 起点の小サイクル）

### Initiative #2 Information
- **Initiative**: 実開発リポジトリの dogfooding ＋ ポータル提供方法の綿密化
- **Start Date**: 2026-06-18T02:00:00Z
- **Project Type**: Brownfield（前サイクル RE 流用・差分のみ）
- **正典ブリーフ**: `aidlc-docs/next-initiative-brief.md`（§3 の2大目標がスコープ）
- **Current Stage**: CONSTRUCTION(#2) - **U2-1〜U2-7 ✅全 Unit 完了**（2026-06-22 U2-7 Code Gen 承認）。残＝**Build and Test（全 Unit 後）**。U2-7 成果＝UX 改修フロー確立（C1 戻り堅牢化＋motion トークン化を代表実証）。**UX/導線の本格改修は保留（今後活用）**。

### 🔖 RESUME POINT（次セッション開始点・2026-06-23 更新＝Build and Test 全グリーン）
- **いま**: CONSTRUCTION(#2)。**U2-1〜U2-7 ✅全 Unit 完了**＋**3レポ commit/push 完了＋CI 全グリーン**。残＝**Core PR#3 のマージ＋タグ／PR#4 マージ（ユーザー操作）**のみ。
- **Build and Test 結果（2026-06-23・3レポすべて緑）**:
    1. **Core PR#3**（`feat/arrival-card-preview`・base=core）= **lint✅/VRT✅/a11y✅**（run 27954197966）。Issue #2＋PR #3 作成済。⏸ 残＝**Maintainer 承認マージ→MINOR タグ v1.3.0**（SEC-3 自動マージ禁止）。最新 HEAD=`4120732`。
    2. **BusDelayAlerts**（`feature/figuds-adoption`）= **build✅/VRT✅/e2e✅**（run 27946891781）。VRT ベースライン3枚（home/ticket-purchase/map-search）を CI Linux 生成→`tests/vrt/__screenshots__/` に commit 済（HEAD=`a4ec3ff`）。
    3. **aidlc-workflows PR#4**（`feat/initiative2-portal-docs`・base=main）= **CI✅/CodeQL✅/grype✅/PR Validation✅**（HEAD=`f5cd997`）。⏸ 残＝マージ。
- **CI を緑化するため今回直した不整合（初回 CI 統合起因・記録）**:
    - 契約文 URL（PR validation）＝awslabs→takahashiman。
    - arrival-card の V3 層逆流（`--bg-app`→`--color-surface-canvas`）。
    - Core lint スコープ過大＝root `.`→`preview`＋レガシー preview/storybook/uploads 等を lint-rules.json ignore 管理＋lint/a11y/vrt の CI 正典 ref を PR head に（ブートストラップ）。
    - submodule pin 誤検知＝tag fetch フォールバック。
    - grype High＝msgpack 1.1.2→1.2.1。
    - **playwright ブラウザ DL ハング（VRT/a11y 20分 timeout の真因）＝旧 azureedge CDN 廃止。Playwright を 1.55.0 へ＋VRT/a11y/e2e を Playwright 公式 Docker コンテナ（mcr.microsoft.com/playwright:v1.55.0-noble）実行に変更＝DL 撤廃で根絶**。
    - a11y runner＝`browser.newContext()` 経由 page に修正＋失敗ノード詳細出力。
    - **a11y が本物の違反検出→修正**: passed status を WCAG AA 化（`--color-status-passed-fg` slate-500→slate-600）＋arrival-card の `<s>` muted 化・通過済カードの opacity:0.5 撤去。
- **次の一手（ユーザー操作）**: ① Core PR#3 を Maintainer 承認マージ→`v1.3.0` タグ（MINOR）。② aidlc-workflows PR#4 をマージ。③（任意）BDA submodule pin を v1.3.0 へ更新。代替＝.pen portal 取込／UX 知見 Core 還元（C1→page-transition back・承認後）。
  - 代替: **Build and Test をローカル先行**（新情報少）／**`.pen` の portal 取込**（保存後 export_nodes→portal/assets→ux-refine 画像結線）／**UX 知見 Core 還元**（C1 戻り規約→page-transition back 追補・承認後）。
  - **U2-7 完了内容（2026-06-22）**: **UX 改修フローの確立**が成果（C-UXFlow＝capture→review→reflect・Core UX 契約を基準に .pen で提案→承認→反映→Core 還元→ポータル確認）。代表 C1＝RouteDetail 戻りの堅牢化（`navigation.ts` の純粋 `decideBackTarget`・履歴なし=Home フォールバック）＋motion トークン化（`motion.ts` で `--motion-duration-budget-nav` 参照・300ms 生値解消）。二層検証＝vitest 8/0＋Playwright e2e（tests/e2e 戻り2経路）＋既存 VRT。portal `ux-refine` ガイド（6手順）。検証 PASS（製品 vitest 8/0・生HEX0・build／portal 42/0・build）。**e2e/VRT 実描画は CI Linux 初回**。
  - **保留・今後**: **UX/導線の本格改修は保留**（C1 は flow 確立の代表実証として working tree に在・本格展開は今後）。`.pen` は今後の改修に備え `BusDelayAlerts/design/llocana-ux.pen` 保存（MCP に save-as なし＝VSCode/Pencil 拡張で Save As が必要・保存後 export_nodes で portal/assets へ書き出し→ux-refine 画像結線）。UX 知見の Core 還元（C1 戻り規約→page-transition back 追補）は承認後。[[ux-circulation-loop]]。
  - **未コミット（U2-7 分）**: BusDelayAlerts working tree＝navigation.ts・motion.ts（新規）/RouteDetail.tsx・RouteDetailScreen.tsx・RouteCard.tsx（改修）/navigation.test.ts・motion.test.ts・tests/e2e/back-navigation.spec.ts（新規）/vite.config.ts・playwright.config.ts・package.json・package-lock.json・figuds-build.yml（改修）/design/README.md（＋保存後 llocana-ux.pen）。aidlc-workflows＝portal/src/usage.js／aidlc-docs。全 commit/push は承認後。
  - **U2-7 実装内容（2026-06-22）**: 最小UX改善 C1＝RouteDetail 戻りの堅牢化（`src/app/lib/navigation.ts` の純粋 `decideBackTarget(locationKey)`＝'default'/空→home／他→back・RouteDetail で `location.key` 分岐・home→`navigate('/',{replace:true})`／back→`navigate(-1)`）。**C1 拡張＝motion トークン化**（`src/app/lib/motion.ts`＝`--motion-duration-budget-nav`(200ms) 参照・遷移 300ms 生値解消）。二層検証＝vitest 単体8/0（navigation4＋motion4）＋Playwright e2e（独立 tests/e2e・戻り2経路）＋既存 VRT。CI=figuds-build.yml（build に test:unit・vrt に test:e2e）。portal `usage.js` に `ux-refine` ガイド追加（6手順・UX 循環）。検証 PASS（製品 vitest 8/0・生HEX0・build 2088 modules／portal 42/0・build）。**e2e/VRT 実描画は CI Linux 初回**（ローカル Playwright ブラウザ未導入）。
  - **`.pen` 作図済（pencil-new.pen）**: 代表3画面フロー＋C1 as-is/to-be 比較（戻り堅牢化＋motion 注記）。MCP で作図・スクショ確認済。**⚠ 要: ユーザーが `BusDelayAlerts/design/llocana-ux.pen` として保存** → `export_nodes` で `portal/assets/` 書き出し → ux-refine 参照。設計意図は `BusDelayAlerts/design/README.md`。
  - **UX 循環ループ（方針確定）**: [[ux-circulation-loop]]＝UX もスタイル同様 Core で蓄積・還元。基準=Core UX 契約（transition-budget/page-transition/feedback-contract/a11y）、.pen=提案ツール（必須ゲートでない）、生 motion 値=UX 版生 HEX 負債。昇格候補=C1 戻り規約→Core page-transition back 追補（承認後）。
  - **repo 状態（U2-7 分・未コミット）**: BusDelayAlerts working tree＝navigation.ts・motion.ts（新規）/RouteDetail.tsx・RouteDetailScreen.tsx・RouteCard.tsx（改修）/navigation.test.ts・motion.test.ts・tests/e2e/back-navigation.spec.ts（新規）/vite.config.ts・playwright.config.ts・package.json・package-lock.json（改修）/figuds-build.yml（改修）/design/README.md（新規）／（保存後）design/llocana-ux.pen。aidlc-workflows＝portal/src/usage.js（改修）/aidlc-docs（state/audit/journal/plans/construction u2-7）。
  - **U2-7 Infra 確定**: IDQ7-1=A（vite.config.ts に vitest test 統合）/ IDQ7-2=A（独立 tests/e2e＋Playwright e2e プロジェクト）/ IDQ7-3=A（`.pen` を製品 design/ で git 追跡）。CI＝figuds-build.yml の build job に test:unit・vrt job に test:e2e 同梱。Code Gen で: `src/app/lib/navigation.ts`（decideBackTarget）/RouteDetail.tsx 結線/navigation.test.ts/tests/e2e/back-navigation.spec.ts/playwright.config・vite.config・package.json/figuds-build.yml/design/llocana-ux.pen〔MCP〕/portal ux-refine。実コード commit/push と .pen 実生成は承認後。
  - **U2-7 確定事項**: 【FD】FDQ7-1=A（代表1フロー＝遅延アラート核心 Home→RouteDetail→SettingsNotifications）/ FDQ7-2=A（最小UX改善1点を実コード反映・非回帰・working tree まで・commit/push 承認後）/ FDQ7-3=B（`.pen` は製品 repo `BusDelayAlerts/design/`・書き出し画像は portal/）/ FDQ7-4=A（portal に `ux-refine` ガイド新規 1 本）。**最小改善主候補=C1**（RouteDetail 戻りの堅牢化＝`location.key==='default'` で Home フォールバック・通常不変＝非回帰）。【NFR Req】NQ7-1=B（**vitest 新規＋e2e の二層**＝純粋ヘルパー `decideBackTarget(locationKey)` 抽出→vitest 単体＋Playwright e2e 戻り2経路＋既存 VRT 緑）/ NQ7-2=A（figuds-build.yml 同梱）。Pencil は MCP 経由のみ・`.pen` 暗号化・実生成は Code Gen 段。
  - **U2-7 FD 確定事項**: FDQ7-1=A（代表1フロー＝遅延アラート核心 Home→RouteDetail→SettingsNotifications）/ FDQ7-2=A（最小UX改善1点を実コード反映・非回帰・working tree まで・commit/push 承認後）/ FDQ7-3=B（`.pen` は製品 repo `BusDelayAlerts/design/`・書き出し画像は portal/）/ FDQ7-4=A（portal に `ux-refine` ガイド新規 1 本）。**最小改善主候補=C1**（RouteDetail 戻りの堅牢化＝履歴無で Home フォールバック・通常不変＝非回帰）。Pencil は MCP 経由のみ・`.pen` 暗号化（Read/Grep 不可）。実 `.pen` 生成は Code Gen 段。
  - **U2-7 論点（C-UXFlow・US-X2・S3=C）**: Pencil を**設計参照**に BusDelayAlerts の画面遷移/UX を改善（**実装が正典・非回帰**＝AC①の「既存機能を壊さない」厳守）。シナリオA「あわよくば」＝UX 改修フロー（画像02-A）。Pencil(.pen) は MCP 経由のみ・VSCode×Pencil 採用。横断記録 US-X4。
  - **U2-6 完了内容（2026-06-22）**: 代表 `arrival-card`（到着予定カード）の **Core preview 余白を解消**＝Core `../FIG-Universal-Design-System`@core に **`preview/arrival-card.html` 新規**（card-fig+status-pill〔配色委譲〕+route-badge+arrival-time・6状態・**生HEX0**）／**`assets/js/portal-content.js` 結線**（`core/patterns/arrival-card` preview:null→path＝**整備率 9/36→10/36**）／**`ci/a11y/*`＋`.github/workflows/{_shared-a11y.yml,component-check.yml}` 新設**（lint+VRT+axe a11y 集約・既存 Playwright/VRT 基盤再利用）。**spec `patterns/arrival-card.md` は既存・充実のため無改変**。导线ドラフト＝本 repo `construction/u2-6-core-promotion/promotion/{issue-draft,pr-draft}.md`。
    - ★重要発見: arrival-card は当初「新規 component 昇格」想定だったが、実体は **Core に Pattern spec 既存・preview だけ未整備（=U2-4/U2-5 余白ビューの当事者）**。昇格＝preview を足し portal-content を結線する「余白解消」だった。delay-banner/notification-sheet/route-selector/page-transition も同様に preview:null 据置（同手順で順次解消可）。
  - **U2-6 未了（承認後）**: ① **Core への実 push＋`core-promotion` Issue 起票＋PR 作成＋MINOR タグ**（全てユーザー承認後・FDQ6-3=A）。② PR の `component-check` で **VRT ベースライン初回生成（CI Linux）＋a11y serious/critical 0** 確認→Maintainer 承認マージ→confirmPromotion。VRT/a11y はローカル Playwright 未導入のため CI Linux 初回実行。
- **U2-4/U2-5 完了内容（2026-06-22）**: ポータル（本 repo `portal/`）に Home ランディング（`#/home` 既定・役割別入口3枚＋はじめに読む順番＋シナリオ入口＋4操作クイックリンク）/ シナリオ別ガイド（A 既存★最優先・② 新規）/ 主要操作ガイド（new-product-setup・migration・github-operations 追加＋既存 promotion/core-version）/ 未整備可視化「余白」ビュー（`#/overview/components/coverage`・整備率 9/36）/ getting-started 責務分離（運用相互リンク注記・本文不変）/ **Playwright VRT＋axe a11y 初導入**（CI portal-deploy.yml に quality job）。npm test 42 pass・build PASS。
  - **U2-4/U2-5 未了（後続）**: ① **VRT ベースライン未生成**＝初回 push 時に CI(Linux) で生成・コミット要（`portal/tests/vrt/__screenshots__/`）。② **package-lock.json** は Playwright 追加分未反映＝ローカル `npm install` か CI の `npm ci || npm install` で reconcile。
- **repo 状態（★未コミット多数・全 commit/push はユーザー承認後）**:
  - **Core**（`../FIG-Universal-Design-System`@core）= **U2-6 実装が working tree 未コミット**＝`preview/arrival-card.html`（新規）／`assets/js/portal-content.js`（結線）／`ci/a11y/*`（新規）／`.github/workflows/{_shared-a11y.yml,component-check.yml}`（新規）。既 push 分はタグ v1.2.0/v1.2.1。U2-6 は MINOR 想定。
  - **本 repo aidlc-workflows**: portal/src・assets・package.json・tests・playwright 一式・`.github/workflows/portal-deploy.yml`・aidlc-docs（state/audit/journal/plans/construction u2-4-5＋u2-6）が **working tree 未コミット**。
  - **BusDelayAlerts**（`../BusDelayAlerts`@feature/figuds-adoption）= U2-2＋U2-3 実装が working tree 未コミット。
  - **（旧）Core**（`../FIG-Universal-Design-System`）= push 済・タグ v1.2.0/v1.2.1。
  - **BusDelayAlerts**（`../BusDelayAlerts` @feature/figuds-adoption）= U2-2＋U2-3 実装が working tree 未コミット（commit/push 承認後）。
- **完了済み**: U2-1（Core C-Palette・✅）／U2-2（配布・ブリッジ・✅）／**U2-3（スタイル適用・✅）**。
- **repo 状態（重要・★未コミット多数）**:
  - **Core**（`../FIG-Universal-Design-System`）= push 済。`origin/core=5bd6ba4`・タグ **v1.2.0 / v1.2.1**。release.yml がタグで CHANGELOG 自動更新（pull 推奨）。
  - **BusDelayAlerts**（`../BusDelayAlerts` @`feature/figuds-adoption`）= **U2-2＋U2-3 実装が working tree 未コミット**（HEAD=home-redesign と同一 705b0b3・枝上コミット無し）。**commit/push はユーザー承認後**。node_modules 導入済。
    - U2-2 分: vendor/core submodule・CORE-DS-VERSION=v1.2.1・.gitignore・package.json(gen:tokens/prebuild/predev)・figuds-bridge.css・index.css/index.html・figuds-build.yml。
    - U2-3 分: figuds-bridge.css(@theme status＋primary-dark/light)・StatusBadge/statusConfigs・主要導線9 tsx(teal→primary・hex→token)・scripts/check-raw-hex.mjs・playwright.config.ts・tests/vrt・旧 tokens/* 削除・package.json(check:rawhex/test:vrt/@playwright/test)・figuds-build.yml(raw-hex step＋VRT job)。
  - **aidlc-workflows**（本 repo）= aidlc-docs 配下に多数の未コミット doc（state/audit/journal/plans/construction/u2-1〜u2-3）。
- **U2-3 成果**: 主要導線 生HEX **0**（check:rawhex 緑）・vite build PASS・src/app 生HEX 379→152/teal 300→112（残=周辺画面・FDQ3=A 次段）。CSS gzip 30.23kB。
- **U2-3 未了（次段/後続）**:
  - **VRT ベースライン未生成**＝IDQ1=A により CI(Linux) で初回生成・承認が必要（push 時に figuds-build.yml の vrt job が走る）。
  - **周辺画面の生HEX解消**（Profile/SettingsNotifications/Onboarding/RegionSettings＋PaymentView/CommuterPassCard 等・152件）はガードのスコープ拡大で段階対応。
  - **before↔after diff**: after=working tree／before=`feature/home-redesign`(705b0b3)。`git diff feature/home-redesign` で**コードdiff は今すぐ可**（ただし U2-2＋U2-3 混在・新規 untracked は要 `git add -N`）。視覚diff は VRT ベースライン後。
- **U2-2 残確認**: Core 既定 signature dark が #259CA0 へ変化＝白文字CTA は `--signature-on` 参照へ（後続コンポーネント確認）。
- **dev-flow-journal**: Step 4（取込）＋**Step 5（状態色 semantic 化・生HEX解消・@theme写像＋CIガード＋VRT）記録済**。

### Initiative #2 Scope（2大目標・並行フル実行＝ユーザー確定 2026-06-18）
- **目標①（dogfooding）**: 実開発 repo が Core DS（三層トークン/3プロファイル/`.fig-*`/submodule配布/移行フロー）で**スタイル整理・統一**できることを実証。Core 正典が思想に視覚的に沿わなければ**都度修正**。
  - 実 repo: **`https://github.com/takahashiman/BusDelayAlerts.git`**（前 brief の busapp プレースホルダを置換）。
  - ローカル: `c:/work/AI-DLC/260618_DesignSystem/BusDelayAlerts`（aidlc-workflows の外＝マルチレポ）。
- **目標②（ポータル綿密化）**: 招待エンジニアが**ポータルを見るだけで**意図する操作を完遂できるレベルへ。中核＝`future-work-portal.md` §4-4 IA ブラッシュアップ。

### Initiative #2 運用方針（next-initiative-brief §2 厳守）
- OPERATIONS には進むが**当面は個人 repo（takahashiman）継続**。会社用 org 移設は「上手く回る」確認後。
- F-4（branch protection 強制）・E-5（CSS三層負債）・認証/private Pages は**会社 org 移設まで保留**。
- ポータル構成変更は小〜中規模 IA・導線改善に限定（抜本再設計しない）。

### Initiative #2 スコープ外（本サイクルで実施しない）
- `future-work-portal.md` §2 **未収録ライブプレビュー 22 件**（ユーザー備考 2026-06-18 で次回引継と明示）。

### Initiative #2 ユーザー確定事項（2026-06-18 Workspace Detection 時）
- BusDelayAlerts は**別ディレクトリにクローン**して差分 RE（実施済）。
- 実行範囲＝**①②を1イニシアチブ内で並行フル実行**（Inception→Construction）。
- state 記録＝**新イニシアチブ節を追記**（前サイクル記録は保全）。

### Initiative #2 Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | Yes | Requirements Analysis（#2・2026-06-18） |
| Property-Based Testing | No | Requirements Analysis（#2・2026-06-18・ユーザー確定） |

### Initiative #2 Requirements 回答サマリ（2026-06-18・clarification 前）
- **Q1=A**: BusDelayAlerts は現 repo 上でスタイル整理（移行 repo 化しない）。`fig-ext-bus-busdelayalerts` とは**別サービス**として並列存在（将来どちらか消える想定）。
- **Q2=A**: dogfooding ゴール＝トークン3条件（signature 集約／状態色 semantic 化／主要画面 hex 0）。FIG-UDS 発展途上ゆえ画面ゲート(B)基準は正典未確立。
- **Q3=要相談**: Tailwind v4 × 三層の共存方式（chat で方針提示→clarification で確定）。
- **Q4=B+**: signature 注入は template init 流用。ただし**変数置換は全既存アプリに適用できるとは限らず改修視野**。アプリ固有カラーは**プロジェクト集に資産（カラーパレット）として提示**（そのままは FIG-UDS 非取込・**Taste 派生**として将来取込余地）。取込時期は開発規模で判断。
- **Q5=A**: 配布＝**submodule＋Core CSS import（pin＋CORE-DS-VERSION）を Vite で再検証し今後の前提に確立**。dev-flow-journal に記録（ユーザー明示）。
- **Q6=C+**: taxonomy 分類は Maintainer 委任。ただしプロジェクト集に製品名**「LLocana」**で実 repo を提示（既存分類とは別サービス認識）。
- **Q7=A**: §4-4 IA 全項目。参照画像3点（後述「画像3点の要件化」）。
- **Q8=C→セルフ**: 主要4操作（新製品セットアップ/移行/Core昇格提案/バージョン参照）をポータルだけで完遂。実地は**ユーザー1人のセルフ試験**で代替。
- **Q9=C**: 検証はセルフレビュー（チェックリスト）。
- **補足**: BusDelayAlerts に**修正前後比較用ブランチを予め追加**（clarification で命名確定）。

### Initiative #2 画像3点の要件化（goal② IA の根拠・2026-06-18）
- **01 情報整理**: 自社デザイン資産の蓄積循環＝**2活用フェーズ**。①新規開発（AI-DLC 前提で Inception/Construction にて FIG-UDS 採用）②既運用サービス（既存コードを整備・分析→スタイル＋UX 修正を AI-DLC で）。3デバイスプロファイル判定（同サービスでも端末2種＝Mobile-Terminal 等）。管理者の作業／開発者の確認物。未整備コンポ閲覧の「余白」。
- **02 活用シーン2種**: **A=既存あり（★最優先）**＝公開サイト閲覧→Developer ガイド→必要 repo clone＋既存コード配置→スタイル修正開始（テンプレ／開始宣言例で**ほぼ自動**）→「最低でも自社デザイン資産化」達成で通知・開発終了。**あわよくば**＝既存機能を壊さず画面操作感も改善＝**UX 改修フロー**（画面遷移図の確認/差替・**VSCode×Pencil** 採用）。**②=新規（既存少）**＝Construction で FIG-UDS スタイル＋UI 実装。→ **BusDelayAlerts(LLocana) はシナリオ A の実例**。
- **03 運用→Core 昇格**: 蓄積資産の**2パターン**（資産化完了＝次回流用/Core 採用候補 ／ 一旦残す＝優先低・閲覧余白・他スタイル混入で昇格させない）。**昇格フロー具体**＝①蓄積完了→②使用コンポ抽出し即時 FIG-UDS Live Preview 形式化→③FIG-UDS へリクエスト→④マージ後 FIG-UDS 側で昇格・新規コンポ確認。**GitHub 上の操作も案内**。

### Initiative #2 Stage Progress
#### 🔵 INCEPTION PHASE（#2）
- [x] Workspace Detection — 2026-06-18（既存 state あり/Brownfield・新規イニシアチブ判定）
- [x] Reverse Engineering（差分）— 2026-06-18 承認 / `busdelayalerts-delta-analysis.md`（改訂版・基準=feature/home-redesign）
- [x] Requirements Analysis — 2026-06-18 承認 / `initiative2-requirements.md`（質問票＋clarification＋画像3点反映・Security=Yes/PBT=No）
  - 受け入れ条件: AC①（signature集約/状態色semantic化/主要画面hex0/submodule×Vite成立/before↔after diff）・AC②（主要4操作をポータルだけで完遂・セルフ検証）。
- [x] User Stories — 2026-06-18 承認 / `initiative2-{personas,stories}.md`（S1=C/S2=C/S3=C/S4=B）
  - Epic D（dogfooding US-D1〜D7）/ Epic P（ポータル US-P1〜P7）/ Epic X（横断 US-X1〜X4）＋旅2本。AC①/AC② カバレッジ表付き。
- [x] Workflow Planning — 2026-06-20 承認（AD 含める修正込み）/ `initiative2-execution-plan.md`
  - Risk=Medium。**Application Design=EXECUTE**（ユーザー判断 B: 新規結線の青写真を先に作る）。**Units Generation=EXECUTE**。
  - Construction per-unit: FD/NFR-Req/NFR-Design/Infra=EXECUTE（条件付・Unit毎）、Code Gen/Build&Test=ALWAYS。
  - 暫定6 Unit: U2-1 配布・トークン基盤 / U2-2 スタイル適用 / U2-3 ポータルIA / U2-4 ポータル操作完結 / U2-5 Core昇格実行 / U2-6 UX改修(Pencil)＋横断記録。Critical Path: U2-1→U2-2→U2-5。
- [x] Application Design — 2026-06-20 / `application-design/initiative2-*`（components/methods/services/dependency/統合）・**承認待ち**
  - 確定: AD1=A（ブリッジ1枚）/AD2=C（Issue+PR昇格）/AD3=A（本文Core・IAはportal）/AD4=A（Pencil参照）/AD5=A/AD5-2=B。
  - ★中核 **C-Palette（Core 新設）**: seed 駆動パレット生成（OKLCH・signature＋status・**a11y AA 必須**）＝signature 機構のパラメトリック化＝Taste 派生基盤（LLocana seed=#2C6B5E 初適用）。
  - 8 component（C-Palette/Signature/Distrib/Bridge/PortalIA/Promo/UXFlow/Record）・5 service・repo 跨ぎ依存・Critical Path U2-1→U2-2→U2-5。
- [x] Units Generation — 2026-06-20 / `application-design/initiative2-unit-of-work{,-dependency,-story-map}.md`・**承認待ち**
  - 確定 U1=A/U2=A/U3=A/U4=A。**7 Unit**: U2-1 Core パレット基盤（根）/ U2-2 配布・ブリッジ / U2-3 スタイル適用 / U2-4 ポータルIA / U2-5 ポータル操作完結 / U2-6 Core昇格実行 / U2-7 UX改修＋横断記録。
  - Critical Path: U2-1→U2-2→U2-3→U2-6。ポータル(U2-4/5)並行。着手=U2-1。全18ストーリー割付済（US-X4横断）。
- [x] **INCEPTION(#2) 完了** — 2026-06-20 承認（全7段階完了）。

#### 🟢 CONSTRUCTION PHASE（#2・per-unit loop）
- [x] **U2-1 Core パレット基盤 — 全ステージ完了** 2026-06-21（Code Gen 検証 PASS）
  - [x] Functional Design — 2026-06-20 承認 / business-logic-model・business-rules(BR-PAL-1〜8)・domain-entities（FD1=A/FD2=B/FD3=A/FD4=C/FD5=A/FD6=A）
  - [x] NFR Requirements — 2026-06-20 承認 / nfr-requirements・tech-stack-decisions（NQ1=C PoC/NQ2=A ビルド時生成/NQ3=A＋ AAA 提案版も準備）
  - [x] NFR Design — 2026-06-20 承認 / nfr-design-patterns(P1-P7)・logical-components(LC 7要素)
  - [x] Infrastructure Design — 2026-06-21 承認 / infrastructure-design・deployment-architecture（Core repo tools/palette-gen＋tokens/、製品ビルドで gen:palette --seed、CI=三層+a11y+drift、SemVer MINOR、従来型N/A）
  - [x] Code Generation — 2026-06-21 / **Core repo（sibling clone `../FIG-Universal-Design-System`@core）に C-Palette 実装**
    - **PoC（TSD-2）**: 色演算は**案A ゼロ依存自前実装**を採択（往復誤差 0/255・WCAG 値正確・案B culori 不要）。
    - **配置** `tools/palette-gen/`: color-math/seed-input/a11y/deriver/status-deriver/emitter/index(Orchestrator)/generate(CLI)＋README＋palette.test.mjs（LC 全要素）。
    - **生成出力** `tokens/`: signature.css（再生成・正準 `--signature-*`＋ramp50-900＋既存 `--color-signature-*`/brand 連鎖を委譲温存＝semantic への drop-in）/ status.css / signature-aaa.css / status-aaa.css。
    - **派生値（anchor-tuned）**: light=L+0.045・dark=L−0.079＋低L chroma taper。seed#2C6B5E→light≈#34796A/dark≈#1F5347 一致（Δ≤2）。tint/shadow=不透明mix（FD2=B）。
    - **a11y**: 全 on/bg ペア AA 自動保証（補正限界で生成失敗＝無音fallbackなし）。AAA 別出力。
    - **CI**: `.github/workflows/palette-check.yml`（test:palette＋gen:palette:check=a11y+drift）。lint-rules.json の semantic 層 glob に tokens/status*.css・signature*.css 追加（生成token=semantic扱い）。
    - **検証 PASS**: `npm run test:palette` 10/10・`npm run gen:palette:check` drift なし＆AA合格・三層lint で生成token errorは 0（既存負債866は対象外）。
    - **✅ Core push＋タグ発行済（2026-06-21）**: origin/core=`4f3aab1`・**タグ `v1.2.0`**（U2-1=MINOR）。release.yml がタグで起動（CHANGELOG 自動更新）。package.json=1.2.0。→ U2-2 は v1.2.0 を submodule pin 可。
    - **⚠ 残要確認**: Core 既定 signature dark が旧手調整(#1A8589)→生成値(#259CA0)へ変化＝白文字CTA は `--signature-on` 参照へ寄せる必要（U2-2/コンポーネント確認）。
- [x] **U2-2 配布・ブリッジ — 全ステージ完了** 2026-06-22（Code Gen 検証 PASS）（repo: BusDelayAlerts @feature/figuds-adoption）
  - [x] Functional Design — 2026-06-21 承認 / business-logic-model・business-rules(BR-DIST/SIG/BRIDGE/LEGACY/PROFILE)・frontend-components
    - 確定: FDQ1=A（ビルド時 gen:palette --seed=#2C6B5E・生成物gitignore）/ FDQ2=B（中核 signature/status＋surface/border/foreground）/ FDQ3=A（旧DS委譲→段階無効化・生HEX解消はU2-3）/ FDQ4=A（signature→`--primary`系・#030213置換）/ FDQ5=A（ルート `.fig-profile-consumer`）。
    - ✅前提充足: Core `v1.2.0` 発行済（submodule pin 可）。
  - [x] NFR Requirements（非回帰）— 2026-06-21 承認 / nfr-requirements(NRD-REL/PERF/SEC/A11Y/MNT・Scal/Avail=N/A)・tech-stack-decisions
    - 確定: NQ1=A（build成功＋自己ビジュアル）/ NQ2=A（性能は監視・厳密予算なし）/ NQ3=A（Security は U2-2 持込供給面のみ＝submodule pin整合＋Coreゼロ依存SCA＋秘密非保持）。
  - [x] NFR Design — 2026-06-21 承認 / nfr-design-patterns(P1 pinned submodule/P2 ビルド時決定的生成/P3 宣言的ブリッジ後勝ち/P4 旧DS委譲/P5 セルフ非回帰/P6 供給面Security/P7 a11y継承＋マトリクス)・logical-components(LC-Submodule/Generator-Hook/Bridge/Profile/Legacy-Shim/Verify・従来型N/A)
  - [x] Infrastructure Design（◎ submodule/Vite/CI）— 2026-06-21 / infrastructure-design・deployment-architecture・**承認待ち**
    - 確定: IDQ1=A（生成は npm prebuild＋predev）/ IDQ2=A（製品 CI 最小＝vite build＋submodule pin 整合・三層LintはU2-3）/ IDQ3=A（public 前提 submodules recursive）。
    - 配置: vendor/core(submodule pin v1.2.0)＋CORE-DS-VERSION・生成出力 src/styles/generated/(gitignore新設)・figuds-bridge.css・.fig-profile-consumer・新規 .github/workflows/figuds-build.yml。
    - ⚠ Code Gen 持越: generate.mjs に **--out オプション追補**（現状 Core tokens/ 直書き→製品出力先指定）。
  - [x] Code Generation — 2026-06-22 / **BusDelayAlerts に Core 配布＋ブリッジ実装・検証 PASS**
    - **Core 小改修**: generate.mjs に `--out <dir>` 追加→commit→**タグ `v1.2.1`**（core=5bd6ba4・release.yml の CHANGELOG 自動commitを rebase 統合）。package.json=1.2.1。
    - **製品実装**（BusDelayAlerts working tree・未コミット）: `vendor/core` submodule（pin `v1.2.1`）＋`CORE-DS-VERSION`／`.gitignore` 新設（`src/styles/generated/` 除外）／package.json `gen:tokens`＋`prebuild`/`predev`（`--seed=#2C6B5E --out src/styles/generated`）／`src/styles/figuds-bridge.css`（shadcn→Core: `--primary`→signature・`--destructive`→status-danger・面/線・FDQ2=B）／`index.css` に Core import 連鎖＋bridge（後勝ち）／`index.html` body に `.fig-profile-consumer`／CI `.github/workflows/figuds-build.yml`（pin整合＋build）。
    - **検証 PASS**: `gen:tokens`（#2C6B5E→base/light#36796B/dark#1E5348）・`npm install`＋`npm run build`=vite build 成功（2087 modules・CSS 29.93kB/JS 202kB gzip・チャンク警告は既存）。built CSS で `--primary:var(--signature-base)`（teal）・`--destructive:var(--status-danger)`・`.fig-profile-consumer` 確認、bridge が theme.css 後勝ち（バイト位置検証）。dev-flow-journal に Step 4（既存repo取込手順・シナリオA）記録。
    - **⚠ 要ユーザー操作**: 製品変更は working tree のみ（未コミット）。BusDelayAlerts の commit/push は承認後。npm audit=既存依存 high 2件（NQ3=A でスコープ外）。
- [x] **U2-3 スタイル適用** — ✅完了（2026-06-22 承認・repo: BusDelayAlerts working tree 未コミット）
  - [x] Functional Design — 2026-06-22 / business-logic-model・business-rules(BR-STYLE-1〜8)・frontend-components・**承認済（2026-06-22）**
    - 実測ベースライン: 生 HEX 283（teal `[#2C6B5E]` 出現 300）。状態色は StatusBadge が Tailwind 既定 green/amber/red・statusConfigs 5状態。
    - 確定: FDQ1=A（status を @theme へ→`bg-success` 等）/ FDQ2=A（teal→`primary` ユーティリティ機械置換・opacity維持）/ FDQ3=A（主要導線 Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase 等で生HEX0・周辺次段）/ FDQ4=A（onTime→success・delayRisk/delayed→warning・suspended→danger・passed→neutral・旧 src/styles/tokens/* 撤去）。
  - [x] NFR Requirements — 2026-06-22 / nfr-requirements(NRD3-REL/VRT/MNT/A11Y/PERF/SEC)・tech-stack-decisions(TSD3-1〜5)・**承認済（2026-06-22）**
    - 確定: NQ1=B（VRT 新規導入＝主要導線スクショ VRT・既定 Playwright）/ NQ2=A（スコープ付き CI ガード＝主要導線のみ生HEX検出 fail・三層Lint接続を本ユニットで完了）/ NQ3=A（厳密予算なし・gzip 監視）。
  - [x] NFR Design — 2026-06-22 / nfr-design-patterns(SP1〜SP7)・logical-components(LC-StatusTheme/StatusMapping/BrandSubstitution/RawHexGuard/VRT/LegacyRemoval/Verify)・質問ゲートなし(論点 FD/NFR-Req 確定済)・**承認済（2026-06-22）**
  - [x] Infrastructure Design — 2026-06-22 / infrastructure-design・deployment-architecture・**承認待ち**
    - 確定: IDQ1=A（Playwright を CI[Linux] 実行・Linux ベースライン repo 管理・figuds-build.yml に VRT job 追加）/ IDQ2=A（figuds-build.yml にスコープ付き raw-hex 検出 step・主要導線 glob 限定）/ IDQ3=C（VRT 対象＝主要ルートのページ＋主要コンポーネント両方）。
    - CI=figuds-build.yml 拡張（1 workflow に集約）: ①pin整合 ②build ③raw-hex guard ④VRT job。配置=LC-StatusTheme(bridge @theme)/StatusMapping(components+statusConfigs)/BrandSubstitution(src/app)/RawHexGuard(scripts+CI step)/VRT(tests/vrt+__screenshots__)/LegacyRemoval(tokens 撤去)/Verify。
  - [x] Code Generation — Part1 プラン承認＋Part2 実装完了（2026-06-22）・**コード承認待ち**
    - 10 step 実装: S1 bridge @theme status 写像（success/warning/danger＋primary-dark/light）/S2 StatusBadge→success/warning/danger＋data-testid/S3 statusConfigs 写像コメント/S4 teal→primary 機械置換/S5 非 teal hex を token 化（teal派生→primary-dark/light・状態色→status-foreground・slate→Core中立/Tailwind）/S6 scripts/check-raw-hex.mjs＋check:rawhex/S7 Playwright VRT（playwright.config.ts＋tests/vrt・ベースラインは CI Linux）/S8 旧 tokens 削除/S9 figuds-build.yml に raw-hex step＋VRT job/S10 検証。
    - 結果: **vite build PASS**（2087 modules）・**主要導線 生HEX0**（check:rawhex 緑）・src/app 生HEX 379→152・teal 300→112（残=周辺・次段）。CSS gzip 29.93→30.23kB（status/primary 派生分・NQ3=A 予算なし）。built CSS で bg-success→var(--status-success-surface)・hover:bg-primary-dark→var(--signature-dark) 検証。
    - **VRT ベースライン未生成**（IDQ1=A＝CI Linux で初回生成・承認）。**製品 commit/push はユーザー承認後**（U2-2 未コミット分と合わせて）。
    - 成果物doc: construction/u2-3-style-application/code/implementation-summary.md・dev-flow-journal Step5 追記。
    - **✅ Code Generation 承認＝U2-3 完了（2026-06-22）**。
- [x] **U2-4/U2-5 ポータル IA・操作完結（統合1ループ・PQ1=A）** — ✅完了（2026-06-22 Code Gen 承認）
  - 確定（FD 質問ゲート 2026-06-22）: PQ1=A（U2-4＋U2-5 統合1ループ）/ PQ2=A（新 Home ルートを DEFAULT_ROUTE 化・役割別入口3枚＋はじめに読む順番）/ PQ3=A（2シナリオを使い方ガイド化・シナリオA★最優先）/ PQ4=A（未整備可視化「余白」ビュー・22件 preview 作成はスコープ外）。US-P4=ポータル IA のみ（本文 Core rolling 不変・§4-4）。US-P7/US-X3=使い方ガイド網羅（新製品セットアップ/移行/GitHub 操作案内 追加・昇格提案/版参照は既存）。
  - [x] Functional Design — 2026-06-22 承認 / `construction/u2-4-5-portal-ia-ops/functional-design/{business-logic-model,business-rules,frontend-components}.md`（BR-PIA-1〜13）
  - [x] NFR Requirements — 2026-06-22 / `construction/u2-4-5-portal-ia-ops/nfr-requirements/{nfr-requirements,tech-stack-decisions}.md`・**承認待ち**
    - 確定: NQ1=B（node テスト拡張＋セルフ検証結線テスト〔AC②-2〕に加え **Playwright をポータルに新設し Home/ランディング VRT 導入**）/ NQ2=B（**CI 自動 a11y**＝Playwright＋`@axe-core/playwright` 実ブラウザ検査・Playwright 共有）/ NQ3=A（厳密予算なし・新依存は devDependencies＝配布非影響）。Scalability/Availability N/A。
  - [x] NFR Design — 2026-06-22 / `construction/u2-4-5-portal-ia-ops/nfr-design/{nfr-design-patterns,logical-components}.md`（質問ゲートなし・論点 PQ/NQ 確定済）・**承認待ち**
    - SP1 新ランディング Home（後方互換）/SP2 役割別入口/SP3 ガイド as IA/SP4 データ駆動 余白/SP5 IA のみ責務分離/SP6 セルフ検証結線テスト/SP7 ブラウザ VRT＋axe a11y。LC-Home/RoleEntry/ScenarioGuides/OpsGuides/CoverageView/Router/IALinking/Verify。
  - [x] Infrastructure Design — 2026-06-22 / `construction/u2-4-5-portal-ia-ops/infrastructure-design/{infrastructure-design,deployment-architecture}.md`・**承認待ち**
    - 確定: IDQ45-1=B（VRT 対象＝Home＋未整備可視化「余白」＋使い方インデックス〔シナリオA★〕）/ IDQ45-2=A（Playwright webServer＝build 出力 `portal/site` 静的配信＝本番同等）/ IDQ45-3=A（既存 portal-deploy.yml に quality job 追加＝build→品質ゲート→deploy・fail-fast）。Playwright/axe は devDependencies。VRT ベースラインは CI Linux 真実源。Compute/Storage/Net/従来型/Scal/Avail N/A。
  - [x] Code Generation — Part 1 プラン承認＋Part 2 実装完了（2026-06-22）・**コード承認待ち**
    - 10 step 実装（portal/）: S1 router（home kind・DEFAULT_ROUTE=#/home）/S2 content（ROLE_ENTRIES・READING_ORDER・HOME_QUICK_LINKS）/S3 views（renderHome・renderBrowseMargin・overview coverage 分岐・Developer 運用相互リンク注記）/S4 usage（GUIDES 5本＝scenario-existing★/scenario-new/new-product-setup/migration/github-operations＋usageIndex グループ・★先頭）/S5 portal（case home・titleFor・import）/S6 tests/ia.test.js（**4操作セルフ検証結線=AC②-2**）/S7 Playwright 新設（@playwright/test＋@axe-core/playwright・serve-site.mjs・playwright.config.js・vrt/a11y spec・.gitignore）/S8 portal-deploy.yml に quality job（build→VRT＋a11y→deploy・fail-fast）/S9 検証/S10 docs。
    - 結果: **npm test 42 pass / 0 fail**（router.test.js の KINDS 定数を home 込みへ更新）・**npm run build PASS**・新規 IA CSS（portal-app.css）バンドル確認・余白整備率 9/36。
    - **VRT/a11y ベースラインは未生成**（IDQ45-2=A＝CI Linux で初回生成）。**本 repo commit/push はユーザー承認後**。package-lock は Playwright 追加分未反映＝CI の `npm ci || npm install` で reconcile。
    - 成果物doc: construction/u2-4-5-portal-ia-ops/code/implementation-summary.md・dev-flow-journal Step 6 追記。
- [x] **U2-6 Core 昇格実行（ドメインパターン）** — ✅完了（2026-06-22 Code Gen 承認）。代表＝`arrival-card`（既存 spec の preview 余白解消・整備率 9/36→10/36）。Critical Path 完走。
  - 確定（FD 質問ゲート 2026-06-22）: FDQ6-1=A（**代表1パターンをフル実証**＝end-to-end）/ FDQ6-2=A（成果物＝`components/*.spec.md`＋`preview/*.html`・Core 慣習）/ FDQ6-3=A（**导线は本文ドラフト化のみ・実 push/Issue/PR は承認後**）/ FDQ6-4=A（transport-domain-tokens は昇格済＝対象外）。
  - **代表パターン＝`arrival-card`（到着予定カード）**。選定根拠: Core に等価物なし（status-pill=運行状態/card/bus-card・pass-card preview は既存だが arrival 系は spec/preview とも未整備＝閲覧余白）／製品 `BusArrival`（arrivalData.ts）に濃いドメインモデル／**card＋status-pill の合成**として定義＝「他スタイル混入禁止」を体現。StatusBadge は status-pill と重複のため不採用。
  - 抽出元（製品 `../BusDelayAlerts`）: RouteCard.tsx / BusLineCard.tsx / arrivalData.ts。Core spec は理想形（プリミティブ合成・生 HEX ゼロ）を正典化（製品 raw は持ち込まない）。
  - [x] Functional Design — 2026-06-22 承認 / `construction/u2-6-core-promotion/functional-design/{business-logic-model,business-rules,promotion-target-spec}.md`（BR-PROMO-1〜6・BR-ARR-1〜6・BR-REC-1／arrival-card Props 契約＋Issue/PR ドラフト）
  - [x] NFR Requirements — 2026-06-22 承認 / `construction/u2-6-core-promotion/nfr-requirements/{nfr-requirements,tech-stack-decisions}.md`
    - 確定: NQ6-1=B（Core 既存 CI〔三層 lint=生HEX0／`_shared-vrt`=preview VRT〕に乗せ、**さらに専用自動 a11y 検査を Core CI に新設**＝arrival-card preview を axe で serious/critical 0 ゲート。実装は**既存 Playwright/chromium VRT 基盤〔`ci/vrt`〕を再利用**して `@axe-core/playwright` 追加・BR-CI-NODUP-1）/ NQ6-2=A（供給面＝既存 Core preview パターン継承・lucide CDN pin・新規依存なし・SHA pin）。NRD6-REL-1〜3/MNT-1〜3/A11Y-1〜3/VRT-1/PERF-1/SEC-1〜3。Scal/Avail N/A。TSD6-1〜7。
  - [x] NFR Design — 2026-06-22 承認 / `construction/u2-6-core-promotion/nfr-design/{nfr-design-patterns,logical-components}.md`
    - SP6-1 加算昇格（後方互換 MINOR）/SP6-2 プリミティブ合成（card+status-pill 委譲・混入禁止）/SP6-3 spec+preview 二点形式/SP6-4 AD2=C 二段导线（ドラフト）/SP6-5 既存 CI 正典再利用（lint+VRT）/SP6-6 自動 a11y ゲート新設（既存 Playwright 基盤再利用）。LC-ArrivalSpec/ArrivalPreview/StatusMapping/PromotionDraft/CICheck/A11yCheck/Confirm/Record。
  - [x] Infrastructure Design — 2026-06-22 / `construction/u2-6-core-promotion/infrastructure-design/{infrastructure-design,deployment-architecture}.md`・**承認待ち**
    - 確定: IDQ6-1=A（新設 a11y＝**独立 `ci/a11y/`〔a11y-runner.mjs＋package.json＋README〕＋ `_shared-a11y.yml` reusable**・@axe-core/playwright＋playwright 1.47.2〔ci/vrt 同版〕・既存 1concern=1subdir+reusable 準拠）/ IDQ6-2=A（**新規 `component-check.yml`** に三層 lint＋VRT〔`_shared-vrt` 自己呼び〕＋a11y〔`_shared-a11y`〕集約・fail-fast・palette/registry-check と並ぶ Core 自己ゲート）。VRT ベースライン CI Linux 真実源・a11y はベースライン不要。registry/taxonomy 変更なし・SemVer MINOR。配布非影響（CI devtool のみ）。従来型 N/A。
    - **実配置先（Core repo @core）**: `components/arrival-card.spec.md`＋`preview/components-arrival-card.html`＋`ci/a11y/*`＋`.github/workflows/{_shared-a11y.yml,component-check.yml}`。Issue/PR ドラフトは本 repo `construction/u2-6-core-promotion/promotion/`。
  - [x] Code Generation — Part 1 プラン承認＋Part 2 実装完了（2026-06-22）・**コード承認済（2026-06-22）**
    - 10 step 実装（Core `../FIG-Universal-Design-System`@core・本 repo 导线）: S1 spec 無改変確認（`patterns/arrival-card.md`）/S2 **`preview/arrival-card.html` 新規**（card-fig+status-pill+route-badge+arrival-time 合成・6状態 normal/possible-delay/delayed/arriving/passed/suspended・**生HEX0**・トークンのみ・lucide CDN）/S3 `assets/js/portal-content.js` `core/patterns/arrival-card` を `preview: null`→`'preview/arrival-card.html'`（**整備率 9/36→10/36**）/S4 **`ci/a11y/{a11y-runner.mjs,package.json,README}` 新設**（axe・serious/critical 0・playwright 1.47.2〔ci/vrt 同版〕・@axe-core/playwright 4.10.0）/S5 **`.github/workflows/_shared-a11y.yml`** 新設（_shared-vrt 構造・SHA pin・permissions 最小）/S6 **`.github/workflows/component-check.yml`** 新設（lint〔_shared-guardrail〕+VRT〔_shared-vrt〕+a11y〔_shared-a11y〕集約・paths components/patterns/preview/semantic/primitives/tokens/ci）/S7 导线ドラフト（本 repo `construction/u2-6-core-promotion/promotion/{issue-draft,pr-draft}.md`・core-promotion）/S8 検証/S9 docs/S10 state。
    - 検証: **生HEX0**（preview grep 0・`--color-status-*` 委譲）・結線確認（残余白 page-transition/delay-banner/notification-sheet/route-selector は preview:null 据置＝スコープどおり）・`node --check` runner OK・三層 lint は HTML inline 対象外＝新規 error 0。**VRT/a11y 実描画＋ベースラインは CI Linux**（ローカル Playwright 未導入・IDQ6 設計どおり）。
    - 成果物doc: `construction/u2-6-core-promotion/code/{implementation-summary.md,confirm-promotion-checklist.md}`・dev-flow-journal Step 7 追記。
    - **⚠ Core への実 push・`core-promotion` Issue 起票・PR 作成・MINOR タグはユーザー承認後**（FDQ6-3=A）。PR の component-check で VRT ベースライン初回生成＋a11y 確認→Maintainer 承認マージ→confirmPromotion。
    - **⚠ 本 repo（aidlc-workflows）の aidlc-docs／Core repo の working tree は未コミット**（commit/push 承認後）。
    - **★Code Gen 着手時の重要発見（実態調整）**: Core に **spec が既存・充実**（`patterns/arrival-card.md`＝Pattern Layer・Card+StatusPill 合成・8状態完備）＝FD の promotion-target-spec を上位互換で充足→**spec 無改変**。実体は `components/` でなく **`patterns/arrival-card.md`**。portal-content.js `core/patterns/arrival-card` は **`preview: null`＝U2-4/U2-5 で可視化した「余白」そのもの**→**U2-6 の真の成果＝preview 作成＋`preview: null` 解消で 未整備→整備済 遷移**（dogfooding 測定可能成果）。delay-banner/notification-sheet/route-selector/page-transition も preview:null＝代表1 以外は余白据置（FDQ6-1=A）。
    - **修正後 実体化先（Core @core）**: `patterns/arrival-card.md`（既存・無改変）／`preview/arrival-card.html`（新規＝余白解消の本体）／`assets/js/portal-content.js`（preview:null→path）／`ci/a11y/{a11y-runner.mjs,package.json,README}`（新規）／`.github/workflows/{_shared-a11y.yml,component-check.yml}`（新規）。导线ドラフトは本 repo `construction/u2-6-core-promotion/promotion/{issue-draft,pr-draft}.md`。
    - 10 step（S1 spec確認/S2 preview作成〔card+status-pill+route-badge+arrival-time・6状態・生HEX0〕/S3 portal結線/S4 ci/a11y/S5 _shared-a11y.yml/S6 component-check.yml/S7 导线ドラフト/S8 ローカル検証〔生HEX0・coverage遷移／VRT・a11yベースラインは CI Linux〕/S9 docs/S10 state）。実 push/PR/タグは承認後。
- [x] **U2-7 UX 改修フロー（VSCode×Pencil）— ✅完了** 2026-06-22（Code Gen 承認＝Initiative #2 全 Unit 完了）。主 component C-UXFlow / 主ストーリー US-X2（S3=C）/ repo BusDelayAlerts ⇄ Pencil。原則 AD4=A（Pencil＝設計参照／実装が正典／既存非回帰）。**成果＝UX 改修フローの確立**（Core UX 契約を基準に .pen で提案→承認→反映→還元→ポータル確認）＋代表 C1（戻り堅牢化＋motion トークン化）の実証。**UXや導線の本格改修自体は保留（今後の改修で活用）・`.pen` は `BusDelayAlerts/design/llocana-ux.pen` 保存（今後の改修に備え）**。
  - 確定（FD 質問ゲート 2026-06-22）: **FDQ7-1=A**（代表1フロー＝遅延アラート核心: Home→RouteDetail→SettingsNotifications）/ **FDQ7-2=A**（最小UX改善1点を実コードに反映・非回帰確認のうえ working tree まで・commit/push 承認後）/ **FDQ7-3=B**（`.pen` は製品 repo `BusDelayAlerts/design/`・書き出し画像は portal/）/ **FDQ7-4=A**（portal に `ux-refine` ガイド新規 1 本）。
  - 代表フロー現状: Home（route/payment タブ・路線カード）→ RouteDetail（全画面オーバーレイ・motion opacity+scale 0.3s・戻る `navigate(-1)`）→ SettingsNotifications（通知ルール編集 761行）。**最小改善主候補=C1: RouteDetail 戻りの堅牢化**（履歴無=Home フォールバック・通常不変＝非回帰）。
  - [x] Functional Design — 2026-06-22 **承認** / `construction/u2-7-ux-flow/functional-design/{business-logic-model,business-rules,ux-refine-flow-spec}.md`（C-UXFlow 3段階 capture→review→reflect・BR-UX-1〜9/BR-FLOW-1〜4/BR-REV-1〜3・代表フロー仕様＋改善候補 C1〜C3＋Pencil .pen 計画＋portal ux-refine 構成案）。
  - [x] NFR Requirements — 2026-06-22 **承認** / `construction/u2-7-ux-flow/nfr-requirements/{nfr-requirements,tech-stack-decisions}.md`
    - 確定（相談の上）: **NQ7-1=B**（**vitest 新規＋e2e の二層**＝戻り判定を純粋ヘルパー `decideBackTarget(locationKey):'back'|'home'` に抽出して vitest 単体＋Playwright e2e〔戻り2経路: 通常=Home／直リンク=Home フォールバック〕＋既存 main-routes VRT 緑。ユーザー意図＝テスト基盤の土台化）/ **NQ7-2=A**（既存 `figuds-build.yml` 同梱＝unit step 追加＋VRT job に戻り e2e・1 workflow 集約）。NRD7-REL-1〜3/MNT-1〜3/A11Y-1〜2/PERF-1/SEC-1〜2・Scal/Avail N/A。TSD7-1〜8。
  - [x] NFR Design — 2026-06-22 **承認** / `construction/u2-7-ux-flow/nfr-design/{nfr-design-patterns,logical-components}.md`（質問ゲートなし＝論点 FDQ/NQ 確定済）
    - SP7-1 戻り堅牢化（純粋判定＋フォールバック）/SP7-2 純粋ロジック抽出/SP7-3 二層検証/SP7-4 既存基盤再利用/SP7-5 非回帰最優先/SP7-6 Pencil 設計参照/SP7-7 ポータル導線データ駆動。LC-BackDecision/RouteDetailBinding/UnitTest/E2E/VRT/CIWire/PenArtifact/PortalGuide/Record＋実行順9 step。
  - [x] Infrastructure Design — 2026-06-22 **承認** / `construction/u2-7-ux-flow/infrastructure-design/{infrastructure-design,deployment-architecture}.md`
    - 確定: **IDQ7-1=A**（vitest＝既存 `vite.config.ts` に `test` ブロック統合・node 環境・`test:unit`=vitest run・vitest devDep 追加）/ **IDQ7-2=A**（e2e＝独立 `tests/e2e/back-navigation.spec.ts` 新設＋playwright.config に e2e プロジェクト追加〔VRT=tests/vrt と関心分離・`test:e2e`=--project=e2e／`test:vrt`=--project=chromium〕）/ **IDQ7-3=A**（`.pen`＝`BusDelayAlerts/design/llocana-ux.pen` を git 追跡・暗号化・MCP 経由のみ・書き出しは portal/assets）。CI 結線（NQ7-2=A 導出）＝build job に `test:unit` step・vrt job に `test:e2e` step を同梱（既存2 job 維持・fail-fast・SHA pin/permissions 継承）。実配置先＝navigation.ts（純粋 decideBackTarget）/RouteDetail.tsx（handleBack 分岐・motion 不変）/navigation.test.ts/tests/e2e/figuds-build.yml/design/llocana-ux.pen/portal。配布非影響（vitest=devDep・e2e=テスト・.pen=設計参照）。従来型/Scal/Avail N/A。
  - [x] Code Generation — Part 1 プラン承認＋Part 2 実装完了＋**コード承認済（2026-06-22）＝U2-7 ✅完了**
    - 10 step 実装（製品 BusDelayAlerts working tree／aidlc-workflows portal・docs）: S1 `src/app/lib/navigation.ts` 新規（純粋 `decideBackTarget(locationKey):'back'|'home'`＝'default'/空→home／他→back・副作用なし）/S2 `RouteDetail.tsx` 結線（useLocation・handleBack を decideBackTarget(location.key) で分岐・home→navigate('/',{replace:true})／back→navigate(-1)・**motion/レイアウト/RouteDetailScreen 不変**）＋テストフック data-testid（RouteDetailScreen 戻り=`route-detail-back`／RouteCard 状態リンク=`route-card-status-link`・視覚/a11y/挙動不変）/S3 `vite.config.ts` を `vitest/config` defineConfig 化＋test（node 環境・include src/**/*.test.ts）・`package.json`（test:unit=vitest run／test:e2e=--project=e2e／test:vrt=--project=chromium 分離・devDep vitest@3.2.4）/S4 `navigation.test.ts`（vitest 4ケース）/S5 `playwright.config.ts` に e2e プロジェクト追加（testDir tests/e2e）・chromium を testDir tests/vrt 明示/S6 `tests/e2e/back-navigation.spec.ts`（①通常 カード→詳細→戻る=Home 非回帰②直リンク→戻る=Home フォールバック・addInitScript で onboarding 決定的化）/S7 `figuds-build.yml`（build に test:unit step・vrt に test:e2e step）/S8 `design/README.md`（.pen 設計参照の git 追跡先・構成意図）＝**`.pen` 実生成は Pencil 拡張でのファイルオープン前提で対話操作待ち**/S9 portal `usage.js` に `ux-refine` ガイド追加（operation・確認→差替→反映＋VSCode×Pencil・usageIndex 自動掲載）/S10 docs（code/{implementation-summary,non-regression-checklist}.md・dev-flow-journal Step 8）＋state/audit。
    - **C1 拡張（2026-06-22・ユーザー方針）＝motion トークン化**: RouteDetail 遷移 `duration:0.3`（300ms 生値＝Core 体感バジェット nav 200ms 超過）を **Core トークン消費へ**。`src/app/lib/motion.ts`（`parseMsToSeconds` 純粋＋`motionDurationSec` getComputedStyle 読取）で `--motion-duration-budget-nav` 参照（未ロード時 200ms 縮退）。製品は `vendor/core/{primitives,semantic}.css` 読込済で当トークン実在確認。`motion.test.ts`（vitest 4）。＝「生 HEX」の UX 版負債解消。
    - **検証 PASS**: 製品 `npm run test:unit` **8 pass/0 fail**（navigation 4＋motion 4）・`check:rawhex` **生HEX0**・`npm run build` **PASS**（2088 modules・CSS gzip 30.23kB 不変・JS 202.14kB・chunk 警告は既存）・Playwright `--list` でプロジェクト分離正常（e2e=tests/e2e 2件／chromium=tests/vrt 7件）。portal `npm test` **42 pass/0 fail**・`npm run build` PASS。**e2e/VRT 実描画はローカル Playwright ブラウザ未導入→CI Linux 初回**（IDQ 設計どおり）。
    - **package-lock.json**: `npm install` 実行済で vitest 反映（CI `npm ci` 整合）。
    - **`.pen` 作図 済（pencil-new.pen・MCP）**: 代表3画面フロー（S1 Home→S2 RouteDetail→S3 通知設定）＋C1 as-is/to-be 比較（戻り堅牢化＋motion 300ms→Core nav 200ms 注記）。**⚠ 要: ユーザーが `BusDelayAlerts/design/llocana-ux.pen` として保存** → 当方 `export_nodes` で `portal/assets/` 書き出し → ux-refine 参照（書き出しは保存後）。
    - **UX 蓄積・還元ループ（仕組み化・ユーザー方針）**: 製品 UX 改修は **Core UX 契約（transition-budget/page-transition/feedback-contract/a11y）を基準**に `.pen` で評価者へ修正項目提案→承認→反映→**Core 還元（昇格）**→次回活用＋portal 確認。portal `ux-refine` ガイドを6手順へ拡充・FD spec §6 / business-rules BR-FLOW-5 / dev-flow-journal Step 8 追記 / memory ux-circulation-loop 記録。昇格候補=C1「履歴なし時 Home フォールバック」→ Core page-transition back 規約追補（承認後）。
    - **⚠ 製品・portal・docs の commit/push はユーザー承認後**。
- [ ] Build and Test（全 Unit 後）

### Initiative #2 差分 RE 主要所見（**改訂版**・基準=feature/home-redesign @705b0b3）
- **基準是正（2026-06-18）**: 初版は `main`(@0c38ec9) を解析したが、ユーザー指定の「修正前(before)」は **`feature/home-redesign`**（実体の濃い最新・main とは80ファイル/+12,618行差）。**RE を home-redesign 基準で改訂**。作業ブランチ **`feature/figuds-adoption`** を home-redesign から分岐・push 済（before↔after 比較）。
- **★最重要前提（ユーザー確認）**: アプリ内蔵の独自 DS は **「古いもの(レガシー)」**。**今回の開発は古い DS を FIG-UDS Core のフローに則って修正していく**（＝dogfooding の実体）。
- **内蔵 DS の実態**: `guidelines/design-system.md`(875行)＝**FIG-UDS と同型の三層・直書き禁止・PR チェックリスト・AI 指示**。`semantic.css`(765行: text/surface/icon/border＋state＋transport-domain)・`primitives.css`(401行: `--brand-teal:#2C6B5E`)・component specs・patterns・preview24・storybook・ui_kits/busapp を内蔵。
- **「定義済みだが未適用」ギャップ（dogfooding 主戦場）**: `src/app` に生 HEX 直書き **379**・インライン`[#...]` 含む tsx **15** に対し `var(--token)` 参照は **14** のみ＝契約は語るがコードが守れていない。
- **ドメインパターン=Core 昇格候補**: arrival-card/delay-banner/notification-sheet/route-selector＋transport-domain-tokens（画像03 昇格フロー直結）。
- **新規論点**: ①配布の Vite 互換→標準化(Q5=A) ②共存=シナリオ別[既存A/新規B](Q3確定) ③古い内蔵 DS を FIG-UDS フローで置換/整理・アプリ固有値はプロジェクト集にカラーパレット資産(将来Taste派生) ④ドメインパターンの Core 昇格スコープ ⑤signature `#2C6B5E` 注入(template init流用＋既存改修視野) ⑥dogfooding 定量ゴール(Q2=A)。

---

## Project Information
- **Project Type**: Brownfield
- **Start Date**: 2026-06-05T00:00:00Z
- **Current Stage**: INCEPTION - Workspace Detection (complete) → Reverse Engineering (in progress)
- **Initiative**: FIG Core DS ブラッシュアップ＋自社デザイン資産の蓄積循環システムの設計（Inception再実行）

## Workspace State
- **Existing Code**: Yes
- **Reverse Engineering Needed**: Yes
- **Workspace Root**: c:\work\AI-DLC\Design System\aidlc-workflows
- **Programming Languages**: JavaScript/JSX (React), CSS (design tokens), HTML, Markdown
- **Build System**: npm (React / CRACO in ProductA)
- **Project Structure**: マルチリポジトリ（ポータル大元 + FIG-UDS[Core DS/拡張] + ProductA[サンドボックス]）

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only
- **Structure patterns**: See code-generation.md Critical Rules

## Key Existing Assets (pre-analysis)
- **FIG Core DS（中核）**: FIG-UDS.git `master`(9ee445a) — 24コンポーネント、三層アーキテクチャ（primitives/semantic/components）。★第一のブラッシュアップ対象、全拡張の親
- **拡張プロジェクト busapp**: FIG-UDS.git `main`(6f36074) の `extensions/busapp` — Card/Button/FAB/TextField 等
- **ポータル大元**: aidlc-workflows.git（awslabs AI-DLC framework fork）
- **ProductA**: ProductA.git — Core DS submodule 検証用サンドボックス（検証後削除予定）

## Confirmed Direction (Inception goals)
- 3層: ① FIG Core DS（恒久・SemVer） / ② 拡張プロジェクト（製品単位・独立repo・スコープ分離） / ③ ポータル（集約・HTML・GitHub共有）
- バージョニング: Core DS に SemVer タグ採用（旧方針=コミットハッシュ/SemVer不採用から**転換**）。各プロジェクトは参照Coreバージョンを pin＋明示
- 既存プロジェクト取り込みフロー（Core導入前の資産）を設計に含める
- 保留解除（Inceptionで固定）: 各拡張プロジェクト自体のバージョン管理方針 / HTML差分可視化環境の要否・方式

## Reverse Engineering Status
- [x] Reverse Engineering - Completed on 2026-06-05
- **Artifacts Location**: aidlc-docs/inception/reverse-engineering/
- **Key findings**: コンポーネント spec の散在(10/28/4)、main/master 2系列同居、自己参照submodule二重ネスト、SemVer/バージョン管理の不在、スコープ分離・既存取り込み導線の不在

## Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | Yes | Requirements Analysis |
| Property-Based Testing | No | Requirements Analysis |

## Requirements Analysis Decisions (Q1-Q10)
- Q1=A: Core DS 正典24は `main/existing-code`(約28)を重複排除・取捨選択して24に整理
- Q2=A: 段階構築（①Core DS→②ポータル→③template＋既存取り込み→④CI/CD自動化→⑤showcase）
- Q3=B: 移行完了＝主要フロー100%＋全体≧80%（レガシー画面に引きずられない）
- Q4=B: Core Maintainer＝デザイナー＋エンジニア2名体制
- Q5=Other: 既存 Interactive Prompt Generator（assets/js/ai-co-creation.js）を拡張し、複製・変数置換・初期設定をAIエージェントが自律実行
- Q6=A: showcase は自動クローリングで一覧化
- Q7=A: ポータルは GitHub Pages でホスティング
- Q8=A: WCAG 2.1 AA を正式目標
- Q9=A: Security Baseline 有効（適用ルールを enforce、非該当は N/A）
- Q10=C: PBT 無効（UI中心のため skip）
- 既存資産発見: `extensions/template/`(master, 雛形), `assets/js/ai-co-creation.js`(Interactive Prompt Generator), `assets/js/portal-content.js`(ポータルIA/Contribution)

## Confirmed Decisions (through RE review, CR1-12 + approval)
- **template**: 雛形は汎用 `template`（busapp は実製品）。GitHub Template Repository 機能で複製、初回セットアップで製品名/signature色/カテゴリ/CI-CD/`.fig-profile-*` を注入
- **ポータル閲覧**: ①コンポーネント単体 ②ページ遷移 ③デモ画面。cloudscape.design 風・左サイドナビ
- **ポータル IA**: サイドメニュー上位3区分=概要/プロジェクト集/運用 ＋ 使い方(操作随伴ガイド)
- **rolling vs pin**: ポータル=最新Core常時反映(pinしない) / 拡張=特定バージョンpin
- **デバイス3プロファイル**: Web-Admin(PC/情報密度) / Mobile-Consumer(スマホ/操作性) / Mobile-Terminal(業務端末/固定視認性)。ポータルはWeb-Admin
- **taxonomy**: カテゴリ>サブカテゴリ>プロジェクトの多階層。Core Maintainer がガバナンス(命名/構造/追加再編承認)
- **Core昇格フロー**: 既存正典(Contributionページ)準拠5ステップ。低ハードル提案+Maintainer伴走、ショーケース、二段レビュー/リリース列車、VRT、後方互換/ラッパー
- **操作随伴ガイド原則**: 操作依頼の全場面に再現可能な使い方ページ必須。表現はツール非依存(各チーム標準のGit/AIアシスタント)
- **情報設計**: 玄人最適化(最小クリック・一面完結)、詳細how-toは別ページ遷移
- **スコープ分離手段**: ★**マルチレポ**確定（AIにはCore＋対象製品repoのみ渡す）
- **バージョン参照確認**: 自動収集(ポータルビルド時に各repoのpin情報をクローリングし一覧化)
- **CI/CD自動化クラスタ**: 層Lint(三層ガードレール)＋バージョン収集＋VRT
- **段階移行基準**: 1画面内の新旧混在=不可 / 画面間=期限付き許容 / 完了=定量チェックリスト

## Execution Plan Summary
- **Total Stages（残）**: Inception 2（AD/UG）＋ Construction 6
- **Stages to Execute**: Application Design, Units Generation, Functional Design, NFR Requirements, NFR Design, Infrastructure Design, Code Generation, Build and Test（全 EXECUTE）
- **Stages to Skip**: なし
- **Unit 順序**: ①Core DS → ②ポータル → ③template/既存取り込み → ④CI/CD → ⑤showcase（横断: サンドボックス）

## Stage Progress

### 🔵 INCEPTION PHASE
- [x] Workspace Detection — Completed 2026-06-05
- [x] Reverse Engineering — Approved 2026-06-05（CR1-12 反映済み）
- [x] Requirements Analysis — Approved 2026-06-05 / requirements.md 生成
- [x] User Stories — Approved 2026-06-05 / personas.md(5) + stories.md(epic①〜⑤+横断) 生成
- [x] Workflow Planning — Approved 2026-06-05 / execution-plan.md 生成
- [x] Application Design — Approved 2026-06-05 / components/methods/services/dependency/application-design 生成
- [x] Units Generation — Approved 2026-06-05 / unit-of-work + dependency + story-map 生成（7 Unit）→ **INCEPTION 完了**

### 🟢 CONSTRUCTION PHASE（per-unit loop）
- [x] **U1 Core DS — 全ステージ完了** Approved 2026-06-05（Functional/NFR Req/NFR Design/Infra/Code Gen）/ origin/core=d336715
- [x] **U2 Portal — 全ステージ完了** Approved 2026-06-09（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `portal/` 生成・test 16 pass・build 成功
- [x] **U3 Template & Setup — 全ステージ完了** Approved 2026-06-09（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `fig-ext-template/` 生成・init dry-run 成功
- [x] **U4 Migration — 全ステージ完了** 2026-06-09（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `fig-ext-business-busapp/` 生成・`fig-ext-template/scripts/{migrate-in,migration-status}.mjs` 追補・migration-status PASS(4/5=80%・critical100%・completed・gate exit0)
- [x] **U5 CI/CD — 全ステージ完了** 2026-06-10（Functional/NFR Req/NFR Design/Infra/Code Gen）/ Core 共有 CI 正典（`_shared-{guardrail,vrt,registry-check}.yml`＋`ci/{lint,vrt,registry}`）＋ portal `collect-versions.mjs` 生成・既存テンプレ ci スタブを `uses:` 実体参照へ差替え・検証 PASS（lint fixture good/bad・registry empty/bad・portal build＋test16 pass）
- [x] **U6 Showcase — 全ステージ完了** 2026-06-10（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `portal/scripts/collect-versions.mjs` に `collectShowcase()` 追加（単一クローラ拡張・CI-4）・`build.mjs` 配線・`views.js renderShowcase()` 実体化・`portal-app.css` バッジ追補・検証 PASS（build 成功・npm test 16 pass・collectShowcase モック10アサーション・view 分岐スモーク）
- [x] **U7 Sandbox — 検証完了** 2026-06-10 / `aidlc-projects/ProductA` を現行 Core（`core`@d9919f9・CSSクラス`.fig-*`）へ再配線・submodule取込→`craco build`成功→bundleにCoreクラス64種確認。本番pin検証/削除は checklist E-9/F-5 へ委譲
- [ ] Build and Test — EXECUTE（全 Unit 後）

### 🟡 OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER

## Current Status
- **Lifecycle Phase**: CONSTRUCTION（INCEPTION 完了済み）
- **Current Stage**: U1 Core DS 承認・完了 → **U2 Portal 着手前**
- **Code Gen 進捗**: [x]S1 repo整理 [x]S2 トークン [x]S3 プロファイル [x]S4 基盤3部品 [x]S6 メタデータ [x]S7 エイリアス [x]S8 リリース基盤 [x]Phase1b push(core) / 残 [ ]S5 残コンポーネント拡充 [ ]S9 CIフック(U5整合) [ ]S10 docs
- **要ユーザー操作**: GitHub で FIG-UDS のデフォルトブランチを `core` に変更（busapp 移設後に main/master 整理）
- **コミット(core)**: dc9cd69(整理) → 6b5a6fc(メタデータ/リリース基盤) → 2ffee42(feedback部品)。remote: origin/core(2ffee42は未push)
- **U1 Code Gen**: ✅ Step1-8,10 完了。CSS30クラス=28部品全カバー、28 spec 完備、README刷新、メタデータ/リリース基盤。Step9 CI=U5委譲。preview 5状態追補=任意継続
- **origin/core 最新**: d9919f9（全 push 済み）。…→5521351(gallery)→d9919f9(signature.css+states)
- **検証用**: `preview/_core-gallery.html`（全30部品）/ `preview/_states.html`（主要部品の状態5+）
- **U1 仕上げ**: ✅ signature.css(再テーマ機構, index.htmlの404解消)、状態プレビュー追補。残: fig-sense契約(デザイナー精査)、全28部品の個別preview(任意/U2 Portalで正規整備)
- **要ユーザー操作(再掲)**: GitHub で FIG-UDS デフォルトブランチを core に変更
- **NRQ2 更新**: Core=CSSクラス方式（.fig-*）採用、JSXは持たない
- **要ユーザー操作の統合チェックリスト**: `aidlc-docs/user-actions-checklist.md`（非エンジニア向け・順序付き・全GitHub操作を集約）。方針=全GitHub操作はBuild & Test直前に一括実施（ユーザー決定）。U5/U6/U7 完了時に各操作を本シート フェーズE/F へ追記すること。
- **U5 Code Gen 成果**: Core repo（`aidlc-projects/FIG-Universal-Design-System/`）に共有 CI 正典＝`.github/workflows/_shared-{guardrail,vrt,registry-check}.yml`・`.github/actions/three-layer-lint/`・`ci/{lint[three-layer-lint.mjs+lint-rules.json+__fixtures__],vrt[vrt-runner.mjs+package.json],registry[check-registry.mjs+schema+__fixtures__]}`＋各 README。portal に `scripts/collect-versions.mjs`（CI-3 単一クローラ・version-matrix＋migration-index・fail-soft）を生成し build.mjs へ配線（version-matrix スタブ→実収集／showcase は U6 までスタブ維持）。既存テンプレ `fig-ext-template/ci.yml`・`fig-ext-business-busapp/migrate-checks.yml` の Lint/VRT echo を `uses: _shared-*.yml@<pin>` へ差替え・register.yml に CI-5 検査先明記。設計判断: Lint は色トークン化を error 化（px は warn）・色 primitive 直参照のみ層逆流判定・軽量 Node 単体（stylelint 非依存）・VRT は依存無しで graceful skip・収集 fail-soft。検証: lint fixture(good clean/bad error3+warn1・color primitive57/242)・registry(empty pass/bad C2-4)・VRT(skip exit0)・portal build(収集+schema OK)・portal test 16 pass。Core 自身は既存 CSS 負債866 error 可視化（段階導入・主対象は拡張製品）。US-4.1/4.2/4.3・CI-5 実装。
- **U5 要ユーザー操作**: Core に共有CIマージ→参照タグ発行／各 repo の `uses:` を実org・@ref(拡張pin/portal main)へ差替え／branch protection で guardrail・vrt・registry-check を required 化／portal 収集変数(GH_OWNER/CORE_DS_REPO/read token)＋トリガ(push/repository_dispatch/nightly)／（任意）Core 既存CSS負債の段階解消。詳細は `user-actions-checklist.md` フェーズ E（E-1〜E-5 追記済み）。
- **Construction 進捗**: [x]U1 Core DS [x]U2 Portal [x]U3 Template&Setup [x]U4 Migration [x]U5 CI/CD [x]U6 Showcase [x]U7 Sandbox → **全 Unit 完了**・次は全 Unit 後 Build & Test
- **U7 Code Gen 成果**: `aidlc-projects/ProductA`（React18+CRACO サンドボックス）を**現行正典 Core へ再配線して配布機構を検証**。旧配線（submodule=`main`@6f36074・`extensions/busapp` JSX import）は U1 の CSSクラス化前のモデルだったため、submodule を `core`@d9919f9 へ更新し `src/App.jsx` を **CSSクラス方式（`.fig-*`）消費**へ書換（`primitives/semantic/tokens{signature,base,profile-terminal,components}.css` import＋`.fig-profile-terminal`/`fig-card`/`fig-form-group`/`fig-input`/`fig-button`/`fig-fab`）。`craco.config.js`（ModuleScopePlugin除去+`@design-system`alias）は無改修でCSS submodule importを解決。検証 PASS（V1–V5）: `craco build`=Compiled successfully（js46.31kB/css10.56kB gzip）・bundle CSS に Core `.fig-*` **64種**確認・`.fig-profile-terminal`適用確認。ローカル Core 実体に対する検証で、**本番（実GitHub URL＋SemVerタグpin）での再検証＋ProductA削除は checklist E-9/F-5 へ委譲**（Core タグ未発行・GitHub操作はBuild&Test直前一括の方針）。成果物 docs=`aidlc-docs/construction/u7-sandbox/{verification-design,verification-report}.md`。US-X.1 AC1 充足。
- **U6 Code Gen 成果**: portal 配下に完結（aidlc-docs 外）。`portal/scripts/collect-versions.mjs` に `collectShowcase()` を追加＝U5 単一クローラ基盤を拡張し showcase-index を**同一走査**で収集（BR-CI-1CRAWL）。収集源2系統＝各 repo `extensions/`（kind=extension・compat/index/README/隠し除外・ヘッダ `// EXTENSION PART — <name>` から name 抽出）＋`temp-part` ラベル Issue（kind=temp-part・PR 除外）。registry 駆動・`ownerProjectId`=projectId。`promotable` 既定 true（US-5.2 AC1）／`promotedToCore`=Core `components/*.spec.md` 同名/同義照合（正規化＋別名表＋製品プレフィックス endsWith 吸収・照合不能は false 据置）。fail-soft（個別 skip／GH_OWNER 未設定は据え置き）。`build.mjs` は version 収集と同じ箇所で `collectShowcase()` を呼出（スタブ生成を実体へ差替え）。`views.js renderShowcase()` を実体化＝空状態を**未収集/収集済み0件で文言区別**（BR-SC-EMPTY）・拡張バッジ（`.fig-badge--ext`）・preview 導線・`promotedToCore`→「Core昇格済み・撤去推奨」・`promotable && !promotedToCore`→「昇格を提案する →」(`#/usage/promotion`)・`esc()` で XSS 防止。契約 `showcase-index.schema.json` は**不変で充足**。US-5.1/5.2 実装。検証: build 成功（schema OK）・npm test 16 pass・collectShowcase モック機能テスト10アサーション PASS（Fab→Core(fab) promotedToCore=true 含む）・renderShowcase 分岐スモーク全 ✓
- **U6 要ユーザー操作**: 収集トークンに `issues:read` 追加（`contents:read`/`GH_OWNER`/`CORE_DS_REPO` は U5 E-4 と共有）／各製品 repo に `temp-part`・`core-promotion` ラベル作成／Core 昇格時の「撤去推奨」表示確認・仮コード撤去。詳細は `user-actions-checklist.md` フェーズ E（E-6〜E-8 追記済み）
- **Next Stage**: **U7 完了 → 全 Construction Unit 完了**。次は全 Unit 後の **Build & Test**（＋ checklist フェーズ A〜F の要ユーザー操作を一括実施）
- **Status**: U1/U2/U3/U4/U5/U6/U7 完了（全 Unit 完了）。残=Build & Test
- **U4 Code Gen 成果**: `fig-ext-business-busapp/`（project-settings[business/Mobile-Terminal/pin v1.0.0]・legacy/busapp[代表スナップショット]・migration/{component-mapping,migration-manifest}.json・src/{Button,Card,TextField}.jsx+compat.js・extensions/Fab.jsx・styles/extensions.css・preview/pass-issue.html・.github/workflows/migrate-checks.yml・AGENTS/SKILL/README）＋`fig-ext-template/scripts/{migrate-in,migration-status}.mjs`・schema/migration-manifest.schema.json。検証: migration-status PASS(4/5=80%・critical pass-issue 100%・completed)、gate exit0、migrate-in dry-run動作。US-3.5/3.6/4.5実装。
- **U4 要ユーザー操作**: GitHub repo化(Template派生)／Core submodule配線・pin／実migrate-in(FIG-UDS main/extensions/busapp)／registry PR最小権限トークン／U5 Lint/VRT/収集SHA配線／taxonomy category=business承認
- **Construction 進捗**: [x]U1 Core DS [x]U2 Portal [x]U3 Template&Setup / 残 U4,U5,U6,U7 → 全 Unit 後 Build & Test
- **U3 Code Gen 成果**: `fig-ext-template/`（project-settings.json+schema・index.html[core/ submodule参照]・styles・CORE-DS-VERSION・scripts/init.mjs[冪等/dry-run/verify/pin整合]・tools/prompt-generator/[正典移管vanilla]・AGENTS.md[Runbook]・SKILL.md[ScopeManifest]・.github/workflows/{ci,register}.yml[SHA pin・U5参照]・README）。検証: init.mjs --dry-run 成功。US-3.1〜3.4 全実装。
- **U3 要ユーザー操作**: GitHub Template Repository 化／REGISTRY_PR_TOKEN(最小権限)／Actions SHA 更新・U5 Lint/VRT 配線
- **U3 Infra 確定(IDQ1-5=全A)**: ①新規standalone fig-ext-template GitHub Template化(GitHub化は要ユーザー操作) ②registry PR=製品Actions+最小権限/App cross-repo ③Generator/init/runbookはテンプレ同梱 ④本Code Gen配置=`aidlc-workflows/fig-ext-template/`サブツリー ⑤CI雛形同梱(U5参照・Actions SHA pin)
- **U3 FD 確定(FDQ1-8=全A)**: ①standalone fig-ext-template(GitHub Template) ②project-settings.json単一入力契約 ③project-settings駆動変数置換 ④submodule pin+CORE-DS-VERSION二重 ⑤registry自動PRガードレール(AI起票+CI-5+Maintainer) ⑥CI雛形同梱(ロジックU5参照) ⑦マルチレポ物理分離+ScopeManifest ⑧Prompt Generator正典U3・ポータル導線
- **Construction 進捗**: [x]U1 Core DS [x]U2 Portal / 残 U3,U4,U5,U6,U7 → 全 Unit 後 Build & Test
- **U2 Code Gen Part2 成果**: `portal/`（src/{portal,router,nav,content,views,usage,state,ai-co-creation,feedback}.js・index.html・assets/{portal,portal-app}.css・vendor/core[取込]・data/[registry/taxonomy/契約stub]・schema/[2 JSON Schema]・scripts/{build,dev-serve}.mjs・tests/[16 pass]・.github/ISSUE_TEMPLATE/[temp-part,core-promotion]）＋ root `.github/workflows/portal-deploy.yml`。検証: npm test=16 pass / build.mjs=成功。US-2.1〜2.7 全実装。
- **U2 要ユーザー操作**: GitHub Pages 設定を「GitHub Actions」ソースへ／`CORE_DS_REPO`/`CORE_DS_REF` variables 設定／Core release から `repository_dispatch(core-released)` 配線（rolling 自動追従）
- **U2 Code Gen 方針**: アプリコード生成先=`aidlc-workflows/portal/`(workspace root直下サブツリー・フレームワーク衝突回避)。ポータル固有のみ移設、Core資産はビルド時取込(vendor/core+data)。15ステップ: ①scaffold ②移設 ③ビルドpipeline ④契約schema+stub ⑤IA再編+router ⑥taxonomy駆動nav ⑦Project View(3形態/iframe) ⑧運用ビュー(版/showcase) ⑨使い方 ⑩ドッグフーディング ⑪UiState ⑫security ⑬test ⑭CI/CD(Actions→Pages) ⑮docs
- **U2 Infra 確定事項(IDQ1-5=全A)**: ①Pages=Actions artifact直接デプロイ(gh-pages不要) ②rolling再ビルド=多重トリガ(push/Core repository_dispatch/nightly/手動) ③ドメイン=デフォルトgithub.io ④runner=GitHub-hosted(ubuntu+Node LTS) ⑤repo=aidlc-workflowsにポータル資産配置(Core実体は移設せずビルド時取込)。移設チェックリストはCode Genで実施
- **U2 NFR Design 要点**: Resilience=build fail-fast+空状態/fallback / Scalability=taxonomy駆動+契約取込 / Performance=最小依存+自己ホストSRI+遅延描画 / Security=iframe sandbox+SRI+CSP+SCA(サーバ系N/A) / 論理要素=ビルドパイプライン(LC-B1-7)+データ層(LC-D1-4)+SPA層(LC-R1-5)+境界(LC-X1-3)、従来型基盤(queue/cache/CB/LB/DB)はN/A
- **U2 NFR 確定事項(NRQ1-9=全A)**: 軽量Nodeビルド/ローカルCore参照(rolling)/性能(初回≦2.5s・遷移即時・LH≧90)/エバーグリーン/Pages一本化/Security Baseline静的サブセット(SCA・iframe sandbox・SRI・CSP・機密非保持、サーバ系N/A)/CDN自己ホスト+SRI/契約はJSON Schema検証+VRT
- **U2 FD 確定事項(FDQ1-10=全A)**: ①repo=aidlc-workflowsへ移設 ②IA4区分再編(概要/プロジェクト集/運用/使い方) ③プロジェクト集のみtaxonomy駆動 ④閲覧3形態=registry+iframe(Core preview暫定) ⑤rolling=ビルド時取込 ⑥version-matrix/showcaseはU2でスキーマ確定+ビュー先行(収集U5/U6) ⑦ドッグフーディング業務規則化(temp-part/core-promotion) ⑧使い方ページ独立エンティティ(目的→前提→手順→確認) ⑨状態=URL+localStorage ⑩ai-co-creation.jsはU3管轄/feedback.js再評価
- **Units**: U1 Core DS / U2 Portal / U3 Template&Setup / U4 Migration / U5 CI-CD / U6 Showcase / U7 Sandbox
- **Unit 進行順**: ①U1 → ②U2/③U3(並行可) → ④U4 → ⑤U5 → ⑥U6（横断U7随時）

## Application Design Decisions (ADQ1-6 + FQ1)
- ADQ1=A: ポータル＝vanilla JS SPA踏襲（既存portal-content.js拡張）
- ADQ2=A: デモ＝iframe埋め込み
- ADQ3=A+: 中央registry.json＋新規セットアップ時にAIが登録PRを自動起票
- ADQ4=A/FQ1=A: taxonomy.json も registry.json も Core DS に集約（単一正典・Core Maintainer管理）
- ADQ5=A: 命名 fig-ext-<category>-<product>
- ADQ6=A: git submodule配布（pin+CORE-DS-VERSION / ポータルrolling）
- [ ] User Stories
- [ ] Workflow Planning
- [ ] Application Design
- [ ] Units Generation
