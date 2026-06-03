# バスアプリ デザインシステム — 全体仕様書

**バス遅延情報サイト** から抽出したデザインシステムを 1 ファイルにまとめたものです。デザインシステムタブの全カードをここに統合しています。

- 出典リポジトリ: `takahashiman/BusDelayAlerts`（プライベート、コミット `0c38ec98`）
- 技術スタック: Vite + React 18 + Tailwind v4 + shadcn/ui + Radix + lucide-react + motion/react

---

## 🛡️ Design System Rules — 厳守事項

**本セクションは、AI・エンジニア・デザイナーが知らずにルールを壊さないための「契約」です。**
PR レビュー時の **MUST チェックリスト** として運用してください。違反は原則 reject。例外は本ドキュメントに追記してから適用します。

### 0. 三層アーキテクチャ（命の根幹）

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3 : Component       ← React コンポーネント                 │
│            （StatusPill, RouteCard, PassCard, etc.）              │
│              ▲ 参照のみ                                            │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2 : Semantic        ← semantic.css                         │
│            （color.* / typography.* / elevation.* /               │
│              motion.* / a11y.* / state.* / surface-* など）       │
│              ▲ 参照のみ                                            │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1 : Primitive       ← primitives.css                       │
│            （--space-* / --font-size-* / --elevation-xs..2xl /    │
│              --z-* / --focus-ring-width / 生 HEX など）           │
└─────────────────────────────────────────────────────────────────┘
```

**依存方向の原則：** 上の層は下の層のみを参照する。**逆流禁止**。
- Component は Semantic のみを参照。Primitive を**直接参照してはならない**（例外: `--space-*` の構造値のみ可）。
- Semantic は Primitive を参照する。Component を参照してはならない。
- Primitive は何にも依存しない（自己完結）。

### 1. 🚫 直書き禁止リスト（MUST NOT）

以下を React/JSX/CSS に**直書きすると即 reject**。必ず対応するトークン経由で記述する。

| 禁止 | 代わりに使う |
|---|---|
| `color: #26B7BC` | `var(--color-text-brand)` |
| `background: #fff` | `var(--color-surface-default)` |
| `border: 1px solid #E2E8F0` | `var(--color-border-default)` |
| `box-shadow: 0 4px 30px rgba(0,0,0,0.03)` | `var(--surface-elevation-card)` 等 |
| `fontSize: 22, fontWeight: 800` | `font: var(--typography-arrival-time)` |
| `lineHeight: 1.5` | `var(--lh-base)`（または typography ロール経由） |
| `transition: opacity 0.3s ease-out` | `transition: opacity var(--motion-enter)` |
| `cubic-bezier(0.22, 1, 0.36, 1)` | `var(--ease-out-expo)` |
| `z-index: 50` / `z-index: 9999` | `var(--z-modal)` 等 |
| `outline: 2px solid #38A1DB` | `outline: var(--a11y-focus-ring)` |
| `min-height: 44px`（タップ目的） | `min-height: var(--a11y-touch-target)` |
| `rgba(色, 0.7)` | `color-mix(...)` + `var(--opacity-70)` |
| 絵文字（🚌 等） | lucide-react アイコン |

### 2. ✅ 必ず守ること（MUST）

1. **色は必ず Semantic 経由**。`color.text.*` / `color.surface.*` / `color.icon.*` / `color.border.*` を使う。生 HEX が必要になったら**まず Semantic に追加してから**コンポーネントで参照する。
2. **タイポは Role トークン経由**。`--typography-arrival-time` 等のショートハンドを `font:` に渡す。`font-variant-numeric` だけは shorthand に含められないので `fontVariantNumeric: var(--font-variant-numeric)` を併記する。
3. **影と z-index はペアで使う**。`--surface-elevation-*` を使えば対応する `--elevation-z-*` も自動で揃う。バラバラに指定しない。
4. **モーションは ロール経由**。`motion.enter` / `motion.modalIn` 等から選び、duration と easing を別々に指定しない。
5. **タップ可能要素は最小 44×44**。視覚サイズが小さいなら `padding` か `--a11y-hit-area-expand` で拡張。
6. **キーボードフォーカスは必ず可視化**。`outline: none` の単独使用禁止。代替を出さずにフォーカスを消すのは a11y 違反。
7. **新トークンを追加したら本ドキュメントを更新**。コードだけ更新するのは禁止。トークンの正典は本ファイル。
8. **`prefers-reduced-motion` を尊重**。`semantic.css` が一括上書きするので、コンポーネント側で生 duration を書かなければ自動で機能する。

### 3. 🚧 注意事項（SHOULD）

1. **Tailwind の任意値（`text-[22px]`, `bg-[#26B7BC]` 等）は原則禁止**。トークンに対応する Tailwind クラスがなければ、`semantic.css` に役割ユーティリティクラスを追加する。
2. **ホバーはオーバーレイ方式**を採用（`state.hover.overlay`）。サーフェス色を直接変えない（どの色のカードでも一貫した触感を出すため）。
3. **同一サーフェスで elevation を 2 段以上ジャンプしない**。`elevation.1 → elevation.2`（ホバーで 1 段上げ）が原則。
4. **ネストは 3 段まで**。surface.default → container-low → container → container-high は 4 段あるが、同一カード内で 3 段以上使わない。
5. **アイコンは lucide-react のみ**。stroke-width 2、色は `currentColor`。カスタム SVG / 絵文字 / アイコンフォントの混在禁止。
6. **コンポーネントの中に直接 React state でスタイルを揺らがせるな**。状態は CSS variables 経由でテーマ可能に保つ。
7. **マジックナンバー禁止**。`marginTop: 10` のような半端値は `--space-*` ラダーから選び直す（4px ステップ）。

### 4. ⚖️ 例外申請プロセス

ルールを破る正当な理由がある場合：

1. **本ドキュメントに「§例外」として記録**。場所・理由・期限を明記。
2. **コード上のコメントで `// EXCEPTION: <理由>` を残す**。
3. **3 ヶ月以内に Semantic 層への昇格 or 削除を再評価**。

未記録の直書きは「壊れた窓」となり、システム全体の信頼性を毀損するため絶対に放置しない。

### 5. 🤖 AI / Claude への指示（最重要）

AI に対するシステムプロンプトに、以下を**必ず含めてください**：

```
This project has a strict design system. You MUST:
1. NEVER write raw HEX colors, pixel font sizes, hard-coded box-shadows,
   raw cubic-bezier, or numeric z-index in component code.
2. ALWAYS reference semantic tokens from semantic.css:
   --color-*, --typography-*, --surface-elevation-*, --motion-*,
   --a11y-*, --z-*, --opacity-*, --state-*.
3. If a required token does not exist, propose adding it to semantic.css
   FIRST, then update design-system.md, THEN use it in components.
4. Read design-system.md before generating any component code.
```

### 6. 🔍 PR レビュー チェックリスト

- [ ] 生 HEX / pixel 値 / cubic-bezier / 数値 z-index を直書きしていない
- [ ] 新規色・サイズ・モーションを使う場合、Semantic 層に追加されている
- [ ] `outline: none` を使う場合、代替フォーカス表示が定義されている
- [ ] タップ可能要素が 44×44 を満たしている
- [ ] `prefers-reduced-motion` で全アニメが停止することを確認している
- [ ] アイコンが lucide-react で、絵文字を混ぜていない
- [ ] design-system.md とコードの内容に乖離がない

---

## 目次

1. [概要](#概要)
2. [カラー](#カラー)
3. [タイポグラフィ](#タイポグラフィ)
4. [スペーシング・角丸・シャドウ](#スペーシング角丸シャドウ)
5. [コンポーネント](#コンポーネント)
6. [ブランド](#ブランド)
7. [Material Theme Builder トークン割当](#material-theme-builder-トークン割当)
8. [セマンティックトークン](#セマンティックトークン)
9. [コンテンツの基本](#コンテンツの基本)
10. [既知の制約](#既知の制約)

---

## 概要

| 項目 | 内容 |
|---|---|
| プロダクト | 単一 Web アプリ。**運行情報**（全地域）と **乗車・決済**（京都のみ／NFC 定期券）の 2 タブ構成 |
| トーン | ですます調、やや謝罪寄り。公共交通の「お知らせ」に近い文体。**絵文字なし** |
| 主色 | FIG ターコイズ `#26B7BC`。背景はFIG ターコイズ・ブルーの淡いグラデーション |
| タイポ | OS の日本語システムスタック。プレビューは Noto Sans JP で代替 |
| アイコン | lucide-react のみ。stroke-width 2、currentColor 継承 |
| アニメーション | motion/react、expo-out 既定。詳細は §セマンティックトークン §6 motion.* に集約 |

### 対応地域

- 京都府 / 兵庫県 / 大分県 / 沖縄県（+ スキップ状態）
- 地域は `localStorage` に永続化
- **京都府のみ** 「乗車・決済」タブが有効化される

---

## カラー

### ブランドカラー

| 名前 | HEX | 用途 |
|---|---|---|
| brand-primary | `#26B7BC` | プライマリ。アクティブタブ、通常運行、CTA |
| primary-light | `#5CCED2` | 定期券グラデーションの中間色 |
| primary-dark | `#1A8589` | 定期券グラデーションの暗色端 |
| pass-grad | `linear-gradient(135deg, #26B7BC, #5CCED2, #1A8589)` | 定期券カードのヒーロー |
| app-bg | `linear-gradient(135deg, #EFF9FA, #F4F8FB, #EBF4FB)` | ページ全体の背景ウォッシュ |

### ニュートラル（slate スケール）

| 名前 | HEX | 用途 |
|---|---|---|
| slate-50 | `#F8FAFC` | 最薄背景、ホバー塗り |
| slate-100 | `#F1F5F9` | カード分割線、サイドバー区切り |
| slate-200 | `#E2E8F0` | 入力ボーダー、タブ非アクティブ背景 |
| slate-300 | `#CBD5E1` | 補助ボーダー |
| slate-400 | `#94A3B8` | プレースホルダー、アイコン既定色 |
| slate-500 | `#64748B` | 補助テキスト、マイクロコピー |
| slate-600 | `#475569` | 二次見出し |
| slate-700 | `#334155` | 本文 |
| slate-800 | `#1E293B` | 主見出し、路線番号バッジ、ダーク CTA |
| slate-900 | `#0F172A` | 最暗。スクリム |

### ステータスカラー

| 状態 | 背景 | 前景 | ラベル |
|---|---|---|---|
| 通常運行 | `#ECFDF5` | `#047857` | 通常運行 |
| 遅延の可能性 | `#FFFBEB` | `#B45309` | 遅延の可能性 |
| 遅延確定 | `#FEF2F2` | `#B91C1C` | 約◯分遅延 |
| 運休 | `#FEF2F2` | `#B91C1C` | 運休 |
| 通過済 | `#F1F5F9` | `#64748B` | 通過済 |

その他の意味色:

- 成功（モーダル / 乗車中）: `#10B981 / #059669 / #047857`
- 警告アクセント: `#F59E0B`
- エラー再試行ボタン: `#F97316`

---

## タイポグラフィ

### フォントスタック

```
font-family:
  'Noto Sans JP',
  'Hiragino Sans',
  'Yu Gothic',
  'Meiryo',
  system-ui,
  sans-serif;
```

- 原本はカスタム Web フォントなし。OS の日本語システムスタックに依存
- プレビュー一貫性のため Noto Sans JP（Google Fonts）で代替
- 等幅: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

### サイズスケール

| 用途 | サイズ | ウェイト |
|---|---|---|
| ヒーロー / 区間表示 | 28–32px | 800（extrabold） |
| セクションタイトル | 18px | 700 |
| 本文 | 14px | 400–500 |
| ステータスバッジ | 13–14px | 600 |
| マイクロコピー | 11–12px | 500 |
| サイドバーセクション見出し | 11px | 700, uppercase, tracking-wider |

### ウェイト

- 400 / 500 / 600 / 700 / 800
- 800 は定期券カードのヒーローテキスト専用

---

## スペーシング・角丸・シャドウ

### スペーシング

| 用途 | 値 |
|---|---|
| ページ余白（モバイル） | `px-4 py-5` |
| カード内側（標準） | `p-4` |
| カード内側（定期券） | `p-5`–`p-6` |
| カード間の縦間隔 | `space-y-4` |
| アイコン + ラベル | `gap-1.5`–`gap-3` |
| ヘッダー高さ | `py-3`（約 52px） |
| 最大コンテンツ幅 | `max-w-3xl`（約 768px） |
| サイドバー幅 | `w-72` |

### 角丸

| 用途 | 値 |
|---|---|
| shadcn ボタン / 入力 | `rounded-md`（6px） |
| アプリ内ボタン | `rounded-xl`（12px） |
| 標準カード | `rounded-xl`（12px） |
| タブバー | `rounded-2xl`（16px） |
| ヒーロー | `rounded-[20px]` |
| 定期券カード | `rounded-[28px]` |
| ピル・バッジ | `rounded-full` |

### シャドウ

| 用途 | 値 |
|---|---|
| ヘッダー | `0 4px 30px rgba(0,0,0,0.03)` |
| カードホバー | `shadow-lg`（Tailwind 既定） |
| アクティブタブ | `0 2px 16px rgba(0,0,0,0.06)` |
| FAB | `0 8px 30px rgba(0,0,0,0.12)` |
| 定期券カード | `0 20px 50px rgba(38, 183, 188,0.25)` |

インナーシャドウ（`box-shadow: inset`）は使用しません。

---

## コンポーネント

### ボタン

#### PrimaryButton

```
背景:       #26B7BC
文字色:     #fff
パディング: 14px 22px
角丸:       20px
シャドウ:   0 8px 30px rgba(38, 183, 188,0.20)
フォント:   16px / 700 / letter-spacing 0.02em
ホバー:     scale(0.98) on press
```

#### SecondaryButton

```
背景:     #1E293B
文字色:   #fff
角丸:     16px
フォント: 15px / 700
```

### ステータスピル

5 状態の色対応表（前述のステータスカラー参照）。ピル内部構造:

```
display:    inline-flex
gap:        6px
padding:    8px 14px
border-radius: 9999px
font-size:  13px
font-weight: 600
icon:       16px lucide
```

### タブバー

```
背景:     rgba(226,232,240,0.50)
パディング: 6px
角丸:     16px
backdrop-filter: blur(6px)
border:   1px solid rgba(226,232,240,0.50)
```

アクティブセグメント:
- 標準: `background: #fff`、`color: #26B7BC`
- 決済タブのアクティブのみ: `background: #26B7BC`、`color: #fff`（ツートーン強調）

### バス路線カード

```
背景:     #fff
ボーダー: 1px solid #E5E7EB
角丸:     12px
パディング: 16px
```

内部構成:
- 上段: IconBubble（route アイコン）+ 「ルート設定」ラベル
- 中段: 乗車地 / 降車地セレクター（矢印で連結）
- 下段: マッチした便のサマリー（バス名 / 経路 / ETA / ステータスピル / 遅延理由）

### 定期券カード（Pass Card）

```
背景:     linear-gradient(135deg, #26B7BC, #5CCED2, #1A8589)
文字色:   #fff
角丸:     28px
パディング: 24px
ボーダー: 1px solid rgba(255,255,255,0.15)
シャドウ: 0 20px 50px rgba(38, 183, 188,0.25)
```

状態:
- **有効（乗車前）**: 標準グラデ
- **乗車中**: グラデを `#10B981 → #059669 → #0F766E` に切替、`乗車中` バッジに breathing ドット
- **期限切れ**: グラデを `#94A3B8 → #64748B → #475569` に切替、日付に取り消し線

### 入力フィールド

```
背景:     #fff
ボーダー: 2px solid #E2E8F0
角丸:     12px
パディング: 12px 16px
フォント: 15px / 500
未入力時: color #94A3B8
入力後:   color #111827
```

### リスト行（サイドバー）

```
パディング: 12px
角丸:     12px
ホバー:   background #F8FAFC
左:       アイコン（slate-400）+ ラベル（slate-700, 500）
右:       任意の補助 + ChevronRight（slate-300）
```

### モーダル

```
オーバーレイ: rgba(0,0,0,0.30) + backdrop-blur(6px)
パネル:
  最大幅:     380px
  背景:       #fff
  角丸:       28px
  シャドウ:   0 25px 50px -12px rgba(0,0,0,0.25)
登場アニメ:   scale 0.92 → 1, opacity 0 → 1, easing [0.22, 1, 0.36, 1]
```

---

## ブランド

### ロゴ

- リポジトリ内に画像ロゴアセットなし
- ヘッダーは `バスアプリ` のテキストワードマークのみ
- 本デザインシステムでは `assets/logo.svg` として簡易ワードマークを再現

### アイコノグラフィ

- **lucide-react のみ** を使用
- カスタム SVG イラスト・アイコンフォント・PNG アイコンは一切なし
- ストロークは lucide 既定（2）
- 色は `currentColor` 継承

主要アイコン:

```
User, Settings, Bell, X, LogOut,
ChevronRight, ChevronDown, ChevronLeft,
Ticket, MapPin, Bus, Clock, CheckCircle, XCircle,
Info, Smartphone, Nfc, ShieldCheck, ShieldOff,
AlertTriangle, HelpCircle, ArrowLeftRight,
CalendarDays, Hash, Apple, MonitorSmartphone,
Check, RotateCcw, CircleDollarSign, RefreshCw,
Route, CreditCard, LayoutTemplate, Map, Menu
```

サイズ目安:

| 用途 | サイズ |
|---|---|
| インライン | 14px |
| ステータス / リスト行 | 16px |
| セクション見出し | 20px |
| タブ / メニュー主要 | 24px |
| NFC ヒーロー | 48px |

絵文字は使用しません。Unicode 文字をアイコン代わりに使うのは定期券の区間表示 `↔` のみ。

### アニメーション

ライブラリは `motion/react`（Framer Motion）。duration / easing / spring の全数値は [§セマンティックトークン §6 `motion.*`](#6-motion---モーションセマンティック) に集約されています。コンポーネント側は本トークン経由でのみ動かしてください。

頻出パターン: `opacity 0→1` + `y ±8〜±30`、モーダル `scale 0.92→1`、NFC パルス、`乗車中` バッジの breathing dot。
- ホバー: `hover:bg-slate-50` / `hover:bg-[#26B7BC]/10`
- プレス: `active:scale-[0.98]`、NFC のみ `whileTap={{ scale: 0.92 }}`

---

## Material Theme Builder トークン割当

Tertiary（装飾アクセント）と Warning（警告ステータス）を明確に分離した構成。Core colors はブランド軸、Status は意味軸として別管理します。

### Core — ブランド / ニュートラル / アクセント

| トークン | 推奨 HEX | 役割 | 用途 |
|---|---|---|---|
| **Primary** | `#26B7BC` | Core Brand — 運行 / 安心 / 基本ブランド | 運行情報タブ、通常運行ピル、「あと◯分」（通常時）、定期券グラデ、地域インジケータ |
| **Secondary** | `#334155` | Informational Neutral — 濃色情報 UI | 路線番号バッジ、ヘッダー濃色テキスト、セカンダリボタン、FAB、時刻表の数値ブロック |
| **Tertiary** | `#38A1DB` | Decorative / Smart — MaaS / AI / Future / Accent | AI 提案、最短ルートサジェスト、新機能告知、パーソナライズドピン、プレミアム状態 |

### Status — 意味色

| トークン | 推奨 HEX | 用途 |
|---|---|---|
| **Success** | `#047857` | 通常運行ピル、完了モーダル、定期券「乗車中」 |
| **Warning** | `#B45309` | 「遅延の可能性」ピル、注意バナー、淡黄ウォッシュ |
| **Error** | `#DC2626` | 「遅延確定」ピル、運休、エラーモーダル、ログアウト |

### Neutral — サーフェス

| トークン | 推奨 HEX | 用途 |
|---|---|---|
| **Neutral** | `#64748B` | 背景グラデ、白カード、サイドバー、区切り線 |
| **Neutral Variant** | `#94A3B8` | プレースホルダー、マイクロコピー、アイコン既定色、入力ボーダー |

**Source color** には `#26B7BC` を入力してください。自動生成パレットは彩度が上がりがちなので、Primary / Secondary / Tertiary は上記値で手動オーバーライドすることを推奨します。

**設計意図:** Material 3 の Tertiary は本来「アクセント / 装飾」のスロットで、警告色を兼任させると意味が衝突します。Tertiary `#38A1DB` を MaaS・AI・未来機能の装飾アクセントとして純粋に運用し、警告は Status トークン下で Success / Error と並ぶ意味色として安定させます。Secondary を `#334155` に一段浅めへ調整したのは、Primary（teal）と Tertiary（indigo）の彩度差に挟まれて Secondary が暗く沈みすぎないよう、情報 UI 寄りにバランスを取るためです。

---

## セマンティックトークン

プリミティブ（生 HEX / `--color-brand-primary` 等）を意味ロールに再マッピングしたセマンティック層。すべてのコンポーネントは**必ずこの層を経由**して色を参照します。実装は `semantic.css` に集約。

### 1. `color.text.*` — テキスト色

| トークン | HEX | 用途 |
|---|---|---|
| `color.text.primary` | `#1E293B` | 主見出し、強調本文 |
| `color.text.secondary` | `#334155` | 本文標準 |
| `color.text.tertiary` | `#475569` | 二次見出し、補助本文 |
| `color.text.muted` | `#64748B` | マイクロコピー、補足 |
| `color.text.disabled` | `#94A3B8` | プレースホルダー、無効テキスト |
| `color.text.inverse` | `#FFFFFF` | 濃色背景上のテキスト |
| `color.text.brand` | `#26B7BC` | ブランドリンク、アクティブタブラベル |
| `color.text.onBrand` | `#FFFFFF` | ブランド背景上のテキスト |
| `color.text.accent` | `#38A1DB` | Tertiary / MaaS・AI 強調 |
| `color.text.success` | `#047857` | 通常運行、完了 |
| `color.text.warning` | `#B45309` | 遅延の可能性、注意 |
| `color.text.error` | `#DC2626` | 遅延確定、運休、エラー |
| `color.text.link` | `#38A1DB` | 一般リンク |

### 2. `color.surface.*` — サーフェス階層

Surface 中心 UI のため、階層を明示的にトークン化します。

```
canvas  <  surface.default  <  container-low  <  container  <  container-high
（ページ背景）   （白カード）       （内部サブ）        （状態カード）     （タブ非アクティブ等）
```

| トークン | HEX | 用途 |
|---|---|---|
| `color.surface.canvas` | gradient | ページ最下層（FIG ターコイズ・ブルーグラデ） |
| `color.surface.default` | `#FFFFFF` | 標準カード、サイドバー、モーダル |
| `color.surface.container-low` | `#F8FAFC` | カード内サブ領域、ホバー塗り |
| `color.surface.container` | `#F1F5F9` | 状態カード、ネスト要素 |
| `color.surface.container-high` | `#E2E8F0` | タブバー非アクティブ、さらに奥 |
| `color.surface.glass` | white / 70% + blur | ヘッダー、フローティング |
| `color.surface.overlay` | black / 30% | モーダル幕 |
| `color.surface.scrim` | slate-900 / 40% | サイドバー幕 |
| `color.surface.inverse` | `#1E293B` | FAB、ダーク CTA |
| `color.surface.brand` | `#26B7BC` | PrimaryButton、決済タブアクティブ |
| `color.surface.brand-subtle` | primary / 10% | ブランドソフト塗り |
| `color.surface.accent` | `#38A1DB` | Tertiary 強調塗り |
| `color.surface.success` | `#ECFDF5` | 通常運行ピル背景 |
| `color.surface.warning` | `#FFFBEB` | 遅延の可能性、注意バナー |
| `color.surface.error` | `#FEF2F2` | 遅延確定、運休、エラー |

**ルール:** 白カード内のネストは `container-low` から始めて段階的に濃く。同じカード内で 3 段以上ネストしない。ティント済みサーフェス（brand / warning / error）の上に浮きカードを重ねないこと。

### 3. `color.icon.*` — アイコン色

| トークン | HEX | 用途 |
|---|---|---|
| `color.icon.default` | `#94A3B8` | lucide 既定色 |
| `color.icon.muted` | `#CBD5E1` | ChevronRight 等の弱アイコン |
| `color.icon.strong` | `#475569` | ヘッダー、メニュー、戻る |
| `color.icon.inverse` | `#FFFFFF` | 濃色背景上 |
| `color.icon.brand` | `#26B7BC` | IconBubble brand、アクティブタブ |
| `color.icon.accent` | `#38A1DB` | Tertiary 強調 |
| `color.icon.success` / `.warning` / `.error` | 各 fg | ステータスアイコン |

### 4. `color.border.*` — ボーダー

| トークン | HEX | 用途 |
|---|---|---|
| `color.border.subtle` | `#F1F5F9` | サイドバー区切り |
| `color.border.default` | `#E2E8F0` | 入力、標準カード |
| `color.border.strong` | `#CBD5E1` | 補助ボーダー |
| `color.border.card` | `#E5E7EB` | 白カード輪郭 |
| `color.border.brand` | `#26B7BC` | 選択中ラジオ、フォーカスブランド |
| `color.border.focus` | `#38A1DB` | キーボードフォーカス |
| `color.border.warning` | `rgba(253,230,138,0.60)` | 警告枠 |
| `color.border.error` | `#FECACA` | エラー枠 |

### 5. `elevation.*` — 浮き上がり階層

サーフェスが「どれだけ浮くか」を 6 段階で表現します。`box-shadow` と `z-index` がペアでトークン化されており、コンポーネントは生のシャドウ値や数値 z-index を直書きせず、必ず本トークンを経由します。

| トークン | box-shadow | z-index | 用途 |
|---|---|---|---|
| `elevation.0` | `none` | `0` (`--z-base`) | フラット（背景、入力エリア、リストセル） |
| `elevation.1` | `0 1px 2px / 0 1px 3px` 弱影 | `100` (`--z-raised`) | 静止状態のカード、低位ボタン |
| `elevation.2` | `0 4px 12px / 0 2px 4px` 中影 | `300` (`--z-dropdown`) | ホバー状態のカード、プルダウン、サイドバー |
| `elevation.3` | `0 8px 30px rgba(0,0,0,.12)` | `400` (`--z-fab`) | FAB（浮遊ボタン）、スナックバー |
| `elevation.4` | `0 20px 50px -8px` 強影 + 補助 | `600` (`--z-modal`) | ダイアログ、モーダル、ボトムシート、定期券カード |
| `elevation.5` | `0 25px 50px -12px` 最強影 + 補助 | `700` (`--z-toast`) | トースト、最前面の通知 |

**ルール:**
- 同一サーフェス上に 3 段以上 elevation を重ねない（視覚的なノイズになる）。
- ブランドカラー面（`pass-card`、PrimaryButton）は標準シャドウではなくブランドティント影（`rgba(38, 183, 188,.25)` 等）を併用してよい。
- `elevation.0` は明示的に `none` を指定するためのトークンで、ボーダーや背景のみで階層を表現する場面で使用。
- `z-index` の運用詳細は [§8 `z-index` — 重なり順](#8-z-index--重なり順) に集約。マジックナンバー（`z-index: 9999` 等）の直書きは禁止。禁止。
- ホバーで `elevation.1 → elevation.2` のように 1 段だけ上げるのが原則。2 段以上ジャンプしない。

### 6. `motion.*` — モーションセマンティック

duration と easing をロールに束ねたモーション層。生の `cubic-bezier(...)` や `0.3s` をコンポーネントへ直書きせず、必ず本トークン経由で適用します。

#### duration ラダー（プリミティブ）

| トークン | 値 | 用途 |
|---|---|---|
| `--dur-instant` | 75ms | hover / press 即時フィードバック |
| `--dur-fast` | 150ms | チップ消失、退場、ボタン押下 |
| `--dur-base` | 250ms | 標準 enter / exit、タブ切替 |
| `--dur-moderate` | 400ms | モーダル登場、サイドバー、ドロワー |
| `--dur-slow` | 600ms | 大きい登場、シーン遷移 |
| `--dur-ambient-1` | 1200ms | 呼吸ドット |
| `--dur-ambient-2` | 2400ms | NFC リングパルス |
| `--dur-ambient-3` | 3000ms | 定期券シマー、長尺アンビエント |

#### easing セット（プリミティブ）

| トークン | 値 | 用途 |
|---|---|---|
| `--ease-linear` | `linear` | シマー等の等速ループのみ |
| `--ease-out-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` | **ブランド既定**。素早く減速 |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 一般的な出現 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 退場・離脱 |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 双方向遷移 |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | 強調された遷移 |
| `--ease-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | モーダル登場 |
| `--ease-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | モーダル退場 |

spring は CSS で表現できないため `motion/react` 側で固定値を採用:
- `spring.gentle` — `{ stiffness: 200, damping: 25, mass: 1 }`
- `spring.snappy` — `{ stiffness: 320, damping: 22, mass: 0.9 }`
- `spring.bouncy` — `{ stiffness: 380, damping: 14, mass: 0.8 }`

#### motion ロール（セマンティック）

| トークン | duration × easing | 用途 |
|---|---|---|
| `motion.enter` | base × out-expo | 標準登場 |
| `motion.exit` | fast × in | 標準退場 |
| `motion.hover` | instant × out | ホバー反応 |
| `motion.press` | instant × in-out | 押下 / リリース |
| `motion.focus` | fast × out | フォーカスリング |
| `motion.tabSwitch` | base × out-expo | タブ・セグメント切替 |
| `motion.dropdown` | base × out-expo | プルダウン、ポップオーバー |
| `motion.drawer` | moderate × out-expo | サイドバー・ドロワー |
| `motion.modalIn` / `.modalOut` | moderate × emphasized-decel / fast × emphasized-accel | ダイアログ・モーダル |
| `motion.toast` | base × out-expo | トースト、スナックバー |
| `motion.ambient.breathe / .pulse / .shimmer` | ambient-1 / -2 / -3 | ループアンビエント |

**ルール:**
- **生の値の直書き禁止**。`transition: opacity 0.3s ease-out` ではなく `transition: opacity var(--motion-enter)`。
- 1 つの遷移に **複数 duration を混ぜない**（A は base、B は fast にする等は避ける）。
- **2 段以上のジャンプを避ける**。`hover: instant → modal: moderate` のように要件が変わる時は明示的に別ロールを使う。
- アンビエントは **常に `--ease-in-out` または `--ease-linear`** を使用（揺らぎを避ける）。

#### アクセシビリティ — `prefers-reduced-motion`

`semantic.css` が `@media (prefers-reduced-motion: reduce)` で **全 motion トークンを `0.01ms linear` に上書き**します。コンポーネント側の改修なしで全アニメが実質静止状態になります。完全停止（0ms）ではなく 0.01ms としているのは `onTransitionEnd` / `onAnimationEnd` ハンドラの発火を維持するためです。アンビエントループに対しては個別に `animation-play-state: paused` も併用してください。

### 7. `opacity.*` — 不透明度スケール

不透明度の唯一の正典。生の `0.4` や `rgba(色, 0.7)` をコンポーネントに直書きせず、必ずプリミティブまたはロールトークンを経由します。

#### プリミティブスケール（10 段）

| トークン | 値 | 主な参照先 |
|---|---|---|
| `--opacity-0` | 0 | フェード起点 |
| `--opacity-5` | 0.05 | hover overlay |
| `--opacity-10` | 0.10 | tint、ブランドサブトル、pressed overlay |
| `--opacity-20` | 0.20 | — |
| `--opacity-30` | 0.30 | 強オーバーレイ、focus ring fill |
| `--opacity-40` | 0.40 | disabled、scrim |
| `--opacity-60` | 0.60 | muted |
| `--opacity-70` | 0.70 | glass |
| `--opacity-80` | 0.80 | warn-bg、subtle、glass-strong |
| `--opacity-90` | 0.90 | dragged |
| `--opacity-100` | 1 | 完全不透明 |

#### ロール（セマンティック）

| トークン | 値 | 用途 |
|---|---|---|
| `opacity.disabled` | `0.40` | 無効状態 |
| `opacity.muted` | `0.60` | 補助情報、二次テキスト |
| `opacity.subtle` | `0.80` | ほぼ不透明、ごく軽い沈み |
| `opacity.dragged` | `0.90` | ドラッグ中の浮遊感 |
| `opacity.overlay-light` | `0.05` | hover オーバーレイ |
| `opacity.overlay` | `0.10` | pressed、ブランドティント |
| `opacity.overlay-strong` | `0.30` | 強オーバーレイ |
| `opacity.scrim` | `0.40` | モーダル / ドロワー背面 scrim |
| `opacity.glass` | `0.70` | ガラスサーフェス（ヘッダー等） |
| `opacity.glass-strong` | `0.80` | ティント面（warn-bg 等） |

既存の `--state-disabled-opacity` / `--state-dragged-opacity` は本ロールを参照する形にリファクタ済み。

**ルール:**
- **`rgba(色, 0.XX)` 直書き禁止**。透過色は `color-mix(in srgb, var(--color-*), transparent calc((1 - var(--opacity-*)) * 100%))` または既存合成済みトークン（`--surface-glass` 等）経由で生成。
- **同一面に 3 段以上の半透明を重ねない**（視覚ノイズと色ずれの原因）。
- **scrim より上のレイヤーは `opacity-80` 以上を維持**（読みやすさを担保）。
- **テキスト透過時は WCAG コントラスト評価を合成後の色で行う**。`muted` (`0.60`) を文字色に使う場合、背景との合成色で AA 4.5:1 を満たすか確認。
- 完全不透明には `--opacity-100` を明示し、`opacity` プロパティの省略に頼らない。

### 8. `z-index` — 重なり順

スタッキングコンテキスト全体の正典。`primitives.css` の `--z-*` スケールを 100 刻みで定義し、各層の間に 99 個の差し込み余地を残しています。**`z-index: 数値` の直書きは禁止**。必ずトークン経由で指定します。

#### スケール（プリミティブ）

| トークン | 値 | 役割 | 該当コンポーネント |
|---|---|---|---|
| `--z-base` | 0 | 通常フロー、フラット | 本文、リストセル、入力 |
| `--z-raised` | 100 | 地表面より一段上 | カード、低位ボタン |
| `--z-sticky` | 200 | 画面端固定 | sticky ヘッダー、フッターナビ |
| `--z-dropdown` | 300 | 一時表示の小窓 | プルダウン、ポップオーバー、メニュー、ツールチップ予備 |
| `--z-fab` | 400 | 浮遊操作 | FAB、スナックバー、固定 CTA |
| `--z-drawer` | 500 | 画面側面/下部のシート | サイドバー、ボトムシート |
| `--z-modal` | 600 | 全画面遮断 | ダイアログ、モーダル（背面 scrim 含む） |
| `--z-toast` | 700 | 最前面通知 | トースト |
| `--z-tooltip` | 700 | コンテキストヒント | ツールチップ（`--z-toast` と同レベル） |
| `--z-debug` | 9999 | 開発専用 | 本番禁止 |

#### Elevation との対応

| Elevation | z-index トークン |
|---|---|
| `elevation.0` | `--z-base` (0) |
| `elevation.1` | `--z-raised` (100) |
| `elevation.2` | `--z-dropdown` (300) |
| `elevation.3` | `--z-fab` (400) |
| `elevation.4` | `--z-modal` (600) |
| `elevation.5` | `--z-toast` (700) |

ペアリングは `semantic.css` の `--elevation-N-z` で固定されているため、コンポーネントは `elevation.*` トークン経由で同時に z-index を継承できます。

**ルール:**
- **`z-index: 50` のような数値直書き禁止**。必ず `z-index: var(--z-*)` を使用。
- **スケールを飛び越えない**。`raised → dropdown` のような隣接遷移を基本とし、`raised → modal` のような 2 段以上のジャンプは要レビュー。
- **新しい層が必要になったら +50（中間値）で差し込み**、勝手に新トークンを追加しない。本トークンの拡張は本ドキュメントを更新して行う。
- **stacking context のアンチパターン回避**: 親に `transform` / `filter` / `opacity < 1` を付けると子の z-index が親の SC に閉じ込められ、外側の `--z-modal` 等を超えられない。モーダル / トーストは `document.body` 直下に `React.createPortal` で逃がす。
- **`isolation: isolate` を必要に応じて使う**。意図せず親が SC を作ることを防げる場面で有効。
- **`--z-debug` (9999) は開発時のみ**。本番ビルドに残さない。

#### Portal 配置方針

以下のコンポーネントは DOM ツリー上で `document.body` 直下のポータルへ描画し、親要素の SC に影響されないようにする:
- ダイアログ・モーダル（`--z-modal`）
- ドロワー / ボトムシート（`--z-drawer`）
- トースト・スナックバー（`--z-toast`）
- ツールチップ（`--z-tooltip`）

プルダウン・ポップオーバーは原則ローカル配置だが、スクロールコンテナ内で切れる懸念がある場合は同様にポータル化する。

### 9. `state.*` — インタラクション状態

| 状態 | 主トークン | 値 |
|---|---|---|
| **hover** | `state.hover.overlay` | `rgba(15,23,42,0.04)` ／ brand: `rgba(38, 183, 188,0.08)` ／ solid bg: `#F8FAFC` |
| **pressed** | `state.pressed.scale` | `0.98`（標準 CTA） ／ `0.92`（NFC 等） ／ overlay: `rgba(15,23,42,0.10)` |
| **focused** | `state.focused.ring` | `0 0 0 3px rgba(56, 161, 219,0.40)` ／ brand: `rgba(38, 183, 188,0.30)` ／ offset: `2px` |
| **disabled** | `state.disabled.opacity` | `0.40` ／ bg: `#F1F5F9` ／ fg: `#94A3B8` ／ cursor: `not-allowed` |
| **dragged** | `state.dragged.shadow` | `0 12px 32px rgba(15,23,42,0.18)` ／ scale `1.02` ／ rotate `1deg` ／ opacity `0.92` |
| **selected** | `state.selected.bg` | soft: `rgba(38, 183, 188,0.10)` + border `#26B7BC` ／ strong: bg `#26B7BC` + fg `#fff` |

ホバーは**半透明オーバーレイ方式**を採用。これによりどの色のサーフェス上でも一貫した「触感」が出ます。

### 10. `color.status.*` / `color.route.*` / `color.vehicle.*` — 交通ドメイン配色

プロジェクト固有価値となるドメイントークン群。**配色（fg / bg）のみ**をトークン化し、ラベル文言やアイコン名はコード側（i18n 辞書・アイコンマッピング）で保持します。

> **📌 注記:** 本ドキュメントは「スタイルの正典」として配色のみを規定します。各ステータス・路線・車両に対応する**ラベル文言・アイコン名・順序などの実装上の定義は `statusConfigs.ts` を参照してください**。デザインシステムとコード側の責務を明確に分離することで、トークンの肥大化と多言語化時の摩擦を防ぎます。

#### `color.status.*` — 運行状態

| トークン | fg | bg |
|---|---|---|
| `color.status.onTime` | `#047857` | `#ECFDF5` |
| `color.status.delayRisk` | `#B45309` | `#FFFBEB` |
| `color.status.delayed` | `#B91C1C` | `#FEF2F2` |
| `color.status.suspended` | `#B91C1C` | `#FEF2F2` |
| `color.status.passed` | `#64748B` | `#F1F5F9` |

#### `color.route.*` — 路線種別

| トークン | fg | bg | 役割 |
|---|---|---|---|
| `color.route.local` | `#26B7BC` | tint 10% | 普通便（ブランド軸） |
| `color.route.express` | `#38A1DB` | tint 10% | 急行・特急（Tertiary 軸） |
| `color.route.rapid` | `#1E40AF` | tint 10% | 快速 |
| `color.route.community` | `#B45309` | tint 10% | コミュニティバス |
| `color.route.night` | `#1E293B` | tint 10% | 深夜便 |

#### `color.vehicle.*` — 車両種別

| トークン | fg | bg |
|---|---|---|
| `color.vehicle.bus` | `#26B7BC` | tint 10% |
| `color.vehicle.train` | `#1E40AF` | tint 10% |
| `color.vehicle.subway` | `#6B21A8` | tint 10% |
| `color.vehicle.tram` | `#B45309` | tint 10% |
| `color.vehicle.taxi` | `#CA8A04` | tint 10% |
| `color.vehicle.ferry` | `#0E7490` | tint 10% |

**ルール:**
- 本トークンは「色」のみを表現する。**ラベル文言・アイコン名はデザイントークンに含めない**（i18n / 多言語化やアイコン選定の柔軟性を確保するため）。
- ラベル・アイコン名・順序などの実装上の定義は **`statusConfigs.ts`** に集中管理する（本ドキュメントが配色の正典、`statusConfigs.ts` が実装の正典）。
- 色使いの付随ルール（赤＝警告、緑＝正常、青＝高速交通、紫＝地下鉄、褂珀＝コミュニティ）は「交通業界の慎例」に準拠。

---

## コンテンツの基本

### 言語・トーン

- **日本語のみ**。ラベル、コピー、エラー、マイクロコピーすべて
- ですます調・やや謝罪寄り・安心感を与える文体
- 公共交通の「お知らせ」に近く、おしゃべりな消費者向けアプリではない
- 「私たち vs あなた」のフレーミングは避け、第三者的にバスについて語る
- 数字は半角。円記号は `¥`
- 時刻: ログ `2026/03/11 14:23` / フロー内 `14:23`

### 実コピー例

| 場面 | コピー |
|---|---|
| ステータス（通常） | `通常運行` |
| ステータス（遅延） | `約15分遅延` |
| ステータス（運休） | `運休` |
| 遅延理由 | `事故の影響により、遅延が発生しております。ご迷惑をおかけして申し訳ございません。` |
| 雪による遅延 | `降雪の影響により、大幅な遅延が発生しております。` |
| 運休理由 | `車両故障のため、運休しております。復旧まで今しばらくお待ちください。` |
| 定期券（待機） | `定期券 有効（乗車前）` |
| 定期券（乗車中） | `乗車中` |
| タップ案内（iPhone） | `端末の先端を近づけてください` |
| タップ案内（Android） | `端末の背面をかざしてください` |
| 注意書き | `※ スマホケースに厚みがあると反応しない場合があります` |
| 完了モーダル | `ありがとうございました` |
| 失敗モーダル | `読み取りに失敗しました` / `もう一度お試しください` |
| サイドバー（ゲスト） | `ゲストユーザー` / `アカウント未登録` |

### ライティングパターン

- 遅延メッセージは「理由 → 影響」: `〈事象〉の影響により、遅延が発生しております。`
- 重大ケースは謝罪のペアで締める: `ご迷惑をおかけして申し訳ございません。`
- `※` は注意書き・デモ注釈のみ。必須事項には使わない
- サイドバーのセクション見出しはラテン大文字 + tracking-wider

---

## 既知の制約

- **フォントファイルなし**: 原本は OS の日本語システムスタックに依存。iOS Safari と完全に同じ表示が必要な場合は Hiragino Sans を別途用意してください
- **ロゴアセットなし**: ヘッダーはテキストワードマークのみ。`assets/logo.svg` で簡易再現
- **オンボーディング画面の深掘り未実施**: UI キット内では可視状態の忠実な近似のみ
- **マップ検索・路線詳細・設定・通知設定**: ソースでは独立した完全なページだが、UI キットでは要約的な単一画面で再現
- **写真・手描きイラスト・パターン・テクスチャは未使用**: 背景は色のウォッシュ + ぼかしブロブのみ

---

## ファイル構成

```
.
├── README.md                          ← 簡略版
├── design-system.md                   ← 本ドキュメント（全体仕様）
├── primitives.css                ← プリミティブトークン（生 HEX、z-index 100 刻みスケール含む）
├── semantic.css                ← セマンティック層（color.* 【交通ドメインを含む】/ elevation.* / motion.* / opacity.* / state.*、prefers-reduced-motion 対応）
├── assets/
│   ├── logo.svg
│   └── icon-mark.svg
├── index.html                          ← Cloudscape 風 Core ポータル（単一エントリ）
├── assets/portal.css                   ← ポータル専用スタイル
├── assets/js/portal.js                 ← ハッシュルーター・サイドバー・検索
├── assets/js/portal-content.js         ← SITEMAP / PAGES
├── preview/                           ← デザインシステムタブのカード（ポータルから iframe で参照）
│   ├── colors-brand.html
│   ├── colors-neutrals.html
│   ├── colors-status.html
│   ├── type-scale.html
│   ├── type-family.html
│   ├── spacing-radii.html
│   ├── spacing-shadows.html
│   ├── components-buttons.html
│   ├── components-status-pills.html
│   ├── components-tabs.html
│   ├── components-bus-card.html
│   ├── components-pass-card.html
│   ├── components-inputs.html
│   ├── components-list-rows.html
│   ├── brand-logo.html
│   ├── brand-iconography.html
│   ├── material-theme-mapping.html
│   ├── semantic-tokens.html           ← color.text / surface / icon / border
│   ├── surface-layering.html          ← Surface 階層図
│   ├── elevation.html                 ← elevation.0〜5 ラダー + z-index 対応
│   ├── z-index.html                   ← 重なり順アイソメトリックビュー
│   ├── state-tokens.html              ← hover / pressed / focused / disabled / dragged / selected
│   └── transport-domain-tokens.html   ← status / route / vehicle
├── ui_kits/busapp/                    ← クリックスルー UI キット
│   ├── index.html
│   ├── BusappComponents.jsx
│   ├── BusappScreens.jsx
│   └── BusappApp.jsx
└── SKILL.md                           ← Claude Skill マニフェスト
```
