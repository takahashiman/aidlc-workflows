# FAB (Floating Action Button) — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

画面内で**最も突出した単一アクション**を表現する。Material Design 3 準拠の Floating Action Button。1 画面に 1 つが原則。主動線で最頻出する CTA（新規作成・お気に入り追加など）の格上げ表現として使う。

## バリエーション

| 種別 | サイズ | 用途 |
|---|---|---|
| Small | 40×40 | 高密度画面の補助 |
| Regular | 56×56 | 標準（主用途） |
| Large | 96×96 | コンテンツの中心 CTA |
| Extended | 高 56 + ラベル | アイコン + テキスト併設、コンテキスト明示 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `icon` | ReactNode | ✅ | — | lucide アイコン等 |
| `label` | string | — | — | Extended 時のテキスト |
| `ariaLabel` | string | ✅ | — | スクリーンリーダー向け（icon-only 時必須） |
| `size` | `'sm'` \| `'md'` \| `'lg'` | — | `'md'` | サイズ |
| `variant` | `'primary'` \| `'surface'` | — | `'primary'` | 配色 |

## FIGセンス（角丸とアイソレーション）

- Small: `--radius-md`（12px）
- Regular: `--radius-lg`（18px）
- Large: `--radius-xl`（28px）
- Extended: `--radius-lg`（18px）、padding 横 `--space-5`
- 影: `--surface-elevation-floating` で「浮遊感」を演出

## トークン参照

| 役割 | トークン |
|---|---|
| Primary 背景 | `--color-surface-brand` |
| Primary 文字 | `--color-text-onBrand` |
| Surface 背景 | `--color-surface-default` |
| Surface 文字 | `--color-text-brand` |
| 影 | `--surface-elevation-floating` |
| Press scale | `--state-pressed-scale` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 浮遊シャドウ | `--surface-elevation-floating` |
| hover | 影強化 + 微小持ち上げ | `--motion-hover` |
| pressed | `scale(0.96)` | `--state-pressed-scale` |
| focus | `--a11y-focus-ring` | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

## アクセシビリティ

- **`aria-label` 必須**（icon-only の場合は意図が分からない）
- **タッチターゲット 48×48 px 以上**（Small でも 40px が下限、推奨は Regular 56px）
- 下端固定時は `padding-bottom: env(safe-area-inset-bottom)` で iOS Safe Area 配慮
- Tab 順序: 通常はページ末尾近く（補助 CTA のため）
- Modal/Dialog 内では使わない（責務重複）

## 使ってよい場面 / 使ってはいけない場面

✅ Consumer / Terminal の最頻出 CTA（投稿・新規作成・経路検索）
✅ Map 等のフルスクリーン画面で動線を維持したいとき
✅ 1 画面に 1 つの「最重要アクション」

❌ Admin プロファイル — Common Button で十分（caution）
❌ 2 つ以上の同レベル CTA — Common Button を並べる
❌ 補助操作（共有・コピー） — Icon Button を使う
❌ Modal 内 — 主動線の延長ではないため

## レイアウト規約

- 位置: 画面右下が標準。`position: fixed; right: var(--space-5); bottom: var(--space-5)`
- z-index: `--z-fab`（Toast より下、Modal より下）
- Extended: ラベル右側、`gap: var(--space-2)` でアイコンと間隔
- 複数の FAB を一画面に並べる必要があるなら、Speed Dial パターンへ

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-fab.html`）
- Code Connect: 未対応
- 関連: Common Button / Icon Button（責務の住み分け重要）
