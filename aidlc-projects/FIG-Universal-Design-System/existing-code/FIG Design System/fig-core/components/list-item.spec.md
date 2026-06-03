# List Item — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。

## 目的

垂直スタックの **1 行** を表現する原子。サイドバー、設定画面、地域選択、停留所選択など全リスト UI の構成単位。

## バリエーション

| 種別 | 用途 |
|---|---|
| Navigation | タップで遷移（ChevronRight 付き）。サイドバー、設定 |
| Selection | ラジオ/チェックボックス的選択（地域選択、停留所選択） |
| Action | トリガー（ログアウト、リセット） |
| Info | タップ不可、情報表示のみ |

## Props（契約）

```ts
type ListItemProps = {
  icon?: LucideIconName;
  iconColor?: 'default' | 'brand' | 'muted' | 'strong';  // 既定 'default'
  label: string;                    // 必須
  description?: string;             // 二行目（補助情報）
  trailing?: ReactNode;             // バッジ / 値 / Switch など
  variant?: 'navigation' | 'selection' | 'action' | 'info';
  selected?: boolean;               // variant: 'selection' のとき有効
  destructive?: boolean;            // variant: 'action' で赤系に
  onClick?: (e) => void;
  disabled?: boolean;
  ariaLabel?: string;
};
```

## トークン参照

| 役割 | トークン |
|---|---|
| Padding | `var(--layout-list-gap-loose)` (12px) |
| 角丸 | `var(--radius-card-compact)` (12px — リスト密度向け) |
| 最小高さ | `var(--interactive-list-item-height)` (56px) ／ Touch target は `var(--a11y-touch-target)` (44px) 以上 |
| アイコンサイズ | `20px` lucide |
| アイコン色 (default) | `var(--color-icon-default)` |
| アイコン色 (brand) | `var(--color-icon-brand)` |
| アイコン色 (strong) | `var(--color-icon-strong)` |
| ラベルタイポ | `var(--typography-body-strong)` |
| 補助タイポ | `var(--typography-caption)` + `color: var(--color-text-muted)` |
| Trailing アイコン | `var(--color-icon-muted)` (ChevronRight) |
| gap (icon ↔ label) | `var(--space-3)` (12px) |
| gap (trailing) | `var(--space-2)` (8px) |
| hover 背景 | `var(--color-surface-container-low)` |
| selected 背景 | `var(--color-surface-brand-subtle)` |
| destructive 文字 | `var(--color-text-error)` |

## 状態

| 状態 | 振る舞い |
|---|---|
| hover | bg fade to container-low、`var(--motion-hover)` |
| pressed | `scale(0.99)` |
| focused | `outline: var(--a11y-focus-ring)` |
| selected | bg brand-subtle、選択アイコン (Check) を trailing |
| disabled | opacity 0.40 |

## ルール

- **必ず `<button>` か `<a>` で実装**。`<div onClick>` は禁止（キーボード操作とスクリーンリーダー対応のため）。
- **trailing に複雑な UI を入れない**。Badge / 値テキスト / Switch / ChevronRight 程度まで。フォームや入力は別行に分離。
- **descripton は最大 1 行 + 省略記号**。スクロール / 改行を増やすなら別画面に逃がす。
- **同じリスト内で `variant` を混在させない**。Selection リストに Action 行を混ぜないこと。
- **左 icon を省略する場合、すべての行で揃える**（揃いと不揃いが混在すると左端が不安定になる）。

## アクセシビリティ

- `<button type="button">` または `<a href>`。
- `variant="selection"` 時は `role="option"` + `aria-selected`、親コンテナに `role="listbox"`。
- destructive アクションは `aria-label` で操作の影響を明示（例: 「ログアウトする」）。
- `disabled` は `aria-disabled="true"` を併記。

## 実装現況

`<SidebarRow>` がほぼ Navigation バリエーション。色とタイポはハードコード。本仕様準拠の `<ListItem>` への抽象化 + 4 variants 統合が次タスク。
