# NFR Design Patterns — U2-3 スタイル適用

> NRD3-*（NFR-Req）を実現する設計パターン。確定（FDQ1-4 / NQ1=B/NQ2=A/NQ3=A）に基づく。従来型インフラは N/A。
> U2-2 の配布/ブリッジ基盤（P1〜P7）を**前提**として活用し、U2-3 固有のパターンを追加。

## SP1 — Theme-mapped Status Utilities（状態色のユーティリティ写像）
- **解決**: NRD3-REL-2 / A11Y-1 / TSD3-1（FDQ1=A）。
- **方式**: `--color-success/-warning/-danger`（＋`-foreground`）を Tailwind `@theme`（bridge 連鎖）に定義し、値は Core `var(--status-*-surface)`/`-on` を参照。`bg-success`/`text-success-foreground` 等のユーティリティが Core 由来色で生成される。
- **写像**: onTime→success / delayRisk・delayed→warning / suspended→danger / passed→neutral(muted)（5→3＋neutral・BR-STYLE-2）。
- **効果**: 既存 className 記法（StatusBadge 等）を保ちつつ色源だけ Core へ。新規クラス命名を増やさない。AA は Core が保証。

## SP2 — Mechanical Brand-token Substitution（teal の機械置換）
- **解決**: NRD3-REL-2/3 / TSD3-2（FDQ2=A）。
- **方式**: `[#2C6B5E]` arbitrary を `primary` ユーティリティへ機械置換（`text-/bg-/border-/ring-`、opacity modifier `/10`・`/20` は Tailwind v4 color-mix で維持）。`--primary`=signature は U2-2 bridge が解決。
- **範囲**: JSX 構造不変・className のトークンのみ変更（破壊的変更なし）。
- **効果**: signature 変更が一元伝播。主要導線のブランド色が Core signature に統一。

## SP3 — Scoped Raw-hex Guard（スコープ付き生 HEX ガード）
- **解決**: NRD3-MNT-1/2/3 / TSD3-3（NQ2=A）。
- **方式**: 主要導線パスに限定して `#RRGGBB`／`[#...]` arbitrary を CI 検出し **fail**。周辺画面（Profile/Settings/Onboarding）は対象外で緑を維持。既存三層 lint（U2-1/U2-2 lint-rules）と整合し、U2-2 持越「三層 Lint 接続」を本ユニットで完了。
- **効果**: 主要導線の生 HEX 0 を PR 時点で恒常保証（再混入阻止）。残債は段階拡大で対処。

## SP4 — Baseline Screenshot VRT（ベースライン・スクショ VRT）
- **解決**: NRD3-VRT-1〜4 / REL-2 / TSD3-4（NQ1=B）。
- **方式**: 主要導線のスクリーンショット VRT を導入。after をベースラインとして固定（repo 管理）、CI でベースライン差分を検出。意図的更新時はベースライン再承認。既定 tool=Playwright（ゼロ SaaS）。
- **補完関係**: 自己ビジュアルチェックリスト＋before↔after diff（BR-STYLE-8）を**置換せず補完**（ハイブリッド）。
- **範囲**: FDQ3=A の主要導線のみ（周辺画面は対象外）。
- **効果**: 状態色 semantic 化・teal 置換・旧 tokens 撤去による予期せぬ視覚回帰を機械検出。

## SP5 — Safe Legacy Removal（旧 DS の安全撤去）
- **解決**: NRD3-REL-4 / TSD3-5（FDQ4=A・BR-STYLE-7）。
- **方式**: 旧 `src/styles/tokens/{primitives,semantic}.css` を削除し `index.css` 参照を除去（U2-2 で Core へ委譲済＝段階無効化の完了）。
- **ガード**: 撤去後 `vite build` 成功＋主要画面 VRT/自己ビジュアル非回帰を必須（SP4/SP1 で担保）。
- **効果**: 二重定義の解消・単一情報源（Core）化。

## SP6 — No-budget Performance Monitoring（無予算・監視のみ）
- **解決**: NRD3-PERF-1/2（NQ3=A）。
- **方式**: 厳密予算なし。`vite build` の CSS/JS gzip サイズを before↔after で記録。旧 tokens 撤去で CSS は減方向。明確な劣化時のみ予算化再検討。

## SP7 — Color-independent Severity（非色の深刻度区別）
- **解決**: NRD3-A11Y-2（BR-STYLE-3）。
- **方式**: delayRisk と delayed はともに warning。深刻度差は**文言・アイコン**（statusConfigs）で表現し、色のみに依存しない。
- **効果**: 色覚特性に依存しない情報伝達・色の意味の普遍性を保持。

## パターン × NFR マトリクス
| NFR | 充足パターン |
|---|---|
| 状態色 semantic（REL-2/A11Y-1） | SP1・SP7 |
| 生 HEX 0（MNT-1/2/3） | SP2・SP3 |
| 非回帰検証（REL-1/2・VRT-1〜4） | SP4・SP1・SP5 |
| 旧 DS 撤去（REL-4） | SP5 |
| 性能（PERF） | SP6 |
| Security（SEC） | （U2-2 P1/P6 継承＋SP5 削除のみ） |
| a11y（A11Y-1/2） | SP1・SP7 |

## U2-2 継承パターン（前提）
- P1 Pinned Submodule Distribution / P2 Build-time Deterministic Generation / P3 Declarative Token Bridge / P6 Supply-surface Security / P7 Inherited Accessibility は U2-2 で確立済。U2-3 はこれらの上で SP1〜SP7 を適用。

## 従来型基盤（N/A）
- Queue / Cache / Circuit Breaker / Load Balancer / DB / オートスケール / ランタイム監視・retry/failover：**いずれも N/A**（ビルド時生成・静的 CSS 配布・ランタイム/サーバ無し）。
