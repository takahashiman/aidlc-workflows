# FIG Sense — Overview Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。

## 目的

**FIG デザインシステムの「センス」を可視化する総覧ページ**。個別コンポーネントの spec ではなく、デザインシステム全体に通底する**美意識・規約・トーン**を一枚で見せるショーケース。

## このページが伝えるもの

| 観点 | 何を見せるか |
|---|---|
| 角丸 | コンポーネント間で連続的に設計された radius スケール |
| アイソレーション | 余白・影・境界線で要素間距離を保つルール |
| 最小サイズ | タッチターゲット・読み上げ可能性の下限 |
| カラー意味論 | brand / feedback / surface の用途別配色 |
| タイポグラフィ | 和文の禁則・行間・ウェイトの設計判断 |

## 他コンポーネント spec との関係

FIG Sense は**個別仕様の集約ではなく、設計哲学の表現**。本ページに記載される規約は、すべて他の spec ファイル（button, card, input ...）で具体化される。

- 個別コンポーネントの利用方法 → 各 `*.spec.md` を参照
- トークン定義 → `primitives.css` / `semantic.css`
- 設計理念 → `design-system.md`

## 主要セクション（プレビュー HTML より）

| セクション | 内容 |
|---|---|
| Radii Scale | xs / sm / md / lg / xl / cta / pill の段階表示 |
| Isolation | 余白とエレベーションの組み合わせ例 |
| Min Sizes | 48×48 / 56×56 タッチターゲットの可視化 |
| Surface Layers | canvas → surface → container の階層 |
| Brand Sense | 色・形・トーンの統合 |

## アクセシビリティ

- すべての構成部品は WCAG AA + 日本語禁則を満たすトークン経由で実装
- ショーケース要素は装飾的なため、各部品の意味は隣接テキストで補足
- 色のみで意味を伝えない（形・テキストの併用）

## 使ってよい場面 / 使ってはいけない場面

✅ 新規参加者のオンボーディング — まずここを見て「センス」を掴む
✅ プロダクト固有判断時の参照点（例: 角丸サイズを迷ったとき）
✅ デザイナーと開発者の共通言語の確認

❌ 個別コンポーネントの実装ガイドとして使う — 各 spec を参照
❌ トークン値の正典として参照する — `primitives.css` / `semantic.css` が正典

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-fig-sense.html`）
- Code Connect: 該当しない（個別コンポーネントではないため）
- 関連: `design-system.md`（設計理念）/ `accessibility-guidelines.md`（a11y 規約）
