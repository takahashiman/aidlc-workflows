# U3 Template & Setup — Infrastructure Design Plan

> U3 = テンプレ repo＋静的 Generator＋AI セットアップ。基盤 = **GitHub（Template Repository＋Actions＋submodule）**。実行時バックエンドなし。
> 確定: standalone fig-ext-template / project-settings 単一契約 / submodule pin+CORE-DS-VERSION / registry 自動 PR / マルチレポ分離。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 生成する成果物（チェックリスト）
- [x] `infrastructure-design.md` — repo 確立・submodule 配線・Generator/初期化の配置・registry PR 自動化基盤・シークレット/権限
- [x] `deployment-architecture.md` — 派生〜セットアップ〜登録 PR のフロー・環境・トリガ

## カテゴリ評価（MANDATORY・根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Deployment Environment | **適用（GitHub）** | Template Repository＋Actions。クラウド計算なし |
| Compute | **代替（CI runner）** | 実行時 compute なし。CI/ローカルの初期化スクリプトのみ |
| Storage / Messaging / Networking | **N/A** | 永続化/キュー/LB なし |
| Monitoring | **代替** | CI チェック（pin 整合・登録検査 U5/CI-5） |
| Shared Infrastructure | **適用** | Core 正典（schema/presets/registry/taxonomy）を共有参照・PR で書込 |

## 確認質問

### IDQ1. fig-ext-template の確立方法
- A) **新規 standalone repo `fig-ext-template` を GitHub Template Repository 化**（既存 `extensions/template/` を seed・Core を submodule 枠で取込）。本 Code Gen ではワークスペース内に雛形ディレクトリとして scaffold し、GitHub 上の Template 化は要ユーザー操作（推奨）
- B) 既存 FIG-UDS 内 `extensions/template/` を当面の正とし、standalone 化は後送り
- X) Other

[Answer]: A

### IDQ2. registry/taxonomy 自動 PR の実行基盤（ADQ3=A+ / SEC-1/2）
- A) **製品 repo の GitHub Actions（セットアップ完了時）から、最小権限トークン/GitHub App で Core DS へ cross-repo PR を起票**（CI-5＋Maintainer レビュー）。ローカル実行時は `gh` CLI 経由でも可（推奨）
- B) AI エージェントがローカルで `gh` CLI のみで起票（Actions 不使用）
- X) Other

[Answer]: A

### IDQ3. Generator / 初期化スクリプト / runbook の配置
- A) **fig-ext-template に同梱（正典）**: `scripts/init.mjs`（project-settings 駆動初期化）・`tools/prompt-generator/`（vanilla Generator）・`SKILL.md`/`AGENTS.md`（runbook＋ScopeManifest）。ポータルは導線参照（推奨：FDQ8=A）
- B) Core DS 配布物として配置（テンプレは参照のみ）
- X) Other

[Answer]: A

### IDQ4. 本 Code Gen でのワークスペース配置先
マルチレポの実 repo は外部 GitHub。今回の生成物（雛形・スクリプト・Generator・runbook）の置き場所。
- A) **`aidlc-workflows/fig-ext-template/`（workspace root 直下サブツリー）に scaffold**し、後で独立 repo 化（U2 portal/ と同方針・フレームワーク非衝突）（推奨）
- B) `aidlc-projects/` 配下に新規ディレクトリ
- C) 既存 FIG-UDS の extensions/template に in-place
- X) Other

[Answer]: A

### IDQ5. CI workflow（テンプレ同梱・U5 参照）
- A) **テンプレに workflow 雛形を同梱（三層 Lint/VRT/version 整合チェック）。実体・閾値は U5 共有設定を参照、Actions は SHA pin**（推奨：FDQ6=A / SEC-4）
- B) CI はテンプレに含めず U5 で後付け
- X) Other

[Answer]: A
