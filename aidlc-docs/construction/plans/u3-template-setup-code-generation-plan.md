# U3 Template & Setup — Code Generation Plan（Part 1）

> **これが Code Generation の単一の正典**。Part 2 はこの番号順に実行する。
> 対象 Unit: U3（stories: US-3.1〜3.4）。確定: FDQ/NRQ/IDQ すべて A。

## コード生成先・方針
- **生成先（workspace）**: `aidlc-workflows/fig-ext-template/`（workspace root 直下サブツリー。後で独立 repo 化／GitHub Template 化は要ユーザー操作・IDQ4=A）
- **ドキュメント要約**: `aidlc-docs/construction/u3-template-setup/code/`（markdown のみ）
- **seed**: 既存 `aidlc-projects/FIG-Universal-Design-System/extensions/template/`（project-settings.json / index.html / styles / README）を素材に standalone 化
- **Core 資産は複製しない**: Core は submodule 枠（`core/`）＋`CORE-DS-VERSION`。signature-presets/schema は Core 正典を参照（テンプレにはローカル検証用コピー＋出典明記）
- **Generator 正典化**: `ai-co-creation.js`（現 portal/src）を `tools/prompt-generator/` へ正典移管（FDQ8=A）。ポータルは導線参照（U2 既存）
- **UI 自動化対応**: Generator 入力/出力に安定 `data-testid`

## 依存・前提
- 依存: U1 Core DS（schema/presets/registry/taxonomy 正典）。後続: U4（テンプレ利用で既存取込）、U5（CI 実体・登録検査）、U2（Generator 導線）。
- インターフェース: `project-settings.json`（入力契約）／registry PR（出力）。

## 生成ステップ（番号順・チェックボックス）

### Step 1: テンプレ scaffold（standalone 骨格）`[US-3.1 / TM-1]`
- [x] `fig-ext-template/` 骨格: `project-settings.json`（seed＋schema 参照）/ `index.html` / `styles/extensions.css` / `components/.gitkeep` / `CORE-DS-VERSION` / `core/.gitkeep`（submodule マウント枠）/ `README.md`
- [x] `project-settings.schema.json`（Core 正典のローカル検証コピー・出典明記）
- [x] 要約 → `code/step1-scaffold.md`

### Step 2: 初期化スクリプト（project-settings 駆動・冪等）`[US-3.2/3.3 / TM-3]`
- [x] `scripts/init.mjs`: project-settings を読み、signature/profile/版/表示名を適用。`--dry-run`（差分プレビュー）・冪等・ステップ fail-stop・完了検証チェックリスト
- [x] CORE-DS-VERSION ↔ submodule 整合チェック関数
- [x] 要約 → `code/step2-init.md`

### Step 3: Interactive Prompt Generator（正典移管）`[US-3.2 / TM-2]`
- [x] `tools/prompt-generator/index.html` ＋ `generator.js`（ai-co-creation.js を正典化・vanilla）
- [x] フォーム→`project-settings.json`＋セットアッププロンプト出力。入力検証（命名/必須/preset 整合）。`data-testid`
- [x] signature presets は Core 正典参照（ローカルコピー＋出典明記）
- [x] 要約 → `code/step3-generator.md`

### Step 4: SetupRunbook ＋ ScopeManifest `[US-3.2/3.4]`
- [x] `AGENTS.md`（SetupRunbook: derive→duplicate→apply→pin→wire-ci→register→verify／ツール非依存）
- [x] `SKILL.md`（ScopeManifest: 参照は Core＋対象製品のみ・他事業製品不可視）
- [x] 要約 → `code/step4-runbook-scope.md`

### Step 5: registry/taxonomy 自動 PR 配線 `[ADQ3 / TM-3]`
- [x] `.github/workflows/register.yml`（セットアップ後 cross-repo PR・最小権限/App・Actions SHA pin）
- [x] registry エントリ生成ロジック（init.mjs から呼ぶ or workflow 内）：repo/category/subcategory/name/coreVersion/demoUrl＋taxonomy 追記案
- [x] 要約 → `code/step5-registry-pr.md`

### Step 6: CI 雛形（U5 参照・SHA pin）`[FDQ6 / 三層・version]`
- [x] `.github/workflows/ci.yml`（三層 Lint/VRT フック/version 整合チェックの配線。実体は U5 共有設定参照・Actions SHA pin）
- [x] 要約 → `code/step6-ci.md`

### Step 7: ドキュメント `[保守性]`
- [x] `README.md`（派生→セットアップ→登録の手順・ツール非依存）＋移設/要ユーザー操作チェックリスト
- [x] 要約 → `code/step7-docs.md`

## ストーリー網羅
US-3.1(Step1) / US-3.2(Step2,3,4) / US-3.3(Step2) / US-3.4(Step4) / registry PR(Step5) / CI(Step6)

## スコープ・見積
- 総ステップ 7。最大は Step2-3（init＋Generator）。Part 2 は一括〜数バッチで実行（着手前に承認）。
