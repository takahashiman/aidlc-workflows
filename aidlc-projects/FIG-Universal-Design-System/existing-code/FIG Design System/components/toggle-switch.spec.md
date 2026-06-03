# Toggle Switch — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**即時反映の二値スイッチ**。設定の ON/OFF など、適用に確認を要さない操作に使う。Checkbox とは異なり「Save/Apply」と組まずに即時反映する。Material Design 3 / iOS HIG の Switch に相当。

## バリエーション

| 種別 | サイズ | 用途 |
|---|---|---|
| Standard | 52×32px | 標準 |
| Small | 40×24px | 高密度リスト |
| With Icon | サムにアイコン | 状態を視覚で補強 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `checked` | boolean | ✅ | — | 状態 |
| `onChange` | (checked) => void | ✅ | — | 変更ハンドラ（即時反映） |
| `label` | string | — | — | スイッチ右側のラベル |
| `disabled` | boolean | — | `false` | 無効 |
| `size` | `'sm'` \| `'md'` | — | `'md'` | サイズ |

## FIGセンス（角丸とアイソレーション）

- トラック角丸: `999px`（完全な楕円）
- サム（円）: 完全な円、内側 4px インセット
- サイズ: トラック 52×32、サム 24×24（Standard）
- 影: サムに `0 2px 4px rgba(0,0,0,0.15)`

## トークン参照

| 役割 | トークン |
|---|---|
| トラック（OFF） | `--color-border-strong` |
| トラック（ON） | `--color-surface-brand` |
| サム | `#fff`（固定）+ 微影 |
| Focus ring | `--a11y-focus-ring` |
| Disabled | `--state-disabled-opacity` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| OFF | サム左、トラック gray | — |
| ON | サム右、トラック brand | — |
| toggling | サム translateX 200ms ease | `--motion-toggle` |
| focus | `--a11y-focus-ring` 外側 | — |
| disabled | `opacity: 0.4` | `--state-disabled-opacity` |

## アクセシビリティ

- `<input type="checkbox" role="switch">` または `<button role="switch" aria-checked>` で実装
- ラベルとの関連付け: `<label>` で囲む、または `aria-labelledby` で連携
- **色だけで状態を表さない** — ラベル文言や icon でも示す
- Space キーでトグル
- フォーカスリング: トラック外側に表示

## 使ってよい場面 / 使ってはいけない場面

✅ 即時反映の二値設定（通知の ON/OFF、ダークモード、機内モード等）
✅ システム状態の切替（モバイル設定画面に多い）
✅ 適用に確認不要な操作

❌ Save ボタンと組む操作 — Checkbox を使う
❌ 重要な破壊的設定（アカウント削除等） — 確認ダイアログ併用
❌ 3 値以上 — Segmented Button へ

## レイアウト規約

- 設定リスト行内: 右端配置、`justify-content: space-between` でラベルと対置
- 横並び label + switch の場合: `gap: var(--space-3)`
- タッチ領域: スイッチ本体は 32px だが、`<label>` 全体をタッチ領域として 48px 確保

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-toggle-switch.html`）
- Code Connect: 未対応
- 関連: Checkbox（適用待ち選択）/ Radio Button（排他選択）
