# U4 Migration — NFR Requirements

> 質問ゲート無し（論点は FD で確定済み・U2/U3 先例に倣う）。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層ガードレール／PBT 無効）を前提に U4 固有の移行品質要件を定義。
> 対象ストーリー: US-3.5 / US-3.6 / US-4.5（横断 US-2.5）。

## 1. 移行の正しさ / 品質要件（移行が破壊でないこと）
| ID | 要件 |
|---|---|
| MIG-Q1 | 写像（ComponentMapping）は VRT グリーンを満たす — 旧 preview をベースラインに、移行前後の視覚差分が許容内（BR-SCR-4・US-3.6） |
| MIG-Q2 | 旧コンポーネントの公開 props インターフェイスは移行期間中の互換性テストで保証（BR-CONV-3） |
| MIG-Q3 | 移行済み画面は三層 Lint 緑（生 hex/px なし・`--fig-*` 経由・層逆流なし / US-4.1） |
| MIG-Q4 | 完了判定（主要フロー100% ∧ 全体≧80%）は移行マニフェストから自動算出し、手動宣言での『完了』を不可とする（BR-DONE-3） |
| MIG-Q5 | 画面内新旧混在の検出を機械化（混在画面は移行率非カウント / BR-SCR-2） |

## 2. 信頼性 / 冪等性要件（取り込みプロセス・U3 継承）
| ID | 要件 |
|---|---|
| REL-1 | 取り込み（migrate-in を含む SetupRunbook）は冪等。再実行で重複取り込み/破壊なし（BR-MIG-4・U3 REL-1 継承） |
| REL-2 | dry-run（差分プレビュー）で適用前に取り込み内容を確認できる（U3 REL-3 継承） |
| REL-3 | 失敗は当該ステップで停止し理由提示。部分適用で放置しない（U3 REL-4 継承） |
| REL-4 | `legacy/` 隔離により旧実装と移行後実装を物理分離し、ロールバック可能（git ベース） |
| REL-5 | baseline ステップで移行マニフェストを再生成可能（状態から導出・BR-VIS-1） |

## 3. 後方互換 / 寿命管理要件（US-4.5）
| ID | 要件 |
|---|---|
| COMPAT-1 | 全 CompatibilityWrapper/エイリアスに `deprecatedSince`/`removeBy` を必須付与（BR-WRAP-2） |
| COMPAT-2 | `removeBy` 超過のラッパー残存は CI 警告＋マニフェスト期限超過フラグ（BR-WRAP-3） |
| COMPAT-3 | 製品移行ラッパーは移行完了到達後に撤去（`legacy/` 空を最終 verify / BR-WRAP-4） |
| COMPAT-4 | Core MAJOR 追従は構造化 MigrationGuide 参照を完了の必須項目化（BR-GUIDE-2／BR-DONE-5） |

## 4. セキュリティ要件（Security Baseline・U3 継承）
| ID | 要件 | 区分 |
|---|---|---|
| SEC-1 | registry 登録は最小権限トークン＋PR のみ（直接 push 禁止 / U3 SEC-1） | enforce |
| SEC-2 | registry PR は CI 登録検査（U5/CI-5）＋Maintainer レビュー（U3 SEC-2） | enforce |
| SEC-3 | Core submodule pin＋`CORE-DS-VERSION` 整合検査（不一致 fail / U3 SEC-3） | enforce |
| SEC-4 | GitHub Actions は SHA pin（U3 SEC-4） | enforce |
| SEC-5 | 取り込む既存資産は SCA（旧依存の脆弱性検査）。不要な旧 devDeps は移行時に削減 | enforce |
| SEC-6 | スコープ分離: 移行 AI コンテキストは Core＋対象製品のみ（U3 SEC-7 / BR-SCOPE-1） | enforce |
| SEC-N1 | サーバ認証/認可/DB | N/A（拡張製品 repo＋静的資産・サーバ無し） |

## 5. アクセシビリティ要件（WCAG 2.1 AA・Q8=A）
| ID | 要件 |
|---|---|
| A11Y-1 | 移行後コンポーネントは Core `.fig-*` の a11y（フォーカス可視・コントラスト・ARIA）を継承し WCAG 2.1 AA を満たす |
| A11Y-2 | TextField 等の旧 a11y 属性（label 関連付け・aria-invalid）は移行で退行させない（MIG-Q2 と連動） |

## 6. 保守性要件
| ID | 要件 |
|---|---|
| MAINT-1 | 移行マニフェスト（`migration-manifest.json`）は機械可読・状態から再生成（手動編集禁止 / BR-VIS-1） |
| MAINT-2 | ComponentMapping 対応表は機械可読化し Code Generation の入力とする（再現性） |
| MAINT-3 | CI ロジック実体は U5 共有設定を参照（テンプレ継承・二重実装回避 / U3 MAINT-3） |
| MAINT-4 | 移行ロジック（混在検出・移行率算出）は U5 の version 収集と同一クローリング基盤を再利用（BR-VIS-2） |

## 7. 性能要件（軽量・移行作業の摩擦最小）
| ID | 要件 |
|---|---|
| PERF-1 | 移行マニフェスト算出・混在検出はビルド/CI 内で完結（軽量 Node・第三者ランタイム依存なし） |
| PERF-2 | VRT は変更画面に限定実行可（フル実行の負荷を抑制・U5 と協調） |

## 8. ブラウザ対象
- モダン・エバーグリーン（Chrome/Edge/Safari/Firefox 最新）。Core/U2/U3 と整合。

## 9. トレーサビリティ（NFR → Story）
| NFR | Story |
|---|---|
| MIG-Q（写像/混在/完了） | US-3.6 / US-4.1 |
| REL（取り込み冪等/ロールバック） | US-3.5 |
| COMPAT（ラッパー/エイリアス/MAJOR） | US-4.5 |
| SEC（PR/pin/scope/SCA） | US-3.4 / ADQ3 |
| A11Y | US-3.6（退行防止）/ Q8 |
| MAINT/PERF | US-4.3（収集基盤再利用） |
