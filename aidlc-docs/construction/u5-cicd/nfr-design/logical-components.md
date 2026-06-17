# U5 CI/CD Automation — Logical Components

> U5 = 共有 CI 正典（Core）＋三層 Lint＋VRT ゲート＋version/migration 収集＋registry 検査。実行時常駐サーバ無し（queue/cache/CB/LB/DB は N/A）。
> 論理要素の多くは「Core に実体 1 つ・各 repo は `uses:` 配線」（BR-CI-NODUP）。

## A. 共有 CI 正典（Shared CI Canon・Core repo / FDQ1）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-A1 Reusable Workflows | `_shared-guardrail` / `_shared-vrt` / `_shared-registry-check` を Core に定義し各 repo が `uses:` | MAINT-1, BR-CI-NODUP-1 |
| LC-A2 Composite Actions | `three-layer-lint` 等、合成可能な実行単位 | MAINT-1 |
| LC-A3 LintRuleSet（config-package） | layerGraph / rawValuePolicy / viaSemantic / 許可リストの単一ソース | MAINT-2, BR-CI-LINT-1 |
| LC-A4 Ref-Pin Consistency | 参照 `@<ref>` と `CORE-DS-VERSION` 整合（拡張=tag pin / portal=rolling） | REL-2, BR-CI-PIN-1 |

## B. 三層ガードレール Lint（CI-1 / FDQ2）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-B1 CSS Linter (stylelint plugin) | 生 hex/px・`var(--fig-*)` 非経由・層逆流を CSS で検出 | CI-Q1, BR-CI-LINT-2 |
| LC-B2 JSX/HTML Scanner | 同一 LintRuleSet で JSX/HTML を静的走査 | CI-Q1, BR-CI-LINT-1 |
| LC-B3 Layer Graph Resolver | primitives←semantic←components 一方向参照を解析 | CI-Q1, BR-CI-LINT-2(V3) |
| LC-B4 Violation Reporter | `LintViolation[]`（file/line/rule/layer）出力・1件で失敗 | CI-Q5, OBS-1, BR-CI-LINT-3 |

## C. VRT ゲート（CI-2 / FDQ3・FDQ4）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-C1 Headless Renderer (Playwright) | preview/*.html を安定描画→スクショ（非決定要素固定） | CI-Q2 |
| LC-C2 Baseline Store (repo 内) | `preview/__baseline__/` にコミット・更新コミットで承認痕跡 | REL-5, BR-CI-VRT-2 |
| LC-C3 Diff Gate | 画素差分しきい値超過で required check 失敗 | CI-Q5, BR-CI-VRT-1 |
| LC-C4 Incremental Scope | 変更画面に限定実行 | PERF-1, BR-CI-VRT-4 |
| LC-C5 Core→Portal Coupling | Core PR で portal を rolling 取込ビルドし VRT、Core PR をゲート | PERF-4, BR-CI-VRT-3, US-4.2 |
| LC-C6 Diff Artifact / PR Comment | 差分画像と崩れ画面を PR に提示 | OBS-2 |

## D. version / migration 収集（CI-3 / FDQ5・FDQ6）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-D1 Single Crawler (`collect-versions.mjs`) | portal ビルド内・registry 駆動の単一走査 | MAINT-3, BR-CI-1CRAWL-1 |
| LC-D2 Pin Resolver (GitHub API) | `submodule→CORE-DS-VERSION→package.json` 優先順で pin 取得・source 記録（並列） | CI-Q3, PERF-2, BR-CI-CRAWL-3 |
| LC-D3 Status Calculator | pinned vs latest(rolling) で `up-to-date/behind/unknown` 算出 | CI-Q3, BR-CI-CRAWL-4 |
| LC-D4 Matrix Emitter | `version-matrix.json`（U2 schema 準拠）生成 | MAINT-4, BR-CI-CRAWL-4 |
| LC-D5 Migration Aggregator | 同一走査で `migration-manifest.json` 集約→`migration-index.json` | BR-CI-1CRAWL-1（U4 BR-VIS-2 履行） |
| LC-D6 Fail-Soft Guard | 個別失敗=unknown/skip、全体失敗=据え置き | REL-3/4, OBS-3, BR-CI-CRAWL-5 |

## E. registry 登録検査（CI-5 / FDQ7）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-E1 Registry Check Workflow (Core 側) | C1 schema / C2 taxonomy / C3 naming / C4 dup / C5 coreVersion-exists | CI-Q4, BR-CI-REG-1 |
| LC-E2 No-Auto-Merge Gate | 全通過でも Maintainer 承認必須 | SEC-3, BR-CI-REG-2 |
| LC-E3 Check Annotation | 不合格項目を PR に注記 | OBS-4 |

## F. セキュリティ統制（横断 / SEC-1〜6）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-F1 Action SHA Pinner | 全 Action を SHA pin（テンプレ踏襲） | SEC-1, BR-CI-SEC-1 |
| LC-F2 Least-Privilege Permissions | `contents: read` 既定・cross-repo 書込のみ最小トークン/App | SEC-2, BR-CI-SEC-2 |
| LC-F3 Fork-Secret Guard | fork PR は secrets job skip | SEC-4, BR-CI-SEC-3 |
| LC-F4 Dependency SCA | OSS 依存 lockfile pin＋脆弱性検査 | SEC-5 |
| LC-F5 Scope Isolation | CI 対象は当該 repo＋Core 参照のみ | SEC-6 |

## G. 適用判定（従来型基盤）
| 基盤要素 | 判定 | 根拠 |
|---|---|---|
| Message Queue / Cache / Circuit Breaker / Load Balancer / Database / Auth | **N/A** | CI ＝静的解析・描画・API 読取。実行時常駐サーバ無し |
| Build Cache（actions/cache） | **限定適用** | 依存復元の反復短縮のみ（PERF-3）。アプリ実行時 cache ではない |

## H. Unit 横断の責務分界
| 関心事 | U5 | 委譲先/参照元 |
|---|---|---|
| 三層定義（primitives/semantic/components）・`.fig-*`・registry/taxonomy 正典 | Lint/検査の判定基準として参照 | U1 Core DS |
| portal ビルド・version-matrix/showcase スキーマ・運用ビュー描画 | 収集器を build に組込み・契約充足 | U2 Portal |
| template ci.yml / register.yml 配線・init.mjs | スタブを `uses:` 実体参照へ差替え | U3 Template & Setup |
| migration-status.mjs / migration-manifest.json 生成 | 収集（読取）対象として集約 | U4 Migration |
| showcase-index 収集（CI-4） | 同一クローラ基盤を提供（実装は U6） | U6 Showcase |
