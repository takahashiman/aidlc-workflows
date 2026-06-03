# Accessibility Guidelines — FIG Core「慈愛章」

> ♿ このファイルは FIG デザインシステムの **慈愛と共感** を、技術仕様として担保するためのものです。
>
> 「相手の立場に立つ。相手のことを考えるのを忘れてはならない」
> ― FIG VALUE
>
> 美しさ・速さ・新規性のいずれも、**「使えない人がいない」状態の上に成立**します。
> 本ガイドラインは推奨ではなく **必須要件（MUST）** として扱います。

本ガイドラインは [`design-system.md`](./design-system.md) と [`semantic.css`](./semantic.css) `--a11y-*` トークン定義を補強し、実装上の指針を提供します。

---

## 0. 適用範囲と優先度

| レベル | 内容 | 違反時の対応 |
|---|---|---|
| **MUST** | WCAG 2.2 AA 準拠。違反は merge blocker。 | PR rejection |
| **SHOULD** | WCAG AAA / 業界推奨慣行 | レビューで議論、可能な限り対応 |
| **MAY** | ベストプラクティス、強化提案 | 任意 |

**前提宣言：**

- 対象 WCAG バージョン：**2.2 Level AA**
- 対象ユーザー：色覚多様性、ロービジョン、運動機能制限、認知 / 学習特性、聴覚障害、一時的障害（屋外環境、手袋、片手操作、回線低速）含む
- 対象言語：**日本語を第一言語**として最適化（行間・禁則・字詰めを規約化）

---

## 1. Japanese Typography（日本語最適化） — **MUST**

> 「読める」は文化と言語に依存します。日本語特有の "字面の懐" を踏まえた行送り・禁則・字詰めをシステムで担保することが、慈愛の最初のかたちです。本章は **デジタル庁デザインシステム (DADS)** の知見を統合します。

### 1.1 行送り（line-height） — DADS 準拠

| ロール | 推奨 line-height | トークン |
|---|---|---|
| Display（大見出し） | **1.30** | `--lh-jp-display` |
| Headline（見出し） | **1.40** | `--lh-jp-headline` |
| Title（中見出し） | **1.50** | `--lh-jp-title` |
| **Body（本文）** | **1.75** | `--lh-jp-body` |
| Prose（案内文・長文） | **1.85** | `--lh-jp-body-loose` |
| Caption / Label | **1.50 〜 1.60** | `--lh-jp-caption` / `--lh-jp-label` |
| 数字専用（時刻・運賃等） | **1.00 〜 1.20** | `--lh-none` / `--lh-tight` |

**理由：** 漢字とかなの密度差が大きい日本語は、英文の `line-height: 1.5` では行間が詰まりすぎて読みにくくなります。本文 **1.75** は DADS 本文域の中央値であり、行をまたぐ視線移動を物理的に楽にします。

✅ OK
```css
.notice { font: var(--typography-body); }      /* 自動で lh = 1.75 */
.long-form { font: var(--typography-body-loose); } /* 1.85 — 案内文 */
```

❌ NG
```css
p { line-height: 1.4; }                /* 日本語本文として狭すぎ */
p { line-height: 24px; }               /* px固定 — 拡大時に追従しない */
```

### 1.2 字詰め（letter-spacing）

| ロール | 推奨 tracking | トークン |
|---|---|---|
| Display | **-0.02em** | `--tracking-jp-display` |
| Headline | -0.01em | `--tracking-jp-headline` |
| Title | -0.005em | `--tracking-jp-title` |
| **Body** | **0**（負の値は禁止） | `--tracking-jp-body` |
| Label / Caption | +0.02em | `--tracking-jp-label` |
| Eyebrow | +0.10em | `--tracking-jp-eyebrow` |

**禁則：** 和文本文に **負の letter-spacing は禁止**。詰めすぎると「閉じ括弧」「促音っ」「拗音ゃ」が読みにくくなり、視覚障害・低視力ユーザーにとって読解負荷が増します。

### 1.3 禁則と分断（word-break / line-break）

| 課題 | 対策 | トークン |
|---|---|---|
| 英単語が和文の途中で切れる | `word-break: keep-all` | `--word-break-jp` |
| 句読点・括弧が行頭に来る | `line-break: strict` | `--line-break-jp` |
| 長い URL がはみ出す | `overflow-wrap: anywhere` | `--overflow-wrap-jp` |
| 末尾に 1 文字だけ残る | `text-wrap: pretty` | `--text-wrap-default` |
| 見出しを 2 行に均等改行 | `text-wrap: balance` | `--text-wrap-headline` |

これらは `html, body` 既定で有効化されています。個別に上書きする場合のみクラスを使ってください。

```html
<h2 class="jp-headline">FIG が大切にしている</h2>     <!-- balance改行 -->
<p class="jp-prose">本文をゆったり読ませたいとき…</p>    <!-- 1.85 + 禁則 -->
```

### 1.4 文字サイズの下限

| 用途 | 最小 px | 補足 |
|---|---|---|
| 本文 | **14px** | システム既定。スマホでは 16px 推奨 |
| キャプション・補助 | **11px** | これより小さい文字は表示しない |
| 重要情報（金額・時刻等） | **16px 以上** | 視認性最優先 |

---

## 2. Knockout — 白抜きルール（FIGロゴマニュアル準拠） — **MUST**

> 「黒・濃色の背景では白抜きを使用」（FIGロゴマニュアル p.3, p.6）の原則を、UIコンポーネント全体の白テキスト適用規約へ拡張します。

### 2.1 大前提：明色ブランド面に白本文を置かない

FIG のブランド色（ターコイズ #26B7BC / ブルー #38A1DB）は **明度が比較的高く、白テキストとのコントラストが本文基準（4.5:1）を満たしません**。

| 面 | 白テキストとの比 | 本文可 | 大型テキスト可（≥18px or ≥14px bold） |
|---|---|---|---|
| `--color-surface-brand` (primary-dark #1A8589) | **4.85 : 1** | ✅ | ✅ |
| `--color-surface-accent` (secondary-dark #2378A8) | **4.79 : 1** | ✅ | ✅ |
| `--color-surface-inverse` (slate-800 #1E293B) | **14.94 : 1** | ✅ | ✅ |
| `--color-surface-brand-vivid` (#26B7BC) | 2.55 : 1 | ❌ | ⚠ 装飾用に限定 |
| `--color-surface-accent-vivid` (#38A1DB) | 3.21 : 1 | ❌ | ⚠ 装飾用に限定 |

### 2.2 規約

1. **「読ませる」白テキストは knockout-safe 面でのみ。**
   PrimaryButton / Secondary CTA / モーダルヘッダー等、本文を含むブランド面の背景は必ず `--color-surface-brand` または `--color-surface-accent` を使用してください。

2. **ビビッド面は装飾専用。**
   `--color-surface-brand-vivid` / `--color-surface-accent-vivid` は、テキストを置かない（ヒーロー帯、ロゴ面、アイコンタイル等）か、置く場合は **18px 以上または 14px bold 以上** に制限。本文・標準ラベル・リンクの直接設置は禁止します。

3. **ロゴマニュアルの加工禁則を UI にも適用。**
   ブランド面上のテキストに対し **シャドー・斜体・ワープ加工・装飾色の追加は禁止** とします（ロゴマニュアル p.7 準拠）。

### 2.3 ✅ OK / ❌ NG

✅ OK — knockout-safe 面に本文
```html
<button class="knockout">
  乗車券を表示
</button>
<!-- = surface-brand (#1A8589) on text-onBrand (#fff) → 4.85:1 -->
```

✅ OK — ビビッド面は装飾＋大型のみ
```html
<section class="knockout--vivid hero">
  <h1 style="font-size:32px">FIG</h1>      <!-- 大型なので 3:1 で許容 -->
</section>
```

❌ NG — ビビッド面に本文を置いている
```html
<div class="knockout--vivid">
  <p>このボタンを押してください…</p>   <!-- 14px 白 on #26B7BC = 2.55:1 -->
</div>
```

❌ NG — ブランド面に装飾シャドーを加えている
```html
<button class="knockout" style="text-shadow: 0 1px 0 #000">乗車</button>
```

---

## 3. Contrast（コントラスト） — **MUST**

> 「読めない色」は存在しないのと同じ。屋外・低照度・低視力環境を含む全条件で読めることを保証します。

### 3.1 数値基準（WCAG 2.2 AA）

| 対象 | 最小コントラスト比 | トークン |
|---|---|---|
| 本文テキスト (< 18pt / 14pt bold) | **4.5 : 1** | `--a11y-contrast-min` |
| 大型テキスト (≥ 18pt / 14pt bold) | **3.0 : 1** | `--a11y-contrast-min-large` |
| 非テキスト UI（アイコン、輪郭、状態境界） | **3.0 : 1** | `--a11y-contrast-min-ui` |
| AAA 推奨（重要情報） | **7.0 : 1** | `--a11y-contrast-aaa` |
| 白抜きの最低基準 | **4.5 : 1** | `--a11y-knockout-min-contrast` |

### 3.2 強化基準（重要情報）

| 対象 | 強化比 | 理由 |
|---|---|---|
| 時刻・金額・運行情報の数値 | **7.0 : 1** | 屋外・直射光下で 0.5 秒で読み取る |
| エラー / 警告バナー（critical） | **7.0 : 1** | パニック時の判読性 |
| 状態ピル（運行・遅延・運休） | **4.5 : 1**（背景込み） | 状態の取り違えは致命傷 |

### 3.3 色だけで状態を伝えない

**第二チャンネル必須**：色 + 形状 / アイコン / テキストラベル / パターンの 2 種以上を組み合わせる。

| 状態 | 色 | + 第二チャンネル |
|---|---|---|
| Success | green | ✓ アイコン + ラベル |
| Warning | amber | ⏱ アイコン + ラベル |
| Error | red | ⊘ アイコン + ラベル |
| Disabled | gray | 取消線 + opacity 0.5 + ラベル |

---

## 4. Touch Target（タップ可能領域） — **MUST**

> 揺れる車内、グローブ越し、片手操作、子どもの指。**誤タップは慈愛の反対**です。

### 4.1 数値基準

| 種別 | 最小サイズ | トークン |
|---|---|---|
| **物理下限** | **44 × 44 px** | `--a11y-touch-target` |
| **推奨快適サイズ** | **48 × 48 px** | `--a11y-touch-target-comfortable` |
| 隣接要素間 spacing | **≥ 8 px** | `--space-2` |
| 主要 CTA / FAB | **56 × 56 px** | `--interactive-fab-size` |

### 4.2 達成手段（3 通り）

```css
/* (1) 視覚サイズが下限を満たす */
button { min-width: var(--a11y-touch-target); min-height: var(--a11y-touch-target); }

/* (2) padding でヒット領域を拡張 */
.icon-btn { padding: var(--a11y-hit-area-expand); /* 視覚 28px → hit 44px */ }

/* (3) ::before 擬似要素で hit-area を拡張（視覚を変えたくないとき） */
.compact-link { position: relative; }
.compact-link::before { content: ''; position: absolute; inset: -10px; }
```

### 4.3 ❌ NG パターン

- `padding: 4px` のアイコンボタン → hit area 32px、下限割れ
- 隣接ボタン間 `gap: 4px` → 指の太さで両方触れる
- 不可逆操作（決済・購入・削除）の直接ボタンが 44px 未満

---

## 5. Keyboard（キーボード操作） — **MUST**

| 項目 | 要件 |
|---|---|
| **全操作の到達** | マウスでできる全アクションをキーボードだけで完了可能 |
| **トラップなし** | フォーカスが永久に閉じ込められる UI は禁止。モーダルは Escape で抜ける |
| **論理順序** | DOM 順 = 視覚順 = タブ順。`tabindex > 0` は使わない |
| **スキップリンク** | ヘッダー先頭に "本文へスキップ" を `:focus` で可視化 |

### 5.1 標準キーマップ

| キー | 動作 |
|---|---|
| `Tab` / `Shift+Tab` | 次/前のフォーカス可能要素 |
| `Enter` / `Space` | ボタン・リンク起動 |
| `Escape` | モーダル・シート・ポップオーバー閉じる |
| `←` / `→` | タブ / セグメンテッドコントロール / カルーセル間移動 |
| `↑` / `↓` | リスト / メニュー間移動 |
| `Home` / `End` | リスト先頭 / 末尾 |
| `/` | 検索フォーカス（推奨） |

### 5.2 ARIA role × キー対応

| Component | role | 必須キー対応 |
|---|---|---|
| Tabs | `tablist` / `tab` / `tabpanel` | `←/→` でタブ間、`Home/End` で端 |
| Dialog / Sheet | `dialog` + `aria-modal="true"` | `Escape` で閉じる、フォーカストラップ |
| Menu | `menu` / `menuitem` | `↑/↓` でアイテム、`Escape` で閉じる |
| Listbox | `listbox` / `option` | `↑/↓` / `Home/End` / 入力で検索 |
| Combobox | `combobox` | `↑/↓` で候補、`Enter` で確定 |

### 5.3 ❌ NG

- `<div onClick>` でボタンを作る → `<button>` を使う
- カスタムドロップダウンに `Escape` ハンドラなし
- モーダル外要素が `Tab` でフォーカス可能（フォーカストラップ未実装）

---

## 6. Focus Visible（フォーカス可視化） — **MUST**

> キーボード操作中、「今どこにいるか」が一目で分かること。`outline: none` は最大の罪です。

### 6.1 数値基準

| 項目 | 値 | トークン |
|---|---|---|
| Outline 太さ | **3 px** | `--a11y-focus-ring-width` |
| Outline オフセット | **2 px** | `--a11y-focus-ring-offset` |
| Outline 色 | secondary-dark (FIG ブルー濃) | `--a11y-focus-ring-color` |
| 背景との contrast | **≥ 3.0 : 1** | （WCAG 2.4.11 Focus Appearance） |

### 6.2 実装パターン

✅ 標準
```css
.btn:focus-visible {
  outline: var(--a11y-focus-ring);
  outline-offset: var(--a11y-focus-ring-offset);
}
```

✅ ブランド面上（ターコイズ / ブルー背景）には対比色を使う
```css
.btn-on-brand:focus-visible {
  outline: var(--a11y-focus-ring-brand);
  outline-offset: var(--a11y-focus-ring-offset);
}
```

✅ 角丸が大きい要素は `box-shadow` halo を併用
```css
.card:focus-visible {
  outline: var(--a11y-focus-ring);
  outline-offset: var(--a11y-focus-ring-offset);
  box-shadow: var(--a11y-focus-ring-shadow);
}
```

### 6.3 ❌ NG

```css
*:focus { outline: none; }              /* 最大の罪、merge blocker */
button:focus { outline: 1px dotted; }   /* 太さ・色とも不足 */
.btn:focus { outline-offset: 0; }       /* 角丸要素で食い込み視認不可 */
```

### 6.4 `focus` vs `focus-visible`

マウスクリック時の outline は煩わしいため `:focus-visible` を使う（キーボード時のみ表示）。ただし「キーボード時のみ表示」を理由に outline を完全削除する設計は禁止。

---

## 7. Reduced Motion（動きの抑制） — **MUST**

> 前庭障害、片頭痛、認知特性。動きで気分が悪くなるユーザーは確実に存在します。

### 7.1 OS 設定の尊重

`@media (prefers-reduced-motion: reduce)` が有効な場合：
- **すべての transition / animation は 0.01ms に短縮**（完全停止ではなく、`onTransitionEnd` の発火は保つ）
- これは `semantic.css` 末尾の `:root` 上書きで全コンポーネントに自動適用される

### 7.2 個別対応が必要なもの

| パターン | 対応 |
|---|---|
| breathing / pulse / shimmer | `prefers-reduced-motion` で `animation: none` |
| ローディングスピナー | 「読み込み中…」テキスト + 進捗バーで代替 |
| パララックス / スクロール連動 | **そもそも禁止**（reduced motion 以前の問題） |

### 7.3 ❌ 絶対禁止モーション

- **無限点滅 / フラッシュ**（光感受性てんかん誘発、WCAG 2.3.1 違反）
- **パララックススクロール**（前庭障害誘発）
- **画面全体の auto-scroll**（ユーザー操作を奪う）
- **大振幅の bounce / spring**（信頼性訴求の FIG と相反）
- **`scrollIntoView` の smooth 強制**（OS 設定無視）

---

## 8. Screen Reader（スクリーンリーダー） — **MUST**

> 視覚に頼らないユーザーにとって、UI は「読み上げられる文字列の連なり」そのものです。

### 8.1 セマンティック HTML 第一原則

- `<button>` を `<div onClick>` で代替しない
- `<a href>` を `<span onClick>` で代替しない
- `<h1>〜<h6>` を `<div class="title">` で代替しない
- `<nav>` / `<main>` / `<aside>` / `<header>` / `<footer>` を使う
- `<label htmlFor>` をフォームに必ず関連付ける

### 8.2 ARIA は補強、HTML が先

ARIA を使う前に「ネイティブ HTML で表現できないか」を必ず検討する。

| 場面 | ❌ ARIA で代替 | ✅ ネイティブ |
|---|---|---|
| ボタン | `<div role="button">` | `<button>` |
| 見出し | `<div role="heading" aria-level="2">` | `<h2>` |
| リンク | `<span role="link">` | `<a href>` |
| リスト | `<div role="list">` | `<ul>` / `<ol>` |

### 8.3 集約 aria-label のルール

情報が密な行は、要素ごとに読み上げると冗長。**行全体に集約 `aria-label` を付与し、子要素は `aria-hidden="true"`** とする。

```jsx
<div
  role="button"
  tabIndex={0}
  aria-label="205系統 市役所前ゆき、あと5分、14時23分発、通常運行"
>
  <span aria-hidden="true">205</span>
  <span aria-hidden="true">市役所前ゆき</span>
  <span aria-hidden="true">あと 5 分</span>
  <StatusPill aria-hidden="true">通常運行</StatusPill>
</div>
```

### 8.4 ライブリージョン

| 用途 | role / aria-live |
|---|---|
| 数値カウントダウン更新 | `aria-live="polite"` |
| 重要な変化告知 | `aria-live="assertive"` |
| 検索結果件数 | `aria-live="polite"` + `role="status"` |
| エラー / 警告 | `aria-live="assertive"` + `role="alert"` |

⚠ **`aria-live` を多用しない**。同時に複数が assertive で発火すると、最重要情報がかき消されます。

### 8.5 必須属性チェックリスト

| 要素 | 必須属性 |
|---|---|
| 画像（情報あり） | `alt="説明"` |
| 画像（装飾のみ） | `alt=""` または `aria-hidden="true"` |
| アイコンのみのボタン | `aria-label="操作内容"` |
| フォーム入力 | `<label htmlFor>` または `aria-labelledby` / `aria-label` |
| エラーメッセージ | `aria-describedby` で入力と関連付け |
| 開閉トグル | `aria-expanded="true|false"` |
| トグルボタン | `aria-pressed="true|false"` |
| モーダル | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` |

### 8.6 言語と読み方

- `<html lang="ja">` 必須
- 英数字混在の固有名詞は読み方が分かれる：`205` は「にひゃくご」/ 「ツーオーファイブ」
  → 集約 `aria-label` で「205系統」と漢字混じり明示。SR は文脈から読みます

### 8.7 ❌ NG

- アイコンのみのボタンに `aria-label` なし → 「ボタン」としか読まれない
- `<img>` に `alt` 属性が無い（空文字も無い）
- フォーム入力に `<label>` 無し、placeholder のみ
- `aria-label` の中に視覚記号（"→", "·", "/"）→ SR が記号を読み上げ騒音化

---

## 9. 検証フロー

### 9.1 PR 提出前セルフチェック（必須）

- [ ] 1. キーボードのみでコンポーネントを操作できる
- [ ] 2. すべてのフォーカス可能要素で focus ring が見える
- [ ] 3. Tab 順序が DOM 順と一致している
- [ ] 4. すべてのタッチターゲットが 44 × 44 px 以上
- [ ] 5. アイコンのみのボタンに `aria-label` がある
- [ ] 6. 色だけで状態を伝えていない（アイコン or テキストも併記）
- [ ] 7. ブランド面上の白テキストは `--color-surface-brand` / `-accent` 上のみ
- [ ] 8. 本文に `line-height: 1.75` 相当（`--lh-jp-body`）が効いている
- [ ] 9. macOS / iOS で「視差効果を減らす」をオンにしてアニメが静止する
- [ ] 10. VoiceOver / TalkBack で集約 aria-label が意図通り読まれる

### 9.2 自動チェックツール（推奨）

| ツール | 目的 |
|---|---|
| axe-core / eslint-plugin-jsx-a11y | 静的 ARIA / 構造チェック |
| Lighthouse Accessibility | 100 点ベースライン |
| WAVE / Stark | コントラスト + 構造可視化 |
| Pa11y | CI でリグレッション検出 |

### 9.3 実機テスト（リリース前必須）

- **VoiceOver（iOS Safari）** — 主要動線 3 つを読み上げで完走
- **TalkBack（Android Chrome）** — 同上
- **Switch Control（iOS）** — スイッチ 1 つで主要動線完走
- **OS 設定**：「動きを減らす」「文字サイズ最大」「色を反転」「コントラストを上げる」各オンで崩れないこと

---

## 10. メタ規約（AI への指示）

AI（Claude を含む）が本プロジェクトに新規コンポーネント・パターン・画面を追加する際：

1. **コードを書く前に本ファイル §1〜§8 を読み直す**
2. PR 説明文に「§9.1 セルフチェック」結果を明記する
3. WCAG 違反が疑われる場合、実装ではなく **質問を返す**
4. 「慈愛と共感」の精神（§1, §2）はデザイン判断を上書きする最終ルール

> 🚨 a11y を犠牲にする意思決定は FIG には存在しません。
> 利便性・美観・実装速度のいずれも、a11y より優先されません。

---

## 関連ドキュメント

- [`design-system.md`](./design-system.md) — システム全体の理念
- [`primitives.css`](./primitives.css) — `--lh-jp-*` / `--tracking-jp-*` / `--word-break-jp` 等の基底トークン
- [`semantic.css`](./semantic.css) — `--a11y-*` / `--color-surface-brand` / `.knockout` / `.jp-*` 等のロールとユーティリティ
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- デジタル庁デザインシステム (DADS): https://design.digital.go.jp/
