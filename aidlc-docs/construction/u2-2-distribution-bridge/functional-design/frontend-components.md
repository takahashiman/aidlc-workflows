# Frontend Components — U2-2 配布・ブリッジ

> U2-2 は新規 UI を作らず、**既存 shadcn/Radix を Core トークンで描画させるスタイル構造**を扱う。
> ここでは「コンポーネント」＝スタイル層の構造単位（CSS）として記述する。

## 構造単位

### FE-Distrib — Core 取り込み（vendor/core）
- **物理**: 製品内 `vendor/core`（submodule・pin タグ）。
- **責務**: Core CSS（primitives/semantic/signature/status/profile）を Vite 解決可能にする。
- **入口**: `src/styles/index.css` から `@import` 連鎖（読込順は business-logic-model 参照）。

### FE-Generated — 生成トークン（src/styles/generated/）
- **物理**: `src/styles/generated/{signature,status}.css`（＋`-aaa`）。**gitignore**。
- **生成**: ビルド前に `gen:palette --seed=#2C6B5E`（C-Signature）。
- **責務**: 製品固有 signature/status（Taste 派生）を CSS 変数として供給。

### FE-Bridge — ブリッジ層（figuds-bridge.css）
- **物理**: `src/styles/figuds-bridge.css`（**1 枚**・AD1=A）。
- **責務**: Core semantic → shadcn `@theme` 変数の静的対応（BR-BRIDGE-2 の表）。最後に読み込み後勝ちで上書き。
- **形式**: 宣言的 CSS のみ（`:root { --primary: var(--signature-base); … }`）。ランタイム JS 無し。
- **スコープ（FDQ2=B）**: 中核（`--primary`/`--destructive`）＋面/線（`--background`/`--foreground`/`--card`/`--popover`/`--border`/`--input`/`--ring`）。`--secondary`/`--accent`/`--muted`/`--sidebar-*`/`--chart-*` は据え置き。

### FE-Profile — プロファイル適用
- **物理**: ルート要素（`<html>`/`<body>` または app ルート）に `class="fig-profile-consumer"`。
- **責務**: Mobile-Consumer のトークン上書きを有効化（Core `tokens/profile-consumer.css`）。

## 非回帰の観点（自己検証チェックリスト・S2=C）
- [ ] `vite build` 成功（CI／ローカル）。
- [ ] 主要画面（ホーム/到達カード/遅延バナー/通知）が崩れず描画。
- [ ] ブランド主色が teal（Core signature 由来）で反映され、旧 `#030213` 主色が置換されている。
- [ ] danger（エラー/運休系）が Core status 由来に。
- [ ] `.fig-profile-consumer` のトークン上書きが効く。
- [ ] before(`feature/home-redesign`) ↔ after(`feature/figuds-adoption`) の diff で差分が説明可能。

## 依存
- C-Palette（U2-1・Core）/ Core CSS（submodule）。生 HEX 解消・状態色 semantic 化は U2-3。
