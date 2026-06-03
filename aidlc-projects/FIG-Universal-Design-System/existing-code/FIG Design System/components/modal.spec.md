# Modal — Component Spec

> 🛡️ 先に [`../design-system.md`](../design-system.md) / [`../component-contract.md`](../component-contract.md) / [`../accessibility-guidelines.md`](../accessibility-guidelines.md) を読むこと。

## 目的

ユーザーの**注意を画面全体から奪い、1 つの意思決定 / 確認に集中させる**ためのオーバーレイ。
公共交通 UI では「決済確定」「定期券発行」「ログアウト」「データ削除」など、**取り消し困難な操作**にのみ使う。情報通知には使わない（Toast / Banner を使う）。

## バリエーション

| 種別 | 用途 | 配置 |
|---|---|---|
| **Confirm Modal** | 重要操作の確認（Yes/No 二択） | 画面中央 |
| **Form Modal** | 短いフォーム入力 | 画面中央 |
| **Bottom Sheet** | モバイル向け、コンテキストアクション | 画面下端からスライド |
| **Full-screen Modal** | 多段フォーム、複雑な操作 | 全画面、Header にクローズ |
| **Alert Dialog** | エラー通知 + 単一アクション | 画面中央、Destructive |

## Props（契約）

```ts
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;                 // 必須、aria-labelledby のソース
  description?: string;          // aria-describedby のソース
  variant?: 'confirm' | 'form' | 'sheet' | 'fullscreen' | 'alert';
  size?: 'sm' | 'md' | 'lg';     // 既定 'md'（max-width 制御）
  dismissible?: boolean;         // 既定 true。背景タップ / Escape で閉じる
  primaryAction?: { label: string; onClick: () => void; variant?: 'primary' | 'destructive'; loading?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
  children: ReactNode;
};
```

**禁止事項：**
- `open` を internal state にしない（親が制御する）
- ネストした Modal（Modal の中に Modal を出さない）
- `dismissible: false` を使う場合は **必ず明示的なクローズ手段**を提供（×ボタン / Cancel）

## トークン参照

| 役割 | トークン |
|---|---|
| Overlay 背景 | `var(--color-surface-overlay)` (slate-900 / 50%) |
| Overlay blur | `backdrop-filter: blur(8px)` |
| Panel 背景 | `var(--color-surface-default)` |
| Panel 角丸 | `var(--radius-modal)` (28px) confirm/form / `var(--radius-sheet)` (20px) bottom sheet 上端のみ |
| Panel max-width | sm: 320 / md: 480 / lg: 640 |
| Panel padding | `var(--layout-card-padding-loose)` (24px) |
| 周辺アイソレーション | `padding: var(--isolation-around)`（panel 外周 — ブランド要素を含む場合） |
| Title タイポ | `var(--typography-title)` |
| Body タイポ | `var(--typography-body)` |
| Title ↔ Body gap | `var(--space-2)` |
| Body ↔ Actions gap | `var(--space-5)` |
| Actions gap | `var(--space-3)` |
| Elevation | `var(--surface-elevation-modal)` |
| Z-index (overlay) | `var(--z-modal)` (600) |
| Z-index (panel) | `var(--z-modal)` (600) |

## 状態と Motion

| 状態 | 振る舞い | トークン |
|---|---|---|
| opening | overlay fade + panel scale(0.92→1) | `var(--motion-modal-enter)` (320ms / decelerate) |
| open | 静止、フォーカストラップ有効 | — |
| closing | overlay fade-out + panel scale(1→0.96) | `var(--motion-modal-exit)` (240ms / accelerate) |
| primaryAction.loading | Primary button が aria-busy + spinner | — |

**Bottom Sheet 専用 motion：** panel が `translateY(100% → 0)` で下からスライドイン、`var(--motion-modal-enter)`。

## アクセシビリティ

- **`role="dialog"` + `aria-modal="true"` + `aria-labelledby={titleId}`** が必須
- **`aria-describedby`** で description を関連付け（あれば）
- **フォーカストラップ**：開いた瞬間、最初のフォーカス可能要素（または `primaryAction` の手前のクローズ × ボタン）へフォーカス。Tab は Modal 内をループ。
- **Escape キー** で `dismissible: true` のとき閉じる
- **背景タップで閉じる**：confirm では推奨、destructive では非推奨（誤クリック防止）
- **クローズ後**：フォーカスを Modal を開いた要素へ戻す（呼び出し元の保持が必要）
- **`prefers-reduced-motion`**：scale / translate を全廃、opacity fade のみに
- **Alert Dialog 専用**：`role="alertdialog"`（高優先度）+ `aria-live` 不要（dialog 自体が SR で announce される）

## ルール

- **1 画面 1 Modal**。同時に複数開いてはならない。新しい Modal を開くときは前を閉じる。
- **Modal の中で長いスクロールを発生させない**。コンテンツが多いなら Full-screen Modal か新しい画面に逃がす。
- **Primary Action は右、Secondary は左**（自然な視線移動）
- **Destructive Primary**（削除確認等）は **赤い Primary** で、Secondary（キャンセル）を **デフォルト右側**にしない — ユーザーが Enter キー連打で誤削除を防ぐため、Cancel を Enter デフォルトに。
- **Bottom Sheet の drag handle は touch 領域 44×44 確保**（視覚は 32×4）
- **Sheet 内で keyboard 入力を受ける**場合、iOS の自動 scroll で隠れないよう `interactive-input-height` × `--safe-area-bottom` を考慮した padding

## 使ってよい場面 / 使ってはいけない場面

✅ 「定期券を発行しますか？」(confirm)
✅ 「読み取りに失敗しました」+ リトライボタン (alert)
✅ 停留所選択 (bottom sheet)
❌ 「保存しました」→ Toast を使う
❌ 「お知らせ」「キャンペーン情報」→ Notification Sheet を使う
❌ ヘルプ・FAQ 表示 → 別画面 or popover を使う

## 実装現況

`<Modal>` 実装済み（`BusappComponents.jsx`）。`role="dialog"` / `aria-modal` / フォーカストラップ / `Escape` ハンドラがすべて未実装。Spec 準拠の refactor が必要。
