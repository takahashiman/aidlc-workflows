# Pagination — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

リスト・テーブルの**分割ナビゲーション**。データ量が多いときに 1 ページに収まる範囲で表示し、前後または番号ジャンプで遷移する。Infinite Scroll の代替として、データ量を俯瞰しやすい場面で使う。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | 番号 + 前後 + 省略 | 5–10 ページ以上のとき |
| With Summary | 「全 X 件中 Y–Z 件」併設 | データテーブル向け |
| Simple | 「N / M」のみ | モバイル向け |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `current` | number | ✅ | — | 現在ページ（1 始まり） |
| `total` | number | ✅ | — | 総ページ数 |
| `onChange` | (page) => void | ✅ | — | ページ変更ハンドラ |
| `siblingCount` | number | — | `1` | 現在ページの前後に出す数 |
| `showSummary` | boolean | — | `false` | サマリ文表示 |
| `variant` | `'standard'` \| `'simple'` | — | `'standard'` | 表示形態 |

## FIGセンス（角丸とアイソレーション）

- ボタン角丸: `--radius-md`（10px）
- ボタンサイズ: 40×40px 標準、36×36px コンパクト
- 余白: ボタン間 gap `--space-1`
- 区切り (`…`): `--color-text-tertiary`

## トークン参照

| 役割 | トークン |
|---|---|
| ボタン背景（通常） | `transparent` |
| ボタン背景（hover） | `--color-surface-subtle` |
| ボタン背景（current） | `--color-surface-brand` |
| ボタン文字（通常） | `--color-text-secondary` |
| ボタン文字（current） | `--color-text-onBrand` |
| サマリ文字 | `--color-text-secondary` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 透明背景 | — |
| hover | `--color-surface-subtle` | `--motion-hover` |
| current | `--color-surface-brand` + 白文字 | — |
| disabled | `opacity: 0.4` + `cursor: not-allowed` | `--state-disabled-opacity` |
| focus | `--a11y-focus-ring` | — |

## アクセシビリティ

- `<nav aria-label="ページ送り">` で識別
- 各ページボタンに `aria-label="N ページ目"`（番号だけだと意味不明瞭）
- 現在ページに `aria-current="page"`
- 前/次ボタンに `aria-label="前のページ" / "次のページ"`
- 無効時は `disabled` 属性 + `aria-disabled="true"` 併記
- 省略 (`…`) は `<span>` で実装、`aria-hidden="true"`

## 使ってよい場面 / 使ってはいけない場面

✅ Admin の管理テーブル
✅ データ量が予測しにくいとき（総ページ数が読みたいとき）
✅ 検索結果一覧

❌ Consumer / Terminal の主動線 — Infinite Scroll または「もっと見る」を検討
❌ 5 ページ以下の少量データ — 全件表示で十分
❌ チャットや時系列タイムライン — Infinite Scroll が適切

## レイアウト規約

- 高さ: 40px（ボタン高）
- 配置: テーブル下部、`justify-content: flex-end` または `space-between`（サマリ併設時）
- レスポンシブ: 狭幅で `flex-wrap: wrap`、ボタン縮小（36px）

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-pagination.html`）
- Code Connect: 未対応
- 関連: Table（直接的に連携するパターン）
