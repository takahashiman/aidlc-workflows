# U5 CI/CD Automation — NFR Requirements

> 質問ゲート無し（論点は FD で確定済み・U2/U3/U4 先例に倣う）。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層ガードレール／PBT 無効）を前提に、U5 固有の「CI 基盤としての非機能要件」を定義。
> 対象ストーリー: US-4.1 / US-4.2 / US-4.3（関連 CI-5/US-3.2）。

## 1. CI 正確性 / 決定性要件（ゲートが信頼できること）
| ID | 要件 |
|---|---|
| CI-Q1 | 三層 Lint は決定的 — 同一入力で同一結果。生 hex/px・`--fig-*` 非経由・層逆流の検出に**偽陰性を出さない**（許可リストは明示宣言のみ / BR-CI-LINT-2/4・US-4.1） |
| CI-Q2 | VRT は安定描画 — フォント/アニメ/時刻等の非決定要素を固定し、**フレーキー差分を出さない**（差分はしきい値で判定 / BR-CI-VRT-1） |
| CI-Q3 | version 収集は registry 駆動で網羅的 — 登録製品を取りこぼさず、pin の採用ソースを `source` に正しく記録（BR-CI-CRAWL-2/3） |
| CI-Q4 | registry 検査 5 項目は機械判定で、1 件でも不合格なら required check 失敗（手動オーバーライド不可 / BR-CI-REG-1） |
| CI-Q5 | ゲート（Lint/VRT/registry）は required check として**マージをブロック**でき、警告降格できない（US-4.1/4.2） |

## 2. 信頼性 / 再現性要件
| ID | 要件 |
|---|---|
| REL-1 | CI は再現可能 — 全 Action を SHA pin し、Node/ツールの版を固定。過去 commit の再実行で同一結果（BR-CI-SEC-1） |
| REL-2 | 共有 CI の参照 ref はバージョン整合 — 拡張は Core SemVer タグに pin、portal は rolling。`@<ref>` と `CORE-DS-VERSION` 不一致は警告（BR-CI-PIN-1） |
| REL-3 | version/migration 収集は **fail-soft** — 個別 repo 取得失敗は当該 entry を `unknown`/skip にし、収集全体・portal ビルドを止めない（BR-CI-CRAWL-5） |
| REL-4 | 収集全体失敗時は直近の version-matrix.json を据え置き（上書き破壊しない）。鮮度は `collectedAt` で提示（frontend §5） |
| REL-5 | VRT baseline は repo 内コミットで再現管理、意図的差分は baseline 更新コミットで承認痕跡を残す（BR-CI-VRT-2） |

## 3. 性能要件（CI 摩擦の最小化）
| ID | 要件 |
|---|---|
| PERF-1 | VRT は**変更画面に限定**実行可。フル総当たりを既定にしない（BR-CI-VRT-4 / U4 PERF-2 協調） |
| PERF-2 | version 収集は GitHub API（contents）で取得しチェックアウト不要。製品数 N に対し並列取得で線形以下に抑える（BR-CI-CRAWL-3） |
| PERF-3 | Lint/収集は軽量 Node で完結、第三者ランタイム常駐に依存しない。依存はキャッシュ（actions/cache）して反復実行を短縮 |
| PERF-4 | Core→portal VRT は portal の U2 ビルドを再利用し、当該 PR の Core 差分描画に限定（FDQ4 / 重複ビルド回避） |

## 4. セキュリティ要件（Security Baseline・Q9=A enforce）
| ID | 要件 | 区分 |
|---|---|---|
| SEC-1 | GitHub Actions は **SHA pin**（タグ/ブランチ参照のみ不可 / BR-CI-SEC-1） | enforce |
| SEC-2 | 各 workflow の `permissions` は既定 `contents: read`。registry の cross-repo 書込のみ最小権限トークン/GitHub App（BR-CI-SEC-2） | enforce |
| SEC-3 | registry/Core への変更は**自動マージ禁止**、Maintainer 承認必須（BR-CI-REG-2 / SEC-2 継承） | enforce |
| SEC-4 | **fork PR では secrets を要する job を実行しない**。Lint/VRT は secrets 不要で動く（BR-CI-SEC-3） | enforce |
| SEC-5 | 共有 CI が依存する OSS（stylelint/Playwright 等）は SCA 対象。lockfile pin＋脆弱性検査（Security Baseline SCA） | enforce |
| SEC-6 | スコープ分離: CI の対象範囲は当該 repo＋Core 参照のみ（横断的に他製品 secret/コードへ触れない / BR-SCOPE 継承） | enforce |
| SEC-N1 | サーバ認証/認可/DB/ネットワーク境界 | N/A（CI ＝静的解析・描画・API 読取のみ。常駐サーバ無し） |

## 5. アクセシビリティ要件（WCAG 2.1 AA・Q8=A）
| ID | 要件 |
|---|---|
| A11Y-1 | VRT は Core/製品 preview の見た目退行を捕捉し、a11y に影響する視覚変化（フォーカスリング消失・コントラスト劣化）も差分として検出できる |
| A11Y-2 | CI 自体の出力（PR コメント/アーティファクト名）は GitHub 標準 UI を用い、独自の非アクセシブル UI を追加しない（frontend §6） |

## 6. 保守性要件
| ID | 要件 |
|---|---|
| MAINT-1 | CI ロジック実体は **Core の共有 CI 正典に 1 つ**。各 repo は `uses:` 配線のみで二重実装しない（BR-CI-NODUP-1） |
| MAINT-2 | Lint ルールは `LintRuleSet` 単一ソース。CSS/JSX/HTML スキャナが同一ルールを参照（BR-CI-LINT-1） |
| MAINT-3 | 収集は**単一クローラ**で version＋migration（将来 showcase）を一括走査し、repo 重複アクセスを作らない（BR-CI-1CRAWL-1） |
| MAINT-4 | 出力は U2 確定スキーマ（version-matrix.schema.json 等）に準拠し、契約を変更しない（充足のみ / BR-CI-CRAWL-4） |

## 7. 可観測性要件
| ID | 要件 |
|---|---|
| OBS-1 | Lint 違反は `LintViolation`（file/line/rule/layer）として PR annotation/job log に出力（frontend §6） |
| OBS-2 | VRT 差分は差分画像アーティファクト＋PR コメントで提示（どの画面がどれだけ崩れたか可視化 / BR-CI-VRT-1） |
| OBS-3 | 収集の skip/unknown は version-matrix.json に痕跡（status/source=unknown）として残し、原因追跡可能（REL-3 連動） |
| OBS-4 | registry 検査の不合格項目は PR に注記（どの C1-5 が落ちたか / BR-CI-REG-1） |

## 8. ブラウザ対象
- VRT 描画はモダン・エバーグリーン（Chromium ベース既定、必要に応じ WebKit/Firefox）。Core/U2/U3/U4 と整合。

## 9. トレーサビリティ（NFR → Story）
| NFR | Story |
|---|---|
| CI-Q（Lint/VRT/収集/検査の正確性） | US-4.1 / US-4.2 / US-4.3 / US-3.2 |
| REL（再現性・fail-soft） | US-4.3 |
| PERF（差分VRT・軽量収集） | US-4.2 / US-4.3 |
| SEC（最小権限・自動マージ禁止・SHA pin・fork） | US-3.2 / ADQ3 / Q9 |
| A11Y | US-4.2（退行捕捉）/ Q8 |
| MAINT/OBS（単一正典・可視化） | US-4.1 / US-4.3 |
