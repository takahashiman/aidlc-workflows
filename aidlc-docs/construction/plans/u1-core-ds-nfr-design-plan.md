# U1 Core DS — NFR Design Plan

> 全カテゴリを評価。U1 はトークン/コンポーネント・ライブラリのため、ランタイム基盤系は N/A、その他は確定済み。
> **新規の未確定論点なし** → 質問ゲートを設けず設計成果物を生成。

## 生成する成果物（チェックリスト）
- [x] `nfr-design-patterns.md` — 適用する設計パターン
- [x] `logical-components.md` — 論理コンポーネント（基盤要素の適用判定）

## カテゴリ評価（MANDATORY・判断根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Resilience Patterns | **代替適用** | ランタイム障害の概念なし（git 配布）。代替＝**後方互換エイリアス/ラッパー**で消費側を保護 |
| Scalability Patterns | **代替適用** | 実行時スケールなし。代替＝MINOR でのコンポーネント/トークン追加・taxonomy 多階層 |
| Performance Patterns | **適用** | CSS Custom Properties・motion 予算・ソースのみ配布（バンドルは消費側） |
| Security Patterns | **部分適用** | サプライチェーン（SECURITY-10）・完全性（SECURITY-13 SRI/CI）。認証/データ系は N/A |
| Logical Components | **大半 N/A** | queue/cache/circuit-breaker/LB は不在。論理要素＝トークン層/メタデータ/Lint設定/preview |

→ ユーザーへの追加質問は不要（全て確定 or N/A）。
