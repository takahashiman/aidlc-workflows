# Icon Button — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**アイコンのみの圧縮されたボタン**。ツールバー・密度の高い領域・補助アクションで使う。Common Button より目立たず、テキスト付きラベルは持たない。意味は `aria-label` で補強する。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | 透明背景、文字色のみ | 最も控えめ |
| Filled | 塗りつぶし | 主用途、目立たせたい |
| Tonal | brand-soft 背景 | 中間的な存在感 |
| Outline | 枠線あり | 明確な境界が必要なとき |
| Danger | 赤系 | 破壊的操作（削除等） |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `icon` | ReactNode | ✅ | — | lucide アイコン |
| `ariaLabel` | string | ✅ | — | スクリーンリーダー向け |
| `variant` | `'standard'` \| `'filled'` \| `'tonal'` \| `'outline'` \| `'danger'` | — | `'standard'` | 配色 |
| `size` | `'sm'` \| `'md'` \| `'lg'` | — | `'md'` | サイズ |
| `pressed` | boolean | — | — | トグル時の選択状態 |
| `disabled` | boolean | — | `false` | 無効 |

## FIGセンス（角丸とアイソレーション）

- Small: `--radius-sm`（10px）/ 36×36px
- Medium: `--radius-md`（14px）/ 48×48px
- Large: `--radius-lg`（18px）/ 56×56px
- アイコンサイズ: Small 16, Medium 20, Large 26 px

## トークン参照

| 役割 | トークン |
|---|---|
| Standard 文字 | `--color-text-secondary` |
| Standard hover 背景 | `--color-surface-subtle` |
| Filled 背景 | `--color-surface-brand` |
| Tonal 背景 | `--color-surface-brand-soft` |
| Tonal 文字 | `--color-text-brand` |
| Outline ボーダー | `--color-border-strong` |
| Danger 文字 | `--color-feedback-error-strong` |
| Disabled | `--state-disabled-opacity` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | variant に応じた配色 | — |
| hover | 背景強調 | `--motion-hover` |
| pressed | `scale(0.96)` | `--state-pressed-scale` |
| toggled | tonal 風の選択状態 | — |
| focus | `--a11y-focus-ring` | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

## アクセシビリティ

- **`aria-label` 必須**（lucide 単独では意味伝達不可）
- タッチターゲット最小: 48×48 px（WCAG 2.5.5）。Small 36px はマウス前提領域のみ許容
- Tooltip 併用で意図を補強できると尚良し
- トグル機能なら `aria-pressed="true" | "false"` を使う
- フォーカスリング必須（`:focus-visible` で実装）

## 使ってよい場面 / 使ってはいけない場面

✅ ツールバー（編集・コピー・削除・閉じる等）
✅ Card / List Row の補助アクション
✅ Modal/Sheet のヘッダ閉じるボタン

❌ 主要 CTA — Common Button または FAB
❌ アイコンの意味が文脈なしで伝わらない場合 — Common Button にテキスト併設
❌ タッチ前提画面で 36px サイズ — 48px 以上にする

## レイアウト規約

- 配置: 横並び flex、`gap: var(--space-1)` 〜 `var(--space-2)`
- ツールバー内: 右寄せが慣例（左寄せはタイトル）
- 単独配置時: 周囲との余白 `--space-2` 以上

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-icon-button.html`）
- Code Connect: 未対応
- 関連: Common Button / FAB（責務の住み分け）
