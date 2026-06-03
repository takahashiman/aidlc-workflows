# Side Sheet — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

主画面の**横（右または左）からスライドインする補助領域**。フィルタ・詳細表示・補助設定など、主動線を中断せずに参照・操作したいときに使う。Material Design 3 準拠。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Persistent（永続） | 主画面と並列表示、コラプス可能 | Admin プロファイル推奨 |
| Modal（モーダル） | スクリム付き、明示的に閉じる | Consumer / 狭幅で必要時 |
| Detail Pane | 選択中アイテムの詳細を出すパネル | Persistent の派生形 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `mode` | `'persistent'` \| `'modal'` | ✅ | — | 表示形態 |
| `side` | `'left'` \| `'right'` | — | `'right'` | スライド方向 |
| `open` | boolean | ✅ | — | 開閉状態 |
| `onClose` | () => void | ⚠️ modal 時必須 | — | 閉じるハンドラ |
| `title` | string | ✅ | — | ヘッダタイトル（`aria-labelledby` 連携） |

## FIGセンス（角丸とアイソレーション）

- Persistent: 角丸なし（画面端に密着）
- Modal: 内側のみ `--radius-lg` 角丸
- 影: `-8px 0 24px rgba(0,0,0,0.12)`（左/右で反転）
- 幅: 360px（標準）/ 480px（広幅）

## トークン参照

| 役割 | トークン |
|---|---|
| Sheet 背景 | `--color-surface-default` |
| Sheet ボーダー | `--color-border-subtle` |
| Scrim（modal） | `rgba(15, 23, 42, 0.45)` |
| ヘッダ文字 | `--color-text-primary` |
| 本文文字 | `--color-text-secondary` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| closed | translateX(100%)（右）/ -100%（左） | — |
| opening | 280ms decelerate | `--motion-enter` |
| open | translateX(0) | — |
| closing | 200ms accelerate | `--motion-exit` |

`prefers-reduced-motion` 時はモーション 0.01ms へ短縮。

## アクセシビリティ

- **Modal 形態**: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- フォーカストラップ必須（開時にヘッダタイトルへフォーカス、閉時に呼び出し元へ復帰）
- Esc キーで閉じる
- Scrim クリックで閉じる（破壊操作でない場合）
- Persistent 形態: フォーカストラップ不要、通常のタブ順序に従う

## 使ってよい場面 / 使ってはいけない場面

✅ Admin で常時参照したいフィルタ・詳細 — Persistent
✅ Consumer で重要な補助操作の一時表示 — Modal
✅ リスト + 詳細パネルのマスタ・ディテール構造

❌ Terminal プロファイル — 画面が狭い・誤操作リスクで使わない
❌ 主要 CTA の格納場所 — 主画面に置く
❌ 4 階層以上の深いナビゲーション — 別ルートを検討

## レイアウト規約

- 幅: 360px 標準、480px 広幅
- ヘッダ高さ: 56px
- 内 padding: `--space-5`
- z-index: `--z-side-sheet`（Modal は `--z-modal` と同等）
- viewport 100vh

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-side-sheet.html`）
- Code Connect: 未対応
- 関連: Modal（中央配置形態）/ Bottom Sheet（縦方向の等価物）
