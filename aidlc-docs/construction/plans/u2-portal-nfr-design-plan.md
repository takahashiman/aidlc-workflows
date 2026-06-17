# U2 Portal — NFR Design Plan

> 全カテゴリを評価。U2 は vanilla JS 静的 SPA（実行時バックエンド無し・GitHub Pages）。
> 設計論点は FD（FDQ全A）＋ NFR Requirements（NRQ全A）で確定済み。**新規の未確定論点なし** → 質問ゲートを設けず設計成果物を生成（U1 先例に準拠）。

## 生成する成果物（チェックリスト）
- [x] `nfr-design-patterns.md` — 適用する設計パターン（静的 SPA 向け）
- [x] `logical-components.md` — 論理コンポーネント（ビルドパイプライン/データ層/基盤要素の適用判定）

## カテゴリ評価（MANDATORY・判断根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Resilience Patterns | **代替適用** | 実行時障害の概念が小さい（静的配信）。代替＝**ビルド fail-fast**＋**グレースフルな空状態/フォールバック**（pending・demo fallback・収集待ち）。Pages SLA に可用性委譲 |
| Scalability Patterns | **代替適用** | 実行時スケール不要（静的・CDN 的配信）。代替＝**taxonomy 駆動の動的ナビ**で製品増に無改修対応・データ契約で収集量増を吸収 |
| Performance Patterns | **適用** | 最小依存・自己ホスト＋SRI・ルート遅延描画・rolling 再ビルドキャッシュ・motion 予算（PERF-1〜5） |
| Security Patterns | **部分適用** | iframe sandbox・SRI・CSP(best-effort)・SCA・機密非保持（SEC-1〜6）。サーバ系（認証/認可/暗号化通信自前）は N/A |
| Logical Components | **静的サイト向けに限定適用** | queue/cache/circuit-breaker/LB は不在。論理要素＝**ビルドパイプライン**・データ層（rolling reader/schema validator）・ルーター/ビュー・iframe 境界 |

→ ユーザーへの追加質問は不要（全て確定 or N/A）。
