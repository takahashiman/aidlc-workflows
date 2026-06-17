# U3 Template & Setup — Frontend Components

> 確定回答: FDQ1-8 = すべて A。U3 の UI は **Interactive Prompt Generator**（TM-2）が中心。
> 既存 `ai-co-creation.js`（現 portal/src）を正典化（FDQ8=A）。フォーム→`project-settings.json`＋セットアッププロンプトを出力。

## コンポーネント階層
```
Interactive Prompt Generator (TM-2)
 ├─ ProductBasicsForm     製品名 / displayName / description / category / subcategory
 ├─ ProfileSelector       admin / consumer / terminal
 ├─ SignaturePicker       Hue × Taste マトリクス（Core signature-presets 参照）
 ├─ VersionField          coreVersion（SemVer）
 ├─ OwnersField           owners[]
 ├─ ValidationSummary     命名規約 / 必須 / preset 整合
 └─ OutputPanel           ① project-settings.json（コピー）② セットアッププロンプト（コピー）
```

## PromptGenerator（TM-2）
- **責務**: 製品情報の入力収集・検証、`project-settings.json` とセットアッププロンプトの生成（業務ロジック §6）。
- **正典所在**: U3（fig-ext-template / Core 配布物）。ポータルは「使い方 › セットアップ」から導線参照（FDQ8=A / BR-GEN-1）。
- **Props/入力状態**:
  | フィールド | 検証 |
  |---|---|
  | projectName | 必須・命名規約（fig-ext-<category>-<product> を導出可能） |
  | displayName / description | displayName 必須 |
  | category / subcategory | category 必須・taxonomy 参照（未存在は taxonomy 追記提案フラグ） |
  | profile | admin/consumer/terminal 必須 |
  | signature(Hue×Taste→preset/value) | Core signature-presets 整合（BR-GEN-3） |
  | coreVersion | SemVer 形式・必須 |
  | owners[] | 1名以上 |
- **Emits/出力**:
  - `project-settings.json`（入力契約・機械可読・schema 準拠 / BR-VAR-2）
  - セットアッププロンプト（AI runbook 指示・ツール非依存 / BR-GEN-4）
- **操作フロー**: 入力 → リアルタイム検証（ValidationSummary）→ OutputPanel に2出力 → ユーザーがコピーして AI へ渡す → AI が SetupRunbook 実行。
- **空/エラー**: 必須欠落・命名違反・preset 乖離は OutputPanel を無効化し ValidationSummary に理由表示。
- **a11y**: フォームラベル/エラーの関連付け（aria-describedby）、キーボード操作、コントラスト AA。
- **自動化対応**: 各入力・出力に `data-testid`（`setup-<field>` / `setup-output-<kind>`）。

## ポータル側導線（U2 連携）
- ポータルの「使い方 › セットアップ（promotion/temp-part と並ぶ topic）」から Generator へリンク（重複実装しない・BR-GEN-1）。
- signature presets はポータルでも Core 正典を rolling 参照（U2 の vendor/core 経由）。

## テンプレ同梱の非 UI 成果物（参考）
| 成果物 | 役割 |
|---|---|
| `project-settings.json`（雛形） | 入力契約のひな型（BR-VAR-1） |
| `SKILL.md` / `AGENTS.md` | SetupRunbook＋ScopeManifest の明文化（BR-SCOPE-2） |
| CI workflow 雛形 | 三層 Lint/VRT/version チェック配線（U5 参照・BR-CI-1/2） |
| `CORE-DS-VERSION` ＋ submodule | Core pin（BR-PIN-1/2） |

## データ統合ポイント
| Component | 依存データ | 由来 |
|---|---|---|
| SignaturePicker | signature-presets.json | Core DS（rolling） |
| Validation（category） | taxonomy.json | Core DS |
| 出力 project-settings | project-settings.schema.json | Core DS |
| RegistryPR（後続・AI） | registry.json | Core DS（PR 経由書込・BR-REG-4） |
