# U3 Template & Setup — Business Logic Model

> 技術非依存の業務ロジック。確定回答: FDQ1-8 = すべて A。
> 対象: TM-1〜3 / US-3.1〜3.4。target = マルチレポ standalone `fig-ext-template`（GitHub Template Repository）。

## 0. スコープと前提
- U3 は「新規拡張製品を素早く・規約準拠で立ち上げる雛形と自律セットアップ」を提供する。
- 正典の所在: `project-settings.schema.json`・`signature-presets.json`・`registry.json`・`taxonomy.json` は **Core DS（U1）**。U3 はそれらを参照/充足する。
- セットアップの実行主体は **AI エージェント**（P4）。U3 は AI が辿る**手順契約（runbook）**と**入力契約（project-settings.json）**を定義する。

---

## 1. テンプレ派生フロー（US-3.1 / TM-1・FDQ1=A）
```
[fig-ext-template (GitHub Template Repository)]
        │  "Use this template"（GitHub Template 機能）
        ▼
[新規 repo: fig-ext-<category>-<product>]        ← 三層構造・CI 雛形・.fig-profile-*・Core submodule 枠が揃った状態
```
- 雛形 = `extensions/template/` の内容を seed に standalone 化（Core を submodule で取り込む独立 repo）。
- 複製直後は汎用値（your-project-name 等）。次の §3 初期化で製品固有値へ。

## 2. AI 自律セットアップ手順（runbook 契約・US-3.2 / TM-3・FDQ2=A）
入力契約 = **`project-settings.json`**（単一の入力。Interactive Prompt Generator が生成 / §6）。
AI エージェントは以下を順に自律実行する:
```
SetupRunbook(project-settings.json):
  1. derive    : repo 名 = fig-ext-<category>-<product>（命名規約・ADQ5）
  2. duplicate : fig-ext-template から新規 repo を作成（GitHub Template）
  3. apply     : project-settings の値を適用（変数置換 §3）
                 - signature 色 → signature.css 機構
                 - profile → ルート .fig-profile-*
                 - displayName/description → README/ポータル表示用メタ
  4. pin       : Core を submodule で pin ＋ CORE-DS-VERSION 書込（§4）
  5. wire-ci   : CI 雛形を有効化（共有 Lint/VRT/version チェック・§5）
  6. register  : Core DS registry.json へ登録 PR を自動起票（§5 ガードレール）
  7. verify    : セットアップ検証（必須値・pin・CI・registry PR の存在）
```
- 各ステップは冪等（再実行で壊れない）。失敗時は当該ステップで停止し理由を提示。

## 3. 変数置換ロジック（FDQ3=A：project-settings 駆動）
- 雛形はプレースホルダ文字列を持たず、**`project-settings.json` の値を初期化が参照**して適用する。
| 設定キー | 適用先 |
|---|---|
| `signatureColor.value/harmonization` | signature.css（再テーマ機構・Core の signature-presets に整合） |
| `designSystem.profile` | ルート要素の `.fig-profile-*`（admin/consumer/terminal） |
| `designSystem.coreVersion` | `CORE-DS-VERSION`＋submodule pin（§4） |
| `projectName` | repo 名・パス（fig-ext-<category>-<product>） |
| `displayName`/`description` | README・registry エントリ・ポータル表示 |
| `owners` | CODEOWNERS・registry エントリ |
- signature presets は Core 正典 `signature-presets.json` を参照（乖離時は JSON が正典）。

## 4. Core pin / 版明示（US-3.3 / ADQ6=A・FDQ4=A）
- **二重表現**: ① git submodule で Core を特定コミットに pin（再現性）② ルート `CORE-DS-VERSION` に SemVer 明記（可視性）。
- `CORE-DS-VERSION` と submodule コミットは一致を保つ（CI で整合検査・§5）。
- これらは **version-matrix 収集（U5/CI-3）の入力**。ポータルは pin せず rolling（製品は pin）。

## 5. registry 自動 PR ガードレール（ADQ3=A+ / TM-3・FDQ5=A）
```
afterSetup():
  entry = { repo, category, subcategory?, name, coreVersion, demoUrl? }
  if taxonomy に category/subcategory が無い:
     PR に taxonomy 追記案も含める（Core Maintainer 承認前提・ADQ4 単一正典）
  open PR → Core DS (registry.json [+ taxonomy.json])
  PR は CI(U5/CI-5 登録検査) ＋ Core Maintainer レビューで承認
```
- ポータル（U2）は registry を**読み取り専用**で表示。書込は本 PR 経由のみ（単一正典）。
- CI-5（登録検査・U5）= 新規 repo が registry 未登録なら警告/PR 補助。

## 6. Interactive Prompt Generator（フォーム→出力・TM-2・FDQ2/3/8=A）
```
form 入力（製品名/カテゴリ/サブカテゴリ/profile/signature[Hue×Taste]/coreVersion/owners/説明）
   │  検証（命名規約・必須・preset 整合）
   ▼
出力①: project-settings.json（入力契約・機械可読）
出力②: セットアッププロンプト（AI への runbook 指示・§2 を具体化した自然文）
```
- 正典所在（FDQ8=A）: Generator は **U3（fig-ext-template / Core 配布物）側に正典**を置く。ポータルは「使い方 › セットアップ」から導線参照。signature-presets は Core を rolling 参照。

## 7. スコープ分離の保証ロジック（US-3.4 / FDQ7=A）
- **物理分離（マルチレポ）が主**: AI へ渡すコンテキストを「Core＋対象製品 repo のみ」に限定。
- `fig-ext-template` の `SKILL.md`/`AGENTS.md` に「参照可能 repo は Core と本製品のみ・他事業製品を引かない」を明文化（ScopeManifest）。
- 他事業製品は別 repo で物理的に不可視。

## 8. ストーリー → ロジック対応
| Story | ロジック |
|---|---|
| US-3.1 template 派生 | §1 |
| US-3.2 AI 自律セットアップ | §2,§3,§6 |
| US-3.3 Core pin＋版明示 | §4 |
| US-3.4 スコープ分離 | §7 |
| （registry 自動 PR） | §5 |
