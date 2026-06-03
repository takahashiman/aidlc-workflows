# Date / Time Picker — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**日付・時刻の選択 UI**。直接入力（キーボード）とポップオーバー（カレンダー / ドラム）の併用が原則。和暦/西暦の切替、過去日付の制限、最小/最大値の制約を扱う。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Date Picker | 日付選択（年月日） | カレンダーグリッド |
| Time Picker | 時刻選択 | 数字ドラム / 直接入力 |
| Date Range | 期間選択（開始–終了） | カレンダーで2回タップ |
| Native | ブラウザネイティブ `<input type="date">` | OS/ブラウザ依存だが a11y 良好 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `value` | Date \| null | ✅ | — | 選択値 |
| `onChange` | (date) => void | ✅ | — | 変更ハンドラ |
| `min` / `max` | Date | — | — | 選択可能範囲 |
| `disablePast` / `disableFuture` | boolean | — | `false` | 過去/未来禁止 |
| `format` | `'gregorian'` \| `'japanese'` | — | `'gregorian'` | 暦選択 |

## FIGセンス（角丸とアイソレーション）

- フィールド角丸: `--radius-md`（12px）
- カレンダーセル角丸: `--radius-sm`（8px）
- セル: 36×36px、Range 中間はラジカル角丸なし
- 時刻ドラム角丸: `--radius-md`（10px）

## トークン参照

| 役割 | トークン |
|---|---|
| フィールド背景 | `--color-surface-default` |
| フィールドボーダー | `--color-border-subtle` |
| カレンダー背景 | `--color-surface-default` |
| 選択日 | `--color-surface-brand` 塗り + 白文字 |
| Range 中間 | `--color-surface-brand-soft` |
| 今日 | `--color-text-brand` 太字 |
| 範囲外 | `--color-text-tertiary` |
| Focus ring | `--a11y-focus-ring` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| closed | フィールドのみ | — |
| opening | カレンダー pop-in 200ms | `--motion-enter` |
| open | カレンダー表示 | — |
| selecting | セル hover で背景 subtle | `--motion-hover` |
| focus (セル) | `--a11y-focus-ring` | — |

## アクセシビリティ

- フィールドに `role="combobox"` + `aria-haspopup="dialog"` + `aria-expanded`
- カレンダーは `role="dialog"` + `aria-label="日付選択"`
- **キーボードのみで全選択操作可能**:
  - Arrow キー: 1 日移動
  - Home / End: 週の頭・末
  - PageUp / PageDown: 1 ヶ月移動
  - Shift + PageUp/Down: 1 年移動
- 直接入力欄も併設、フォーマット例（YYYY-MM-DD）を placeholder で示す
- 和暦/西暦切替は `<input type="radio">` の radiogroup で実装

## 使ってよい場面 / 使ってはいけない場面

✅ 日付・時刻が確定的に必要なフォーム（予約、生年月日、有効期限）
✅ 過去/未来日付の制限が必要なとき
✅ Date Range の指定（旅程、レポート期間）

❌ 「今すぐ / 後で」のような大雑把な時刻 — Segmented Button や Radio
❌ 範囲指定なしのフリーテキスト — Text Field で十分
❌ 日付の表示のみ — `<time>` 要素で十分

## レイアウト規約

- フィールド高さ: 48px
- カレンダー幅: 320px、padding `--space-4`
- カレンダーグリッド: `grid-template-columns: repeat(7, 1fr)`
- 時刻ドラム: 縦 3 段（時 / : / 分）、各列幅 56px

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-picker.html`）
- Code Connect: 未対応
- 関連: Text Field（直接入力フォールバック）
