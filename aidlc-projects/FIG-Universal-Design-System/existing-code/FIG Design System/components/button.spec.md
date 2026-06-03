# Button — Component Spec

> 🛡️ 先に [`design-system.md`](../design-system.md) の **Design System Rules** を読むこと。本仕様は Semantic 層のトークンのみを参照する。

## 目的

ユーザーが実行可能な操作を表現する最小単位。アプリ内の **意思決定の終端**（決済する／検索する／キャンセルする等）。リンクではなく**動作**を伴うものに使う（遷移のみなら `<a>`）。

## バリエーション

| 種別 | 用途 | コンポーネント |
|---|---|---|
| Primary | 画面の主要 CTA。1 画面に 1 つが原則 | `<PrimaryButton>` |
| Secondary | サブ操作、補助 CTA | `<SecondaryButton>` |
| Tertiary（Ghost） | キャンセル、戻る、テキスト型 | （未実装。本仕様で予約） |
| Destructive | 削除・ログアウト | （未実装。本仕様で予約） |
| Icon-only | アイコンだけのトリガー | （Header メニュー等で利用中、未抽象化） |

## Props（契約）

```ts
type ButtonProps = {
  children: ReactNode;          // ラベル文言（必須、空禁止）
  icon?: LucideIconName;        // 任意の lucide アイコン
  iconPosition?: 'leading' | 'trailing';  // 既定: 'leading'
  onClick?: (e) => void;
  disabled?: boolean;
  loading?: boolean;            // true で操作ロック + スピナー
  fullWidth?: boolean;          // 既定 true（モバイル前提）
  type?: 'button' | 'submit' | 'reset';  // 既定 'button'
  ariaLabel?: string;           // icon-only の時は必須
};
```

**禁止事項：** `style` / `className` で見た目を上書きしないこと。視覚バリアントが必要なら新規 variant を本ドキュメントに追加する。

## FIGセンス（角丸とアイソレーション）

- **Primary は Pill 形状（`--radius-cta`）が原則**。FIGロゴの円弧 DNA / Rounded-X M+ の丸さを最も強く継承するロール。1 画面の主要 CTA が「ブランドの語気」を担う。
- **Secondary は `--radius-button`（16px）に留める**。"素早さと信頼の中庸"。Primary の柔らかさに対し、補助 CTA は適度な硬さを残して情報の優先順位を視覚化する。
- **CTA 周辺は `--isolation-cta` 余白を確保**。ロゴマニュアル準拠のアイソレーション規約をUIに継承し、CTA を他要素で囲って意味を弱めない。

## トークン参照

| 役割 | Primary | Secondary |
|---|---|---|
| 背景 | `var(--color-surface-brand)` | `var(--color-surface-inverse)` |
| 文字 | `var(--color-text-onBrand)` | `var(--color-text-inverse)` |
| 角丸 | `var(--radius-cta)` (Pill — FIGセンス核) | `var(--radius-button)` (16px) |
| Padding | `var(--layout-control-padding-inline) var(--layout-control-padding-block)` (20/12px) | 同上 |
| 周辺アイソレーション | `margin: var(--isolation-cta)`（隣接要素との最小距離） | 同上 |
| タイポ | `var(--typography-body-strong)` + `letterSpacing: var(--tracking-jp-label)` | `var(--typography-body-strong)` |
| 影 | `var(--surface-elevation-floating)` (ブランドティント) | `var(--surface-elevation-card)` |
| Min height | `var(--interactive-primary-min-height)` (48px) | `var(--interactive-secondary-min-height)` (44px) |
| Hit area | `var(--a11y-touch-target)` 以上を保証 | 同上 |

> **コンパクト/アイコンボタン**：小型ボタンは `--radius-button-compact` (12px)、アイコン単独ボタンは `--radius-icon-button` (Pill / 円形)。生プリミティブ `--radius-*` を直接参照しないこと。

## 状態と Motion

| 状態 | 視覚 | トークン |
|---|---|---|
| default | 標準 | — |
| hover | 半透明オーバーレイ（色を直接変えない） | `var(--state-hover-overlay)` |
| pressed | `scale(0.98)` | `var(--state-pressed-scale)` + `var(--motion-press)` |
| focused | フォーカスリング | `outline: var(--a11y-focus-ring); outline-offset: var(--a11y-focus-ring-offset);` |
| disabled | opacity + ポインタロック | `opacity: var(--state-disabled-opacity); cursor: not-allowed;` |
| loading | テキスト透過 + 中央スピナー | `var(--motion-enter)` でスピナー fade-in |

## アクセシビリティ

- `disabled` 時は `aria-disabled="true"` を併記（属性 disabled だけだとフォーカスが当たらず通知できない場面がある）。
- icon-only の場合は `ariaLabel` 必須。lucide アイコンのみでは意味が伝わらない。
- ローディング中は `aria-busy="true"`。
- フォーカスリングを `outline: none` で消すのは禁止。Brand 上では `--a11y-focus-ring-brand`、Error 上では `--a11y-focus-ring-error` を使い分ける。
- タップ可能領域は最低 44×44。視覚サイズが小さい時は `padding` か `--a11y-hit-area-expand` で拡張。

## 使ってよい場面 / 使ってはいけない場面

✅ 「決済する」「検索する」「定期券を発行」など **動作の確定**
✅ モーダルの主アクション
❌ ページ遷移のみ → `<a>` を使う
❌ トグル / ラジオ → `<Switch>` / `<Radio>` を使う
❌ 同一画面に 2 つ以上の Primary

## レイアウト規約

- モバイル既定: `fullWidth` (画面端まで)
- 横並び: Primary を**右**、Secondary を**左**（Apple HIG 準拠、自然な視線移動）
- ボタン間隔: `var(--space-3)` (12px)

## 実装現況

`ui_kits/busapp/BusappComponents.jsx` の `<PrimaryButton>` / `<SecondaryButton>` は現在 **生 HEX / pixel 値で実装**。本仕様準拠へリファクタするのが次タスク（typography refactor と同パターン）。
