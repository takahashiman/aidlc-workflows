# Functional Design Plan — U2-2 配布・ブリッジ（Part 1）

> 対象 Unit: U2-2（BusDelayAlerts repo・branch `feature/figuds-adoption`）。
> component: C-Distrib / C-Bridge / C-Signature。ストーリー: US-D1（submodule×Vite）/ US-D5（@theme ブリッジ）/ US-D6（Consumer プロファイル）。
> 確定済: Q5=A（submodule＋pin＋CORE-DS-VERSION 標準）/ AD1=A（専用ブリッジ CSS 1枚）/ Q3 既存=A（shadcn/Radix を壊さず Core へ寄せる）。
> `[Answer]:` 記入後に Part 2 を生成。推奨案に **(推奨)**。

## 回答確定（2026-06-21）
- **FDQ1=A**: ビルド時に `gen:palette --seed=#2C6B5E` 実行・生成物は gitignore（Infra 既定）。
- **FDQ2=B**: ブリッジは中核（signature/status）＋ surface/border/foreground まで Core semantic へ寄せる。
- **FDQ3=A**: 旧内蔵 DS は Core へ委譲し段階的無効化（生 HEX 解消は U2-3）。
- **FDQ4=A**: signature(seed #2C6B5E) を `--primary` 系へ（旧 teal 直書き 203 の置換先・`#030213` を置換）。
- **FDQ5=A**: ルート要素に `.fig-profile-consumer` ＋ Core `tokens/profile-consumer.css` import。

## 現状（BusDelayAlerts・実測）
- ビルド/スタイル: **Vite + Tailwind v4（CSS-first・config 無し）**。`postcss.config.mjs`。
- スタイル入口: `src/styles/index.css` → `@import fonts/tailwind/theme`。
- 既存トークン: `src/styles/theme.css`（**shadcn 系** `--primary:#030213` / `--destructive:#d4183d` / `--background` …＋`@custom-variant dark`）。
- 旧内蔵 DS: `src/styles/tokens/{primitives,semantic}.css`（FIG-UDS と同型三層・レガシー）。
- ブランド主色: 旧 teal **`#2C6B5E`**（生 HEX 直書き 203 箇所＝最頻）＝C-Signature の seed。

## 依存・前提（U2-1 連携）
- C-Signature は U2-1 の C-Palette（Core `tools/palette-gen`）を `--seed=#2C6B5E` で利用し signature/status トークンを得る。
- **前提（要ユーザー操作・Infra/Code Gen で必須）**: Core を submodule で pin するには Core が **push 済み＋SemVer タグ**である必要。現状 Core(U2-1) はローカル sibling・未コミット。

## 生成する成果物（Part 2）
- [ ] `construction/u2-2-distribution-bridge/functional-design/business-logic-model.md`（配布→生成→ブリッジ→描画フロー）
- [ ] `construction/u2-2-distribution-bridge/functional-design/business-rules.md`（BR-DIST-*/BR-BRIDGE-*/BR-SIG-*）
- [ ] `construction/u2-2-distribution-bridge/functional-design/frontend-components.md`（ブリッジ層・プロファイル適用＝スタイル構造）

---

## 質問（Part 1）

## Question FDQ1 — 生成トークン（signature/status）の取り込み方式
製品は U2-1 生成トークンをどう得ますか？

A) **ビルド時に Core submodule の `gen:palette --seed=#2C6B5E` を実行し、生成 CSS を import（生成物は gitignore）(推奨)** — Infra 設計の既定。常に Core 最新法則で再生成。製品ビルドに Node 実行が必要。

B) **生成済み CSS を製品 repo にコミットして import** — diff レビュー容易・決定性最大・製品ビルドは純 CSS。Core 更新時は再生成コミットが要る（CI drift 検査で担保）。

[Answer]: A

## Question FDQ2 — ブリッジの対応付け範囲（shadcn `@theme` をどこまで Core へ寄せるか）
専用ブリッジ CSS 1枚（AD1=A）で、どこまで Core semantic に対応づけますか？

A) **中核のみ（signature→`--primary`系 / status→`--destructive` 等の状態色）、他の既存値は据え置き (推奨)** — 非回帰最優先。最小の対応表でブランド色を Core 由来へ。

B) **状態色＋surface/border/foreground まで拡張** — 見た目の Core 寄せを進める。回帰リスク中。

C) **全 shadcn トークンを全面ブリッジ** — 網羅的だが回帰リスク高。

[Answer]: B

## Question FDQ3 — 旧内蔵 DS（`src/styles/tokens/{primitives,semantic}.css`）の扱い
レガシー三層トークンをどうしますか？

A) **ブリッジで Core 由来へ委譲し、旧 tokens は段階的に無効化（生 HEX 解消は U2-3）(推奨)** — 非回帰を保ちつつ正典を Core へ。

B) **即削除して Core で完全置換** — クリーンだが回帰リスク高。

C) **据え置き（U2-2 では触らない）** — ブリッジのみ追加。

[Answer]: A

## Question FDQ4 — signature（seed `#2C6B5E`）の適用先
ブランド主色 signature をどのトークンへ対応づけますか？

A) **signature を Tailwind `--primary` 系へ対応（旧 teal 直書き 203 箇所の置換先）(推奨)** — RE 上、teal がブランド主色。既存 `--primary:#030213` は signature へ置換。

B) **既存 `--primary`(#030213) を主に保ち、signature は別アクセント** — 現行の黒主色を維持。

[Answer]: A

## Question FDQ5 — Mobile-Consumer プロファイルの適用方法（US-D6）
`.fig-profile-consumer` をどう適用しますか？

A) **ルート要素に `.fig-profile-consumer` クラス付与＋Core `tokens/profile-consumer.css` を import (推奨)** — Core 既定の適用法・端末2種（Terminal）は将来。

B) **プロファイル CSS をブリッジ内に取り込み `:root` 既定化** — クラス不要だが切替不可。

[Answer]: A
