# U3 Template & Setup — NFR Design Patterns

> NFR Requirements（NRQ全A）を設計パターンへ。U3 = テンプレ repo＋静的 Generator＋AI セットアップ runbook。

## 1. Resilience（代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Idempotent Runbook** | ● | 各セットアップステップは再実行で壊れない（REL-1 / BR-IDEM-1） |
| **Step Fail-Stop** | ● | 失敗は当該ステップで停止し理由提示（部分適用放置なし / REL-4） |
| **Dry-Run / Preview** | ● | 適用前に差分プレビュー（REL-3） |
| **Completion Verification** | ● | 必須値・pin・CI・registry PR の存在を検証（REL-2 / BR-IDEM-2） |
| Retry/Circuit Breaker | N/A | 実行時の常時外部呼び出しなし |

## 2. Scalability（代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Template Cloning** | ● | GitHub Template 複製で製品数を線形拡大（運用負荷一定） |
| **Registry/Taxonomy 吸収** | ● | 製品増は registry/taxonomy（単一正典）で吸収。ポータルが自動反映 |
| 実行時オートスケール | N/A | サーバ無し |

## 3. Performance（限定適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Minimal-Dependency** | ● | Generator=vanilla、初期化=Node 最小依存（MAINT-1） |
| **Local/Offline Init** | ● | 初期化スクリプトはオフライン実行可（REL-5） |

## 4. Security（適用・重点 / SEC-1〜7）
| パターン | 適用 | 内容 |
|---|---|---|
| **Least-Privilege PR** | ● | registry PR は最小権限トークン・ブランチ経由（SEC-1） |
| **Review Gate** | ● | CI(U5/CI-5)＋Maintainer 必須レビュー・自動マージ禁止（SEC-2） |
| **Pinned Dependencies** | ● | Core submodule pin＋CORE-DS-VERSION 整合・Actions SHA pin（SEC-3/4） |
| **Supply-Chain (SCA)** | ● | 依存脆弱性監査・devDeps 最小（SEC-5） |
| **Secret Management** | ● | 秘密はシークレット管理・repo に置かない（SEC-6） |
| **Scope Isolation** | ● | AI コンテキストは Core＋対象製品のみ（SEC-7 / ScopeManifest） |
| **Single-Source-of-Truth Write** | ● | registry/taxonomy 書込は PR 経由のみ（BR-REG-4） |

## 5. Accessibility / Maintainability
| パターン | 適用 | 内容 |
|---|---|---|
| **Accessible Form** | ● | Generator は WCAG AA（ラベル/エラー関連付け・キーボード / A11Y-1/2） |
| **Schema-Validated Contract** | ● | project-settings を Core schema で検証（MAINT-2） |
| **No-Fork / Reference** | ● | CI ロジック=U5 参照・signature presets=Core 参照（MAINT-3/4） |
| **Tool-Agnostic Runbook** | ● | SetupRunbook/ScopeManifest を SKILL/AGENTS に明文化（MAINT-5） |

## 6. トレース
| パターン群 | NFR | Story |
|---|---|---|
| Resilience | REL | US-3.2 |
| Security | SEC | US-3.2/3.3/3.4・ADQ3 |
| Scalability | – | US-3.1 |
| A11y/Maint | A11Y/MAINT | US-3.2 |
