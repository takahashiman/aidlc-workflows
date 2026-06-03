# Tab — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。

## 目的

**並列で排他的なビュー**を切り替えるためのコントロール。バスアプリでは「運行情報 / 乗車・決済」の 2 タブが該当。3 タブ以上の場合は再検討（情報量の見直し）。

## バリエーション

| 種別 | 用途 |
|---|---|
| Segmented | 標準のセグメント型。本プロジェクトの主要パターン |
| Underline | 大量データの上に置くスクロール型（未実装） |
| Two-tone | アクティブ状態でブランド色背景に切り替える強調型（決済タブ等） |

## Props（契約）

```ts
type TabsProps = {
  tabs: Array<{
    value: string;
    label: string;
    icon?: LucideIconName;
    badge?: number;           // 通知数表示
    disabled?: boolean;
  }>;
  active: string;
  onChange: (value: string) => void;
  twoTone?: boolean;          // true: アクティブセグメントをブランド色で塗る
  ariaLabel: string;          // タブグループの説明（必須）
};
```

## トークン参照

| 役割 | トークン |
|---|---|
| コンテナ背景 | `var(--color-surface-container-high)` + opacity 50% (`--opacity-50`) |
| コンテナボーダー | `1px solid var(--color-border-default)` + opacity 50% |
| コンテナ角丸 | `var(--radius-card)` (16px) |
| コンテナ Padding | `var(--space-1-5)` (6px) |
| backdrop-filter | `blur(6px)` |
| セグメント角丸 | `var(--radius-card-compact)` (12px) |
| セグメント Padding | `var(--space-3) var(--space-2)` |
| アクティブ背景 (standard) | `var(--color-surface-default)` |
| アクティブ背景 (two-tone) | `var(--color-surface-brand)` |
| アクティブ文字 (standard) | `var(--color-text-brand)` |
| アクティブ文字 (two-tone) | `var(--color-text-onBrand)` |
| 非アクティブ文字 | `var(--color-text-muted)` |
| アクティブ影 | `var(--surface-elevation-card)` |
| 非アクティブ scale | `0.95` |
| アイコン | `24px` lucide |
| タイポ active | `var(--typography-label)` (700) |
| タイポ inactive | `var(--typography-label)` (weight: medium で上書き) |
| 切替モーション | `var(--motion-tab-switch)` |

## 状態

| 状態 | 振る舞い |
|---|---|
| active | フル opacity、scale 1、影あり |
| inactive | scale 0.95、影なし、文字 muted |
| disabled | opacity 0.40、pointer-events: none |
| focused | `outline: var(--a11y-focus-ring)` （セグメント単位） |
| hover (inactive) | オーバーレイ `var(--state-hover-overlay)` |

## ルール

- **3 タブ以上を作らない**。本プロジェクトのモバイル幅 (768px max) では破綻する。3 つ以上が必要ならドロワーかボトムシートを検討。
- **タブのコンテンツが空にならない**。各タブには必ずデフォルトコンテンツがあること（空ビューはタブ機能で表現しない）。
- **`twoTone` は決済 / 課金など「金銭の責任ある操作」のみ**。装飾的に使わない。
- **アクティブセグメントの scale を変える運動は `--motion-tab-switch`** で統一。

## アクセシビリティ

- `role="tablist"` をコンテナに、`role="tab"` を各セグメントに付与。
- `aria-selected="true|false"`、`aria-controls={panelId}`、対応する panel に `role="tabpanel"`。
- キーボード操作: `←` / `→` でフォーカス移動、`Home` / `End` で端へジャンプ、`Enter` / `Space` でアクティブ化。
- タップ可能領域は 44×44 以上。

## 実装現況

`<SegmentedTabs>` 実装済み（`BusappComponents.jsx`）。色は生 HEX、`role` / `aria-*` 属性なし、キーボード対応なし。本仕様準拠への refactor が必要。
