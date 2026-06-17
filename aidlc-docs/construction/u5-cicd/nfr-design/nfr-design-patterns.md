# U5 CI/CD Automation — NFR Design Patterns

> NFR Requirements（質問ゲート無し・FD確定）を設計パターンへ。U5 = 共有 CI 正典＋三層 Lint＋VRT ゲート＋version/migration 収集＋registry 検査。実行時常駐サーバ無し。

## 1. CI Correctness（ゲートの信頼性・重点）
| パターン | 適用 | 内容 |
|---|---|---|
| **Single Rule Source** | ● | Lint ルールは Core `LintRuleSet` 単一ソース。CSS/JSX/HTML が同一規則を参照（CI-Q1 / BR-CI-LINT-1） |
| **Deterministic Lint** | ● | 同一入力＝同一結果・偽陰性排除・許可リストは明示宣言のみ（CI-Q1 / BR-CI-LINT-4） |
| **Stable VRT Rendering** | ● | フォント/アニメ/時刻を固定しフレーキー差分を排除（CI-Q2） |
| **Registry-Driven Crawl** | ● | 収集対象は registry.json 駆動で網羅・取りこぼし防止（CI-Q3 / BR-CI-CRAWL-2） |
| **Required Check Gate** | ● | Lint/VRT/registry 検査は required check でマージブロック・警告降格不可（CI-Q5 / US-4.1/4.2） |

## 2. Resilience（再現性・代替適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Pinned & Reproducible** | ● | 全 Action SHA pin＋ツール版固定で過去 commit 再実行も同一結果（REL-1 / BR-CI-SEC-1） |
| **Ref-Pin Consistency** | ● | 共有 CI 参照 `@<ref>` と `CORE-DS-VERSION` 整合（拡張 pin / portal rolling）（REL-2 / BR-CI-PIN-1） |
| **Fail-Soft Collection** | ● | 収集の個別失敗は unknown/skip、全体失敗は直近結果据え置き（REL-3/4 / BR-CI-CRAWL-5） |
| **Approved Baseline Update** | ● | VRT baseline は repo 内コミット、意図差分は更新コミットで承認痕跡（REL-5 / BR-CI-VRT-2） |
| Retry/Circuit Breaker | N/A | 実行時の常時外部呼び出し無し |

## 3. Performance（限定適用）
| パターン | 適用 | 内容 |
|---|---|---|
| **Incremental VRT** | ● | VRT は変更画面に限定実行（PERF-1 / BR-CI-VRT-4） |
| **Checkout-Free Parallel Collection** | ● | GitHub API contents で pin を並列取得・チェックアウト不要（PERF-2 / BR-CI-CRAWL-3） |
| **Build Reuse for Coupled VRT** | ● | Core→portal VRT は U2 ビルドを再利用し差分描画に限定（PERF-4 / BR-CI-VRT-3） |
| **Dependency Cache** | ● | actions/cache で依存復元を短縮（PERF-3） |
| 実行時オートスケール | N/A | 常駐サーバ無し |

## 4. Security（適用・重点 / SEC-1〜6）
| パターン | 適用 | 内容 |
|---|---|---|
| **Pinned Actions** | ● | 全 Action を SHA pin（SEC-1 / BR-CI-SEC-1） |
| **Least-Privilege Permissions** | ● | `contents: read` 既定・cross-repo 書込のみ最小トークン/App（SEC-2 / BR-CI-SEC-2） |
| **No-Auto-Merge Review Gate** | ● | registry/Core 変更は自動マージ禁止・Maintainer 承認必須（SEC-3 / BR-CI-REG-2） |
| **Fork-Secret Isolation** | ● | fork PR は secrets job を skip、Lint/VRT は secrets 不要で動作（SEC-4 / BR-CI-SEC-3） |
| **Supply-Chain (SCA)** | ● | 共有 CI 依存 OSS の lockfile pin＋脆弱性検査（SEC-5） |
| **Scope Isolation** | ● | CI 対象は当該 repo＋Core 参照のみ（SEC-6） |

## 5. Maintainability（重点 / BR-CI-NODUP）
| パターン | 適用 | 内容 |
|---|---|---|
| **Single Canon, Wired Stubs** | ● | ロジック実体は Core に 1 つ、各 repo は `uses:` 配線のみ（MAINT-1 / BR-CI-NODUP-1） |
| **Single Crawler** | ● | version＋migration（将来 showcase）を単一クローラで一括走査（MAINT-3 / BR-CI-1CRAWL-1） |
| **Contract-Conformant Output** | ● | 出力は U2 確定スキーマ準拠（契約変更せず充足）（MAINT-4 / BR-CI-CRAWL-4） |

## 6. Observability（可視化）
| パターン | 適用 | 内容 |
|---|---|---|
| **Violation Annotation** | ● | Lint 違反を PR annotation/job log に file/line/rule で出力（OBS-1） |
| **Visual Diff Artifact** | ● | VRT 差分画像＋PR コメントで崩れ画面を提示（OBS-2） |
| **Collection Trace** | ● | 収集 skip/unknown を version-matrix に痕跡として残す（OBS-3） |
| **Check Annotation** | ● | registry 検査の不合格 C1-5 を PR に注記（OBS-4） |

## 7. Accessibility
| パターン | 適用 | 内容 |
|---|---|---|
| **VRT Catches a11y Regression** | ● | フォーカスリング消失・コントラスト劣化など視覚的 a11y 退行も差分検出（A11Y-1） |
| **GitHub-Native UI** | ● | CI 出力は GitHub 標準 UI を用い独自非アクセシブル UI を足さない（A11Y-2） |

## 8. トレース
| パターン群 | NFR | Story |
|---|---|---|
| CI Correctness | CI-Q | US-4.1 / US-4.2 / US-4.3 / US-3.2 |
| Resilience | REL | US-4.3 |
| Performance | PERF | US-4.2 / US-4.3 |
| Security | SEC | US-3.2 / Q9 |
| Maintainability/Observability | MAINT/OBS | US-4.1 / US-4.3 |
| Accessibility | A11Y | US-4.2 / Q8 |
