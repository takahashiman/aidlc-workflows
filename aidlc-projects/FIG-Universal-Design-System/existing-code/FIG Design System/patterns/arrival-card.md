# Pattern: Arrival Card

> 🛡️ 先に [`../design-system.md`](../design-system.md) と [`../component-contract.md`](../component-contract.md) を読むこと。
> 本パターンは Component Layer の上位、ドメイン UX を組み立てる **Pattern Layer** に属する。

## 概要

**「次に来るバスがいつ来るのか」** を一目で伝える、本アプリで最も重要な情報単位。
ホーム画面・路線詳細・通知のすべてで再利用される、交通 UX の中核パターン。

利用コンポーネント：`<Card variant="interactive">` + `<StatusPill>` + Route Number Badge + Arrival Time Display

---

## 1. Structure（構造）

```
┌──────────────────────────────────────────────────┐
│ ┌────┐  系統名 · 行き先              ChevronRight│
│ │205 │  ────────────────────                    │
│ └────┘                                           │
│         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│         あと  5 分     14:23 発                  │
│         [StatusPill: 通常運行]                  │
└──────────────────────────────────────────────────┘
```

| Slot | 必須 | 内容 |
|---|---|---|
| **Route Number Badge** | ✅ | 系統番号（205 / B-7 等）。`font: var(--typography-route-number)` |
| **Route Name** | ✅ | 系統名（市役所前ゆき）。`var(--typography-title)` |
| **Destination** | ▲ | 行き先補足。`var(--typography-caption)` / `--color-text-muted` |
| **Divider** | ✅ | 上下情報の視覚分離。`border-top: 1px solid var(--color-border-subtle)` |
| **Arrival Time** | ✅ | 「あと N 分」or「N 分後」。`font: var(--typography-arrival-time)` + `font-variant-numeric: var(--font-variant-numeric)` |
| **Departure Clock** | ▲ | 「14:23 発」絶対時刻併記。`var(--typography-timetable-cell)` |
| **Status Pill** | ✅ | 現在の運行状態（5 種） |
| **Trailing Chevron** | ✅ | タップ可能であることのアフォーダンス |

**禁止構造：**
- Arrival Time なしで Status Pill だけ表示する → 主役不在
- Status Pill を Route Number と同じ列に並べる → 視線フローが破綻
- Route Number を文字（「205 系統」）として書く → Badge 化することで一意のグリフ的役割を果たす

---

## 2. Priority（情報優先順位）

ユーザーが 0.5 秒で読み取る順序を、視覚階層で強制する：

| 順位 | 情報 | 視覚的重み |
|---|---|---|
| **1** | あと何分で来るか | 最大フォント、最濃色、等幅数字 |
| **2** | 通常運行か遅延か | カラー付き Pill |
| **3** | どの系統か | Badge + 系統名 |
| **4** | 絶対時刻（14:23 発） | 補助情報、muted |

**判断軸：** 「3 つの選択肢のうちどれに乗るか」を意思決定するための情報が上位。乗るかどうかが決まった後の確認情報（時刻・行先詳細）が下位。

**Density mode（高密度リスト時）の優先順位：**
密集表示（5 件以上を一覧）では `compact` バリエーションを使い、Departure Clock を省略、Route Name を 1 行省略表示にする。あと N 分と Status Pill は絶対に省略しない。

---

## 3. State（状態）

| 状態 | 視覚 | データ条件 |
|---|---|---|
| **normal** | Status Pill = onTime | ETA ≤ 定刻 +1 分 |
| **possible-delay** | Status Pill = delayRisk (amber) | 路線上の他便で遅延発生中 |
| **delayed** | Status Pill = delayed (orange) + Arrival Time に取消線で旧 ETA、新 ETA を強調 | 実 ETA > 定刻 +3 分 |
| **arriving** | Arrival Time が「まもなく」表示 + 微細な breathing アニメ | ETA < 1 分 |
| **passed** | カード全体が opacity 0.5、Status Pill = passed (gray) | ETA が過去 |
| **suspended** | Status Pill = suspended (red) + Arrival Time を「—」 | 運休 |
| **stale-data** | カード右上に小さな ⚠ + 「最終更新 N 分前」 | データ取得失敗 / 古い |
| **loading** | Skeleton: Route Badge / Time / Pill を `var(--color-surface-skeleton)` で矩形表示 | 初回フェッチ中 |
| **pressed** | `scale(var(--state-pressed-scale))` | タップ中 |
| **focused** | `outline: var(--a11y-focus-ring)` | キーボード操作 |

**stale-data の扱い**：オフライン / API 失敗時に **データを消さない**。古いデータを「古い」と明示して表示し続けるほうが、空欄より行動可能。

---

## 4. Behavior（振る舞い）

### タップ

- **タップ領域：** カード全体（最小高さ `var(--a11y-touch-target)` を満たす）
- **遷移先：** 路線詳細画面（停留所ごとの ETA を時系列表示）
- **トリガー：** `<Card variant="interactive" as="button">`

### 自動更新

- **更新頻度：** 30 秒ごと（バックグラウンドで silently fetch）
- **更新時の視覚通知：**
  - ETA の数値が変わったときのみ、新しい数字を `var(--motion-enter)` でクロスフェード
  - 数字が変わらない場合、いかなる視覚変化も起こさない（チラつき禁止）
- **Status 変化時：** Status Pill が `--motion-tab-switch` でクロスフェード（色のジャンプ禁止）

### Pull-to-refresh

- ホーム画面のカードリストでサポート
- 引き下げ中：trailing Chevron を ↻ アイコンに置換
- 完了：軽い触覚フィードバック（haptic）+ 「N 件更新」を 2 秒トースト

### スワイプ（任意拡張）

- **左スワイプ：** カードを「ピン留め」する Action revealed
- **右スワイプ：** 「通知設定」Action revealed
- 採用時は ListItem の `trailing` Action と排他にすること

### Empty / Error

| 状況 | 表示 |
|---|---|
| 当日運行なし | Card 自体を出さず、上位の Empty State パターンへ委譲 |
| ネット切断 | stale-data 状態を維持、上部に [`delay-banner.md`](./delay-banner.md) で通知 |
| 不正データ | Card を出さず、エラーログ送出。ユーザーに表示しない |

---

## 5. Motion（モーション）

| イベント | トークン | 持続 / Easing |
|---|---|---|
| カード初回登場 | `var(--motion-enter)` | 240ms / decelerate |
| ETA 数値更新 | `var(--motion-enter)` でクロスフェード | 160ms |
| Status Pill 色変化 | `var(--motion-tab-switch)` | 200ms / standard |
| タップ pressed | `var(--motion-press)` + `scale(0.99)` | 80ms |
| Pull-to-refresh release | `var(--motion-modal-exit)` | 280ms |
| **arriving** breathing | `opacity` 1.0 ⇄ 0.85, 2.0s loop, `var(--easing-standard)` | 無限、ただし `prefers-reduced-motion` で停止 |
| **passed** fade | `opacity` 1 → 0.5 | 400ms / decelerate |

**禁止モーション：**
- カードのスライドイン（リストの並び替えと混同される）
- Bounce / Spring 系（交通情報は信頼が第一、誇張は不誠実）
- 色の hue を回転させるアニメ（情報の意味が変わって見える）

---

## 6. Accessibility

### スクリーンリーダー

カード全体に意味のある読み上げを 1 つにまとめる：

```html
<button
  aria-label="205系統 市役所前ゆき、あと5分、14時23分発、通常運行"
  aria-describedby="card-205-status"
>
  ...
  <span id="card-205-status" class="sr-only">
    最終更新 30秒前
  </span>
</button>
```

- 個別要素を順に読ませない（情報順序がデザイン優先順位と一致するよう **集約 label** にする）
- 状態変化（normal → delayed）は `aria-live="polite"` の領域から再アナウンス
- `arriving` 状態は `aria-live="assertive"` でも可（ユーザーが今乗るべき判断材料）

### キーボード

- Tab で各カードへフォーカス移動
- Enter / Space で詳細遷移
- 矢印キーでカード間移動（リスト全体に `role="list"`、各カードに `role="listitem"`、フォーカス管理は roving tabindex）

### コントラスト

- Status Pill の fg / bg ペアは Semantic 層で **WCAG AA 4.5:1 以上**を保証済み
- 取消線（delayed の旧 ETA）は色だけに頼らない：必ず `<s>` タグ + 「変更前」の aria-label

### 色覚多様性

- Status を**色だけで判断させない**：必ず Icon + Label の併記
- 「あと N 分」の数値は色を変えず一律 `--color-text-strong`（赤緑色覚で差が消える事故を防ぐ）

### 触覚 / 動き

- `prefers-reduced-motion: reduce` で breathing / cross-fade を瞬時化
- arriving 時の haptic feedback はオプトイン（設定で off 可）

---

## 採用判断

| この pattern を使うべき場面 | 使うべきでない場面 |
|---|---|
| ホーム画面の「次に来るバス」リスト | 過去のバス履歴（passed のみ並ぶ画面） |
| 路線詳細の「次の便」セクション | 時刻表全体（密度が違いすぎる、別 pattern） |
| 通知の本文 | 検索結果リスト（系統選択前の段階、route-selector を使う） |

## 実装現況

`RouteCard` / `FakeStateCard` (`BusappComponents.jsx`) が本パターンの実装。Typography はトークン移行済、Status Pill は配色トークン移行が pending、a11y の集約 aria-label は未実装。次の refactor 対象。

---

## Experience Contract（Step 4）

このパターンに紐づく**時間 × 触覚 × 聴覚**の三位一体規約。意味的トークン（`semantic.css` §17–§20）を経由して、コンポーネント実装に体感バジェットを強制する。

### 体感バジェット

- カード差分更新（時刻・遅延数値の変化）は `--motion-experience-reveal-quick`（180ms）以内。
- 接近時のアンビエント呼吸（NFC リング・next 強調）は `--motion-ambient-breathe` / `--motion-ambient-pulse`。ループ系のためバジェット対象外、ただし `prefers-reduced-motion` で完全停止。
- カードタップ→詳細遷移は `--motion-experience-navigation`（200ms）。

### Feedback contract

| 操作 | motion | haptic | audio |
|---|---|---|---|
| カードタップ（詳細展開） | `--feedback-select-motion` | `--feedback-select-haptic` (light) | none |
| 「次に来る」の状態切替（next ↔ scheduled） | `--motion-experience-reveal-quick` | none | none |
| お気に入り登録 | `--feedback-cta-fire-motion` | `--feedback-cta-fire-haptic` (medium) | `--audio-cue-confirm` （任意） |

### フォールバック契約

- **`prefers-reduced-motion: reduce`** : motion トークンが `0.01ms linear` に自動上書き、`--haptic-enabled: 0` で触覚も停止。視覚は静的状態だけ残す。
- **振動非対応端末** : `navigator.vibrate` が未定義の環境では `assets/js/feedback.js` が no-op。視覚 + 音声のみで等価情報量を担保。
- **音声 OFF** (`--audio-cue-enabled: 0`, 既定) : 音声チャネルだけ no-op。視覚 + 触覚で完結する設計を必須とする。

> パターン全体の規約は [`patterns/transition-budget.md`](./transition-budget.md) と [`patterns/feedback-contract.md`](./feedback-contract.md) を参照。
