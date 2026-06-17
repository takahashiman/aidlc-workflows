# U2 Portal — Logical Components

> NFR を実現する論理コンポーネント。U2 = 静的 SPA のため、従来型ランタイム基盤（queue/cache/CB/LB/DB）は大半 N/A。
> 論理要素＝**ビルドパイプライン** / **データ層** / **ランタイム SPA 層** / **境界**。

## A. ビルドパイプライン（ビルド時・Node スクリプト・NRQ1=A）
```
[Core Source Resolver] → [Core Asset Importer] → [Data Loader] → [Schema Validator]
        │                        │                     │               │
   core branch/tag         tokens+css 無改変 copy   registry/taxonomy   JSON Schema
                                                     +matrix/showcase    (fail-fast)
        └──────────────→ [Stub Generator] → [Bundler/Minifier] → [Pages Emitter]
                          (matrix/showcase   (self-host+SRI)      (静的成果物 → deploy)
                           暫定データ)
```
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-B1 Core Source Resolver | core ブランチ/最新タグを解決（pin しない） | BR-ROLL-1, BUILD-2/3 |
| LC-B2 Core Asset Importer | トークン/コンポーネント CSS を無改変取込 | BR-ROLL-3, MAINT-5 |
| LC-B3 Data Loader | registry/taxonomy/matrix/showcase 読込 | FDQ5=A, BUILD-4 |
| LC-B4 Schema Validator | JSON Schema 検証＋孤児/必須キー検査、fail-fast | MAINT-1/3, AVAIL-4 |
| LC-B5 Stub Generator | matrix/showcase の暫定データ生成（収集前） | FDQ6=A |
| LC-B6 Bundler/SRI | 自己ホスト化・SRI 付与・最小化 | SEC-3, PERF-5, TSD-8 |
| LC-B7 Pages Emitter | 静的成果物出力（デプロイ詳細は infra） | US-2.6, AVAIL-1 |

## B. データ層（契約・PT-7）
| 論理要素 | 責務 | 由来/契約 |
|---|---|---|
| LC-D1 Metadata Reader | registry/taxonomy を rolling 読込（読取専用） | Core DS（BR-DATA-4） |
| LC-D2 Version-Matrix Contract | `version-matrix.json` の JSON Schema（U2 定義） | U5(CI-3) が生成（TSD-7） |
| LC-D3 Showcase Contract | `showcase-index.json` の JSON Schema（U2 定義） | U6(CI-4) が生成（TSD-7） |
| LC-D4 Usage Guide Store | UsageGuidePage 群（静的同梱） | U2 所有（FDQ8=A） |

## C. ランタイム SPA 層（クライアント・実行時）
| 論理要素 | 責務 | 対応 PT |
|---|---|---|
| LC-R1 Hash Router | route 解決・ビュー dispatch・フォーカス管理 | PT-1 |
| LC-R2 Nav Builder | buildNav（taxonomy 駆動＋静的セクション） | PT-2 |
| LC-R3 View Renderers | IA Section / Project / Version / Showcase / Usage | PT-3〜6,8 |
| LC-R4 UiState Manager | profile/version の URL+localStorage 同期 | Header/FDQ9=A |
| LC-R5 Empty/Error Presenter | pending・収集待ち・Not-Found・demo fallback | BR §6 |

## D. 境界（Trust/Isolation Boundary）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-X1 iframe Demo Boundary | デモを sandbox 隔離・context query 伝播 | SEC-2, BR-VIEW-2 |
| LC-X2 CSP/SRI Boundary | 許可元最小化・資産完全性 | SEC-3/4 |
| LC-X3 Read-Only Boundary | ポータルは正典を書換えない（書込は U3/U5 へ委譲） | SEC-6, BR-DATA-4 |

## E. 適用判定（従来型基盤）
| 基盤要素 | 判定 | 根拠 |
|---|---|---|
| Message Queue | N/A | 非同期処理・サーバ無し |
| Cache (Redis 等) | N/A | 静的配信。ブラウザ/Pages キャッシュで代替 |
| Circuit Breaker | N/A | 実行時外部呼び出しを必須経路に持たない |
| Load Balancer | N/A | Pages/CDN が配信を担う |
| Database | N/A | 状態は静的 JSON＋localStorage（UI 設定のみ） |
| Auth Service | N/A | 認証なし（読取専用社内公開） |

## F. コンポーネント間の責務分界（Unit 横断）
| 関心事 | U2(Portal) | 委譲先 |
|---|---|---|
| registry/taxonomy 正典 | 読取・表示 | U1 Core DS（編集） |
| version-matrix/showcase | スキーマ定義・表示 | U5/U6（収集生成） |
| registry 登録 PR・Issue 起票 | 導線提供 | U3(TM-3)/U5(CI) |
| VRT 実行 | 決定的描画を提供 | U5(CI-2) |
| Interactive Prompt Generator | 現状維持（壊さない） | U3(TM-2) |
