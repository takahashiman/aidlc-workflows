# Card — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。

## 目的

関連する情報を 1 つの面にまとめる**コンテナ**。リストの要素単位、または独立した情報の塊（路線情報、ステータス、定期券）を表現する。

## バリエーション

| 種別 | 用途 | Elevation |
|---|---|---|
| Default | 標準の白カード | `card` (elevation.1) |
| Interactive | クリック可能なカード（リスト要素など） | `card` → hover で `raised` |
| Floating | FAB 的に浮いた情報カード | `floating` (elevation.3) |
| Hero | 定期券カードなど、ブランドティント影を持つ大型 | `modal` (elevation.4) + ブランドティント |

## Props（契約）

```ts
type CardProps = {
  children: ReactNode;
  variant?: 'default' | 'interactive' | 'floating' | 'hero';  // 既定 'default'
  onClick?: (e) => void;       // interactive 時のみ意味を持つ
  ariaLabel?: string;
  padding?: 'sm' | 'md' | 'lg';  // 既定 'md'
  as?: 'div' | 'article' | 'section' | 'button';  // 意味的マークアップ
};
```

## FIGセンス（角丸の中庸とアイソレーション）

- **Default は `--radius-card`（16px）に統一**。FIGブランドの「慈愛のやわらかさ」を表現する中庸値。従来の 12px はカードとしては鋭く、20px 以上は冗長になる。
- **Hero は `--radius-card-hero`（28px）**。定期券・ヒーローカードなど「所有感のあるカード」専用ロール。日常の Default と差をつけることでブランドの最上位面を演出する。
- **密集レイアウトは `--radius-card-compact`（12px）**。リスト密度が高い場面でのみ許容（例外ロール）。
- **ブランド要素を含む Hero / 主要カードは周辺に `--isolation-around` の余白を確保**。

## トークン参照

| 役割 | Default | Hero |
|---|---|---|
| 背景 | `var(--color-surface-default)` | `var(--color-surface-brand-vivid)` |
| ボーダー | `1px solid var(--color-border-card)` | `1px solid rgba(255,255,255,0.15)` |
| 角丸 | `var(--radius-card)` (16px) | `var(--radius-card-hero)` (28px) |
| 影 | `var(--surface-elevation-card)` | `var(--surface-elevation-modal)` (ブランドティント) |
| Padding sm | `var(--layout-card-padding-compact)` (12px) | — |
| Padding md | `var(--layout-card-padding)` (16px) | — |
| Padding lg | `var(--layout-card-padding-loose)` (24px) | `var(--layout-card-padding-loose)` (24px) |
| 周辺アイソレーション (Hero) | — | `margin: var(--isolation-around)` |

## 状態

| 状態 | 振る舞い |
|---|---|
| hover (interactive のみ) | elevation.1 → elevation.2、`var(--motion-hover)` |
| pressed (interactive のみ) | `scale(0.99)` + `var(--motion-press)` |
| focused (interactive のみ) | `outline: var(--a11y-focus-ring)` |

## ルール

- **ネストは 3 段まで**。`default` → `container-low` → `container` で停止。`container-high` を 4 段目に使わない。
- **同一カード内で elevation を 2 段以上ジャンプしない**。
- **interactive 以外に `onClick` を渡さない**。クリックできるカードは見た目で示唆する（hover 反応 + cursor: pointer）。
- **角丸を独自に変えない**。`var(--radius-*)` のラダーから選ぶ。
- **ティント済みサーフェス（brand / warning / error）の上に Card を重ねない**（影が活かせず視覚ノイズになる）。

## アクセシビリティ

- 全体がクリック可能な場合、`as="button"` または `<a>` で包む。`<div onClick>` は禁止。
- カード内のクリック要素（ボタン・リンク）は `e.stopPropagation()` で外側のクリックと分離。

## 実装現況

`<Card>` は実装済み（`BusappComponents.jsx`）。Hero variant は定期券カード内に直書き済みのため、本仕様準拠へリファクタが必要。
