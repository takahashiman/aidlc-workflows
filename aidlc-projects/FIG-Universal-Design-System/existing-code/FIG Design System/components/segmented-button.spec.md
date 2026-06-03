# Segmented Button — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

2–5 個の**排他的な選択肢**から 1 つ（または複数）を切り替える。Tabs より粒度の細かい操作切替（並べ替え順・表示モード等）に使う。Material Design 3 準拠。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Single Select | 排他選択（radiogroup） | 標準 |
| Multi Select | 複数選択（group + checkbox） | フィルタタグ等 |
| With Icon | アイコン + ラベル | スキャナビリティ向上 |
| Full Width | 親幅いっぱい | モバイル向け、各セグメント flex 1 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `options` | Option[] | ✅ | — | `{ id, label, icon? }` |
| `value` | string \| string[] | ✅ | — | 選択値（multi 時は配列） |
| `onChange` | (value) => void | ✅ | — | 選択変更ハンドラ |
| `multi` | boolean | — | `false` | 複数選択モード |
| `fullWidth` | boolean | — | `false` | 親幅いっぱい |

## FIGセンス（角丸とアイソレーション）

- 外枠角丸: `--radius-md`（12px）
- 内側セグメント角丸: `--radius-sm`（8px）
- 内 padding: 4px（セグメント間 gap 2px）
- 高さ: 36px 標準 / 44px ラージ

## トークン参照

| 役割 | トークン |
|---|---|
| 外枠背景 | `--color-surface-subtle` |
| 外枠ボーダー | `--color-border-subtle` |
| セグメント（通常） | `--color-text-secondary` |
| セグメント（選択中） | `--color-surface-default` 背景 + `--color-text-brand` |
| 選択中影 | `--surface-elevation-card` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 透明 | — |
| hover | 文字色 primary | `--motion-hover` |
| selected | 白背景 + 影 + brand 文字 | — |
| focus | `--a11y-focus-ring` | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

## アクセシビリティ

- **Single Select**: `role="radiogroup"` + 子に `role="radio" aria-pressed`、Arrow キーで移動
- **Multi Select**: `role="group"` + 子に `role="button" aria-pressed`、Space/Enter でトグル
- グループに `aria-label` 必須
- アイコン併設時もテキストラベル必須（アイコン単独不可）
- タッチターゲット: 各セグメント 44×44 以上（Full Width 時は親幅依存）

## 使ってよい場面 / 使ってはいけない場面

✅ 排他的な表示モード切替（日/週/月、リスト/グリッド/マップ）
✅ 並べ替え方向の切替（昇順/降順）
✅ 2–5 個の選択肢

❌ 6 個以上の選択肢 — Select / Picker を使う
❌ Tabs と機能重複する場面 — 役割を明確化
❌ 1 個だけの選択 — Toggle Switch / Checkbox へ

## レイアウト規約

- 高さ: 36px 標準 / 44px ラージ
- 横並び flex、各セグメント `min-width: 60px`
- Full Width 時: `display: flex; width: 100%;` 各セグメント `flex: 1`

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-segmented-button.html`）
- Code Connect: 未対応
- 関連: Tabs（より大きな粒度のビュー切替）/ Radio Button（フォーム内の選択）
