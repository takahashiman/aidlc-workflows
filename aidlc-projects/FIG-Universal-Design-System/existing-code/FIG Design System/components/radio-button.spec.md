# Radio Button — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**排他的な選択肢から 1 つを選ぶ**。2–5 個程度の選択肢で、ユーザーが各選択肢を一覧して比較したい場面に使う。それ以上は Select / Picker / Segmented Button を検討。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | 円形ラジオ + ラベル | 標準 |
| Card | 説明文付きのカード型 | プラン選択等、リッチな比較が必要なとき |
| Inline | 横並び | 2–3 個の短いラベル |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `name` | string | ✅ | — | グループ識別子（同一 name で排他） |
| `value` | string | ✅ | — | この選択肢の値 |
| `checked` | boolean | ✅ | — | 選択状態 |
| `onChange` | (value) => void | ✅ | — | 変更ハンドラ |
| `label` | string | ✅ | — | 表示ラベル |
| `disabled` | boolean | — | `false` | 無効 |

## FIGセンス（角丸とアイソレーション）

- 外円: 20×20px、ボーダー 2px
- 内円: 10×10px、完全な円
- カード型: 外側 `--radius-lg`（14px）、内 padding `--space-4`

## トークン参照

| 役割 | トークン |
|---|---|
| 外円ボーダー（未選択） | `--color-border-strong` |
| 外円ボーダー（選択中） | `--color-surface-brand` |
| 内円塗り | `--color-surface-brand` |
| ラベル文字 | `--color-text-primary` |
| カード（選択中）背景 | `--color-surface-brand-soft` |
| カード（選択中）ボーダー | `--color-surface-brand` |
| Focus ring | `--a11y-focus-ring` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| unselected | 外円のみ | — |
| selected | 内円フェードイン | `--motion-toggle` |
| hover | 外円ボーダー色強調 | `--motion-hover` |
| focus | `--a11y-focus-ring` | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

## アクセシビリティ

- **ネイティブ `<input type="radio">` + 同一 `name` 必須**
- グループ全体を `<fieldset>` で囲み、`<legend>` でグループラベルを提示
- 個別ラベルは `<label>` で関連付け
- Arrow キーで選択移動（同一グループ内）
- Tab はグループ単位（次のグループへ）
- カード型: `<label>` 全体をクリック領域にする

## 使ってよい場面 / 使ってはいけない場面

✅ 2–5 個の排他選択（支払い方法、配送オプション）
✅ プラン選択（カード型）
✅ 各選択肢を比較表示したいとき

❌ 6 個以上 — Select / Picker
❌ 複数選択可能 — Checkbox
❌ 即時反映の二値 — Toggle Switch
❌ 並列で頻繁に切り替える表示モード — Segmented Button

## レイアウト規約

- 縦並びリスト（標準）: `flex-direction: column; gap: var(--space-2)`
- 横並び: `flex-direction: row; gap: var(--space-4)`
- カード型: 各カード間 `gap: var(--space-3)`
- タッチ領域: 標準 36×36 以上、Terminal は 48×48 以上

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-radio-button.html`）
- Code Connect: 未対応
- 関連: Checkbox / Toggle Switch / Segmented Button
