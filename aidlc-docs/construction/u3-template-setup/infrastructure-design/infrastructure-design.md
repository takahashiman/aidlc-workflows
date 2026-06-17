# U3 Template & Setup — Infrastructure Design

> 確定回答: IDQ1-5 = すべて A。論理コンポーネント（nfr-design）を GitHub 基盤へマッピング。
> U3 = テンプレ repo＋静的 Generator＋AI セットアップ。基盤 = GitHub Template Repository ＋ Actions ＋ submodule。

## 1. 基盤マッピング（論理 → 実体）
| 論理要素 | 実インフラ |
|---|---|
| LC-T1 Template Repository | **GitHub Template Repository** `fig-ext-template`（IDQ1=A） |
| LC-T2 Core Submodule | git submodule（Core pin）＋ `CORE-DS-VERSION` |
| LC-G1 Prompt Generator | テンプレ同梱 `tools/prompt-generator/`（vanilla・静的）（IDQ3=A） |
| LC-S1 Init Script | テンプレ同梱 `scripts/init.mjs`（Node・ローカル/CI 冪等） |
| LC-S2 SetupRunbook / LC-R2 ScopeManifest | `SKILL.md` / `AGENTS.md` |
| LC-R1 Registry PR | 製品 Actions＋最小権限/GitHub App で cross-repo PR（IDQ2=A） |
| LC-R3 CI 雛形 | テンプレ同梱 workflow（U5 共有設定参照・Actions SHA pin）（IDQ5=A） |
| 監視 | CI チェック（pin 整合・登録検査 U5/CI-5）（代替） |

## 2. リポジトリ構成（IDQ4=A：workspace に scaffold → 独立 repo 化）
```
aidlc-workflows/fig-ext-template/        ← 本 Code Gen の scaffold（後で独立 repo 化）
├─ project-settings.json                 # 入力契約のひな型（seed: extensions/template）
├─ index.html / styles/ / components/    # 製品 UI スターター（.fig-profile-*）
├─ core/                                  # Core submodule のマウント先（枠・実体は submodule）
├─ CORE-DS-VERSION                        # 参照 SemVer（submodule と整合）
├─ scripts/init.mjs                       # project-settings 駆動の冪等初期化（dry-run 対応）
├─ tools/prompt-generator/               # Interactive Prompt Generator（vanilla・正典）
│   ├─ index.html / generator.js         # ai-co-creation.js を正典化
├─ .github/
│   ├─ workflows/ci.yml                  # 三層 Lint/VRT/version 整合（U5 参照・SHA pin）
│   └─ workflows/register.yml            # セットアップ後 registry PR 起票（cross-repo）
├─ SKILL.md / AGENTS.md                  # SetupRunbook＋ScopeManifest
└─ README.md
```
- GitHub 上での Template 化・実 repo 作成は **要ユーザー操作**（IDQ1=A）。

## 3. registry/taxonomy 自動 PR 基盤（IDQ2=A / SEC-1/2）
```
[製品 repo: セットアップ完了]
   │ register.yml (workflow_dispatch / setup hook)
   ▼
[最小権限トークン or GitHub App] --cross-repo PR--> [Core DS registry.json (+ taxonomy.json)]
   ▼
[CI: U5/CI-5 登録検査] + [Core Maintainer 必須レビュー] → マージ（自動マージ禁止）
```
- ローカル実行時は `gh` CLI 経由でも可。直接 push・直接編集は禁止（単一正典）。

## 4. シークレット / 権限
| 項目 | 設定 |
|---|---|
| registry PR トークン | 最小権限（Core repo への PR 作成のみ）。GitHub App 推奨 |
| Core submodule 取得 | 同一 org は GITHUB_TOKEN。private cross-repo は読み取り Deploy Key/PAT |
| シークレット保管 | Actions Secrets。repo に平文を置かない（SEC-6） |
| Actions pin | すべて SHA pin（SEC-4） |

## 5. セキュリティ基盤（SEC-1〜7）
- registry PR=最小権限＋レビュー必須／Core pin 整合（CORE-DS-VERSION↔submodule・CI fail）／Actions SHA pin／SCA（npm audit）／スコープ分離（ScopeManifest）。

## 6. Unit 横断依存
| 依存 | 提供元 | U3 での扱い |
|---|---|---|
| project-settings.schema / signature-presets / registry / taxonomy | U1 Core DS | 参照・PR 起票 |
| 三層 Lint / VRT / 登録検査(CI-5) | U5 | CI 雛形で配線・実体参照 |
| version-matrix 収集 | U5(CI-3) | CORE-DS-VERSION/submodule を入力提供 |
| Generator ポータル導線 | U2 | 正典提供（U2 は使い方リンク） |
| 既存製品取込 | U4 | テンプレ提供 |
