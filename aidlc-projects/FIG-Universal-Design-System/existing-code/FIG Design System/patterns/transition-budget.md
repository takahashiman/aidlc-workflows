# Pattern: Transition Budget — 体感バジェット規約

> **Step 4 で導入**。FIG Core DS の理念「スピード自体が大きな価値」を、システム全体で強制可能な数値契約に落とし込む規約。

## 原則

**ユーザーが意思決定してから結果が画面に反映されるまでは、原則 200ms 以内。**

200ms は人間が「即座に反応した」と感じる上限値の通説（Doherty Threshold 400ms の半分、Material Motion の "small" 帯）。これを下回ったとき、操作と結果の因果が「同時」として知覚され、UI に対する信頼感が形成される。

FIG Core DS では、この 200ms をデザイントークンとして公開し、コンポーネント実装が CSS / JS 経由で参照できる契約値とする。

| 数値定数 | 役割 |
|---|---|
| `--motion-experience-budget-ms: 200` | 一般操作の体感バジェット上限（ms） |
| `--motion-experience-budget-soft-ms: 280` | 例外（モーダル登場）の物理上限（ms） |

## バジェット帯と適用ロール

| ロール（semantic） | 上限 | 適用先 |
|---|---|---|
| `--motion-experience-press-result` | **150ms** | 押下 → 結果反映（CTA、トグル、削除確定） |
| `--motion-experience-reveal-quick` | **180ms** | ポップオーバー、メニュー、ドロップダウン、リスト差分更新 |
| `--motion-experience-navigation` | **200ms** | タブ切替、サブビュー切替、画面内ナビゲーション |
| `--motion-experience-sheet-rise` | **240ms** *例外* | ボトムシート登場（高さの大きい登場演出） |
| `--motion-experience-modal-rise` | **280ms** *最大例外* | モーダル登場（フォーカス遷移を伴う最大演出） |
| `--motion-experience-dismiss-quick` | **150ms** | シート / モーダル退場（去り際は最速で返す） |
| `--motion-experience-dismiss-press` | **75ms** | タップ離脱の最小残像 |

> **例外帯の使用条件**：sheet-rise / modal-rise は「高さの登場 + フォーカス遷移」を伴うときだけ許容。タブ切替やフィルタ適用にこれらを使ってはならない。

## 強制ルール

### 1. 生 ms 値の直接記述は禁止

```css
/* ✘ 禁止 — バジェット契約が無効化される */
.btn-primary { transition: transform 300ms ease-in-out; }

/* ✓ 必須 — semantic トークン経由 */
.btn-primary { transition: transform var(--motion-experience-press-result); }
```

### 2. JS 側 setTimeout / animate() も同様

```js
// ✘ 禁止
setTimeout(() => closeSheet(), 250);

// ✓ 必須 — getComputedStyle から取得
const ms = parseInt(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--motion-experience-budget-nav')
) || 200;
setTimeout(closeSheet, ms);
```

### 3. レビュー観点

- `transition:` / `animation:` のプロパティ値に `ms` リテラルが含まれていたら指摘
- `--motion-experience-*` 以外の motion トークンを新規参照する場合、根拠（既存 `--motion-*` の互換目的か、本当に例外帯が必要か）を PR 説明に明記
- 200ms を超える transition を導入する場合は **例外帯（sheet-rise / modal-rise）に該当するか** を必ず確認

## アクセシビリティ：`prefers-reduced-motion`

OS で「動きを減らす」が有効なとき、すべての `--motion-experience-*` は `0.01ms linear` に自動上書きされる（`semantic.css` 末尾の `@media` ブロック）。

- コンポーネント側の改修は不要
- `0` ではなく `0.01ms` を採用する理由：`onTransitionEnd` ハンドラの発火を維持するため。アニメーション完了を待つ JS の整合性が保たれる
- アンビエントループ（呼吸、シマー）は `animation-play-state: paused` 相当で完全停止

## バジェット可視化

`preview/motion-budget.html` で各ロールの実時間を時間バーで確認できる。200ms の境界線が描かれ、例外帯（240ms / 280ms）はその理由とともに表示される。

## バジェット違反の検出

将来的に CI で以下を検査することを推奨：

1. `*.css` 内に `\d+ms` リテラルが `--motion-experience-*` 定義以外の場所に出現したら警告
2. `*.tsx` / `*.jsx` 内の `setTimeout` / `setInterval` / `animate()` の数値リテラルを同様に検査
3. Lighthouse / 自社計測ツールで実機の TTI（Time to Interactive）を計測し、`--motion-experience-budget-ms` を超えるトランジションが計測されたらビルド失敗

## なぜ 200ms か

- **Doherty Threshold** : 1982 年の IBM 研究で「400ms 以内のレスポンスがユーザー生産性を最大化」と報告された値。その半分が 200ms。
- **Material Motion "small" 帯** : 50–200ms に「area-restricted, simple」な動きを割り当てる Google の規約。
- **Apple HIG** : "Animations should occur in response to user actions and feel instantaneous." 体感即時の目安として 200ms 前後を提示。
- **FIG ロゴマニュアルの "スピード"** : ロゴデザイン段階で言語化された理念をシステムに継承。

---

## 関連

- [`patterns/feedback-contract.md`](./feedback-contract.md) — 視覚 + 触覚 + 聴覚の三位一体規約
- [`patterns/page-transition.md`](./page-transition.md) — 画面遷移の標準（forward / back / modal-rise / tab-switch）
- `semantic.css` §17 — Experience Motion Contract
- `preview/motion-budget.html` — バジェット可視化
