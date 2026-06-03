# Form Group — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**関連する入力をまとめる構造体**。ラベル・補助文・エラー文の表示規約を提供する。フォーム内の各フィールドの単位として機能し、ラベル粒度・エラー連携・補助情報の置き場所を一元化する。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Single | ラベル + 入力 + 補助/エラー | 標準 |
| Required | `*必須` バッジ付き | 必須項目 |
| Optional | `（任意）` 注記付き | 任意項目（必須が多いフォーム） |
| Inline | ラベルと入力が横並び | チェックボックス等の短い項目 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `label` | string | ✅ | — | フィールドラベル |
| `htmlFor` | string | ✅ | — | 紐付ける input の id |
| `required` | boolean | — | `false` | 必須バッジ |
| `optional` | boolean | — | `false` | 任意注記 |
| `help` | ReactNode | — | — | 補助説明文 |
| `error` | string | — | — | エラー文（存在時に error 表示） |
| `success` | string | — | — | 成功文（バリデーション通過） |
| `children` | ReactNode | ✅ | — | 入力要素（Text Field / Checkbox 等） |

## FIGセンス（角丸とアイソレーション）

- グループ間 gap: `--space-5`（垂直）
- ラベル ↔ 入力 gap: `--space-2`
- 入力 ↔ 補助/エラー文 gap: `--space-1`
- `<fieldset>` ボーダー: `--radius-md`（14px）角丸、padding `--space-4 --space-5`

## トークン参照

| 役割 | トークン |
|---|---|
| ラベル文字 | `--color-text-primary` |
| 必須バッジ | `--color-feedback-error-strong` |
| 任意注記 | `--color-text-muted` |
| 補助文 | `--color-text-muted` |
| エラー文 | `--color-feedback-error-strong` |
| 成功文 | `--color-feedback-success-strong` |
| Fieldset ボーダー | `--color-border-subtle` |
| Legend 文字 | `--color-text-primary` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| pristine | 通常表示 | — |
| invalid | 入力ボーダー赤 + error 文字 | `--motion-feedback` |
| valid | 入力ボーダー緑 + success 文字 | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

エラー文出現: 200ms fade-in（過剰アニメは認知負荷）

## アクセシビリティ

- **`<label for="...">`** で input と関連付け（最重要）
- 必須項目: `<input required>` + `aria-required="true"`
- 補助文: `<input aria-describedby="...-help">` で関連付け
- エラー時: `<input aria-invalid="true" aria-describedby="...-err">` で関連付け
- `<fieldset>` グループ化: `<legend>` でグループラベル
- エラーは入力直下に配置（読み上げで連続して伝わる）
- placeholder で label を代用しない（フォーカス時に消失する）

## 使ってよい場面 / 使ってはいけない場面

✅ あらゆるフォームのフィールド単位
✅ Save/Apply ボタンと組む入力
✅ バリデーション結果の表示が必要なとき

❌ 設定の即時反映 — Toggle Switch を使う（Form Group ではない）
❌ 単一の検索ボックス — ラベル省略OK（`aria-label` で代替）
❌ 無関係な複数項目の並列 — 個別の見出しで区切る

## レイアウト規約

- 1 グループの最大幅: 540–640px（読みやすさ）
- 縦並びフォーム: `flex-direction: column; gap: var(--space-5)`
- 2 列フォーム: `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4) var(--space-5)`
- レスポンシブ: 480px 以下で 2 列 → 1 列

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-form-group.html`）
- Code Connect: 未対応
- 関連: Text Field / Checkbox / Radio Button / Picker（すべて Form Group 内に置く）
