# Pattern: Feedback Contract — 視覚・触覚・聴覚の三位一体

> **Step 4 で導入**。FIG Core DS の理念「慈愛の精神 / おもてなし」を、複数感覚チャネルにまたがる UI 規約として強制する。

## 原則

**1 つの「操作の意味」に対して、視覚 (motion) / 触覚 (haptic) / 聴覚 (audio) の 3 チャネルを束ねる。**

- どのチャネルが欠けても **等価な情報量** が伝わる設計を必須とする。
- 振動非対応端末・音声 OFF・`prefers-reduced-motion` のいずれかが効いても、操作の確証はユーザーに残る。
- "おもてなし" は冗長な装飾ではなく「複数経路の保険」として実装する。

## 規約マトリクス

| Feedback ID | motion | haptic | audio | 主用途 |
|---|---|---|---|---|
| `cta-fire` | `press-result` (150ms) | `medium` (20ms) | `ui-tap` | 主要 CTA の押下瞬間 |
| `cta-success` | `reveal-quick` (180ms) | `success` (10,50,20) | `ui-success` | 処理完了 |
| `cta-error` | `press-result` (150ms) | `error` (40,30,40,30,40) | `ui-error` | 処理失敗 |
| `toggle` | `press-result` (150ms) | `light` (10ms) | — | ON/OFF 切替（高頻度操作） |
| `select` | `navigation` (200ms) | `light` (10ms) | — | リスト / タブ選択 |
| `nfc-touch` | `press-result` (150ms) | `heavy` (40ms) | `nfc-touch` | NFC タッチ決済の確定 |

各行に対応する CSS 変数は **3 本セット**（`-motion` / `-haptic` / `-audio`）で `semantic.css` §20 に定義済み。

```css
/* 例: cta-fire の 3 本セット */
--feedback-cta-fire-motion: var(--motion-experience-press-result);
--feedback-cta-fire-haptic: var(--haptic-medium);
--feedback-cta-fire-audio:  var(--audio-cue-tap);
```

## 参照パターン（推奨：`data-feedback` 属性）

```html
<!-- 主要 CTA -->
<button class="btn btn--primary" data-feedback="cta-fire">
  定期券を発行する
</button>

<!-- NFC タッチエリア -->
<div class="nfc-pad" data-feedback="nfc-touch" tabindex="0"></div>
```

CSS 側は属性に応じて motion を適用：

```css
[data-feedback="cta-fire"] {
  transition: transform var(--feedback-cta-fire-motion);
}
[data-feedback="cta-fire"]:active {
  transform: scale(var(--state-pressed-scale));
}
```

JS 側は `assets/js/feedback.js` のヘルパーが haptic + audio を発火：

```js
import { fireFeedback } from '/assets/js/feedback.js';

button.addEventListener('pointerdown', () => {
  fireFeedback(button); // data-feedback 属性を読み、haptic + audio を発火
});
```

## チャネル別フォールバック契約

### 視覚 (motion)

- `prefers-reduced-motion: reduce` が有効 → 全 `--motion-experience-*` が `0.01ms linear` に上書き
- それでも **静的な状態変化（背景色、影、アイコン差替）は維持**。アニメーションだけ静止
- アンビエントループ（呼吸、シマー）は完全停止

### 触覚 (haptic)

- `navigator.vibrate` が undefined → JS ヘルパーが no-op
- `--haptic-enabled: 0`（reduced-motion 時に自動）→ 全停止
- ユーザー設定で個別に OFF 可能（将来）

### 聴覚 (audio)

- `--audio-cue-enabled: 0`（**既定は OFF**）→ 音源を読み込まない
- 公共交通アプリの文脈：駅・車内など音声 OFF が事実上必須の環境を想定し、デフォルトで鳴らさない
- ユーザー設定で ON にできる
- `--audio-cue-volume: 0.6` で音量制御

## 「等価情報量」の検証ルール

新規 feedback ID を追加する際、以下を満たすか確認：

1. **3 チャネルすべて欠落した状態でも操作の結果がわかる**
   - 例：CTA 押下時に `disabled` / loading state など、視覚状態が変わるか？
2. **2 チャネル欠落でも意味が伝わる**
   - 視覚のみ：色変化 + テキスト変化で十分か
   - 視覚 + 触覚：振動で「触れた / 確定した」がわかるか
3. **音声単独に意味を持たせない**
   - audio は必ず視覚 or 触覚の補強。音声がないと完了が判断できない設計は禁止

## "慈愛" の実装としての feedback contract

「誰一人取り残さない」を機能要件に翻訳すると：

- 視覚障害者：触覚 + 音声 + スクリーンリーダー
- 聴覚障害者：視覚 + 触覚
- 前庭系障害者（reduced-motion 利用者）：静的視覚 + 触覚（または静的視覚 + 音声）
- 公共環境利用者（音声不可）：視覚 + 触覚

3 チャネル契約は **これらのユースケースを横断的にカバー** するための設計。

## 参考実装

`assets/js/feedback.js`（同梱）は以下のシグネチャを提供：

```js
fireFeedback(element, options?)
// element.dataset.feedback または options.id から
// haptic / audio を発火。motion は CSS 側に委譲。

setFeedbackChannel(channel, enabled)
// channel: 'haptic' | 'audio'
// ユーザー設定からの切替

getFeedbackToken(id, channel)
// CSS 変数値を JS から取得
```

すべての feature detection 込み。SSR / 振動非対応 / 音声 OFF いずれの環境でも例外を投げない。

---

## 関連

- [`patterns/transition-budget.md`](./transition-budget.md) — 200ms 体感バジェット規約
- [`patterns/page-transition.md`](./page-transition.md) — 画面遷移の標準
- `semantic.css` §18 haptic / §19 audio-cue / §20 feedback-contract
- `preview/feedback-patterns.html` — 実演プレビュー
- `assets/js/feedback.js` — 参考実装ヘルパー
