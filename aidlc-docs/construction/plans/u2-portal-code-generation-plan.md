# U2 Portal — Code Generation Plan（Part 1）

> **これが Code Generation の単一の正典**。Part 2 はこの番号順に実行する。
> 対象 Unit: U2 Portal（stories: US-2.1〜2.7）。確定: FDQ/NRQ/IDQ すべて A。

## コード生成先・方針
- **アプリコード生成先（workspace）**: `aidlc-workflows/portal/`（★workspace root 直下の `portal/` サブツリー）
  - 理由: workspace root は awslabs AI-DLC フレームワーク fork で `assets/`(images)・`scripts/`・`docs/`・`README.md`・`.github/`・`cliff.toml` 等を既保有。直置きは衝突するため、IDQ5=A（aidlc-workflows repo に配置・`aidlc-docs/` と共存）を**フレームワークを壊さない `portal/` サブツリー**として具体化。Pages は `portal/` のビルド出力を公開。
- **ドキュメント要約**: `aidlc-docs/construction/u2-portal/code/`（markdown のみ）
- **移設元**: `aidlc-projects/FIG-Universal-Design-System/`（FIG-UDS core）。**ポータル固有ファイルのみ移設**（index.html / assets/js/portal*.js / ai-co-creation.js / feedback.js / portal.css）。
- **Core 資産は移設しない**: tokens / primitives.css / semantic.css / components / preview / registry.json / taxonomy.json は **ビルド時取込**（`vendor/core/` ＋ `data/`、BR-ROLL-3 重複排除）。
- **Brownfield 方針**: 既存 portal*.js 等は in-place 修正・移植。複製（`*_new`）禁止。
- **UI 自動化対応**: インタラクティブ要素に安定した `data-testid`（`{component}-{role}`）。

## 目標ディレクトリ構成（portal/）
```
aidlc-workflows/portal/
├─ index.html                # エントリ（移設・self-host化）
├─ src/
│   ├─ portal.js             # App Shell/Router (PT-1)（移設・拡張）
│   ├─ portal-content.js     # 静的IA定義（概要/運用/使い方）（IA再編）
│   ├─ nav.js                # buildNav: taxonomy駆動 (PT-2)
│   ├─ views/                # project/version/showcase/usage view (PT-3〜6,8)
│   ├─ state.js              # UiState: URL+localStorage (FDQ9)
│   ├─ ai-co-creation.js     # U3管轄・現状維持（FDQ10=A）
│   └─ feedback.js           # 昇格提案/仮パーツ導線の母体（再評価）
├─ assets/portal.css         # ポータル固有レイアウト（移設）
├─ vendor/
│   ├─ core/                 # ビルド時取込（tokens/components css・無改変）
│   └─ prism/                # 自己ホストPrism+SRI（NRQ7=A）
├─ data/                     # registry.json/taxonomy.json(Core取込)＋version-matrix.json/showcase-index.json(スタブ)
├─ schema/                   # version-matrix.schema.json / showcase-index.schema.json
├─ usage/                    # UsageGuidePage コンテンツ
├─ scripts/build.mjs 等      # 軽量Nodeビルド (LC-B1〜7)
├─ tests/                    # routing/buildNav unit・schema検証
├─ package.json              # devDeps（schema validator・test runner）最小
└─ (.github/workflows/portal-deploy.yml は workspace root 配下に追加)
```

## 依存・前提
- 依存 Unit: **U1 Core DS**（tokens/components/registry/taxonomy をビルド時取込）。
- 後続依存: **U5**（version-matrix/showcase 収集・VRT・三層Lint）、**U6**（showcase 収集）、**U3**（ai-co-creation.js）。本 Unit は契約スキーマとビューを先行実装し、データはスタブ。
- インターフェース契約: `version-matrix.schema.json` / `showcase-index.schema.json`（U2 定義 → U5/U6 が充足）。

## 生成ステップ（番号順・チェックボックス）

### Step 1: portal/ スキャフォールド `[基盤]`
- [x] `portal/` ディレクトリ構成・`package.json`（最小 devDeps: JSON Schema validator・軽量 test runner）作成
- [x] `.gitignore` に `portal/vendor/core/`・`portal/site/`（ビルド生成物）追加
- [x] 要約 → `code/step1-scaffold.md`

### Step 2: ポータル固有資産の移設（brownfield in-place）`[US-2.x 基盤・FDQ1/IDQ5=A]`
- [x] FIG-UDS から `index.html` / `assets/js/{portal.js,portal-content.js,ai-co-creation.js,feedback.js}` / `assets/portal.css` を `portal/` へ移設・配置
- [x] Core 直リンク（primitives.css/semantic.css/tokens/*）を `vendor/core/` 参照へ付替（取込前提）
- [x] `ai-co-creation.js` は機能維持（U3 管轄・壊さない、FDQ10=A）
- [x] 要約 → `code/step2-migration.md`

### Step 3: ビルドパイプライン（rolling 取込・LC-B1〜7）`[US-2.3, NRQ1/2=A]`
- [x] `scripts/build.mjs`: ①Core 解決（core HEAD/最新タグ・pin しない）②tokens/components css → `vendor/core/`（無改変）③registry/taxonomy → `data/`（取込）④Prism 自己ホスト化＋SRI ⑤スキーマ検証＋孤児/必須キー（fail-fast）⑥bundle ⑦`portal/site/` 出力
- [x] `scripts/dev-serve.mjs`（ローカル静的サーブ・オフライン可）
- [x] 要約 → `code/step3-build-pipeline.md`

### Step 4: データ契約（JSON Schema＋スタブ）`[FDQ6/NRQ9=A]`
- [x] `schema/version-matrix.schema.json`・`schema/showcase-index.schema.json`（domain-entities 準拠）
- [x] `data/version-matrix.json`・`data/showcase-index.json` のスタブ（空/サンプル）
- [x] 要約 → `code/step4-contracts.md`

### Step 5: IA 再編＋ルーター（PT-1/PT-3）`[US-2.4, FDQ2=A]`
- [x] `portal-content.js` を **概要/プロジェクト集/運用/使い方** の4区分へ再編（旧 scope/section を写像）
- [x] `portal.js` のハッシュルーター: `#/overview` `#/projects` `#/ops` `#/usage`、Not-Found/フォールバック、フォーカス管理（A11Y-3）
- [x] `data-testid` 付与（ナビ/タブ等）
- [x] 要約 → `code/step5-ia-router.md`

### Step 6: taxonomy 駆動サイドナビ（PT-2）`[US-2.1, FDQ3=A]`
- [x] `nav.js`: buildNav（静的セクション ∪ taxonomy projects 枝）。葉=直接リンク（即時到達）、pending/仮パーツ badge
- [x] ARIA tree・`aria-current`・キーボード操作（A11Y-2）
- [x] ユニットテスト対象として buildNav を純粋関数化
- [x] 要約 → `code/step6-side-nav.md`

### Step 7: Project View（閲覧3形態）（PT-4）`[US-2.2, FDQ4=A]`
- [x] component/page/demo タブ。demo=sandbox iframe＋profile/coreVersion query 伝播（SEC-2）
- [x] 拡張未整備のため Core preview を暫定ソース（Core 自身を1 Project 提示）
- [x] demoUrl 不在時フォールバック・registry 未登録時 pending ビュー
- [x] 要約 → `code/step7-project-view.md`

### Step 8: 運用ビュー（版ダッシュボード／Showcase）（PT-5/PT-6）`[US-4.3表示/US-5.1,5.2, FDQ6=A]`
- [x] Version Dashboard: version-matrix を table 描画（status 可視化）・空状態
- [x] Showcase View: showcase-index を一覧（owner/種別明示・昇格提案導線）・空状態
- [x] 要約 → `code/step8-ops-views.md`

### Step 9: 使い方ページ（PT-8）`[US-2.7, FDQ8=A]`
- [x] UsageGuidePage テンプレ（目的→前提→手順→確認・ツール非依存）と `#/usage/<topic>`
- [x] 主要 topic（セットアップ/昇格提案/版確認/フィードバック/ポータル閲覧）を作成、操作箇所から導線（BR-USE-1）
- [x] 要約 → `code/step9-usage-guide.md`

### Step 10: ドッグフーディング/仮パーツ（US-2.5）`[FDQ7=A]`
- [x] 仮パーツ badge 表示・撤去判定（Core registry に core 出現で「昇格済み・撤去推奨」）
- [x] Issue テンプレ（`temp-part` / `core-promotion`）と起票条件、ポータル導線（自動起票機構は U5）
- [x] `feedback.js` を昇格提案/仮パーツ導線の母体として再評価
- [x] 要約 → `code/step10-dogfooding.md`

### Step 11: クライアント状態（UiState）（Header）`[FDQ9=A]`
- [x] `state.js`: profile（既定 admin）/coreVersionLabel を URL+localStorage 同期、`.fig-profile-*` 付替
- [x] coreVersionLabel は取込版の表示専用（pin でない、BR-ROLL-4）
- [x] 要約 → `code/step11-uistate.md`

### Step 12: セキュリティ硬化（SEC-1〜6）`[NRQ6/7=A]`
- [x] CDN 実行時依存排除（Prism 自己ホスト＋SRI）、iframe `sandbox`/`referrerpolicy`、CSP メタ（best-effort）
- [x] URL/localStorage に機密を置かない確認（BR-STATE-3）
- [x] 要約 → `code/step12-security.md`

### Step 13: テスト（NRQ8=A）`[品質ゲート]`
- [x] ルーティング解決・buildNav のユニットテスト、JSON Schema 検証テスト
- [x] ビルド時バリデーション（孤児/必須キー）のテスト
- [x] （VRT は U5。U2 は決定的描画を保証）
- [x] 要約 → `code/step13-tests.md`

### Step 14: CI/CD（Actions→Pages）`[US-2.6, IDQ1/2/4=A]`
- [x] `.github/workflows/portal-deploy.yml`（workspace root）: triggers=push(paths: portal/**)/repository_dispatch(core-released)/schedule(nightly)/workflow_dispatch
- [x] build job（Step3 ステップ）→ deploy job（upload-pages-artifact＋deploy-pages, `portal/site/`）。permissions: pages/id-token/contents
- [x] 要約 → `code/step14-cicd.md`

### Step 15: ドキュメント `[保守性]`
- [x] `portal/README.md`（構成・ビルド・rolling・公開手順）
- [x] 移設チェックリスト（infra deployment-architecture §7）の消化記録
- [x] 要約 → `code/step15-docs.md`

## ストーリー網羅
US-2.1(Step6) / US-2.2(Step7) / US-2.3(Step3,14) / US-2.4(Step5) / US-2.5(Step10) / US-2.6(Step14) / US-2.7(Step9)
横断: A11Y(Step5,6,7) / SEC(Step12) / 契約(Step4) / 状態(Step11) / テスト(Step13)

## スコープ・見積
- **総ステップ**: 15。基盤(1-4)→IA/ナビ/ビュー(5-8)→ガイド/運用(9-11)→品質/配信(12-15)。
- 増分実行（Step ごとにチェック更新）。最大は Step5-7（IA再編＋ナビ＋Project View）。
- 実コード生成のため、Part 2 は数バッチに分けて実行可能（着手前に承認）。
