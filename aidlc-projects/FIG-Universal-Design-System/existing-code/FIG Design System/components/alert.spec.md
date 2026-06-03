# Alert / Banner — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

画面内に**永続的に表示する重要メッセージ**。Toast と異なり自動消失せず、ユーザーが認識・解消するまで残る。情報（Info）/ 成功（Success）/ 注意（Warning）/ エラー（Error）の 4 段階の重要度を扱う。

## バリエーション

| 種別 | 用途 | role |
|---|---|---|
| Info | メンテナンス予告等 | `role="status"` |
| Success | 完了通知 | `role="status"` |
| Warning | 注意喚起 | `role="status"` |
| Error | 操作失敗・エラー | `role="alert"` |
| Banner | 画面上部固定の最重要通知 | `role="alert"` |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `severity` | `'info'` \| `'success'` \| `'warning'` \| `'error'` | ✅ | — | 重要度 |
| `title` | string | — | — | 太字の見出し |
| `description` | string | ✅ | — | 本文 |
| `dismissible` | boolean | — | `true` | 閉じるボタン表示 |
| `actions` | ReactNode | — | — | アクションリンク群 |
| `onDismiss` | () => void | — | — | 閉じるハンドラ |

## FIGセンス（角丸とアイソレーション）

- 角丸: `--radius-md`（12px）
- 内 padding: `var(--space-4) var(--space-5)`
- アイコン: 20×20、本文左に配置
- ボーダー: 重要度色の薄色（subtle）

## トークン参照

| 重要度 | 背景 | ボーダー | アイコン色 |
|---|---|---|---|
| Info | `--color-feedback-info-soft` | `--color-feedback-info-border` | `--color-feedback-info-strong` |
| Success | `--color-feedback-success-soft` | `--color-feedback-success-border` | `--color-feedback-success-strong` |
| Warning | `--color-feedback-warning-soft` | `--color-feedback-warning-border` | `--color-feedback-warning-strong` |
| Error | `--color-feedback-error-soft` | `--color-feedback-error-border` | `--color-feedback-error-strong` |
| Banner（critical） | `#B91C1C` | — | `#fff` |

タイトル: `--color-text-primary`、本文: `--color-text-secondary`。

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| visible | 静的表示 | — |
| appearing | fade-in 200ms（新規発生時） | `--motion-enter` |
| dismissing | fade-out 160ms | `--motion-exit` |
| dismissed | DOM から削除 | — |

## アクセシビリティ

- Error: `role="alert"` + `aria-live="assertive"`（即時読み上げ）
- Info / Success / Warning: `role="status"` + `aria-live="polite"`
- 閉じるボタンに `aria-label="閉じる"`
- Esc キーで閉じられるとなお良い
- 色だけで重要度を伝えない — アイコン + テキストでも示す
- リンク併設時は十分なコントラスト（重要度色背景とのコントラスト維持）

## 使ってよい場面 / 使ってはいけない場面

✅ メンテナンス予告（事前周知）
✅ フォーム送信後の確認（成功 / 失敗）
✅ ページ内の状態通知（永続）

❌ 一時的な通知 — Toast を使う
❌ 操作の確認（破壊操作） — Modal を使う
❌ Critical（運休等）の全画面表示 — Banner（critical variant）を画面最上部に

## レイアウト規約

- 1 ページに同時表示は最大 2–3 個まで（多すぎると認知過多）
- 配置: ページ本文上部、または該当セクション直上
- Banner: `position: sticky; top: 0` で画面上部固定
- 内側: アイコン左、本文中央、閉じるボタン右

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-alert.html`）
- Code Connect: 未対応
- 関連: Toast（一時通知）/ Modal（操作確認）/ Status Pill（インライン状態）
