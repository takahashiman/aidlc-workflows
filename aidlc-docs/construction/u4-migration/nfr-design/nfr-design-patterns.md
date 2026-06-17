# U4 Migration — NFR Design Patterns

> NFR Requirements（質問ゲート無し・FD確定）を設計パターンへ。U4 = 既存製品の取り込み＋画面単位 Core 化＋完了判定＋後方互換。実行時サーバ無し（拡張製品 repo＋静的資産）。

## 1. Migration Correctness（移行の正しさ・重点）
| パターン | 適用 | 内容 |
|---|---|---|
| **Visual Regression Baseline** | ● | 旧 preview をベースラインに写像前後の VRT グリーンを要求（MIG-Q1 / U5 VRT 実行） |
| **API-Preserving Wrapper** | ● | 旧 props を維持し内部のみ Core クラスへ委譲（MIG-Q2 / BR-CONV-3） |
| **Layered Guardrail Lint** | ● | 生 hex/px・`--fig-*` 非経由・層逆流を CI 検出（MIG-Q3 / US-4.1） |
| **Screen-Atomic Migration** | ● | 画面を原子単位に。混在画面は移行率非カウント（MIG-Q5 / BR-SCR-1/2） |
| **Derived Completion Gate** | ● | 完了は状態から自動算出（主要フロー100%∧全体≧80%）。手動宣言不可（MIG-Q4 / BR-DONE-3） |

## 2. Resilience（取り込み・代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Idempotent migrate-in** | ● | 取り込みステップは再実行で重複/破壊なし（REL-1 / BR-MIG-4） |
| **Quarantine (`legacy/`)** | ● | 旧実装を隔離領域に置き移行後と物理分離 → ロールバック容易（REL-4） |
| **Dry-Run / Preview** | ● | 取り込み前に差分プレビュー（REL-2） |
| **Step Fail-Stop** | ● | 失敗は当該ステップで停止し理由提示（REL-3） |
| **Regenerable Manifest** | ● | 移行マニフェストは状態から再生成（REL-5 / BR-VIS-1） |
| Retry/Circuit Breaker | N/A | 実行時の常時外部呼び出しなし |

## 3. Backward Compatibility（寿命管理・重点 / US-4.5）
| パターン | 適用 | 内容 |
|---|---|---|
| **Dated Deprecation** | ● | 全ラッパー/エイリアスに `deprecatedSince`/`removeBy` 必須（COMPAT-1 / BR-WRAP-2） |
| **Overdue CI Warning** | ● | `removeBy` 超過の残存を CI 警告＋マニフェストフラグ（COMPAT-2 / BR-WRAP-3） |
| **Alias-vs-Wrapper 分離** | ● | Core 改名エイリアス（Core側）と製品移行ラッパー（製品側）を区別（BR-WRAP-1） |
| **Structured Migration Guide** | ● | Core MAJOR に構造化ガイド・参照消化を完了必須化（COMPAT-4 / BR-GUIDE-2） |
| **Post-Completion Cleanup** | ● | 移行完了で製品ラッパー撤去・`legacy/` 空を verify（COMPAT-3 / BR-WRAP-4） |

## 4. Scalability（代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Template-Driven Onboarding** | ● | 取り込みは U3 template 派生で線形拡大（製品数に対し運用一定） |
| **Registry/Manifest 吸収** | ● | 製品増は registry＋移行マニフェスト（収集）で吸収。ポータル自動反映 |
| 実行時オートスケール | N/A | サーバ無し |

## 5. Performance（限定適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Minimal-Dependency** | ● | 取り込み/算出は Node 最小依存・実行時ランタイム無し（PERF-1） |
| **Incremental VRT** | ● | VRT は変更画面に限定実行可（PERF-2 / U5 協調） |
| **Shared Crawler Reuse** | ● | 移行率算出を U5 version 収集と同一クローリングで実行（MAINT-4） |

## 6. Security（適用 / SEC-1〜6）
| パターン | 適用 | 内容 |
|---|---|---|
| **Least-Privilege PR** | ● | registry 登録は最小権限・PR 経由（SEC-1） |
| **Review Gate** | ● | CI(CI-5)＋Maintainer レビュー（SEC-2） |
| **Pinned Dependencies** | ● | Core submodule pin＋CORE-DS-VERSION 整合・Actions SHA pin（SEC-3/4） |
| **Supply-Chain (SCA) on Legacy** | ● | 取り込む旧資産の依存脆弱性監査・旧 devDeps 削減（SEC-5） |
| **Scope Isolation** | ● | 移行 AI コンテキストは Core＋対象製品のみ（SEC-6 / ScopeManifest） |

## 7. Accessibility / Maintainability
| パターン | 適用 | 内容 |
|---|---|---|
| **A11y Non-Regression** | ● | 移行で a11y 属性を退行させない（旧 label/aria 維持 / A11Y-1/2） |
| **Machine-Readable Mapping** | ● | ComponentMapping を機械可読化し Code Gen 入力に（MAINT-2） |
| **No-Fork / Reference** | ● | CI 実体=U5 参照・収集基盤再利用（MAINT-3/4） |

## 8. トレース
| パターン群 | NFR | Story |
|---|---|---|
| Migration Correctness | MIG-Q | US-3.6 / US-4.1 |
| Resilience | REL | US-3.5 |
| Backward Compatibility | COMPAT | US-4.5 |
| Security | SEC | US-3.4 / ADQ3 |
| A11y/Maint/Perf | A11Y/MAINT/PERF | US-3.6 / US-4.3 |
