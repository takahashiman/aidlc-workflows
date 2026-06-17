# U3 Template & Setup — NFR Design Plan

> 全カテゴリを評価。U3 = テンプレ repo＋静的 Generator＋AI セットアップ（runbook）。実行時バックエンドなし。
> 論点は FD（FDQ全A）＋ NFR Requirements（NRQ全A）で確定済み。**新規の未確定論点なし** → 質問ゲート無しで成果物生成（U1/U2 先例）。

## 生成する成果物（チェックリスト）
- [x] `nfr-design-patterns.md` — 適用する設計パターン
- [x] `logical-components.md` — 論理コンポーネント（基盤要素の適用判定）

## カテゴリ評価（MANDATORY・根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Resilience Patterns | **代替適用** | 実行時障害概念は小。代替＝**冪等 runbook**＋**ステップ単位 fail-stop**＋**dry-run**＋**完了検証** |
| Scalability Patterns | **代替適用** | 実行時スケール不要。代替＝テンプレ複製で製品数線形拡大・registry/taxonomy で増加吸収 |
| Performance Patterns | **限定適用** | Generator は軽量 vanilla・初期化は Node 最小依存。性能は副次 |
| Security Patterns | **適用（重点）** | registry PR 最小権限/レビュー・Core pin 整合・Actions SHA pin・SCA・スコープ分離 |
| Logical Components | **限定適用** | queue/cache/CB/LB/DB は N/A。論理要素＝テンプレ/Generator/初期化スクリプト/runbook/registry-PR/ScopeManifest |

→ 追加質問は不要（全て確定 or N/A）。
