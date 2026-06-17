# U3 Template & Setup — Functional Design Plan

> 対象 Unit: **U3 Template & Setup**（repo: `fig-ext-template` ＋ Interactive Prompt Generator / 含む: TM-1〜3）
> 対象ストーリー: US-3.1 template 派生 / US-3.2 AI 自律セットアップ（+registry PR）/ US-3.3 Core pin＋版明示 / US-3.4 スコープ分離
> 技術非依存の詳細設計（テンプレ構造・変数モデル・AI セットアップ手順契約・registry 自動 PR ガードレール・Core pin/版明示・スコープ分離）。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 前提認識（既存資産のグラウンディング）
- 既存テンプレは **ディレクトリ型** `FIG-UDS/extensions/template/`（`project-settings.json`＋`index.html`＋`styles/extensions.css`＋`components/`＋README）。複製は手動 `cp -r`。
- `project-settings.json`: projectName/displayName/description/designSystem{coreVersion,profile,lockedAt}/signatureColor{value,name,harmonization{preset,hue,taste,relation,baseToken}}/owners/createdAt。スキーマ `tokens/project-settings.schema.json`。
- **Interactive Prompt Generator** = `ai-co-creation.js`（現 `portal/src/`・U2 では無改変保持）。signature presets（Hue×Taste マトリクス・正典 `tokens/signature-presets.json`）でカラー選定→セットアッププロンプト生成。
- 目標アーキ（確定）: **マルチレポ**（ADQ5=A 命名 `fig-ext-<category>-<product>` / ADQ6=A submodule pin+`CORE-DS-VERSION`・ポータル rolling / ADQ3=A+ registry 登録 AI 自動 PR）。
- 関連 Unit: ポータル(U2)=registry/taxonomy 表示／Core(U1)=registry/taxonomy 正典・project-settings.schema・signature-presets／CI(U5)=三層 Lint・registry 登録検査(CI-5)。

## 生成する成果物（チェックリスト）
- [x] `business-logic-model.md` — テンプレ派生フロー・変数置換ロジック・AI セットアップ手順（複製→置換→pin→CI 配線→registry PR）・スコープ分離の保証ロジック
- [x] `business-rules.md` — テンプレ構造規約・命名規約・変数必須/検証規則・pin/版明示規則・registry PR ガードレール規則・スコープ分離規則
- [x] `domain-entities.md` — TemplateRepo, ProjectSettings, SetupVariable, SetupRunbook, RegistryPR, CorePin, ScopeManifest
- [x] `frontend-components.md` — Interactive Prompt Generator（フォーム→プロンプト）の契約（入力項目・検証・出力プロンプト構造）

## 確認質問

### FDQ1. テンプレートの実現形態（ディレクトリ型 → マルチレポ standalone）
既存はディレクトリ型 `extensions/template/`。目標はマルチレポの standalone `fig-ext-template`。
- A) **standalone `fig-ext-template` を GitHub Template Repository 化**（既存 `extensions/template/` の内容を seed に、Core を submodule で取り込む独立 repo 雛形へ）。複製は GitHub Template 機能（US-3.1）（推奨：目標マルチレポに整合・ADQ6）
- B) ディレクトリ型を維持（モノレポ的に `extensions/<product>/` を複製）。マルチレポ化は後送り
- C) 両対応（standalone を正とし、ディレクトリ型も移行期サポート）
- X) Other

[Answer]: A

### FDQ2. AI 自律セットアップの入出力契約（US-3.2 / TM-2,3）
Interactive Prompt Generator がフォーム入力からセットアッププロンプトを生成し、AI エージェントが複製・変数置換・初期設定を実行。契約の確定。
- A) **`project-settings.json` を単一の入力契約**とし、フォーム→`project-settings.json`（＋プロンプト）を生成。AI は project-settings を読んで「複製→変数置換→Core pin→CI 配線→registry PR」を runbook 通り自律実行（推奨：既存 project-settings 資産を正典化・機械検証可能）
- B) プロンプト（自然文）のみを契約とし、AI が解釈実行（project-settings は補助）
- X) Other

[Answer]: A

### FDQ3. 変数置換の方式（雛形 → 製品固有値）
テンプレの汎用値を製品固有値へ置換する仕組み。
- A) **`project-settings.json` 駆動**（雛形は placeholder を持たず、ビルド/初期化が project-settings の値を参照して signature 色・profile・CORE-DS-VERSION・表示名等を適用）。既存 `.fig-profile-*`・signature.css 機構に整合（推奨）
- B) プレースホルダ・トークン置換（`{{projectName}}` 等を全ファイル走査して文字列置換）
- C) 両方（構造値=project-settings、表示文字列=プレースホルダ）
- X) Other

[Answer]: A

### FDQ4. Core pin と版明示の表現（US-3.3 / ADQ6=A）
- A) **git submodule で Core を pin（特定コミット）＋ ルートに `CORE-DS-VERSION`（SemVer 明記）**の二重表現（submodule=再現性、CORE-DS-VERSION=可視性。version-matrix 収集の入力, U5/CI-3）（推奨）
- B) submodule のみ（版は submodule コミットから導出）
- C) パッケージ依存（package.json の version）で pin
- X) Other

[Answer]: A

### FDQ5. registry 自動 PR ガードレール（ADQ3=A+ / TM-3）
セットアップ末尾で Core DS `registry.json` へ登録 PR を自動起票。
- A) **AI が Core DS に対し registry 追加 PR を自動起票**（entry: repo/category/subcategory/name/coreVersion/demoUrl）。PR は CI(U5/CI-5 登録検査)＋Core Maintainer レビューで承認。taxonomy 未存在カテゴリは PR に taxonomy 追記も提案（推奨：単一正典・ADQ4）
- B) PR 本文に登録案を提示するのみ（人手で registry 編集）
- X) Other

[Answer]: A

### FDQ6. CI 配線（テンプレが同梱する CI）
テンプレ派生時に新製品 repo へ配線する CI。
- A) **共有 Lint（三層ガードレール）＋ VRT フック＋ version 明示チェックの workflow 雛形を同梱**し、実体・閾値は U5 の共有設定を参照（pin 更新で追従）。テンプレは「配線」、ロジックは U5（推奨：責務分界）
- B) テンプレに CI ロジックも内蔵（U5 と二重管理）
- C) CI はテンプレに含めず、U5 で各 repo へ後付け
- X) Other

[Answer]: A

### FDQ7. スコープ分離の保証手段（US-3.4 / ADQ）
開発/AI 生成時に Core＋対象製品のみを参照し、無関係製品を含めない。
- A) **マルチレポ＝物理的分離を主とし、AI へ渡すコンテキストを「Core＋対象製品 repo のみ」に限定する manifest/手順を定義**（fig-ext-template の SKILL/AGENTS 指示で明文化）。他事業製品は別 repo で不可視（推奨：ADQ 確定のマルチレポに整合）
- B) モノレポ内の論理分離（ディレクトリ単位の参照制限）
- X) Other

[Answer]: A

### FDQ8. Interactive Prompt Generator の所在（U2↔U3 責務）
`ai-co-creation.js` は現在 `portal/src/`（U2 で無改変保持・FDQ10=A）。U3 が管轄。
- A) **U3 が `fig-ext-template`（または Core の配布物）側に正典を置き、ポータルは導線（使い方/リンク）で参照**。signature-presets.json は Core 正典を rolling 参照（推奨：責務一元化・重複排除）
- B) ポータル(U2)に同梱し続け、U3 は仕様のみ定義
- X) Other

[Answer]: A
