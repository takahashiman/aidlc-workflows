# Header / Footer — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

ページ最上部のグローバル領域（Header）と、最下部の補助領域（Footer）。**ブランド・主要ナビ・補助情報の所在を固定**し、ユーザーが画面間を移動してもアプリケーションの「居場所」を保証する。動的な操作領域ではなく、参照と移動の起点。

## バリエーション

| 種別 | 用途 | 補足 |
|---|---|---|
| Standard Header（Admin） | 水平多層ナビ。ブランド + 主要ナビ + アクション + アバター | 1280px 想定。3–5 個の nav リンク |
| Mobile Header（Consumer） | ハンバーガー + タイトル + 補助アイコン | 単層・縦積み回避 |
| Terminal Header | 大型タイトル + 時計 / 状態表示の最小構成 | 業務用ターミナル想定 |
| Footer（Admin） | 4 列グリッド：ブランド + Resources + Legal + Contact | レスポンシブで段階的に列数を減らす |
| Footer（Mobile） | 1 列スタック | リンク優先度を再考 |

## Props（契約）

| Prop | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `brand` | string \| ReactNode | ✅ | — | ブランド表示。クリックでホームへ遷移 |
| `nav` | NavItem[] | ⚠️ Admin のみ必須 | `[]` | ナビゲーション項目。`{ label, href, current }` |
| `actions` | ReactNode | — | — | 検索・通知・アバター等のアクション群 |
| `variant` | `'standard'` \| `'mobile'` \| `'terminal'` | — | プロファイル準拠 | レイアウト切替 |

## FIGセンス（角丸とアイソレーション）

- Header 高さ: 56–64px（Mobile）/ 64–72px（Admin）
- Footer 内 padding: `--space-6` 縦 / `--space-5` 横
- ブランドマーク角丸: `--radius-md`（10px）
- アバター角丸: `999px`（完全な円）

## トークン参照

| 役割 | トークン |
|---|---|
| Header 背景 | `--color-surface-default` |
| Header ボーダー | `--color-border-subtle` |
| Footer 背景 | `--color-surface-inverse` |
| Footer 文字 | `--color-text-inverse` |
| ブランドマーク背景 | `linear-gradient(--color-brand-secondary, --color-brand-primary)` |
| nav リンク（通常） | `--color-text-secondary` |
| nav リンク（現在） | `--color-text-primary` + `--color-surface-subtle` |
| 余白 | `--space-3` 〜 `--space-5` |

## 状態と Motion

| 状態 | 表現 | トークン |
|---|---|---|
| default | 標準 | — |
| hover (nav link) | 背景に `--state-hover-overlay` を重畳 | `--motion-hover` |
| current (nav link) | `--color-surface-subtle` 塗り + `--fw-semibold` | — |
| sticky scroll | `position: sticky; top: 0` + 影 `--surface-elevation-card` | — |

## アクセシビリティ

- `<header role="banner">` / `<footer role="contentinfo">` のランドマーク必須
- 主要 nav は `<nav aria-label="メイン">` で識別
- 現在ページのリンクに `aria-current="page"`
- **スキップリンク**を Header の最初に置く: `<a href="#main">本文へスキップ</a>`（focus 時のみ可視）
- アイコンのみのアクションには `aria-label` 必須
- 色だけで現在地を示さない（背景塗り + 太字の併用）

## 使ってよい場面 / 使ってはいけない場面

✅ アプリケーションの全画面で固定表示する一貫したナビゲーションが必要なとき
✅ ブランドの存在感を維持したいとき（Consumer アプリ）
✅ 業務状態（時計・運行状況）を常時可視化したいとき（Terminal）

❌ 単一画面の一時 UI（モーダル内など）— そこでは Header を出さない
❌ ナビゲーション項目が 1 つのとき（ナビではなくタイトルバーで十分）
❌ Mobile で 5 項目以上の水平 nav を表示しようとするとき（Navigation Bar / ハンバーガーへ）

## レイアウト規約

- Header: `position: sticky; top: 0; z-index: var(--z-header)`
- Footer: ページ最下部、`margin-top: auto` で押し下げ
- Admin Header: `display: flex; align-items: center; gap: var(--space-4)`
- Mobile Header: 高さ固定 56px、`safe-area-inset-top` 加算
- Footer の列数: 4 → 700px 以下で 2 → 480px 以下で 1（メディアクエリ）

## 実装現況

- Status: spec 策定済、プレビュー実装済（`preview/components-header.html`）
- Code Connect: 未対応
- Spec 起点コンポーネント: TBD（実装時に `<HeaderShell>` / `<AppFooter>` 等）
