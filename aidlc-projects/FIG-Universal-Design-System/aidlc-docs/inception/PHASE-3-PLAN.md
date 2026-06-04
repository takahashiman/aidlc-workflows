# Phase 3: TextField — 実行計画書

**期間:** 1日  
**目標:** TextField（入力欄）を三層アーキテクチャで完全実装  
**成功条件:** Live Preview + React impl + Semantic tokens (100% coverage)

---

## TextField の仕様

### バリエーション

| 種別 | 用途 | Props |
|-----|------|-------|
| **Text Input** | テキスト入力（名前、メモ） | `type="text"` |
| **Search Input** | 検索専用 | `type="search"` |
| **Numeric Input** | 数値入力（金額、回数） | `type="number"` |
| **Password Input** | パスワード | `type="password"` |
| **Select Input** | 選択肢から選択 | `<select>` |

### Props（契約）

```typescript
type TextFieldProps = {
  type?: 'text' | 'search' | 'number' | 'password' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;                    // 必須。視覚的に表示
  placeholder?: string;             // 補助情報のみ
  hint?: string;                    // 入力下に表示される説明
  error?: string;                   // エラーメッセージ
  leadingIcon?: string;             // lucide アイコン
  trailingIcon?: string;            // lucide アイコン
  clearable?: boolean;              // 値があるとき Clear ボタン表示
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'search' | 'tel' | 'email';
  ariaInvalid?: boolean;
  showPassword?: boolean;           // password 型のみ
  onTogglePassword?: () => void;
};
```

### トークン参照

| 役割 | デフォルト | フォーカス | エラー | 無効 |
|-----|-----------|----------|--------|------|
| 背景 | `--color-surface-default` | 同 | 同 | `--color-surface-container-low` |
| ボーダー | `--color-border-default` (2px) | `--color-border-focus` | `--color-border-error` | `--color-border-default` (1px) |
| 文字色 | `--color-text-primary` | 同 | 同 | `--color-text-disabled` |
| Placeholder | `--color-text-disabled` | — | — | — |
| 角丸 | `--radius-input` (12px) | — | — | — |
| Padding | `var(--layout-control-padding-block) var(--layout-control-padding-inline)` | — | — | — |
| 高さ | `var(--interactive-input-height)` (48px) | — | — | — |
| Label タイポ | `--typography-label` | — | — | — |
| Hint タイポ | `--typography-caption` | — | — | — |
| Error タイポ | `--typography-caption` + `--color-text-error` | — | — | — |

---

## Day 1: 実装 + Live Preview 作成

### タスク 1.1: TextField.jsx を実装

**内容:**
- `extensions/busapp/components/TextField.jsx` を作成
- 5 バリエーション（Text, Search, Numeric, Password, Select）
- ラベル / ヒント / エラーメッセージ表示
- アイコン配置（Leading / Trailing）対応
- Clearable ボタン（値があるとき X アイコン表示）
- Password トグル（表示/非表示切り替え）

**チェックリスト:**
- ✓ `backgroundColor` は `var(--color-surface-*)` で指定
- ✓ `borderColor` は `var(--color-border-*)` で指定
- ✓ `borderRadius` は `var(--radius-input)` で指定
- ✓ フォーカス状態は `:focus` で outline ring を表示
- ✓ エラー状態は `aria-invalid` + `aria-describedby` で実装
- ✓ インラインスタイル最小化、すべて Semantic トークン参照

**アクセシビリティ:**
- ✓ `<label htmlFor={id}>` で label を関連付け
- ✓ `aria-required` + 視覚的に「*」表記
- ✓ `aria-invalid` + `aria-describedby` でエラー関連付け
- ✓ `aria-describedby` で hint を関連付け
- ✓ Password の表示トグルに `aria-pressed` を付与

### タスク 1.2: Live Preview HTML の作成

**内容:**
- `extensions/busapp/preview/textfield.html` を作成
- 5 バリエーション × 5 状態（Default, Focused, Filled, Error, Disabled）を視覚化
- Label / Hint / Error メッセージの表示確認
- Icon 配置（Leading / Trailing）の表示
- Clear ボタン / Password トグルの動作確認
- デバイスフレーム（iPhone SE 360px）でのレスポンス確認

**要件:**
- Semantic トークンのみ参照
- lucide アイコン CDN で読み込み
- フォーカス状態を CSS で再現（`:focus-visible`）
- エラー表示を明確に
- Password マスク表示の切り替え（`type="password"` ↔ `type="text"`）

---

## 完了の証拠（チェックリスト）

### コード品質

- [ ] TextField.jsx に直書き値（HEX, px, rgba）なし
- [ ] すべてのスタイル属性が `var(--color-*, --radius-*, --interactive-*, etc.)` で定義
- [ ] インラインスタイル最小化

### Live Preview

- [ ] `extensions/busapp/preview/textfield.html` が存在
- [ ] 5 バリエーション × 5 状態を視覚化
- [ ] Label / Hint / Error メッセージが正確に表示
- [ ] Clear ボタン / Password トグルが見えやすいか
- [ ] デバイス別（360px 以上）でレスポンス確認

### Semantic Tokens

- [ ] `extensions/busapp/tokens/semantic.css` に必要トークンが存在
- [ ] `semantic.json` に新規トークンを記録
- [ ] project-settings.json の `semanticTokens` セクションに記録

### アクセシビリティ

- [ ] `<label htmlFor={id}>` で label を関連付け
- [ ] `aria-required` + 視覚的に「*」表記
- [ ] `aria-invalid` + `aria-describedby` でエラー関連付け
- [ ] `aria-describedby` で hint を関連付け
- [ ] Password トグルに `aria-pressed` を付与

---

## 成功の定義

**「TextField をディレクトリ全体で複製して色を変更するだけで、新規ブランドの入力欄が完成する」状態を実現。**

つまり：
1. React JSX には「生値」の直書きがない
2. CSS は 100% Semantic トークン参照
3. Live Preview が「正解の見た目」を証明
4. 他プロジェクト複製時、色を変えるだけで自動反映される

→ **三層アーキテクチャの証明（Card, Button に続き 3 つ目）**

---

## Construction フェーズ完了後の状態

| コンポーネント | Phase | 状態 |
|-------------|-------|------|
| Card | Phase 1 | ✅ Complete |
| Button & FAB | Phase 2 | ✅ Complete |
| TextField | Phase 3 | 🔄 In Progress |

**Phase 4（Extensions 統合 + ポータル）:**
- assets/js/portal-content.js に自動登録スクリプト
- extensions/busapp を「流用テンプレート」として最終確認
- ポータル構築（後日）

---

## 参考トークン（必要な場合、semantic.css に追加）

```css
/* Input 関連（既存で確認） */
--interactive-input-height: 48px;
--radius-input: 12px;
--layout-control-padding-block: 12px;
--layout-control-padding-inline: 16px;

/* Label / Hint / Error（既存で確認） */
--typography-label: ...
--typography-caption: ...
--color-border-error: ...

/* Focus ring（既存で確認） */
--a11y-focus-ring: ...
--state-focused-outline: ...
```
