# Status Pill — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本コンポーネントは交通ドメインの **「運行状態」を表す配色契約** を持つ。

## 目的

バス便の**現在の運行状態**を一目で伝える。リスト要素や詳細画面で、利用者が「今乗れるか・遅れているか」を判断する最短経路。

## バリエーション（状態）

| status | ラベル例 | 配色トークン |
|---|---|---|
| `normal` | 通常運行 | `color.status.onTime` |
| `possible` | 遅延の可能性 | `color.status.delayRisk` |
| `delay` | 約15分遅延 | `color.status.delayed` |
| `suspended` | 運休 | `color.status.suspended` |
| `passed` | 通過済 | `color.status.passed` |

**注：** ラベル文言は本コンポーネントに直書きせず `statusConfigs.ts` を参照（多言語化対応）。

## Props（契約）

```ts
type StatusPillProps = {
  status: 'normal' | 'possible' | 'delay' | 'suspended' | 'passed';
  delayMinutes?: number;     // 'delay' のとき必須。N → "約N分遅延"
  full?: boolean;            // true で width: 100% + 中央寄せ
  size?: 'sm' | 'md';        // 既定 'md'。sm はリスト密集時のみ
};
```

## トークン参照

| 役割 | トークン |
|---|---|
| 背景 | `var(--color-status-{state}-bg)` |
| 文字 / アイコン | `var(--color-status-{state}-fg)` |
| 角丸 | `var(--radius-pill-status)` (Pill — 粒度の最小単位) |
| Padding | `var(--layout-control-padding-block-compact) var(--layout-control-padding-inline)` (8/20px) |
| タイポ | `font: var(--typography-status-pill)` + `letter-spacing: var(--tracking-wide)` |
| アイコンサイズ | `16px` (lucide) |
| gap | `var(--space-1)` (6px) |

## ルール

- **必ず Icon + Label のペア**。アイコンだけ／文字だけは禁止（色覚多様性 + 走査速度の両立）。
- **状態色は `--color-status-*` 経由のみ**。生 HEX 直書き禁止。
- **`full` は親が `display: flex` のときに使う**。`display: inline-flex` の中で使うと崩れる。
- **angle / アニメーション禁止**。状態表示は静的であるべき（ambient breathing は別コンポーネント「乗車中バッジ」の責務）。
- **複数の status を並べない**。1 つの便に対し 1 つの pill が原則。

## アクセシビリティ

- 色だけで意味を伝えない。アイコンとラベル文言の併記が必須。
- `role="status"` + `aria-live="polite"` を付与（状態が動的に変わる場面で読み上げ更新）。
- 配色は WCAG AA を満たすよう Semantic 層で fg/bg ペアが事前検証済み（`--a11y-contrast-min` 4.5 以上）。

## 実装現況

`<StatusPill>` 実装済み。本仕様のタイポはトークン化済み（`--typography-status-pill`）。配色は `--color-status-*` への移行が次タスク。
