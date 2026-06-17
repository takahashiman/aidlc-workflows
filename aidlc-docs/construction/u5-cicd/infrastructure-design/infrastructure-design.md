# U5 CI/CD Automation — Infrastructure Design

> 確定: IDQ1-8 = すべて A。基盤 = GitHub（Actions + reusable workflows + composite actions + GitHub API）。実行時バックエンドなし。
> U5 は新規構築でなく、各 repo の「U5 参照」スタブを Core 共有 CI 正典への `uses:` 参照で実体化する。

## 1. 基盤マッピング（カテゴリ評価の確定）
| カテゴリ | 実体 | 備考 |
|---|---|---|
| Deployment Environment | GitHub Actions（reusable workflows / composite actions） | クラウド計算なし（IDQ1=A） |
| Compute | CI runner（GitHub-hosted ubuntu）/ ローカル Node | Lint/VRT/収集/検査のみ。実行時 compute 無し（IDQ2=A） |
| Storage / Messaging / Networking | N/A | 成果は JSON 契約＋PR チェック。永続化/キュー/LB なし |
| Monitoring | CI チェック | required check（Lint/VRT/registry）＋PR annotation/artifact/収集痕跡 |
| Shared Infrastructure | Core 正典＋GitHub API | reusable workflows/LintRuleSet を Core 集約、registry/taxonomy 参照、pin を API 収集 |

## 2. 共有 CI 正典の repo 配置（IDQ1=A / IDQ7=A）
- **ホスト repo**: Core DS（`FIG-Universal-Design-System`）。
- **構成**:
```
FIG-Universal-Design-System/            # = aidlc-projects/FIG-Universal-Design-System（独立 repo）
├─ .github/
│   ├─ workflows/
│   │   ├─ _shared-guardrail.yml        # CI-1 三層 Lint（reusable: workflow_call）
│   │   ├─ _shared-vrt.yml              # CI-2 VRT（reusable: workflow_call・Core→portal 連動）
│   │   └─ _shared-registry-check.yml   # CI-5 registry PR 検査（reusable: workflow_call）
│   └─ actions/
│       └─ three-layer-lint/            # composite action（action.yml + 実行スクリプト）
├─ ci/
│   ├─ lint/                            # LintRuleSet（layerGraph/rawValuePolicy/viaSemantic/allowlist）＋ stylelint config・JSX/HTML scanner
│   ├─ vrt/                             # Playwright runner・差分（pixelmatch）・しきい値
│   └─ registry/                        # registry 検査スクリプト（schema/taxonomy/naming/dup/coreVersion）
└─ （既存 registry.json / taxonomy.json / primitives.css / semantic.css / components/ …）
```
- **公開単位**: 各 repo は `uses: <org>/FIG-Core-DS/.github/workflows/_shared-*.yml@<ref>`。
  - **拡張 repo**: `<ref>` = Core SemVer タグ（`CORE-DS-VERSION` と整合 / BR-CI-PIN-1）。
  - **portal**: `<ref>` = `main`（rolling）。
- **二重実装回避**: ロジック実体は Core に 1 つ。各 repo は配線のみ（BR-CI-NODUP-1）。

## 3. runner と実行環境（IDQ2=A）
- **runner**: GitHub-hosted `ubuntu-latest`。
- **ツール**: Node LTS（`actions/setup-node`）。stylelint / Playwright / ajv 等は lockfile pin で導入。
- **キャッシュ**: `actions/cache` で node_modules、Playwright ブラウザバイナリをキャッシュ（PERF-3）。
- **Actions SHA pin**: 全 Action を commit SHA で pin（SEC-1）。

## 4. 三層 Lint 実行基盤（CI-1 / IDQ1=A）
- **配線**: 各 repo `ci.yml`（拡張）/ portal CI が `_shared-guardrail.yml` を `uses:`。
- **実体**: composite `three-layer-lint` が CSS=stylelint（カスタムプラグイン）＋ JSX/HTML=静的スキャナを実行、`LintRuleSet`（Core 単一ソース）を参照。
- **scope**: `styles/`・`src/`・`extensions/`・`preview/`。
- **ゲート**: `LintViolation` 1 件で job 失敗（required check）。違反は PR annotation/job log に file/line/rule/layer 出力（OBS-1）。

## 5. VRT 実行基盤（CI-2 / IDQ3=A / IDQ4=A）
- **実行**: 各 repo の Actions が `_shared-vrt.yml` を `uses:`。Playwright（ヘッドレス Chromium 既定）。
- **baseline**: 各 repo 内 `preview/__baseline__/<screen>.png`（コミット管理）。意図差分は baseline 更新コミットで承認（BR-CI-VRT-2）。
- **差分**: pixelmatch でしきい値判定。超過で required check 失敗＝マージブロック。差分画像は artifact＋PR コメント（OBS-2）。
- **変更画面限定**: 変更された preview のみ対象（PERF-1 / BR-CI-VRT-4）。
- **Core→portal cross-repo 連動**（US-4.2 AC1）:
```
Core PR の _shared-vrt:
  1. checkout Core (PR head)         # 当該変更を含む Core
  2. checkout portal (read-only)     # actions/checkout（別 repo・read 権限）
  3. portal の Core 参照を「この PR の Core」に vendor 取込（rolling 相当）
  4. portal を U2 build → preview 生成
  5. VRT(portal preview vs portal baseline)
  6. 差分許容外 → Core PR の required check 失敗（= Core をマージ不可）
```
  - portal の checkout は read-only。U2 ビルドパイプラインを再利用（PERF-4）。

## 6. version / migration 収集基盤（CI-3 / IDQ5=A）
- **実行場所**: portal ビルドの一部 `portal/scripts/collect-versions.mjs`（build.mjs から呼出）。
- **トリガ（U2 多重トリガ rolling と整合）**: portal への push / Core released の `repository_dispatch(core-released)` / nightly schedule / 手動 `workflow_dispatch`。
- **データアクセス**: 各 repo の pin は **GitHub API（contents）** で取得（チェックアウト不要）。
  - 探索対象 = Core `registry.json`（registry 駆動 / BR-CI-CRAWL-2）。
  - 優先順 `submodule → CORE-DS-VERSION → package.json`、採用 `source` 記録。
  - 並列取得（PERF-2）、個別失敗は `unknown`/skip（fail-soft / REL-3）。
- **出力**: `portal/data/version-matrix.json`（U2 schema 準拠）＋ `portal/data/migration-index.json`（同一走査で migration-manifest 集約 / BR-CI-1CRAWL-1）。全体失敗時は直近結果据え置き（REL-4）。
- **rolling 基準**: `coreVersionLatest` = Core 最新 SemVer タグ（GitHub API tags）。

## 7. registry 登録検査の配置（CI-5 / IDQ6=A）
- **製品側**（U3 register.yml）: 最小権限トークン/GitHub App で Core registry.json への cross-repo **PR 起票のみ**（直接 push 禁止 / SEC-2）。
- **Core 側**（`_shared-registry-check.yml`）: registry PR を検査 ①schema ②taxonomy 整合 ③naming `fig-ext-<category>-<product>` ④重複 ⑤coreVersion 実在（tag）。全通過でも**自動マージ禁止**、Maintainer 承認必須（SEC-3 / BR-CI-REG-2）。不合格は PR 注記（OBS-4）。

## 8. シークレット / 権限 / サプライチェーン（IDQ8=A）
| 項目 | 方針 |
|---|---|
| Actions | 全 SHA pin（SEC-1）。既定 `GITHUB_TOKEN` は `permissions: contents: read`（SEC-2） |
| registry PR | 最小権限トークン/GitHub App（対象 registry repo の PR 起票のみ）。repo に置かずシークレット管理 |
| portal 収集 | GitHub API は read（public は無トークンも可、rate-limit 回避に read-only token 推奨） |
| fork PR | secrets を要する job（registry 起票等）を skip。Lint/VRT は secrets 不要で動作（SEC-4） |
| SCA | 共有 CI 依存 OSS（stylelint/Playwright/ajv 等）は lockfile pin＋脆弱性検査（SEC-5） |

## 9. Unit 横断依存
| 依存先 | 内容 |
|---|---|
| U1 Core DS | 三層定義（primitives/semantic/components）・`.fig-*`・registry/taxonomy 正典（Lint/検査の判定基準）。**共有 CI 正典のホスト** |
| U2 Portal | build.mjs に収集器組込み・version-matrix/migration-index 契約充足・Core→portal VRT 対象 |
| U3 Template & Setup | `fig-ext-template` ci.yml / register.yml スタブを `uses:` 実体参照へ差替え |
| U4 Migration | migrate-checks.yml スタブ実体化・migration-manifest を収集対象として集約 |
| U6 Showcase | 同一クローラ基盤を提供（showcase-index 収集の実装は U6） |

## 10. 要ユーザー操作（GitHub 側・user-actions-checklist フェーズ E へ追記）
1. Core repo に共有 CI（`_shared-*.yml`・`actions/`・`ci/`）をマージし、参照用 SemVer タグを発行。
2. 各 repo の `uses:` 参照 `<org>/FIG-Core-DS` を実 org/repo 名へ、`@<ref>` を pin 版（拡張）/ `main`（portal）へ設定。
3. branch protection で Lint/VRT/registry-check を **required status checks** に設定（マージブロック有効化）。
4. registry PR 用の最小権限トークン/GitHub App を Core・各製品に設定。
5. portal の収集トリガ（push / `repository_dispatch(core-released)` / nightly）を配線、GitHub API read token を設定。
6. Core release ワークフローから portal へ `repository_dispatch(core-released)` を送出（rolling 自動追従）。
7. fork PR の secrets 制限を確認（pull_request_target を使う場合は最小限）。
