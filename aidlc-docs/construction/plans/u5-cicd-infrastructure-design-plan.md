# U5 CI/CD Automation — Infrastructure Design Plan

> U5 = 共有 CI 正典（Core）＋三層 Lint＋VRT ゲート＋version/migration 収集＋registry 検査。基盤 = **GitHub（Actions + reusable workflows + GitHub API）**。実行時バックエンドなし。
> 確定（FD/NFR）: Core 共有 CI 正典（Reusable/Composite）/ stylelint+静的スキャナ / Playwright VRT（repo 内 baseline）/ Core→portal rolling VRT / GitHub API 単一クローラ（version+migration）/ Core 側 registry 検査 / GitHub-hosted runner・Node LTS / SHA pin・最小権限。
> 下部 `[Answer]:` にご記入ください。A=推奨。**全A で進める場合は「全A」とだけご返信で確定します。**

## 生成する成果物（チェックリスト）
- [x] `infrastructure-design.md` — 共有 CI 正典の repo 配置・runner/実行環境・VRT 実行基盤（Playwright/browser cache）・Core→portal cross-repo VRT 配線・収集の実行トリガとデータアクセス・registry 検査の配置・シークレット/権限・Unit 横断依存
- [x] `deployment-architecture.md` — PR→Lint/VRT→merge ゲート、portal build→収集→Pages 反映、registry PR→検査→Maintainer 承認の全体フロー・トリガ・スタブ実体化マップ・要ユーザー操作

## カテゴリ評価（MANDATORY・根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Deployment Environment | **適用（GitHub Actions）** | reusable workflows + composite actions。クラウド計算なし |
| Compute | **代替（CI runner / ローカル Node）** | Lint/VRT/収集/検査は CI runner・ローカルのみ。実行時 compute 無し |
| Storage / Messaging / Networking | **N/A** | 永続化/キュー/LB なし（成果は JSON 契約＋PR チェック） |
| Monitoring | **代替（CI チェック）** | required check（Lint/VRT/registry）＋PR annotation/artifact/収集痕跡 |
| Shared Infrastructure | **適用（Core 正典＋GitHub API）** | reusable workflows/LintRuleSet を Core 集約、registry/taxonomy 参照、pin を API 収集 |

## 確認質問

### IDQ1. 共有 CI 正典のホスト repo と公開単位（FDQ1=A 確認）
reusable workflows / composite actions / LintRuleSet の置き場と参照単位。
- A) **Core DS repo（`FIG-Universal-Design-System`）に `.github/workflows/_shared-*.yml`・`.github/actions/`・`ci/` を置き、`uses: <org>/FIG-Core-DS/...@<ref>` で公開**。拡張＝Core SemVer タグ pin、portal＝main(rolling)（推奨：単一正典・既存テンプレ配線前提・新規 repo 不要）
- B) 独立 `fig-ci` repo を新設して公開
- X) Other

[Answer]: A

### IDQ2. runner と実行環境（TSD-7 確認）
Lint/VRT/収集/検査の実行基盤。
- A) **GitHub-hosted runner（ubuntu-latest）＋ Node LTS。依存は `actions/cache`、Playwright ブラウザもキャッシュ**（U2/U3/U4 と整合・PERF-3）（推奨）
- B) self-hosted runner を用意（運用負荷・現時点不要）
- X) Other

[Answer]: A

### IDQ3. VRT 実行基盤と baseline 配置（FDQ3=A 確認）
preview スナップショットと基準画像の置き場・実行。
- A) **各 repo の Actions で Playwright 実行。baseline は repo 内 `preview/__baseline__/` にコミット、差分画像は artifact＋PR コメント、required check でブロック**。変更画面限定（推奨：差分の説明責任が PR に残る・PERF-1）
- B) baseline を Core 集中管理（cross-repo 同期コスト）
- C) 外部 VRT SaaS（自己ホスト方針と不整合）
- X) Other

[Answer]: A

### IDQ4. Core→portal 連動 VRT の cross-repo 配線（FDQ4=A 確認 / US-4.2 AC1）
「Core 変更でポータルを巻き込む VRT」の実行配線。
- A) **Core PR の CI（`_shared-vrt`）が portal を checkout → 当該 PR の Core を vendor 取込（rolling 相当）→ U2 ビルド → portal preview VRT → Core PR の required check に反映**。portal checkout は read-only（推奨：マージ前検出・U2 ビルド再利用・PERF-4）
- B) repository_dispatch で portal repo に投げ非同期で結果待ち（PR ゲート化が複雑）
- C) マージ後 nightly（事前ブロック不能・AC1 不充足）
- X) Other

[Answer]: A

### IDQ5. 収集の実行トリガとデータアクセス（FDQ5=A 確認 / CI-3）
version/migration 収集をいつ・どう動かし、各 repo の pin をどう読むか。
- A) **portal ビルドの一部として `collect-versions.mjs` を実行（push / Core released の repository_dispatch / nightly / 手動）。各 repo の pin は GitHub API（contents）で取得（チェックアウト不要・registry 駆動・並列・fail-soft）**（推奨：U2 の多重トリガ rolling と整合・PERF-2）
- B) 各 repo が自身の pin を中央へ push 報告（全 repo 改修）
- C) ローカル submodule 物理走査のみ（GitHub 最新を取れず status 不正確）
- X) Other

[Answer]: A

### IDQ6. registry 検査の配置と権限（FDQ7=A 確認 / CI-5・SEC）
registry PR 検査ワークフローの所在とトークン。
- A) **Core repo 側 `_shared-registry-check.yml` が registry PR を検査（schema/taxonomy/naming/dup/coreVersion）。製品側 register.yml は最小権限トークン/GitHub App で cross-repo PR 起票のみ。全通過でも自動マージ禁止・Maintainer 承認**（推奨：CI-5 責務・SEC-2/3）
- B) 製品側で検査まで完結（Core 正典の健全性を製品に委ねる・不適）
- X) Other

[Answer]: A

### IDQ7. 本 Code Gen でのワークスペース配置先（FDQ8=A 確認）
今回の生成物の置き場所。
- A) **共有 CI 正典＝`aidlc-projects/FIG-Universal-Design-System/`（Core repo）の `.github/`・`ci/`／収集器＝`portal/scripts/collect-versions.mjs`（build.mjs から呼出）／既存テンプレ（`fig-ext-template`・`fig-ext-business-busapp`）の ci スタブを `uses:` 実体参照へ差替え**（推奨：各 Unit の所有境界尊重・スタブを活かす）
- B) すべて aidlc-workflows 配下の新規 `ci/` に集約（Core 中核方針と不整合）
- X) Other

[Answer]: A

### IDQ8. シークレット / 権限 / サプライチェーン（NFR SEC 確認）
- A) **全 Actions を SHA pin、`permissions: contents: read` 既定、registry の cross-repo 書込のみ最小権限トークン/App、fork PR は secrets job skip、共有 CI 依存 OSS は lockfile pin＋SCA**（推奨：Security Baseline enforce）
- X) Other

[Answer]: A
