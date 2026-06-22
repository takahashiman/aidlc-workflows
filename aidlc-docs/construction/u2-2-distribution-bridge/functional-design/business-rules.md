# Business Rules — U2-2 配布・ブリッジ

> 配布・signature 生成・ブリッジ対応の正典。確定回答（FDQ1-5）に基づく。

## 配布（C-Distrib・US-D1 / AC①-4）

### BR-DIST-1 — submodule pin（Q5=A）
- Core DS は **git submodule** として製品に取り込み、**SemVer タグに pin** する（rolling 禁止＝製品は固定版）。
- 配置: 製品内 `vendor/core`（lint ignore 対象＝`**/vendor/**`）。

### BR-DIST-2 — 版の二重宣言・整合
- 製品ルート `CORE-DS-VERSION` に pin タグを明記し、**submodule の実 ref と一致**すること（不一致は CI 失敗）。

### BR-DIST-3 — Core CSS の取り込みは Vite 経由
- Core の `primitives/semantic/tokens/*.css` を Vite で import 解決。**`vite build` 非回帰**（成功＋既存画面が壊れない）が完了条件。

### BR-DIST-4 — 前提（Core 可用性）
- pin には Core が **push 済み＋タグ発行済み**であること（U2-1 の要ユーザー操作）。未充足ならローカル path submodule で暫定検証可だが、正式 pin はタグ後。

## signature 生成（C-Signature・FDQ1=A / FDQ4=A）

### BR-SIG-1 — seed は #2C6B5E（単一宣言）
- 製品メインカラー seed = **`#2C6B5E`**（旧 teal）。`gen:palette --seed=#2C6B5E` を**ビルド時に実行**して signature/status トークンを得る（U2-1 C-Palette）。
- 旧 DS の手動派生（`teal-*` 等）は生成トークンで**置換**。

### BR-SIG-2 — 生成物は gitignore（ビルド成果）
- 生成 CSS（`src/styles/generated/{signature,status}.css`＋`-aaa`）は**コミットしない**（毎ビルド再生成・決定性は U2-1 が保証）。
- 利点: Core 生成法則の更新に自動追従。再現性は seed＋pin タグ＋決定的生成で担保。

### BR-SIG-3 — a11y は生成側で保証
- AA は U2-1 生成器が保証（補正限界で生成失敗＝ビルド失敗）。製品は AA 済みトークンを消費するだけ。

## ブリッジ（C-Bridge・US-D5 / FDQ2=B）

### BR-BRIDGE-1 — 専用 CSS 1枚・宣言的（AD1=A）
- ブリッジは**製品内 1 ファイル** `src/styles/figuds-bridge.css`。ランタイムメソッド無し（純 CSS の `@theme`/変数対応表）。

### BR-BRIDGE-2 — 対応範囲＝中核＋面/線（FDQ2=B）
| shadcn 変数 | 対応先（Core） |
|---|---|
| `--primary` / `--primary-foreground` | `--signature-base` / `--signature-on` |
| `--destructive` / `--destructive-foreground` | `--status-danger` / `--status-danger-on` |
| `--background` / `--foreground` | Core surface/text semantic（base） |
| `--card` / `--popover`（＋-foreground） | Core surface（raised）/text semantic |
| `--border` / `--input` / `--ring` | Core border semantic / signature |
| `--secondary` / `--accent` / `--muted`（＋-foreground） | **据え置き（FDQ2=B 範囲外）** |
| `--sidebar-*` / `--chart-*` | **据え置き** |
> success/warning 系は U2-3（状態色 semantic 化）で本格対応。U2-2 は danger を含む中核＋面/線まで。

### BR-BRIDGE-3 — 読込順は後勝ち
- ブリッジは Core 読込後・既存 `theme.css` より**後**に読み込み、@theme 変数を Core 値へ上書き。

### BR-BRIDGE-4 — 既存構造を壊さない（Q3 既存=A / 非回帰）
- shadcn/Radix コンポーネントや JSX は**書き換えない**。変数の指す先のみ Core へ。`vite build` 成功＋画面非回帰が不変条件。

## 旧内蔵 DS（FDQ3=A）

### BR-LEGACY-1 — 委譲して段階的に無効化
- `src/styles/tokens/{primitives,semantic}.css` は Core 由来へ委譲（ブリッジ経由）。**即削除しない**。
- 生 HEX 直書き（baseline 379）の解消・旧 tokens 撤去は **U2-3** のスコープ。

## プロファイル（US-D6・FDQ5=A）

### BR-PROFILE-1 — Consumer プロファイルはルートクラス適用
- ルート要素に **`.fig-profile-consumer`** を付与し Core `tokens/profile-consumer.css` を import。端末2種（Mobile-Terminal）は将来。

## ドキュメント

### BR-DOC-1 — シナリオ別方針を journal へ（US-D5 AC）
- 「既存=A / 新規=B」のシナリオ別ブリッジ方針を `dev-flow-journal.md` に明記（U2-2 Code Gen 時）。

## トレーサビリティ
- AC①-4=BR-DIST-1/2/3。NFR2-3 非回帰=BR-BRIDGE-4。US-D5=BR-BRIDGE-*。US-D6=BR-PROFILE-1。U2-1 連携=BR-SIG-*。
