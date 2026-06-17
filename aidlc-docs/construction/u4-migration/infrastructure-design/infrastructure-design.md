# U4 Migration — Infrastructure Design

> 確定: IDQ1-6 = すべて A。基盤 = GitHub（拡張製品 repo＋Actions＋submodule）。実行時バックエンドなし。
> 対象 = busapp → `fig-ext-business-busapp`（命名は taxonomy 参照で確定。例示 category=business）。

## 1. 基盤マッピング（カテゴリ評価の確定）
| カテゴリ | 実体 | 備考 |
|---|---|---|
| Deployment Environment | GitHub（拡張製品 repo＋Actions） | クラウド計算なし（IDQ1=A） |
| Compute | CI runner / ローカル Node | 取り込み・写像・移行率算出・VRT のみ（実行時 compute 無し） |
| Storage / Messaging / Networking | N/A | 静的資産＋`migration-manifest.json`。永続化/キュー/LB なし |
| Monitoring | CI チェック | 混在検出・移行率・pin 整合・ラッパー期限・登録検査(CI-5) |
| Shared Infrastructure | Core 正典＋U5 収集基盤 | `.fig-*`/semantic/alias/registry/taxonomy 参照、version 収集共有 |

## 2. 拡張製品 repo の確立（IDQ1=A / IDQ5=A）
- **repo**: `fig-ext-business-busapp`（GitHub Template `fig-ext-template` から派生）。category は Core taxonomy 参照で確定（暫定 `business`、Maintainer 承認）。
- **本 Code Gen 配置**: `aidlc-workflows/fig-ext-business-busapp/`（workspace root 直下サブツリー）に scaffold。後で独立 repo 化。U2 `portal/`・U3 `fig-ext-template/` と同方針（フレームワーク非衝突）。
- **汎用ロジックの所在**: `migrate-in`/移行率算出等の再利用ロジックは `fig-ext-template/scripts/` に追補（テンプレ正典）→ 派生製品が継承。製品 repo 側は project-settings＋migration-manifest が主。
- **GitHub 化は要ユーザー操作**: 実 repo 作成・Template 派生・submodule 配線は GitHub 上で実施（本 Code Gen はローカル雛形＋スクリプトまで）。

### repo 構成（scaffold）
```
fig-ext-business-busapp/
├─ project-settings.json          # derive で busapp 既存設定を補完（IDQ6）
├─ CORE-DS-VERSION                # pin 可視化（U3 継承）
├─ core/                          # Core submodule 枠（pin・要ユーザー操作で配線）
├─ legacy/                        # ★ migrate-in 隔離領域（旧 busapp 資産）
│   └─ busapp/ {components(jsx), tokens, preview, README}
├─ src/ または components/        # 移行後の薄ラッパー＋Core `.fig-*` 委譲
├─ extensions/                    # Core 未満の独自/仮パーツ（Showcase 対象）
├─ migration/
│   ├─ component-mapping.json     # 旧→Core 写像（機械可読・Code Gen 入力）
│   └─ migration-manifest.json    # 進捗の単一真実源（状態から再生成）
├─ schema/migration-manifest.schema.json
├─ preview/                       # VRT スナップショット（baseline=legacy/busapp/preview）
├─ .github/workflows/{ci.yml, migrate-checks.yml}  # U5 参照・SHA pin
├─ SKILL.md / AGENTS.md           # 移行 runbook＋ScopeManifest（U3 継承）
└─ README.md
```

## 3. 既存 busapp 取り込み元の配線（IDQ2=A）
- **取り込み元**: `FIG-UDS.git main(6f36074)/extensions/busapp/`。
- **手段**: `migrate-in` ステップが取り込み元を引数で受ける。
  - ①ローカルパス（チェックアウト済み FIG-UDS）／②git URL+ref（`<repo>#main:extensions/busapp`）。
  - `legacy/busapp/` へ**コピー取り込み**（履歴は持ち込まない・冪等・ハッシュ突合で二重防止）。
- **隔離方針**: 旧実装は `legacy/` に隔離（新規追加禁止）。移行が進むたび `legacy/` 依存を Core 化で減らし、空になれば撤去（BR-MIG-3／BR-WRAP-4）。
- **ロールバック**: `legacy/` 隔離と git により、写像失敗時は当該画面/部品を旧実装へ戻せる。

## 4. migration-manifest 収集・集約基盤（IDQ3=A）
- **生成（U4 責務）**: 製品 repo の状態（ScreenMigrationState/ComponentMapping/wrappers/extensionParts）から `migration-manifest.json` を**再生成**するジェネレータ＋ JSON Schema を提供。
- **収集（U5 参照）**: U5 の version 収集と**同一クローリング**（GitHub Actions/ビルド時）でマニフェストも収集。registry エントリと結合。
- **集約表示（U2 参照）**: ポータル運用ビューに「製品 × Core版 × 移行率 × 完了 × 期限超過ラッパー」を一覧。
- **二重実装回避**: U4 は生成器＋schema のみ。収集・描画ロジックは U5/U2 を参照。

## 5. VRT / 三層 Lint 実行環境（IDQ4=A）
- **実行**: 製品 repo の GitHub Actions（`migrate-checks.yml`）。
- **VRT ベースライン**: busapp 既存 `legacy/busapp/preview/*.html` を baseline、移行後 `preview/` をスナップショットとして差分。
- **三層 Lint / VRT 実体**: U5 共有設定を参照（閾値含む）。テンプレは配線のみ。Actions は SHA pin（SEC-4）。
- **差分実行**: 変更画面に限定実行可（PERF-2）。
- **ゲート**: 画面 `MIGRATED` 条件 = 三層 Lint 緑 ∧ VRT 緑 ∧ `legacyRemaining==0`（BR-SCR-4）。

## 6. registry 登録 / Core pin（IDQ6=A・U3 継承）
- **Core pin**: submodule pin（特定コミット）＋ `CORE-DS-VERSION`（SemVer）。整合は CI 検査（不一致 fail / SEC-3）。
- **registry 登録**: 取り込み時に最小権限トークン/GitHub App で Core DS へ cross-repo 登録 PR（entry: repo/category/subcategory/name/coreVersion/demoUrl）。CI-5＋Maintainer レビュー（SEC-1/2）。取り込み製品も同一ガードレール。

## 7. シークレット / 権限
| 項目 | 方針 |
|---|---|
| registry PR トークン | 最小権限（対象 registry repo の PR 起票のみ）／GitHub App 推奨。repo に置かずシークレット管理（SEC-6） |
| Actions | 既定 `GITHUB_TOKEN` 最小権限＋必要時 cross-repo App。全 Actions SHA pin（SEC-4） |
| SCA | 取り込む旧 busapp 依存の脆弱性監査・旧 devDeps 削減（SEC-5） |

## 8. Unit 横断依存
| 依存先 | 内容 |
|---|---|
| U1 Core DS | `.fig-*`/semantic トークン/alias 機構/registry/taxonomy/project-settings.schema（写像先・正典） |
| U3 Template & Setup | `fig-ext-template`・init.mjs（migrate-in 追補先）・ScopeManifest・RegistryPR フロー |
| U5 CI/CD | 三層 Lint/VRT 実体・version 収集（manifest 収集）・registry 検査(CI-5)・ラッパー期限 Lint |
| U2 Portal | 運用ビュー（移行率/完了/期限超過の集約表示） |
| U6 Showcase | ExtensionPart 収集・昇格導線 |

## 9. 要ユーザー操作（GitHub 側）
1. `fig-ext-business-busapp` を GitHub 上に `fig-ext-template` から Template 派生で作成。
2. Core を submodule として配線・pin（`CORE-DS-VERSION` と整合）。
3. busapp 取り込み元（FIG-UDS main/extensions/busapp）への参照を migrate-in 引数に設定。
4. registry PR 用トークン/GitHub App（最小権限）を設定。
5. U5 共有 Lint/VRT/収集の参照（SHA）を配線。
6. taxonomy の category（business 等）を Maintainer 承認。
