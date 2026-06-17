# U2 Portal — Infrastructure Design

> 確定回答: IDQ1-5 = すべて A。論理コンポーネント（nfr-design/logical-components.md）を GitHub 基盤へマッピング。
> U2 = vanilla JS 静的 SPA。実行時バックエンド無し。基盤 = **GitHub repo + Actions + Pages**。

## 1. 基盤マッピング（論理 → 実体）
| 論理要素 | 実インフラ | 備考 |
|---|---|---|
| ビルドパイプライン LC-B1〜7 | **GitHub Actions（ubuntu-latest / Node LTS）**（IDQ4=A） | ビルド時のみ compute |
| Core Source Resolver LC-B1 | Actions 内で Core repo を checkout/submodule（最新タグ/core HEAD） | pin しない（rolling, IDQ2） |
| Schema Validator LC-B4 | Actions ステップ（JSON Schema 検証・孤児/必須キー・fail-fast） | 失敗で公開中断 |
| 静的成果物 / Pages Emitter LC-B7 | **GitHub Pages**（`actions/upload-pages-artifact`＋`deploy-pages`）（IDQ1=A） | gh-pages ブランチ不要 |
| データ層 LC-D1〜4 | ビルド時に同梱した静的 JSON（`data/`）＋ローカル localStorage | DB なし |
| ランタイム SPA 層 LC-R1〜5 | ブラウザ（クライアント実行・サーバ無し） | – |
| 境界 LC-X1〜3 | iframe sandbox / CSP メタ・SRI / 読み取り専用 | SEC-2/3/4 |
| 配信 | Pages の CDN | LB/API GW なし |
| 監視 | CI チェック＋Lighthouse＋VRT(U5) | サービス監視なし（代替） |

## 2. リポジトリ構成（IDQ5=A・FDQ1=A）
- ポータル資産を本 **`aidlc-workflows`** repo に配置（設計 `aidlc-docs/` と共存）。
```
aidlc-workflows/
├─ index.html                 # ポータルエントリ（移設）
├─ assets/                    # portal.js / portal-content.js / portal.css ほか（移設）
│   └─ js/ ...
├─ vendor/
│   ├─ core/                  # ビルド時に Core から無改変取込（tokens/components css）
│   └─ prism/                 # 自己ホスト化した Prism.js（+SRI）（NRQ7=A）
├─ data/                      # registry.json / taxonomy.json（Core 取込）＋ version-matrix.json / showcase-index.json（スタブ/収集）
├─ schema/                    # version-matrix.schema.json / showcase-index.schema.json（U2 定義）
├─ scripts/                   # 軽量 Node ビルド（取込・検証・スタブ・バンドル）
├─ tests/                     # ルーティング/buildNav ユニット・スキーマ検証
└─ .github/workflows/         # ポータルビルド&デプロイ（本 Unit が追加）
```
- 既存 `aidlc-projects/FIG-Universal-Design-System/`（FIG-UDS core 配下）のポータル相当資産を本 repo へ移設。Core 実体（tokens/components）は移設せず **ビルド時取込**（重複保持しない, BR-ROLL-3）。

## 3. rolling 追従機構（IDQ2=A）
ビルドトリガ（多重）:
1. `push`（`aidlc-workflows` のポータル変更）
2. `repository_dispatch`（Core repo のリリース時に通知 → ポータル再ビルド）
3. `schedule`（nightly。dispatch 取りこぼし対策）
4. `workflow_dispatch`（手動）

各トリガで「Core 最新取込 → 検証 → ビルド → Pages デプロイ」を実行（再ビルド＝最新反映, BR-ROLL-2）。

## 4. シークレット / 権限
| 項目 | 設定 |
|---|---|
| Pages デプロイ権限 | workflow `permissions: pages: write, id-token: write`（OIDC, deploy-pages 公式手順） |
| Core repo 参照 | 同一 org の場合は `GITHUB_TOKEN` で checkout。private cross-repo は読み取り用 PAT/Deploy Key（最小権限） |
| repository_dispatch 受信 | Core 側 release workflow から本 repo へ dispatch（送信側に最小権限トークン） |
| シークレット保管 | GitHub Actions Secrets。コードに埋め込まない（SEC-5 整合） |

## 5. セキュリティ基盤（静的サイト・SEC-1〜6）
- 依存監査（SCA）を CI に組込（`npm audit` 等、devDependency 最小）。
- ビルド成果物に SRI 付与（自己ホスト資産）、iframe `sandbox`/`referrerpolicy`、CSP メタ（best-effort）。
- HTTPS は Pages がデフォルト提供（SEC-N1 を委譲）。
- ポータルは正典（registry/taxonomy）を書込まない（読取専用, SEC-6）。

## 6. 監視 / 品質ゲート（代替監視）
| 項目 | 実現 |
|---|---|
| ビルド健全性 | Actions のジョブ成否（fail-fast） |
| 性能 | Lighthouse CI（PERF-1〜3 の閾値チェック・任意） |
| 表示崩れ | VRT（U5/CI-2 連動。U2 は決定的描画を提供） |
| 契約整合 | JSON Schema 検証＋孤児/必須キー（MAINT-1/3） |

## 7. Unit 横断の基盤依存
| 依存 | 提供元 | U2 での扱い |
|---|---|---|
| Core tokens/components/registry/taxonomy | U1 Core DS | ビルド時取込（rolling） |
| version-matrix.json | U5(CI-3) | スキーマは U2、データは U5（暫定スタブ） |
| showcase-index.json | U6(CI-4) | スキーマは U2、データは U6（暫定スタブ） |
| 三層 Lint / VRT | U5 | CI で連携（U2 は決定的描画・Lint 準拠） |
