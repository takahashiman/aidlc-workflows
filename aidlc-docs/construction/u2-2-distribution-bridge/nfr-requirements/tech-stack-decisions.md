# Tech Stack Decisions — U2-2 配布・ブリッジ

> 製品（BusDelayAlerts）側の技術選定。Core 側 U2-1 の決定（OKLCH ゼロ依存生成）を前提に消費する。

## TSD-1 — ビルド/スタイル基盤は現行踏襲（Vite + Tailwind v4）
- 製品は **Vite + Tailwind v4（CSS-first・config 無し）** を維持。`postcss.config.mjs` 既存。
- 新フレームワーク導入なし（非回帰最優先）。

## TSD-2 — Core 配布は git submodule × pin タグ（Q5=A）
- Core を **submodule** で `vendor/core` に取り込み、**`v1.2.0` に pin**。`CORE-DS-VERSION` に同タグを明記。
- Core CSS（`primitives/semantic/tokens/*.css`）は Vite の `@import` で解決。
- 前提充足: Core `v1.2.0` 発行済（origin/core 4f3aab1）。

## TSD-3 — signature/status はビルド時生成（FDQ1=A）
- `vendor/core/tools/palette-gen/generate.mjs --seed=#2C6B5E` を **prebuild フック**で実行。
- 出力 `src/styles/generated/{signature,status}.css`（＋`-aaa`）は **gitignore**（毎ビルド再生成・決定的）。
- 利点: Core 生成法則の更新に自動追従。再現性＝seed＋pin タグ＋決定性で担保。

## TSD-4 — ブリッジは宣言的 CSS 1 枚（AD1=A / FDQ2=B）
- `src/styles/figuds-bridge.css`＝Core semantic → shadcn `@theme` 変数の静的対応表（ランタイム JS 無し）。
- 範囲＝中核（signature/status）＋面/線（background/foreground/card/popover/border/input/ring）。
- 読込順は Core の後・既存 theme.css の後（後勝ち上書き）。

## TSD-5 — Tailwind v4 × 三層の共存（Q3 既存=A の具体）
- Tailwind の `@theme`/CSS 変数を Core semantic で**指し替える**方式（ユーティリティ生成は維持）。
- 既存 shadcn コンポーネント/JSX は不変＝変数の参照先だけ Core 由来へ。
- 旧内蔵 DS `tokens/{primitives,semantic}.css` はブリッジ経由で委譲し**段階的に無効化**（撤去は U2-3）。

## TSD-6 — プロファイル（FDQ5=A）
- ルート要素に `.fig-profile-consumer` ＋ Core `tokens/profile-consumer.css` import。

## TSD-7 — テスト/検証（NQ1=A・PBT=No）
- 非回帰＝`vite build` 成功＋自己ビジュアルチェックリスト。既存自動テストがあれば併用。
- VRT は U2-2 では導入しない（Core VRT は U5）。

## TSD-8 — Security（NQ3=A）
- submodule pin 整合の CI 検査・Core 依存ゼロ確認・秘密非保持。製品既存依存の SCA は対象外。

## 決定サマリ
| 項目 | 決定 |
|---|---|
| 基盤 | Vite + Tailwind v4 踏襲 |
| 配布 | submodule × pin `v1.2.0`＋CORE-DS-VERSION |
| 生成 | ビルド時 `gen:palette --seed=#2C6B5E`・出力 gitignore |
| ブリッジ | 宣言的 CSS 1 枚・中核＋面/線 |
| 旧DS | 委譲→段階無効化（撤去 U2-3） |
| プロファイル | `.fig-profile-consumer` |
| 検証 | build＋自己ビジュアル（VRT なし） |
| Security | 供給面のみ enforce |
