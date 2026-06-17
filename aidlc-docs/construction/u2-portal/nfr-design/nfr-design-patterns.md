# U2 Portal — NFR Design Patterns

> NFR Requirements（NRQ全A）を設計パターンへ落とし込む。U2 = vanilla JS 静的 SPA / ビルド時 rolling 取込 / GitHub Pages。

## 1. Resilience（代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Build Fail-Fast** | ● | Core 取込・スキーマ検証に失敗したらビルドを中断し、壊れた版を公開しない（BR-PUB-3 / AVAIL-4） |
| **Graceful Empty-State** | ● | version-matrix/showcase 欠落・空時はクラッシュせず「収集待ち（U5/U6）」を表示（BR-DATA-5） |
| **Fallback Rendering** | ● | demoUrl 不在→リンク/「デモ準備中」、registry 未登録製品→pending ビュー（BR-VIEW-1 / §FD 6） |
| **Not-Found 誘導** | ● | 未知 route は最近接有効祖先へ誘導（BR §6） |
| **可用性の外部委譲** | ● | 実行時バックエンド無し。可用性は GitHub Pages SLA に委譲（AVAIL-1/2） |
| Retry/Circuit Breaker | N/A | 実行時の外部呼び出しを必須経路に持たない（自己ホスト・静的） |

## 2. Scalability（代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Data-Driven Navigation** | ● | ナビ（プロジェクト集）を taxonomy.json から動的生成。製品追加にコード改修不要（BR-NAV-2） |
| **Contract-Based Ingestion** | ● | version-matrix/showcase を JSON Schema 契約で取り込み、収集量増加を吸収（TSD-7） |
| **Static Fan-out 配信** | ● | 静的成果物のため閲覧者数増は配信側（Pages/CDN）で吸収。アプリ側スケール作業不要 |
| 実行時オートスケール/シャーディング | N/A | サーバ無し |

## 3. Performance（適用・PERF-1〜5）
| パターン | 適用 | 内容 |
|---|---|---|
| **Minimal-Dependency** | ● | フレームワーク非導入・vanilla JS（TSD-1）。バンドル最小（PERF-5） |
| **Self-Host + SRI** | ● | 第三者 CDN 実行時依存を排除し初回ロード安定化（SEC-3 / PERF） |
| **Lazy Route Rendering** | ● | ルート単位で必要ビューのみ描画。SPA 遷移は再ロード無し（PERF-2 <100ms） |
| **iframe Lazy-Load** | ● | デモ iframe は表示時ロード（`loading="lazy"`）。初回ロードを軽量化 |
| **Build-Time Precompute** | ● | データ検証・ナビ素材・スタブ生成をビルド時に確定し実行時計算を削減（rolling 再ビルド） |
| **Motion Budget** | ● | Core の motion 予算・`prefers-reduced-motion` 踏襲（PERF-4） |
| **Asset Caching** | ● | バージョン付きアセット／Pages のキャッシュで再訪高速化 |

## 4. Security（部分適用・SEC-1〜6）
| パターン | 適用 | 内容 |
|---|---|---|
| **iframe Sandboxing** | ● | デモは `sandbox`＋`referrerpolicy` で隔離。profile/coreVersion のみ query 伝播（SEC-2 / BR-VIEW-2） |
| **Subresource Integrity (SRI)** | ● | 自己ホスト資産・残存外部資産に SRI（SEC-3 / TSD-8） |
| **Content Security Policy** | ●(best-effort) | メタ CSP で許可元最小化（SEC-4） |
| **Supply-Chain (SCA)** | ● | 依存の脆弱性監査（SEC-1）。devDependency を最小化 |
| **Least-Data Client State** | ● | URL/localStorage に UI 設定のみ。機密・個人特定情報を置かない（SEC-5 / BR-STATE-3） |
| **Read-Only Data** | ● | registry/taxonomy を編集しない（SEC-6 / BR-DATA-4）。書込は U3/U5 機構へ委譲 |
| サーバ認証/認可/暗号化通信の自前実装 | N/A | 静的・Pages の HTTPS に委譲（SEC-N1/N2） |

## 5. Accessibility（適用・A11Y-1〜4）
| パターン | 適用 | 内容 |
|---|---|---|
| **Landmark/Heading 構造** | ● | banner/navigation/main・見出し階層（A11Y-1） |
| **ARIA Tree/Tab/Iframe** | ● | サイドナビ tree、Project View tab、iframe `title`（A11Y-2） |
| **Focus Management** | ● | route 変更時のフォーカス移動＋live region 通知（A11Y-3） |
| **Profile-Agnostic AA** | ● | 3プロファイルいずれでも AA 成立（A11Y-4） |

## 6. Maintainability / Quality（適用・MAINT-1〜6）
| パターン | 適用 | 内容 |
|---|---|---|
| **Schema-Validated Contracts** | ● | JSON Schema 検証（MAINT-1 / TSD-7） |
| **Pure-Function Core Logic** | ● | ルーティング解決・buildNav を純粋関数化しユニットテスト（MAINT-2） |
| **Build-Time Validation** | ● | 孤児/必須キー検査（MAINT-3 / BR-DATA-1/3） |
| **Deterministic Rendering for VRT** | ● | 決定的描画で VRT を成立（MAINT-4 / US-4.2 連動） |
| **No-Fork Core Assets** | ● | Core CSS/トークンは無改変取込（MAINT-5 / BR-ROLL-3） |

## 7. パターン → NFR/Story トレース
| パターン群 | NFR | Story |
|---|---|---|
| Resilience | AVAIL, BUILD | US-2.3, US-2.6 |
| Scalability | MAINT, BUILD | US-2.1, US-4.3, US-5.1 |
| Performance | PERF, UX | US-2.1, US-2.4 |
| Security | SEC | 横断(Q9=A) |
| Accessibility | A11Y | 横断(Q8=A) |
| Maintainability | MAINT | US-2.3 |
