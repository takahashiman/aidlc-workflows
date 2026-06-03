# Bottom Sheet — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

画面下端から立ち上がる**一時的な補助領域**。モバイル UI で主動線を維持しつつ、選択中アイテムの詳細・補助アクションを表示する。Material Design 3 準拠の 3 形態（Standard / Modal / Expandable）。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard | 主画面と共存、ハンドルでドラッグ可 | スクリムなし |
| Modal | スクリム付き、明示的に閉じる | 主動線中断 |
| Expandable | 部分展開 → フル展開の 2 段階 | ドラッグで切替 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `mode` | `'standard'` \| `'modal'` \| `'expandable'` | ✅ | — | 表示形態 |
| `open` | boolean | ✅ | — | 開閉状態 |
| `peekHeight` | number | — | `280` | 初期高さ（px） |
| `fullHeight` | number | — | `viewport - 64` | フル展開時高さ |
| `onClose` | () => void | ⚠️ modal 時必須 | — | 閉じるハンドラ |

## FIGセンス（角丸とアイソレーション）

- 上部 2 角: `28px` 角丸（やわらかさを演出）
- 下部 2 角: 0（画面端密着）
- 影: `0 -8px 24px rgba(0,0,0,0.12)`
- ハンドル: 36×4px、`--color-border-strong`、`999px` 角丸

## トークン参照

| 役割 | トークン |
|---|---|
| Sheet 背景 | `--color-surface-default` |
| Scrim（modal） | `rgba(15, 23, 42, 0.35)` |
| ハンドル | `--color-border-strong` |
| タイトル | `--color-text-primary` |
| 本文 | `--color-text-secondary` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| closed | translateY(100%) | — |
| peeked | translateY(viewport - peekHeight) | `--motion-enter` |
| expanded | translateY(64px) | `--motion-enter` |
| closing | translateY(100%) | `--motion-exit` |

Spring 系モーションは禁止。`--motion-enter`（280ms decelerate）固定。

## アクセシビリティ

- ハンドルは `<button role="button" tabindex="0" aria-label="シートをドラッグ">` で実装
- **Modal 形態**: `role="dialog"` + `aria-modal="true"` + フォーカストラップ + Esc 対応
- **Standard 形態**: フォーカストラップ不要だが、`tabindex` 順序は連続させる
- スクリムクリックで閉じる（破壊操作でない場合）
- スワイプダウンで閉じる動線を提供
- 開時にシートヘッダタイトルへフォーカス移動

## 使ってよい場面 / 使ってはいけない場面

✅ Consumer / Terminal で選択中アイテムの詳細表示
✅ モバイル前提の補助 CTA（共有・お気に入り・経路 等）
✅ 部分表示 → 拡張という段階的開示

❌ Admin プロファイル — Side Sheet を使う（要審慎なら caution）
❌ 主要 CTA の格納 — 主画面に
❌ 4 階層以上のネスト — 別画面遷移へ
❌ 永続表示 — Bottom Sheet は一時 UI

## レイアウト規約

- 幅: 100vw（画面下端いっぱい）
- 初期高さ: 280–360px
- 内 padding: `--space-5`
- ハンドル上下 padding: `var(--space-3)` / `var(--space-4)`
- z-index: `--z-bottom-sheet`（Toast より上、Modal より下）
- safe-area: `padding-bottom: env(safe-area-inset-bottom)`

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-bottom-sheet.html`）
- Code Connect: 未対応
- 関連: Side Sheet（横方向の等価物）/ Modal（中央配置・取消困難な操作向け）
