# Navigation Rail — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

デスクトップ・タブレット向けの**縦型ナビゲーション**。画面左端に固定し、3–7 項目のグローバル移動を担当する。Material Design 3 の Navigation Rail に準拠し、Admin プロファイルの中密度 UI に最適化。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | アイコン + 小ラベル | 幅 80px / 項目高 56px |
| Compact | アイコンのみ | 幅 56px / ホバーでツールチップ |
| With FAB | 最上部に Primary FAB を併設 | 主要 CTA を常時可視化 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `items` | RailItem[] | ✅ | — | `{ id, label, icon, href, current }` |
| `fab` | ReactNode | — | — | 最上部に表示する Primary FAB |
| `density` | `'standard'` \| `'compact'` | — | `'standard'` | ラベル表示有無 |

## FIGセンス（角丸とアイソレーション）

- Rail 全体角丸: `--radius-lg`（16px）
- 項目インジケータピル角丸: `999px`（完全な楕円）
- 余白: ピル padding `var(--space-1) var(--space-4)`
- アイソレーション: rail 自体に外側 `--space-3` の margin

## トークン参照

| 役割 | トークン |
|---|---|
| Rail 背景 | `--color-surface-default` |
| Rail ボーダー | `--color-border-subtle` |
| 項目（通常） | `--color-text-secondary` |
| 項目（現在） | `--color-text-brand` |
| インジケータピル背景 | `--color-surface-brand-soft` |
| FAB 背景 | `--color-surface-brand` |
| FAB シャドウ | `--surface-elevation-floating` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 文字色 secondary | — |
| hover | 背景 `--color-surface-subtle` | `--motion-hover` |
| current | インジケータピル + 文字色 brand | — |
| focus | `--a11y-focus-ring` 外側 | — |

Motion: ピルの背景は 160ms ease-out で fade-in。

## アクセシビリティ

- `<nav aria-label="メイン">` で識別
- 各項目は `<a>` または `<button>`
- 現在項目に `aria-current="page"`
- アイコン単独でも label を必須化（視覚以外でも識別可能に）
- キーボード: Tab で順次フォーカス。Arrow キーでの移動は実装任意（あれば望ましい）

## 使ってよい場面 / 使ってはいけない場面

✅ Admin プロファイル（PC・タブレット）の主要ナビゲーション
✅ 3–7 項目のフラットな移動が必要なとき
✅ Navigation Bar との二項対立（同一プロダクトで両方は使わない）

❌ Consumer / Terminal プロファイル — Navigation Bar を使う
❌ ナビ項目が 8 以上 — 階層化（Side Sheet 等）を検討
❌ 動的なフィルタや操作 — Side Sheet 内に置く

## レイアウト規約

- 幅: 80px 固定（Standard）/ 56px（Compact）
- 高さ: viewport 100%
- 位置: `position: sticky; top: 0; left: 0`
- 項目間 gap: `--space-2`
- z-index: `--z-rail`（Sidebar より低、Header より低）

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-navigation-rail.html`）
- Code Connect: 未対応
- 関連: Navigation Bar（モバイル等価形態）
