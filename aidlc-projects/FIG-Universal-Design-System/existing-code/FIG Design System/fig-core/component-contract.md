# Component Contract

> 🛡️ このファイルは **新規コンポーネントを作る前に必ず通過する契約書**。
> AI / 人間を問わず、この 6 条を満たさないコンポーネントは PR としてマージしない。
> 既存コンポーネントを編集する場合も、変更後に本契約に違反していないかを確認すること。

本契約は [`design-system.md`](../design-system.md) の **Design System Rules** を補強する **コンポーネント作成時の手続き的ガード**である。違反したと思われるものを見つけた場合は実装ではなくレビュー依頼を出すこと。

---

## 0. 適用範囲

| 対象 | 適用 |
|---|---|
| 新規 React コンポーネント (`*.jsx`) | **必須** |
| 既存コンポーネントの大規模 refactor | **必須** |
| 1 行のスタイル微調整 | 第 2 条のみ |
| デザイントークン定義そのもの (`primitives.css` / `semantic.css`) | 適用外（本契約はトークン**利用側**の規約） |

---

## 第 1 条 — Semantic Token 経由のみ

コンポーネントから直接参照してよい CSS 変数は **Semantic 層** (`semantic.css`) のものに限る。

✅ **許可**
```css
color: var(--color-text-brand);
background: var(--color-surface-default);
font: var(--typography-body-strong);
box-shadow: var(--surface-elevation-card);
```

❌ **禁止**
```css
color: var(--brand-500);            /* Primitive を直接参照 */
color: var(--color-brand-primary);  /* 同上 */
background: var(--gray-100);        /* 同上 */
```

**理由：** Primitive 層は「材料」、Semantic 層は「役割」。コンポーネントは役割を知るだけでよく、材料の選定はテーマ側の責務。ダークモード／ブランド差し替え／a11y 対応はすべて Semantic 層で吸収する設計。

**例外：** なし。Primitive を使いたくなったら、それは Semantic 層に新しいロールを追加すべきサインである。`semantic.css` への追加 PR をまず出すこと。

---

## 第 2 条 — Raw Value 禁止

コンポーネント実装の中で **生の数値・HEX・キーワード**を書かない。

❌ **禁止される raw value の例**
| 種別 | NG | OK |
|---|---|---|
| Color | `color: '#26B7BC'` | `color: var(--color-text-brand)` |
| Color | `background: 'rgba(0,0,0,0.04)'` | `background: var(--state-hover-overlay)` |
| Spacing | `padding: '12px 16px'` | `padding: var(--space-3) var(--space-4)` |
| Spacing | `margin-top: 20` (Tailwind / inline) | `margin-top: var(--space-5)` |
| Radius | `border-radius: 12` | `border-radius: var(--radius-md)` |
| Font | `font-size: 14, font-weight: 600` | `font: var(--typography-body-strong)` |
| Shadow | `box-shadow: '0 4px 12px rgba(...)'` | `box-shadow: var(--surface-elevation-card)` |
| Z-index | `z-index: 1000` | `z-index: var(--z-modal)` |
| Duration | `transition-duration: 200ms` | `transition: var(--motion-hover)` |
| Easing | `cubic-bezier(0.4,0,0.2,1)` | `var(--easing-standard)` |

**例外（明示）：**
- `0` / `1` / `100%` などの**幾何学的恒等値**は許可（`opacity: 1`、`flex: 1`、`width: 100%`）。
- `1px` の hairline border は許可（トークン化されていない最小単位として）。ただし `border` 自体の色は必ずトークン経由。
- アスペクト比 (`aspect-ratio: 16 / 9` 等) は許可。

**コードレビュー時のチェック：** インライン HEX (`#[0-9a-f]{3,8}`)、`px` / `rem` リテラル、`rgba(` 直書きが diff に含まれていたら **即座に差し戻し**。

---

## 第 3 条 — Layout Token 必須

レイアウトに関わる**間隔・サイズ・グリッド**は専用トークンで表現する。「なんとなく見栄えで決めた px」を禁じる。

**必須利用トークン**

| 軸 | トークン |
|---|---|
| 余白（padding / margin / gap） | `var(--space-0)` 〜 `var(--space-12)` のラダーから選ぶ |
| 角丸 | `var(--radius-xs)` 〜 `var(--radius-2xl)` / `--radius-pill` |
| コンポーネント固有のサイズ | `var(--interactive-*-min-height)` 等 Semantic 層に定義 |
| 画面端からの余白 | `var(--layout-edge-inset)` |
| Safe area | `var(--safe-area-top|bottom|left|right)` |
| コンテナ最大幅 | `var(--layout-max-content-width)` |

**禁止される設計の臭い**
- `gap: 13px` のような**ラダー外の値**（必要なら新しい token を提案）
- `padding: 14px 18px` のような**非対称で意味のない値**
- マジックナンバー（`top: 73px` 等の「Header の高さを目視で測った」値）→ 必ず `var(--layout-header-height)` 等を定義してから使う

**理由：** レイアウトトークンは「8 の倍数 + 4 の補助段」のリズムでアプリ全体の視覚密度を統一する。1 つの画面で勝手な余白を入れると、全画面の調律が崩れる。

---

## 第 4 条 — Touch Target 必須

**インタラクティブ要素は最低 44×44 CSS px の hit area を確保**しなければならない（Apple HIG / WCAG 2.5.5 準拠）。

**該当する要素：** Button, Link, Tab, ListItem, IconButton, Switch, Checkbox, Radio, FAB, Bottom Nav item, Header の戻る・メニュー、Card (variant=interactive)

**達成手段（いずれか）**

1. **直接サイズ**: `min-height: var(--a11y-touch-target)` + `min-width: var(--a11y-touch-target)`
2. **Padding で拡張**: 視覚サイズが小さくても padding で 44×44 を確保
3. **疑似要素で拡張**: アイコンのみの密集 UI で見た目を変えたくない場合、`::before` を絶対配置で 44×44 にする
   ```css
   .icon-btn::before {
     content: '';
     position: absolute;
     inset: calc((var(--a11y-touch-target) - 100%) / -2);
   }
   ```

**禁止：** `width: 32px; height: 32px` の素のアイコンボタンを `<button>` で実装すること。

**例外：** 純粋に装飾的でクリック不要な要素（読み取り専用のステータスバッジ等）。ただしクリック可能化した瞬間、本条が適用される。

---

## 第 5 条 — State Token 必須

すべての**インタラクティブ要素**は、5 状態を **State Token** で表現する。状態ごとに独自の色や陰影を新規発明してはならない。

**必須 5 状態**

| 状態 | 必須トークン | 視覚 |
|---|---|---|
| default | （なし） | 標準 |
| hover | `var(--state-hover-overlay)` | 半透明オーバーレイ（色を直接変えない） |
| pressed | `var(--state-pressed-scale)` (= 0.98) | `transform: scale()` |
| focused (keyboard) | `var(--a11y-focus-ring)` + `var(--a11y-focus-ring-offset)` | outline |
| disabled | `var(--state-disabled-opacity)` (= 0.40) | `pointer-events: none` |

**追加状態（必要に応じ）**
| 状態 | トークン |
|---|---|
| selected | `var(--color-surface-brand-subtle)` |
| dragged | `var(--state-dragged-shadow)` |
| loading | `aria-busy="true"` + スピナー |

**禁止事項**
- hover で `background: #f5f5f5` のように**直接色を変える**（オーバーレイ経由でない）
- `:focus { outline: none }` で消す（`:focus-visible` で本ルールに従って再定義する分には OK）
- disabled を `display: none` で消す（読み取り可能で操作不可、が正しい）

**理由：** 状態表現の一貫性は「学習できる UI」の根幹。同じ hover が全コンポーネントで同じ視覚効果を持つことで、ユーザは初見の画面でも触れる場所を予測できる。

---

## 第 6 条 — Motion Token 必須

すべての**状態遷移・出現・消滅**は **Motion Token** を経由する。`transition` / `animation-duration` / `cubic-bezier()` の直書きを禁じる。

**必須利用トークン**

| 用途 | トークン |
|---|---|
| hover / focus 等の微細フィードバック | `var(--motion-hover)` |
| pressed の即時反応 | `var(--motion-press)` |
| 要素の出現 | `var(--motion-enter)` |
| 要素の消滅 | `var(--motion-exit)` |
| タブ切替 | `var(--motion-tab-switch)` |
| モーダル / ボトムシート | `var(--motion-modal-enter)` / `--motion-modal-exit` |
| Easing 単体 | `var(--easing-standard)` / `--easing-decelerate` / `--easing-accelerate` / `--easing-emphasis` |

**書き方**

✅ ショートハンドの transition トークンを使う
```css
transition: var(--motion-hover);
/* 内部は `background-color 160ms var(--easing-standard)` 等 */
```

❌ 個別指定
```css
transition: background 200ms ease-in-out;   /* 禁止 */
animation: fadeIn 300ms cubic-bezier(...);  /* 禁止 */
```

**`prefers-reduced-motion` 対応**
- Motion Token は `prefers-reduced-motion: reduce` で **自動的に近瞬時化**される設計。
- コンポーネント側でメディアクエリを書く必要はない（書いてもよいが、`semantic.css` の設計を覆さない範囲で）。

**理由：** 動きはブランドの語り口である。同じ「ふわっ」を全画面で再生することで、アプリは「同じ手」で作られた一貫した世界に感じられる。コンポーネントごとに異なる ease / duration を持つと、その世界観が崩れる。

---

## チェックリスト（PR 提出前に自己採点）

新規 / refactor コンポーネントを書き終えたら、以下を順に確認する。1 つでも `No` があれば本契約違反。

- [ ] 1. `--brand-*` / `--gray-*` 等の **Primitive を直接参照していない**
- [ ] 2. ソース全体を `#[0-9a-f]{3,8}` / `\d+px` / `rgba(` で grep して **0 件**である
- [ ] 3. すべての padding / margin / gap / radius が `var(--space-*)` / `var(--radius-*)` を参照している
- [ ] 4. すべてのインタラクティブ要素が **44×44 以上の hit area** を持つ（DevTools で測った）
- [ ] 5. **hover / pressed / focused / disabled** が State Token 経由で実装されている
- [ ] 6. すべての `transition` / `animation` が Motion Token 経由である
- [ ] 7. 該当する `*.spec.md` を作成 or 更新した（[`components/`](./) 配下）
- [ ] 8. ARIA / キーボード操作の節を仕様書通りに実装した

---

## 違反例集（実コードからの抜粋）

参考までに、現プロジェクトの「直すべきコード」例：

```jsx
// ❌ BusappComponents.jsx の旧 StatusPill
<div style={{
  background: '#FFF4E5',          // 第 1, 2 条違反: 生 HEX
  color: '#8B5A00',               // 同上
  padding: '6px 12px',            // 第 2, 3 条違反: 生 px
  borderRadius: 9999,             // 第 2 条違反 → var(--radius-pill)
  fontSize: 13, fontWeight: 600,  // 第 2 条違反 → var(--typography-status-pill)
}}>...</div>

// ✅ 正準形
<div style={{
  background: `var(--color-status-delay-bg)`,
  color: `var(--color-status-delay-fg)`,
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--radius-pill)',
  font: 'var(--typography-status-pill)',
  letterSpacing: 'var(--tracking-wide)',
}}>...</div>
```

---

## メタ規約（AI への指示）

生成 AI が本リポジトリでコンポーネントを書くとき：

1. **新規コンポーネントを書く前に、必ず本ファイルを読み直す。**
2. **同等のコンポーネントが `components/*.spec.md` に存在しないか先に確認**する。あれば仕様に従って実装、なければ仕様を先に書く。
3. **「とりあえず動く」コードに raw value を残さない。** その場で `semantic.css` への token 追加 PR を提案する方が正しい。
4. **「ちょっとだけ」がデザインシステムを壊す。** 1 行の `marginTop: 7` が積み重なって統一感が崩壊する。
5. 違反したと気づいたら、**実装を出す前にユーザーに確認を取る**こと。
