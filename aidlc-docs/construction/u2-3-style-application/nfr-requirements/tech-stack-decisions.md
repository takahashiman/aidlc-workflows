# Tech Stack Decisions — U2-3 スタイル適用

> 対象: BusDelayAlerts（`feature/figuds-adoption`）。U2-2 の技術選定（Vite+Tailwind v4・submodule pin・bridge）を踏襲し、U2-3 固有の選定を追記。

## 踏襲（U2-2 から不変）
- **ビルド/スタイル**: Vite + Tailwind v4（CSS-first・`@theme`）。
- **配布**: `vendor/core` submodule（pin タグ **v1.2.1**）＋`CORE-DS-VERSION`。ビルド時 `gen:tokens`（生成物 gitignore）。
- **ブリッジ**: `figuds-bridge.css` 1 枚（shadcn→Core 宣言的写像・後勝ち）。`.fig-profile-consumer` ルートプロファイル。

## U2-3 固有の選定

### TSD3-1 — 状態色は Tailwind `@theme` ユーティリティ（FDQ1=A）
- **決定**: `--color-success/-warning/-danger`（＋`-foreground`）を `@theme`（bridge 連鎖）に定義し、値は Core `var(--status-*-surface)` / `var(--status-*-on)` を参照。`bg-success`/`text-success-foreground` 等のユーティリティを Core 由来色で生成。
- **理由**: Tailwind v4 のユーティリティ生成機構に乗ることで、StatusBadge 等の既存クラス記法を維持しつつ色源だけ Core へ寄せられる。新規 CSS クラス命名を増やさない。

### TSD3-2 — teal は `primary` ユーティリティへ機械置換（FDQ2=A）
- **決定**: `[#2C6B5E]` arbitrary を `primary` ユーティリティへ置換（opacity modifier は Tailwind v4 の color-mix で維持）。`--primary`=signature は bridge で解決。
- **理由**: JSX 構造不変・className のトークンのみ変更で破壊的変更を避ける。signature 変更が一元伝播。

### TSD3-3 — 生 HEX ガード = スコープ付き lint/CI（NQ2=A）
- **決定**: 主要導線パスに限定した生 HEX（`#RRGGBB`）・arbitrary（`[#...]`）検出を CI で **fail** 化。既存三層 lint（U2-1/U2-2 lint-rules）と整合し、U2-2 持越の「三層 Lint 接続」を本ユニットで完了。
- **理由**: 周辺画面に残債がある状態で全画面ガードは赤になる（raw hex 多数）。スコープ限定で主要導線の 0 を恒常保証しつつ緑を保ち、段階拡大できる。
- **実装方針（Code Gen で確定）**: 対象ファイル glob を絞った検出（既存 lint スクリプト or 軽量 grep ベース CI step）。具体は Infrastructure Design で結線。

### TSD3-4 — VRT = Playwright スクリーンショット（既定推奨・NQ1=B）
- **決定（既定推奨）**: 主要導線のスクリーンショット VRT を **Playwright**（`@playwright/test` の `toHaveScreenshot`）で導入。after をベースライン commit、CI で差分検出。外部 SaaS（Chromatic 等）非依存。
- **理由**: Vite/React と親和・ゼロ SaaS・ベースライン画像を repo 管理可能。U2-2 の「ゼロ依存/供給面最小」方針と整合。Storybook 依存を新設しない。
- **代替**: Storybook + Chromatic（SaaS・運用容易だが外部依存増）。本サイクルは見送り。
- **未確定（NFR Design/Infra で確定）**: 対象画面リスト・ビューポート・しきい値・ベースライン更新フロー・CI 実行（headless ブラウザ導入コスト）。

### TSD3-5 — 旧内蔵 DS 撤去（FDQ4=A）
- **決定**: `src/styles/tokens/{primitives,semantic}.css` を削除し `index.css` の参照を除去（U2-2 で Core へ委譲済）。
- **理由**: 二重定義の解消・単一情報源（Core）化。撤去後 build 成功・主要画面非回帰を必須（NRD3-REL-4）。

## 性能/監視（NQ3=A）
- 厳密予算なし。`vite build` 出力の CSS/JS gzip サイズを before↔after で記録（U2-2 と同様の記録粒度）。

## N/A
- ランタイム/サーバ/スケール関連の技術選定は対象外（静的・ビルド時）。
