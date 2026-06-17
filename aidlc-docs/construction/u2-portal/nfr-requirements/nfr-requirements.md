# U2 Portal — NFR Requirements

> 確定回答: NRQ1-9 = すべて A。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層／PBT 無効）を前提に U2 固有要件を定義。
> ポータル = vanilla JS 静的 SPA（ADQ1=A）、ビルド時 rolling 取込（FDQ5=A）、GitHub Pages 公開（US-2.6）。

## 1. パフォーマンス要件（NRQ3=A）
| ID | 要件 | 目標値 | 検証 |
|---|---|---|---|
| PERF-1 | 初回ロード（標準回線・PC/Web-Admin） | ≦ 2.5s（LCP 目安） | Lighthouse / 実測 |
| PERF-2 | ルート遷移（SPA・hashchange） | 即時（< 100ms） | 体感/計測 |
| PERF-3 | Lighthouse Performance スコア | ≧ 90 | CI/手動 Lighthouse |
| PERF-4 | モーション予算・`prefers-reduced-motion` | Core 踏襲（過剰アニメ禁止） | 目視/設定確認 |
| PERF-5 | バンドルサイズ | 最小依存（フレームワーク非導入, NRQ1=A）。サードパーティ実行時依存を必須経路から排除（NRQ7=A） | ビルド時計測 |

## 2. 可用性 / 配信要件（NRQ5=A / US-2.6）
| ID | 要件 |
|---|---|
| AVAIL-1 | GitHub Pages（静的ホスティング）に一本化。可用性は Pages SLA に委ねる |
| AVAIL-2 | 実行時バックエンド・サーバ処理を持たない（静的成果物のみで完全成立） |
| AVAIL-3 | 更新反映は「再ビルド → 再デプロイ」。rolling は再ビルド単位（BR-ROLL-2） |
| AVAIL-4 | ビルドは Core データ取得失敗時に fail-fast（壊れた版を公開しない, BR-PUB-3） |

## 3. アクセシビリティ要件（横断・Q8=A）
| ID | 要件 |
|---|---|
| A11Y-1 | ポータル UI は WCAG 2.1 AA 準拠（コントラスト・キーボード操作・フォーカス可視・ランドマーク/見出し階層） |
| A11Y-2 | サイドナビ（tree）・タブ・iframe デモに適切な ARIA とフォーカス管理（BR-A11Y-2） |
| A11Y-3 | route 変更時のフォーカス移動と live region 通知（PT-1） |
| A11Y-4 | 既定プロファイル Web-Admin だが、3プロファイルいずれでも AA 成立（Core と整合） |

## 4. セキュリティ要件（Security Baseline・NRQ6=A）
> ポータル = 認証なし・読み取り専用・社内公開の静的サイト。該当項目のみ enforce、サーバ系は N/A 明記。

| ID | 要件 | 区分 |
|---|---|---|
| SEC-1 | 依存の脆弱性管理（SCA。npm 依存の監査） | enforce |
| SEC-2 | iframe デモは `sandbox` ＋ `referrerpolicy` を付与（BR-VIEW-2） | enforce |
| SEC-3 | 外部スクリプトは自己ホスト化＋SRI（NRQ7=A）。必須経路から CDN 実行時依存を排除 | enforce |
| SEC-4 | 可能な範囲で CSP（メタタグ）を付与し、許可元を最小化 | enforce(best-effort) |
| SEC-5 | 機密・個人特定情報を URL/localStorage に保存しない（BR-STATE-3）。保存は UI 設定のみ | enforce |
| SEC-6 | ポータルは registry/taxonomy を編集しない（読み取り専用, BR-DATA-4） | enforce |
| SEC-N1 | サーバ側 認証/認可/セッション/暗号化通信の自前実装 | N/A（静的・Pages の HTTPS に委譲） |
| SEC-N2 | データベース/秘密情報ストア/サーバ入力検証 | N/A（バックエンド無し） |

## 5. 保守性 / テスト要件（NRQ8=A / PBT 無効 Q10=C）
| ID | 要件 |
|---|---|
| MAINT-1 | データ契約（version-matrix/showcase）は JSON Schema 検証（NRQ9=A） |
| MAINT-2 | ルーティング解決・ナビツリー生成（buildNav）にユニットテスト |
| MAINT-3 | ビルド時バリデーション: registry/taxonomy の孤児検出・必須キー検査（BR-DATA-1/3） |
| MAINT-4 | VRT（Core×ポータル）を品質ゲートに（U5/US-4.2 連動。U2 は決定的レンダリングを保証） |
| MAINT-5 | Core CSS/トークンは無改変取込（BR-ROLL-3）。ポータル固有は portal.css に限定 |
| MAINT-6 | vanilla JS・最小依存を維持し、長期保守コストを抑制（NRQ1=A） |

## 6. ユーザビリティ要件（玄人最適化・US-2.4）
| ID | 要件 |
|---|---|
| UX-1 | メインビューは一面完結（最小クリック・原則ノンスクロール, BR-UX-1） |
| UX-2 | 詳細 how-to は使い方/別ページへ分離（BR-UX-2） |
| UX-3 | サイドナビ葉は直接リンク・即時到達（US-2.1, BR-NAV-1） |
| UX-4 | UI 状態は URL+localStorage で共有・復元（FDQ9=A, BR-STATE-1/2） |

## 7. ビルド要件（rolling 基盤・NRQ1/2=A）
| ID | 要件 |
|---|---|
| BUILD-1 | 軽量ビルド（Node スクリプト＋最小依存）。フレームワーク/重量バンドラを導入しない |
| BUILD-2 | Core 取込は同一ワークスペースの Core（core ブランチ/最新タグ）をローカル参照。CI では checkout/submodule で供給 |
| BUILD-3 | ビルドは pin しない（最新 Core）。表示版ラベルは取込時の実版（BR-ROLL-1/4） |
| BUILD-4 | ビルド工程: Core 取込 → データ検証 → version-matrix/showcase スタブ生成 → バンドル → Pages 出力 |
| BUILD-5 | オフラインビルド可能（実行時の外部 fetch に依存しない, NRQ2=A/NRQ7=A） |

## 8. ブラウザ対象（NRQ4=A）
- モダン・エバーグリーン（Chrome / Edge / Safari / Firefox 最新）。レガシー（IE 等）非対象。Core(NRQ3) と整合。

## 9. トレーサビリティ（NFR → Story）
| NFR | 関連 Story |
|---|---|
| PERF / UX | US-2.1, US-2.4 |
| AVAIL / BUILD | US-2.3, US-2.6 |
| SEC | 横断（Q9=A） |
| A11Y | 横断（Q8=A） |
| MAINT | US-2.3（VRT）, US-4.3/5.1（契約） |
