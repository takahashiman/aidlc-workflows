# Input — Component Spec

> 🛡️ 先に [`../design-system.md`](../design-system.md) / [`../component-contract.md`](../component-contract.md) / [`../accessibility-guidelines.md`](../accessibility-guidelines.md) を読むこと。

## 目的

ユーザーからの**テキスト・数値・選択値の入力**を受け付ける。
公共交通 UI では「停留所検索」「経路検索」「定期券の名前入力」など、**短く明確な入力**に限定する。複雑なフォームは別画面に分解する。

## バリエーション

| 種別 | 用途 |
|---|---|
| **Text Input** | 1 行のテキスト入力（名前、メモ） |
| **Search Input** | 検索専用、`type="search"` + 検索アイコン + Clear ボタン |
| **Numeric Input** | 数値入力（金額、回数）。等幅数字 (`--font-numeric`) |
| **Select Input** | 候補から 1 つ選択。タップで Bottom Sheet を開くパターン推奨 |
| **Stop Selector** | 停留所選択専用（既存 `<StopSelectInput>`）。ボタン的に振る舞い、Bottom Sheet を開く |
| **Password Input** | パスワード（マスク + 表示トグル） |
| **Date / Time Input** | ネイティブ `<input type="date|time">` を尊重 |

## Props（契約）

```ts
type InputProps = {
  type?: 'text' | 'search' | 'number' | 'password' | 'email' | 'tel' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  label: string;                 // 必須。aria-labelledby または <label> として描画
  placeholder?: string;          // 補助、label の代替にしない
  hint?: string;                 // 入力下に表示される説明
  error?: string;                // エラー時のメッセージ。aria-describedby
  leadingIcon?: LucideIconName;
  trailingIcon?: LucideIconName;
  clearable?: boolean;           // 値があるとき Clear ボタン表示
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;         // ブラウザ補完を活用
  inputMode?: 'text' | 'numeric' | 'decimal' | 'search' | 'tel' | 'email';
  maxLength?: number;
  ariaInvalid?: boolean;
};
```

**禁止事項：**
- `placeholder` だけで `label` を省略する（フォーカス時に消える＝アクセシブルでない）
- `disabled` ではなく opacity だけで非活性化する（フォーカス可能なまま）
- IME 入力中（compositionstart〜end）にフィルタを発火させる

## トークン参照

| 役割 | デフォルト | フォーカス | エラー | 無効 |
|---|---|---|---|---|
| 背景 | `var(--color-surface-default)` | 同 | 同 | `var(--color-surface-container-low)` |
| ボーダー | `var(--color-border-default)` | `var(--color-border-focus)` | `var(--color-feedback-error-strong)` | `var(--color-border-default)` |
| ボーダー幅 | 2px | 2px | 2px | 1px |
| 文字色 | `var(--color-text-on-surface)` | 同 | 同 | `var(--color-text-disabled)` |
| Placeholder | `var(--color-text-disabled)` | — | — | — |
| 角丸 | `var(--radius-input)` (12px — FIGセンス: 情報密度を保つ中庸) | — | — | — |
| Padding | `var(--layout-control-padding-block) var(--layout-control-padding-inline)` (12px / 20px) | — | — | — |
| 高さ | `var(--interactive-input-height)` (48px) | — | — | — |
| タイポ | `var(--typography-body-strong)` | — | — | — |
| Label タイポ | `var(--typography-label)` + `letter-spacing: var(--tracking-wide)` | — | — | — |
| Hint タイポ | `var(--typography-caption)` + `color: var(--color-text-muted)` | — | — | — |
| Error タイポ | `var(--typography-caption)` + `color: var(--color-feedback-error-strong)` | — | — | — |
| Icon サイズ | 20×20 px | — | — | — |
| Numeric Input フォント | `var(--font-numeric)` + `font-variant-numeric: tabular-nums` | — | — | — |

## 状態と Motion

| 状態 | 振る舞い | トークン |
|---|---|---|
| default | 標準 | — |
| focused | ボーダー色変化 + outline ring | `var(--motion-focus)` (120ms / standard) |
| filled | 値あり、Clear ボタン表示 | — |
| invalid (aria-invalid) | ボーダー赤、Error メッセージ表示 | `var(--motion-enter)` でエラー出現 |
| disabled | bg 暗化、cursor not-allowed | — |
| read-only | bg 暗化、cursor default、フォーカス可能 | — |
| loading（async バリデーション） | trailingIcon が spinner | `aria-busy="true"` |

**Clear ボタン**：値があるとき trailingIcon を `X` に置換。タップで `onChange('')`、フォーカスを input に戻す。

## アクセシビリティ

- **`<label htmlFor={id}>`** 必須。`placeholder` は補助情報のみ。
- **`aria-required="true"`** + 視覚的にも「*」または「必須」表記
- **`aria-invalid="true"`** + `aria-describedby={errorId}` でエラーメッセージを関連付け
- **`aria-describedby={hintId}`** で hint を関連付け
- **`inputMode`** で OS の正しいキーボード呼び出し（numeric → テンキー、tel → 数字キー、email → @キー）
- **`autoComplete`** を活用（`given-name`, `postal-code`, `tel` 等）
- **IME 配慮**：日本語入力中（`compositionstart`〜`compositionend`）はフィルタ・確定処理を抑制
- **エラー時の SR 通知**：`aria-live="polite"` でメッセージ更新時に読み上げ
- **フォーカスリング**：`var(--a11y-focus-ring)` を outline で描画（境界線とは別）
- **Touch target**：高さ 48px、Clear ボタンは 44×44 hit area 確保

## ルール

- **`label` は必ず視覚的に存在させる**。`aria-label` だけで済ませない（視覚ユーザーも label を見たい）
- **エラーメッセージは具体的に**：「無効な入力」ではなく「数字のみ入力してください」
- **`maxLength` を視覚的に表示**しない（文字数カウンタは別ロール）。文字数表示が必要なら別途明示。
- **Numeric Input は必ず `inputMode="numeric"`** + `pattern="[0-9]*"` で OS テンキー召喚
- **Search Input は `type="search"`**（OS の Search Affordance を活用）
- **Password の表示トグル**は必須（パスワード入力ミスを防ぐ）。`aria-pressed` で状態通知。
- **Stop Selector のような「フィールド型ボタン」は `<button>` で実装**し、`role="combobox"` or `aria-haspopup="listbox"` を付与

## 使ってよい場面 / 使ってはいけない場面

✅ 停留所名検索
✅ 定期券の名前入力
✅ 4 桁の認証コード入力
❌ 長文の入力（コメント、レビュー）→ `<textarea>` を別仕様で
❌ 複数項目を 1 つの input で処理する（カンマ区切り入力等）

## 実装現況

`<StopSelectInput>` のみ実装（field-as-button パターン）。汎用 Text Input / Search Input / Numeric Input は未抽象化。次の追加実装候補。
