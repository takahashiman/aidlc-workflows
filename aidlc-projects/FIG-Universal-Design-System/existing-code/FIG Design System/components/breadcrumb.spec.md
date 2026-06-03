# Breadcrumb — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**階層構造内の現在地と上位への経路**を提示する。深い階層のあるアプリケーション（管理画面・カタログ）で迷子を防ぎ、上位への戻りを 1 アクションで実現する。3 階層以上から効果が出る。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | 全階層を表示 | 3–5 階層 |
| Truncated | 中間を `…` で省略 | 6 階層以上 |
| Mobile（戻るリンクのみ） | 現在地 + 一つ上のみ | 狭幅向け代替 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `items` | CrumbItem[] | ✅ | — | `{ label, href }`、最終要素は現在地（href 省略） |
| `homeIcon` | boolean | — | `true` | 最初の要素にホームアイコンを付与 |
| `maxItems` | number | — | `5` | これを超えると中間を省略 |
| `separator` | ReactNode | — | `›` | カスタム区切り |

## FIGセンス（角丸とアイソレーション）

- リンク要素の hover 背景: `--radius-sm`（6px）角丸
- 区切り文字 (`›`): `--color-text-tertiary`、装飾的
- 全体: 横並び flex、 wrap 許容

## トークン参照

| 役割 | トークン |
|---|---|
| リンク（通常） | `--color-text-secondary` |
| リンク（hover） | `--color-text-primary` + `--color-surface-subtle` |
| 現在地 | `--color-text-primary`、`--fw-semibold` |
| 区切り | `--color-text-tertiary` |
| フォントサイズ | `--text-sm` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 文字色 secondary | — |
| hover | 文字色 primary + 背景 subtle | `--motion-hover` |
| focus | `--a11y-focus-ring` | — |
| current | 太字 + 文字色 primary（リンクではなく span） | — |

## アクセシビリティ

- `<nav aria-label="現在地">` で識別
- 最終要素（現在地）に `aria-current="page"`
- 中間省略 (`…`) は `<button aria-label="中間階層を展開">` で実装、クリックで展開可能に
- セパレータ (`›`) は `aria-hidden="true"`（読み上げ対象外）
- リンクは適切な `href` を持つ `<a>` で実装、`<div onClick>` 禁止

## 使ってよい場面 / 使ってはいけない場面

✅ 管理画面の深い階層構造（路線管理 > 路線詳細 > 編集 等）
✅ ファイル/カタログのドリルダウン
✅ Admin プロファイル（PC・タブレット）

❌ Terminal プロファイル — 画面狭く誤タップリスク
❌ 階層が 2 以下 — 不要
❌ Consumer の主要動線 — 戻るボタンや Tab で十分

## レイアウト規約

- 高さ: 約 32–40px（リンク要素 padding 含む）
- 区切り間 gap: `--space-2`
- リンク padding: `var(--space-1) var(--space-2)`
- ページタイトルの上に配置（h1 の直前）
- `flex-wrap: wrap` で長い経路でも折り返し対応

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-breadcrumb.html`）
- Code Connect: 未対応
- 関連: Tabs（同階層の切替）
