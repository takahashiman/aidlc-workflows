# Badge — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

**数値や状態を伴う小さな付箋**。他要素にアンカーして注意を喚起する（未読件数・新着印・ステータスインジケータ等）。Status Pill が FIG 独自の運行状態専用なのに対し、Badge は汎用な付箋として機能する。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Dot | 未読あり等の有無のみ | 8×8 円 |
| Count | 数値表示 | `99+` も対応 |
| Label | 文字列ラベル | "新着" "承認済" 等 |
| Status | アイコン + ラベル | "承認済 ✓" |

カラーバリアント: default / brand / success / warning / error / info / filled / inverse。

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `variant` | `'dot'` \| `'count'` \| `'label'` | ✅ | `'label'` | 形態 |
| `color` | `'default'` \| `'brand'` \| `'success'` ... | — | `'default'` | 配色 |
| `value` | number | ⚠️ count 時必須 | — | 数値（99 超は `99+`） |
| `text` | string | ⚠️ label 時必須 | — | ラベル文字 |
| `icon` | ReactNode | — | — | 左側アイコン |
| `ariaLabel` | string | ⚠️ dot/count 時必須 | — | 意味の言語化 |

## FIGセンス（角丸とアイソレーション）

- Label / Status / Count: `999px` 完全な楕円
- Dot: 完全な円（8×8）
- 高さ: 18–22px、内 padding `2px 8px`
- Count（アンカー型）: 親要素右上、白い 2px ボーダーで親と分離

## トークン参照

| Color | 背景 | 文字 |
|---|---|---|
| default | `--color-surface-subtle` | `--color-text-muted` |
| brand | `--color-surface-brand-soft` | `--color-text-brand` |
| success | `#DCFCE7` | `#166534` |
| warning | `#FEF3C7` | `#92400E` |
| error | `#FEE2E2` | `#991B1B` |
| info | `#DBEAFE` | `#1E40AF` |
| filled | `--color-surface-brand` | `#fff` |
| inverse | `--color-surface-inverse` | `#fff` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| static | 標準 | — |
| appearing | scale 0 → 1（新規発生） | `--motion-enter` |
| pulsing | 微小 scale 1→1.05→1 ループ（重要通知） | カスタム、`prefers-reduced-motion` で停止 |

## アクセシビリティ

- 数値のみのバッジ: **`aria-label="未読 3 件"` 等で意味を補う**
- Dot（無音インジケータ）: 親要素の `aria-label` で文脈付与（例: `aria-label="通知（未読あり）"`）
- 色だけに依存しない（アイコン + 文字でも示す）
- ラベルが短い英数字（"NEW" "BETA"）でもスクリーンリーダーで意味が通る単語を選ぶ

## 使ってよい場面 / 使ってはいけない場面

✅ アイコン / アバターに付ける未読カウント
✅ リスト項目のステータス表示（承認済・処理中）
✅ メニューの「新機能」マーク

❌ 主要な情報（重要度が高いもの） — Alert / Toast へ
❌ 操作可能要素 — Button を使う（バッジはクリック不可前提）
❌ 長文 — 1–3 単語まで

## レイアウト規約

- 単独配置: `display: inline-flex; align-items: center; gap: 4px`
- アンカー型: 親要素を `position: relative` にし、`position: absolute; top: -6px; right: -8px`
- アンカー型は白い 2px ボーダーで親と視覚分離

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-badge.html`）
- Code Connect: 未対応
- 関連: Status Pill（FIG 独自の運行状態専用）/ Icon Bubble（装飾的アイコンコンテナ）
