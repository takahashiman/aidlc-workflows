# Toast — Component Spec

> 🛡️ 先に [`../design-system.md`](../design-system.md) / [`../component-contract.md`](../component-contract.md) / [`../accessibility-guidelines.md`](../accessibility-guidelines.md) を読むこと。

## 目的

ユーザーの操作結果を **画面の隅で控えめに通知**するための一時的なフィードバック。
モーダルと異なり、**操作を中断しない**。Modal / Notification Sheet / Delay Banner との責務分離が必須。

| パターン | 通知の性質 |
|---|---|
| **Toast** | 一時的、自動消滅、操作中断なし。"〜しました" の事後報告 |
| Modal | 操作の中断、明示的なユーザー応答が必要 |
| Notification Sheet | 永続的、履歴として残る |
| Delay Banner | 広域、システム異常 |

## バリエーション

| 種別 | 用途 | 自動消滅 |
|---|---|---|
| **info** | 一般通知 | 4 秒 |
| **success** | 操作成功 | 3 秒 |
| **warning** | 注意（軽微） | 5 秒 |
| **error** | エラー（軽微、リトライ可能） | 6 秒、または手動閉じ |
| **action-toast** | undo / retry action 付き | 5–8 秒 |

**重大エラー / システム障害は Toast ではなく Alert Modal / Delay Banner**で表現する。

## Props（契約）

```ts
type ToastProps = {
  id: string;                            // queue 管理用
  variant?: 'info' | 'success' | 'warning' | 'error';
  message: string;                       // 必須、1 文 60 字以内推奨
  action?: { label: string; onClick: () => void };  // undo / retry
  duration?: number;                     // ms、既定は variant ごと
  dismissible?: boolean;                 // 既定 true、手動 × ボタン
  onDismiss: (id: string) => void;
};

// Manager API
toast.info(message: string, options?: Partial<ToastProps>): string;
toast.success(message: string, options?: Partial<ToastProps>): string;
toast.warning(message: string, options?: Partial<ToastProps>): string;
toast.error(message: string, options?: Partial<ToastProps>): string;
toast.dismiss(id: string): void;
```

**禁止事項：**
- Toast 内に複数の action を入れない（1 つだけ）
- 入力フィールド / フォームを Toast に入れない
- 同じメッセージを連続スパムさせない（debounce / dedupe）

## トークン参照

| 役割 | トークン |
|---|---|
| Container 位置 | bottom-center (モバイル) / bottom-right (デスクトップ) |
| Container margin (bottom) | `calc(var(--space-5) + var(--safe-area-bottom))` |
| Stack gap | `var(--space-2)` |
| Toast 幅 | min 280 / max 480 |
| Padding | `var(--space-3) var(--space-4)` |
| 角丸 | `var(--radius-popover)` (12px — 浮遊系のコンテナ統一) |
| Elevation | `var(--surface-elevation-toast)` |
| Z-index | `var(--z-toast)` (700) |
| Icon サイズ | 20×20 |
| メッセージタイポ | `var(--typography-body-strong)` |
| Action タイポ | `var(--typography-label)` + `color: var(--color-text-on-toast-action)` |
| Action min hit area | `var(--a11y-touch-target)` (44px) |

### Variant 別配色

| variant | bg | fg | icon |
|---|---|---|---|
| info | `var(--color-surface-inverse)` (#0F172A) | `var(--color-text-inverse)` | `lucide:info` |
| success | `var(--color-status-onTime-bg-strong)` | `var(--color-status-onTime-fg-strong)` | `lucide:check-circle-2` |
| warning | `var(--color-status-delayRisk-bg-strong)` | `var(--color-status-delayRisk-fg-strong)` | `lucide:alert-triangle` |
| error | `var(--color-feedback-error-strong)` | `var(--color-text-inverse)` | `lucide:x-circle` |

**注：** background は Pill より濃いソリッド色（読みやすさ優先）。Pill のような subtle 配色は使わない。

## 状態と Motion

| 状態 | 振る舞い | トークン |
|---|---|---|
| entering | `translateY(20px → 0)` + opacity fade | `var(--motion-toast-enter)` (240ms / decelerate) |
| visible | 静止、duration ms 表示 | — |
| pausing | hover / focus 中はタイマー停止（マウス + キーボード） | — |
| exiting | `translateY(0 → 20px)` + opacity fade | `var(--motion-toast-exit)` (200ms / accelerate) |
| stack reorder | 上の Toast が消えると下が上にスライド | `var(--motion-tab-switch)` |

**プログレスバー**：上端に細い 2px の bar、duration に従って 100% → 0% で減るのは**任意**（reduced-motion で非表示）。

## アクセシビリティ

- **`role="status"`** (info / success) または **`role="alert"`** (warning / error)
- **`aria-live="polite"`** (info / success) または **`assertive"`** (warning / error)
- ⚠ **`aria-live` の使い分け**：同時に複数 assertive が発火すると最重要が消える。error と warning は queue で逐次再生
- **Action ボタンは独立した focusable 要素**として実装、Tab で到達可能
- **タイマー一時停止**：マウス hover、focus、`prefers-reduced-motion: reduce` で自動停止
- **Touch target**：Action ボタンと × ボタンは 44×44 hit area 確保
- **重要情報を Toast で通知しない**：Toast は見逃される前提。重要情報は Modal / Notification Sheet に。

## ルール

- **同時表示は最大 3 つ**。4 つ目以降は queue で順次表示。
- **画面下端 + safe-area 配慮**（ボトムナビ 64px + safe-area-bottom の上に表示）
- **Toast の上にモーダルが開いた場合**、Toast は z-index で隠れず継続表示（モーダル外要素として）
- **action-toast の duration は長め (5–8s)**、undo を促す時間を確保
- **同一メッセージの重複を防ぐ**：直近 1 秒以内の同 ID は無視（dedupe）
- **キューイング戦略**：FIFO、ただし `error` は info / success より優先（assertive 性を尊重）
- **Toast 内のテキストは 60 字以内 / 1 文**。長くなるなら Modal / Notification Sheet を使う
- **Action は 1 つだけ**。複数選択肢が必要なら Modal を使う

## 使ってよい場面 / 使ってはいけない場面

✅ 「お気に入りに追加しました」(success)
✅ 「通知を 3 件削除しました [元に戻す]」(action-toast)
✅ 「接続が回復しました」(info)
✅ 「読み取りに失敗しました [再試行]」(error, retryable)
❌ 「定期券を発行しますか？」→ Modal を使う
❌ 「お知らせ」「キャンペーン」→ Notification Sheet を使う
❌ 「サーバー全体障害」→ Delay Banner を使う
❌ 「フォーム入力エラー」→ Input の error prop を使う（field-level）

## 実装現況

**未実装**（本仕様で予約）。実装時は `<ToastManager>` を `document.body` 直下に React Portal で配置、`useToast()` hook で `toast.success()` 等を提供。
