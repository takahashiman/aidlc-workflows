# IconBubble — Component Spec

> 🛡️ 先に [`../design-system.md`](../design-system.md) / [`../component-contract.md`](../component-contract.md) / [`../accessibility-guidelines.md`](../accessibility-guidelines.md) を読むこと。

## 目的

アイコンを**色付き円形バブルで包み、意味のカテゴリを視覚化する**装飾的アイコンコンテナ。
List Item の leading slot、IconBubble + Title の組み合わせ（バス路線カード等）、Empty State の中央配置などに使う。

**重要：** IconBubble は **インタラクティブではない**（タップしない）。装飾 + 意味付け専用。
タップさせたい場合は親要素（ListItem 等）が `<button>` で包む。

## バリエーション

| 種別 | 用途 |
|---|---|
| **Standard** | デフォルト。色 palette は brand / accent / muted / success / warning / error / blue / amber 等 |
| **Compact** | リスト密集時の小型 (32×32) |
| **Hero** | Empty State / Onboarding の大型 (72×72) |
| **Avatar** | ユーザー or 路線番号入りバージョン |

## Props（契約）

```ts
type IconBubbleProps = {
  icon: LucideIconName;
  color?: 'brand' | 'accent' | 'muted' | 'success' | 'warning' | 'error' | 'blue' | 'amber' | 'teal' | 'emerald' | 'slate';  // 既定 'brand'
  size?: 'compact' | 'standard' | 'hero';  // 既定 'standard'
  ariaHidden?: boolean;  // 既定 true（装飾扱い）
  ariaLabel?: string;    // ariaHidden=false のときに必須
};
```

**禁止事項：**
- `onClick` を渡さない（インタラクティブにしない、親が包む）
- 任意の HEX 色を直接指定させない（必ず `color` palette から選ぶ）
- icon に絵文字を使わない（lucide のみ）

## トークン参照

| 役割 | Compact | Standard | Hero |
|---|---|---|---|
| 外枠サイズ | 32×32 | 40×40 | 72×72 |
| Icon サイズ | 16 | 20 | 36 |
| Padding | `var(--space-2)` | `var(--space-2-5)` (10px) | `var(--space-4)` |
| 角丸 | `var(--radius-icon-tile)` (12px) — rounded square。完全円は使わない | `var(--radius-icon-tile)` | `var(--radius-card)` (16px — Hero 専用) |

| color | bg トークン | fg トークン |
|---|---|---|
| brand | `var(--color-surface-brand-subtle)` | `var(--color-icon-brand)` |
| accent | `var(--color-surface-accent-subtle)` | `var(--color-icon-accent)` |
| muted | `var(--color-surface-container)` | `var(--color-icon-default)` |
| success | `var(--color-status-onTime-bg)` | `var(--color-status-onTime-fg)` |
| warning | `var(--color-status-delayRisk-bg)` | `var(--color-status-delayRisk-fg)` |
| error | `var(--color-feedback-error-subtle)` | `var(--color-feedback-error-strong)` |
| blue | `--color-surface-blue-subtle` | `--color-icon-blue` |
| amber | `--color-surface-amber-subtle` | `--color-icon-amber` |
| teal | `var(--color-surface-brand-subtle)` | `var(--color-icon-brand)` (brand のエイリアス) |
| emerald | `var(--color-surface-emerald-subtle)` | `var(--color-icon-emerald)` |
| slate | `var(--color-surface-container)` | `var(--color-icon-strong)` |

## 状態と Motion

| 状態 | 振る舞い |
|---|---|
| default | 静的、アニメーションなし |
| parent hover | （親 ListItem の hover に従う、IconBubble 単独では反応しない） |
| parent disabled | `opacity: var(--state-disabled-opacity)` |

**ルール：** IconBubble 自体は **絶対にモーションを持たない**。親要素の motion に追従するのみ。

## アクセシビリティ

- **既定で `aria-hidden="true"`**（装飾扱い、SR で読み上げない）
- 親要素（ListItem の `aria-label` など）が IconBubble の意味を含めて表現する
- 例外的に意味を読み上げたい場合（情報の主たる表現が IconBubble の場合）：
  - `ariaHidden={false}` + `ariaLabel="バス停"` を渡す
  - ただし**集約パターン**を優先する（親で読み上げを統合）

- **コントラスト**：bg / fg ペアは Semantic 層で 3.0:1 以上を保証（非テキスト UI 基準）
- **色覚多様性**：色だけで情報の意味を分けない（アイコン形状が第二チャンネル）

## ルール

- **色は palette から選ぶ**。任意 HEX 禁止。
- **同一画面で 4 種類以上の color を混ぜない**（視覚ノイズ）
- **アイコンと色の組み合わせに意味的整合性を持たせる**：
  - `Bus` icon + `blue` color → 「バス全般」のメタファ
  - `MapPin` icon + `error` color → 違和感（red は警告色）
  - 用途と色のミスマッチを避ける
- **Hero variant は 1 画面 1 つまで**（Empty State の中央など）

## 使ってよい場面 / 使ってはいけない場面

✅ List Item の leading（停留所アイコン、設定項目アイコン）
✅ Card の Title の左横（路線カードの先頭）
✅ Empty State の中央（大型）
❌ ボタンとして使う → `<IconButton>` を使う
❌ Status Pill の中に入れる → 直接 lucide アイコンを使う
❌ 同じ画面で 10 個以上並べる → アイコン羅列は視覚ノイズ、デザインを見直す

## 実装現況

`<IconBubble>` 実装済み（`BusappComponents.jsx`）。color palette はハードコード、token への移行が必要。サイズバリアント（compact / standard / hero）は未抽象化、`padding` を props で渡す現実装をリファクタ予定。
