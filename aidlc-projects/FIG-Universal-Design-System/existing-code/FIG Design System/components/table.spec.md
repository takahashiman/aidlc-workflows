# Table — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**構造化データの一覧表示**。複数列にわたる比較可能なデータ（運行路線・利用履歴・分析結果等）を表形式で提示する。ソート・絞り込み・ページネーションと組み合わせる。Admin プロファイル向けの中核コンポーネント。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | ソート + 行 hover | 主用途 |
| Selectable | チェックボックス列で選択 | バルク操作 |
| Sortable | カラム ソート | `aria-sort` 使用 |
| Striped | 偶奇行で背景差 | 高密度時の視線誘導 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `columns` | Column[] | ✅ | — | `{ key, label, sortable?, scope: 'col' }` |
| `rows` | Row[] | ✅ | — | 表データ |
| `sortBy` | string | — | — | 現在のソート列 |
| `sortDir` | `'asc'` \| `'desc'` | — | `'asc'` | ソート方向 |
| `onSort` | (key, dir) => void | — | — | ソートハンドラ |
| `selectable` | boolean | — | `false` | 選択列を出す |

## FIGセンス（角丸とアイソレーション）

- 外側角丸: `--radius-lg`（16px）
- セル padding: `var(--space-3) var(--space-5)`
- ヘッダ高さ: 約 44–48px
- 行高さ: 44–52px

## トークン参照

| 役割 | トークン |
|---|---|
| ヘッダ背景 | `--color-surface-subtle` |
| ヘッダ文字 | `--color-text-muted` |
| 行背景（通常） | `--color-surface-default` |
| 行背景（hover） | `--color-surface-subtle` |
| セル区切り | `--color-border-subtle` |
| 数値セル | `--color-text-primary`、`text-align: right` |
| Status pill | カラム内に Status Pill コンポーネント |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 標準 | — |
| row hover | 背景 `--color-surface-subtle` | `--motion-hover` |
| row selected | 背景 `--color-surface-brand-soft` | — |
| sort active | ヘッダに矢印アイコン | — |
| loading | スケルトン行を表示 | — |

## アクセシビリティ

- `<th scope="col">` 必須（列ヘッダ）、`<th scope="row">` で行ヘッダ
- ソート可能列の `<th>` に `aria-sort="ascending" | "descending" | "none"`
- ソートボタンを `<th>` 内に `<button>` で配置、`aria-label="路線名で並べ替え"`
- 選択列のチェックボックスに `aria-label="N行目を選択"`（または列ヘッダ「全選択」）
- レスポンシブ: 狭幅で **`overflow-x: auto` ラッパー**を使い横スクロール許容、`aria-label` で示唆
- Terminal: Table の使用を避ける（List + 詳細 / Card グリッドへ）

## 使ってよい場面 / 使ってはいけない場面

✅ Admin の管理画面（路線一覧、利用履歴、レポート）
✅ ソート・絞り込みが必要な比較データ
✅ 5 列以上の構造化情報

❌ Consumer / Terminal の主動線 — List / Card で代替
❌ 単一エンティティの詳細表示 — Definition List（dl/dt/dd）
❌ レイアウト目的 — `<div>` の Grid を使う

## レイアウト規約

- 親コンテナ: `overflow-x: auto` で横スクロール許容
- 最小幅: `min-width: 640px`（崩れ防止）
- ツールバー（検索 + 絞り込み + 新規追加）: テーブル上部に配置
- ページネーション: テーブル下部
- レスポンシブ: 狭幅で toolbar / footer を縦並びに

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-table.html`）
- Code Connect: 未対応
- 関連: Pagination / Status Pill / Checkbox（テーブル内で使用）
