# Pattern: Route Selector

> 🛡️ 先に [`../design-system.md`](../design-system.md) と [`../component-contract.md`](../component-contract.md) を読むこと。

## 概要

ユーザーが **「どの路線を見るか」を選ぶ** ためのインターフェース。
ホーム画面のフィルタ、検索画面、地域選択、お気に入り路線管理の共通土台。

「移動の起点となる選択 UX」であり、誤選択が乗り間違いに直結する。**曖昧さを許容しない設計**を最優先する。

---

## 1. Structure（構造）

ユースケースごとに 3 つのバリエーション：

### A. Quick Filter（横スクロールチップ）

```
[すべて] [205] [B-7] [301] [G-12] ...→
```

- ホーム画面の上部、Tabs の下に配置
- お気に入り + 直近利用の系統を 5〜8 件表示

### B. Selector List（縦リスト）

```
┌────────────────────────────────┐
│ 🔍 系統番号・停留所で検索       │
├────────────────────────────────┤
│ ⭐ お気に入り                   │
│   ┌────┐ 205 市役所前ゆき      │
│   │205 │ 通常運行              │
│   └────┘                       │
├────────────────────────────────┤
│ 📍 近くの路線                   │
│   ...                          │
├────────────────────────────────┤
│ 🚌 すべての系統                 │
│   ...                          │
└────────────────────────────────┘
```

- 検索画面・系統一覧の主役 UX

### C. Origin → Destination（ペア選択）

```
┌─────────────────────────────────┐
│ 🟢 出発地  │  中央駅          │
├─────────────────────────────────┤
│ 🔴 目的地  │  市民病院         │
├─────────────────────────────────┤
│ [候補ルートを検索]             │
└─────────────────────────────────┘
```

- 経路検索画面

| Slot | 必須 | 内容 |
|---|---|---|
| **Search Input** | A▲ B✅ C✅ | `<input type="search">` + 検索アイコン |
| **Section Header** | B✅ | 「お気に入り」「近くの路線」「すべて」等のグルーピング |
| **Route Row** | B✅ | Route Badge + 系統名 + 行き先 + 現在状態の縮小表示 |
| **Filter Chip** | A✅ | 角丸 pill。アクティブ状態あり |
| **Empty State** | ✅ | 該当 0 件時、検索条件の見直しを促す |

---

## 2. Priority（情報優先順位）

ユーザーが「どの路線を選ぶか」決める情報の重み：

| 順位 | 情報 | 表示優先 |
|---|---|---|
| **1** | お気に入り（過去の選択） | リスト最上部・常に最初 |
| **2** | 現在地から近い路線 | 2 番目のセクション |
| **3** | 検索クエリへのマッチ度 | 入力中はこれが最優先 |
| **4** | アルファベット / 系統番号順 | 4 番目以降 |
| **5** | 全系統リスト（fallback） | 最下部 |

**判断軸：** 「使ったことがあるか」が最大の手がかり。新規ユーザーには「近くの路線」が代替の最強シグナル。

### Section の並び順は固定

- お気に入り → 近く → すべて、の順を **逆転させない**
- セクションごとに `<h2>` 見出しを置き、画面内のランドマーク化
- 各セクション内は最大 5 件で省略、「もっと見る」リンクで全表示

---

## 3. State（状態）

| 状態 | 視覚 | 条件 |
|---|---|---|
| **idle** | 標準表示 | 入力なし |
| **typing** | 検索結果をリアルタイム反映、セクション再構成 | 入力中 |
| **no-results** | Empty state: 「該当する路線が見つかりません」+ 検索ヒント | クエリ 0 件 |
| **loading** | Skeleton: Route Row を 5 件分グレー矩形で表示 | 初回フェッチ中 |
| **selected** (A) | チップが brand 色背景 + onBrand 文字 | アクティブフィルタ |
| **selected** (C) | フィールドに値、`Clear` アイコン表示 | 起点・終点指定済 |
| **disabled** | opacity 0.40 | 路線が運休 / 営業時間外 |
| **favorited** | 行頭に `Star` (filled) アイコン | お気に入り登録済 |
| **recent** | 行頭に時計アイコン、薄い tint | 直近 7 日以内に選択 |
| **offline** | 検索 disable + 「オフラインのため候補が限定的」notice | ネット切断 |

**typing の挙動：**
- 入力ごとに即時フィルタ（debounce 150ms）
- 1 文字目はサーバー検索せずローカルキャッシュ（お気に入り + 直近）のみ
- 2 文字以降はサーバー検索もマージ
- 結果セクションは「マッチした候補」「お気に入り」「近く」「すべて」の順に再構成

---

## 4. Behavior（振る舞い）

### 選択確定

- **Quick Filter (A)：** タップで即フィルタ適用、画面を切り替えない
- **Selector List (B)：** Route Row タップで路線詳細画面へ遷移
- **O→D (C)：** 両フィールド入力後、「検索」Primary Button タップで結果画面へ

### 検索

- IME 対応：日本語入力中（composition）は確定後にクエリ送信
- カナ / ローマ字どちらでもヒット（バックエンド側でノーマライズ）
- 系統番号は完全一致を優先（「205」入力 → 205 系統が最上位）
- 停留所名でも検索可能：マッチ時は「『〇〇停』を通る系統」セクションを最上位に挿入

### お気に入り操作

- Route Row の trailing に Star アイコン（lucide）
- タップで toggle、即座にローカル + サーバーへ反映
- toggle 直後、軽い haptic + 1.5 秒の inline toast（「お気に入りに追加」）

### 履歴

- 選択した路線は `recent` リストに最大 10 件保存
- 同じ路線を再選択した場合、リスト先頭に移動

### Empty State

- 0 件時のメッセージ：「該当する路線が見つかりません」+ 検索クエリのハイライト
- アクションヒント：「系統番号で検索」「停留所名で検索」「お気に入りから選ぶ」を 3 つの ListItem で提示

### Clear

- 検索フィールド右の × アイコンで一括クリア
- O→D の各フィールドにも個別 Clear
- すべての Clear はキーボードフォーカスを入力フィールドへ戻す

---

## 5. Motion（モーション）

| イベント | トークン | 備考 |
|---|---|---|
| Filter Chip 選択 | `var(--motion-tab-switch)` で bg / fg クロスフェード | scale 変化なし |
| 検索結果の差し替え | `var(--motion-enter)` でリスト全体クロスフェード | 行単位の stagger は禁止（情報遅延に感じる） |
| 行展開（詳細プレビュー） | `var(--motion-tab-switch)` で max-height | |
| Skeleton → 実データ | `var(--motion-enter)` でクロスフェード | スケルトンは shimmer なし（情報の精度を下げる演出を避ける） |
| Star toggle | `scale(1.0 → 1.2 → 1.0)` 200ms + 色変化 | filled / outline のクロスフェード |
| Clear タップ | `var(--motion-press)` | |
| O→D Swap（任意） | `var(--motion-tab-switch)` でフィールド上下入れ替え | reduced-motion で瞬時化 |

**禁止モーション：**
- 横スライドで結果を切り替える（タブ切替と誤認識）
- Bounce / Spring（信頼性が必要な選択 UX に不適切）
- 検索中の loading spinner を入力フィールド内に置く（入力位置と競合）

---

## 6. Accessibility

### 役割

- Selector List (B) 全体に `role="search"`
- 結果セクション全体に `role="listbox"`、各 Route Row に `role="option"`
- Filter Chip 群に `role="group"` + `aria-label="路線フィルタ"`、各チップに `aria-pressed`

### スクリーンリーダー

- 検索入力に `aria-label="系統番号、停留所名で検索"`
- 結果の件数を `aria-live="polite"` で読み上げ：「3 件の路線が見つかりました」
- 各 Route Row は集約 label：「205系統、市役所前ゆき、現在通常運行、お気に入り登録済」

### キーボード

- Tab で検索 → セクション → 行へ順次移動
- リスト内では ↑↓ で移動、Enter で選択（roving tabindex）
- `/` キーで検索フィールドへフォーカス（PC ユーザー向けショートカット）
- Escape で検索クリア、もう一度 Escape で modal 閉じる（モーダル時）

### IME / 日本語入力

- 検索インプットは `lang="ja"` 明示
- composition 中はフィルタを発火しない（入力中の文字が即座に消えるのを防ぐ）
- カナ / ローマ字 / 漢字混在の検索を受け入れる

### コントラスト

- Filter Chip の active / inactive 配色は Semantic 層で AA 保証
- selected 状態は色だけでなくアイコン（Check）も併記

### Touch

- Quick Filter chip は横スクロール領域。各 chip は `var(--a11y-touch-target)` 以上
- 横スクロール領域は scroll-snap で chip 単位スナップ、誤タップを軽減
- Route Row は最小 56px（48 px の touch target + padding）

### 動き

- `prefers-reduced-motion: reduce` で Star bounce、検索結果クロスフェードを瞬時化

---

## 採用判断

| 使うべき場面 | 使うべきでない場面 |
|---|---|
| ホーム画面の路線フィルタ (A) | 系統が 3 つ以下の小規模都市 → 単純な Tabs で十分 |
| 検索画面のメイン UX (B) | モーダルの中での一時選択 → Bottom Sheet + 簡略リスト |
| 経路検索の起終点指定 (C) | 単一地点の選択（停留所マップ等） → 地図 UI に委譲 |

## 実装現況

**未実装**（本パターンで予約）。Quick Filter (A) は今後ホーム画面 Tabs の下に追加予定。Selector List (B) は検索タブの主要画面として実装予定。

---

## Experience Contract（Step 4）

このパターンに紐づく**時間 × 触覚 × 聴覚**の三位一体規約。意味的トークン（`semantic.css` §17–§20）を経由して、コンポーネント実装に体感バジェットを強制する。

### 体感バジェット

- フィルタチップ選択は `--motion-experience-press-result`（150ms）。タップ→フィルタ反映までを 150ms 以内。
- リスト表示の検索結果切替（クロスフェード）は `--motion-experience-reveal-quick`（180ms）。
- Star bounce など装飾的アニメは `--motion-press`（instant）。 `prefers-reduced-motion` で停止。

### Feedback contract

| 操作 | motion | haptic | audio |
|---|---|---|---|
| チップ選択 | `--feedback-select-motion` | `--feedback-select-haptic` (light) | none |
| 路線決定（確定タップ） | `--feedback-cta-fire-motion` | `--feedback-cta-fire-haptic` (medium) | `--audio-cue-tap` （任意） |
| お気に入り Star トグル | `--feedback-toggle-motion` | `--feedback-toggle-haptic` (light) | none |
| 検索結果クロスフェード | `--motion-experience-reveal-quick` | none | none |

### フォールバック契約

- **`prefers-reduced-motion: reduce`** : motion トークンが `0.01ms linear` に自動上書き、`--haptic-enabled: 0` で触覚も停止。視覚は静的状態だけ残す。
- **振動非対応端末** : `navigator.vibrate` が未定義の環境では `assets/js/feedback.js` が no-op。視覚 + 音声のみで等価情報量を担保。
- **音声 OFF** (`--audio-cue-enabled: 0`, 既定) : 音声チャネルだけ no-op。視覚 + 触覚で完結する設計を必須とする。

> パターン全体の規約は [`patterns/transition-budget.md`](./transition-budget.md) と [`patterns/feedback-contract.md`](./feedback-contract.md) を参照。
