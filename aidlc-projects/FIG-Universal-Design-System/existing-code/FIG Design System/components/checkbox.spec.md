# Checkbox — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**複数選択可能な独立した選択肢**。確定操作（Save / Apply）と組で用いる。Toggle Switch とは異なり即時反映ではない。フォーム内・テーブル選択・規約同意などに使う。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | 20×20px、ラベル付き | 標準 |
| Indeterminate | 不確定状態（親子グループの一部選択） | `aria-checked="mixed"` |
| Without Label | 単独配置（テーブル選択列等） | `aria-label` 必須 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `checked` | boolean \| 'indeterminate' | ✅ | — | 状態 |
| `onChange` | (checked) => void | ✅ | — | 変更ハンドラ |
| `label` | string | — | — | チェックボックス右側のラベル |
| `disabled` | boolean | — | `false` | 無効 |
| `required` | boolean | — | `false` | 必須項目（規約同意等） |

## FIGセンス（角丸とアイソレーション）

- 箱角丸: `--radius-sm`（6px）
- サイズ: 20×20px、ボーダー 2px
- チェックマーク: lucide `check` を 14×14、白
- 不確定マーク: 10×2px の白横棒

## トークン参照

| 役割 | トークン |
|---|---|
| 箱ボーダー（未選択） | `--color-border-strong` |
| 箱背景（選択中） | `--color-surface-brand` |
| 箱ボーダー（選択中） | `--color-surface-brand` |
| チェックマーク | `#fff` |
| Focus ring | `--a11y-focus-ring` |
| ラベル文字 | `--color-text-primary` |
| Disabled | `--state-disabled-opacity` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| unchecked | ボーダーのみ | — |
| checked | brand 塗り + ✓ | `--motion-toggle` |
| indeterminate | brand 塗り + 横棒 | — |
| hover | ボーダー色強調 | `--motion-hover` |
| focus | `--a11y-focus-ring` | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

## アクセシビリティ

- **ネイティブ `<input type="checkbox">` 推奨**（カスタム要素より a11y 良好）
- 不確定状態: JS で `input.indeterminate = true` を設定（属性では制御不可）
- `aria-checked="mixed"` も補助的に付与
- Space キーでトグル
- 親子グループ: 親 checkbox は子の状態に応じて `indeterminate` 自動切替
- ラベル必須（`<label>` で囲むか、`aria-label`）

## 使ってよい場面 / 使ってはいけない場面

✅ フォーム内の複数選択（趣味の選択、配信オプション等）
✅ テーブルの行選択（全選択 + 個別選択）
✅ 規約同意（必須・任意の両方）

❌ 即時反映の二値設定 — Toggle Switch を使う
❌ 排他選択 — Radio Button を使う
❌ 単一の必須選択 — チェックではなく明示的な操作（Button）を

## レイアウト規約

- 配置: `display: inline-flex; align-items: center; gap: var(--space-3)`
- 縦並びリスト: `flex-direction: column; gap: var(--space-2)`
- 親子グループ: 子は親より `padding-left: var(--space-6)` でインデント
- タッチ領域: `<label>` 全体で 36×36 以上（Consumer）、48×48 以上（Terminal）

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-checkbox.html`）
- Code Connect: 未対応
- 関連: Toggle Switch / Radio Button / Segmented Button
