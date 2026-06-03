# Bottom Navigation — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。

## 目的

モバイルアプリの **常時表示されるグローバルナビ**。画面下端に固定され、親指で届く位置から全主要セクションへワンタップでアクセスする。

> **注：** 本プロジェクトは現在 `<SegmentedTabs>` を**上部**に配置している。Bottom Navigation 採用時は、Tabs と意味が衝突しないよう責務分離を厳守すること（Bottom Nav = アプリ全体のセクション、Tabs = 画面内の並列ビュー）。

## バリエーション

| 種別 | 用途 |
|---|---|
| Standard | 3–5 タブ、アイコン + ラベル |
| Compact | 3–5 タブ、アイコンのみ（縦領域節約。a11y 配慮要） |
| With FAB | 中央に FAB を埋め込む（4 タブ + FAB 構成） |

## Props（契約）

```ts
type BottomNavProps = {
  items: Array<{
    value: string;
    label: string;            // compact でも内部で必要（aria-label として使う）
    icon: LucideIconName;     // active / inactive 共通
    activeIcon?: LucideIconName;  // 任意。filled 系アイコンに差し替え
    badge?: number | true;    // 数値 or ドット
    disabled?: boolean;
  }>;
  active: string;
  onChange: (value: string) => void;
  variant?: 'standard' | 'compact';  // 既定 'standard'
  fab?: { icon: LucideIconName; onClick: () => void; ariaLabel: string };
  ariaLabel: string;          // ナビゲーション全体の説明（必須）
};
```

## トークン参照

| 役割 | トークン |
|---|---|
| 高さ | `var(--interactive-bottom-nav-height)` (64px standard / 56px compact) |
| 背景 | `var(--color-surface-glass)` (white 70% + blur) |
| ボーダー上端 | `1px solid var(--color-border-subtle)` |
| 影 | `var(--surface-elevation-floating)` ※ 上向き |
| Z-index | `var(--z-sticky)` (200) ※ Drawer 未満 |
| Safe area | `padding-bottom: var(--safe-area-bottom)` |
| 各アイテム高さ | `var(--interactive-bottom-nav-item-height)` (56px) |
| アイコンサイズ (standard) | `24px` lucide |
| アイコンサイズ (compact) | `28px` lucide |
| ラベルタイポ | `var(--typography-caption)` + `letter-spacing: var(--tracking-wide)` |
| アクティブ文字 / アイコン | `var(--color-text-brand)` / `var(--color-icon-brand)` |
| 非アクティブ | `var(--color-text-muted)` / `var(--color-icon-default)` |
| Badge bg | `var(--color-surface-error)` (数値) / `var(--color-status-delayed-fg)` (ドット) |
| Badge fg | `var(--color-text-inverse)` |
| Badge タイポ | `var(--typography-eyebrow)` (数値) |
| FAB サイズ | `var(--interactive-fab-size)` (56px) |
| FAB 角丸 | `var(--radius-icon-button)` (Pill / 円形) |
| FAB 背景 | `var(--color-surface-brand)` |
| FAB 影 | `var(--surface-elevation-floating)` |
| FAB 周辺余白 | `var(--isolation-cta)`（ブランド要素のアイソレーション） |
| 切替モーション | `var(--motion-tab-switch)` |

## 状態

| 状態 | 振る舞い |
|---|---|
| active | brand 色、アイコンを `activeIcon` に差し替え（あれば）、ラベル太字 |
| inactive | muted 色 |
| hover | bg overlay `var(--state-hover-overlay)` |
| pressed | `scale(0.96)` + `var(--motion-press)` |
| focused | `outline: var(--a11y-focus-ring)` （セル単位、内側にインセット） |
| badge: 99+ | 数値 ≥100 は `99+` 表記に切り替え |

## ルール

- **タブ数は 3〜5**。2 だと bottom nav の意義が薄く（Tabs で十分）、6 以上は親指で押し分けられない。
- **画面遷移は左右移動として扱える構成**にする（タブ A → タブ B が「戻る」ではなく「横移動」と認識される配置）。
- **モーダル / フルスクリーンビュー上では非表示**。ボトムシートやドロワーで隠れる場面は OK。
- **タブ切替時の戻る挙動**: 各タブのスタックは独立に保つ（タブ A で 3 階層 → タブ B → タブ A に戻ると 3 階層目に戻る）。
- **Badge は通知数のみ**。ステータスや進行度には使わない（情報過多になる）。
- **`with FAB` は標準ナビとの**両立で慎重に**運用**: FAB のアクションは「現在のタブ」ではなく「アプリ全体」に対するもの（新規作成等）であること。

## アクセシビリティ

- `<nav aria-label="...">` で囲む。
- 各アイテムは `<button>` または `<a>`。`aria-current="page"` をアクティブに付与。
- compact variant では `aria-label` でラベル相当の情報を必ず提供（視覚的にアイコンしかなくても読み上げで識別可能に）。
- Badge は装飾扱いせず `aria-label="未読 3 件"` のような可読文を付与。
- 全アイテムが 44×44 を満たす（コンテナ高 56px + horizontal padding で確保）。
- `prefers-reduced-motion` で切替アニメは即時化（semantic.css が自動対応）。

## レイアウト規約

- 横並びは `flex: 1` の等幅。
- FAB あり構成では中央セルを FAB に置き換え、両側を 2-2 に分割。
- 縦幅: `--interactive-bottom-nav-height` + Safe area inset。

## 実装現況

**未実装**。本仕様で予約。実装時は本仕様 → `<BottomNavigation>` 新規作成 → `BusappApp.jsx` のルーティングを上部 Tabs → Bottom Nav へ昇格させるかを別途検討。
