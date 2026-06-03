# Pattern: Notification Sheet

> 🛡️ 先に [`../design-system.md`](../design-system.md) と [`../component-contract.md`](../component-contract.md) を読むこと。

## 概要

ユーザー個別の通知（お気に入り路線の遅延、定期券更新リマインド、システムメッセージ）を **時系列で一覧** するボトムシート / 専用画面。

[`delay-banner.md`](./delay-banner.md) が **「全員に向けた広域通知」** であるのに対し、本パターンは **「あなた宛ての履歴」** を扱う。

---

## 1. Structure（構造）

### コンテナ：Bottom Sheet（モバイル既定） or 専用画面

```
┌─────────────────────────────────┐
│         ─────                   │ ← drag handle
│  通知                  すべて既読│
├─────────────────────────────────┤
│ 今日                            │
│  ⚠ 205系統が遅延しています       │
│    14:23 · あと5分              │
│  ────────                       │
│  💳 定期券の更新期限が近づいてい│
│    ています                     │
│    13:00 · 残り3日              │
├─────────────────────────────────┤
│ 昨日                            │
│  ✅ B-7系統の運行が再開しました │
│  ────────                       │
│  ...                            │
├─────────────────────────────────┤
│         通知設定 →              │
└─────────────────────────────────┘
```

| Slot | 必須 | 内容 |
|---|---|---|
| **Drag Handle** | ✅(Sheet) | 上端の灰色バー、`var(--color-border-default)` |
| **Title Bar** | ✅ | 「通知」「すべて既読」「閉じる ×」 |
| **Section Header** | ✅ | 「今日」「昨日」「N 日前」「これより前」グルーピング |
| **Notification Row** | ✅ | Icon + Title + Body + Timestamp + (Action Hint) |
| **Empty State** | ✅ | 通知 0 件時の状態 |
| **Footer** | ▲ | 通知設定への導線リンク |

**Notification Row の内訳：**

| サブスロット | 内容 |
|---|---|
| Icon | category に応じた lucide アイコン（`AlertTriangle` / `CreditCard` / `Bell` / `CheckCircle2` 等） |
| Title | 通知の要約、1 行 32 字以内、`var(--typography-body-strong)` |
| Body | 補足、最大 2 行、`var(--typography-caption)` + muted |
| Timestamp | 相対時刻（「5 分前」「13:00」「昨日」）、`var(--typography-eyebrow)` |
| Unread Dot | 未読時のみ、行頭に 8px の brand 色ドット |
| Trailing Action | 「ルート詳細」「更新する」等のリンク（任意） |

---

## 2. Priority（情報優先順位）

| 順位 | 軸 | 補足 |
|---|---|---|
| **1** | 未読 > 既読 | 未読をリスト最上部、ただし時系列との両立は時系列を優先（未読はドットで強調） |
| **2** | 時系列降順 | 今日 → 昨日 → 過去 |
| **3** | category 重要度 | 同時刻なら critical > warning > reminder > info |
| **4** | アクション可否 | アクション可能（「更新する」等）は視覚的に強調 |

**Category の重要度：**

| Category | 例 | 視覚的扱い |
|---|---|---|
| `critical` | お気に入り路線の運休 | Icon = red、Title 太字 |
| `warning` | 遅延発生 | Icon = amber |
| `reminder` | 定期券更新期限 | Icon = brand |
| `info` | 新機能告知 | Icon = muted |
| `success` | 運行再開 | Icon = green |

**1 セクション内の最大表示：** 20 件。それ以上は「もっと見る」で展開。

---

## 3. State（状態）

| 状態 | 視覚 | 条件 |
|---|---|---|
| **closed** | 非表示 | 既定（モバイル） |
| **opened** | Bottom Sheet が 70% viewport 高で表示 | ユーザーが Bell アイコンをタップ |
| **fullscreen** | Sheet をさらに上にドラッグで全画面化 | Sheet を上端まで引き上げ |
| **loading** | Notification Row 5 件分の Skeleton | 初回フェッチ |
| **empty** | 「新しい通知はありません」+ Bell アイコン中央配置 | 通知 0 件 |
| **unread** | 行頭に brand 色ドット、bg = `var(--color-surface-brand-subtle)` 弱tint | 未読 |
| **read** | 標準表示、bg = surface-default | 既読 |
| **swipe-revealed** | 行の右側に「既読にする」「削除」action | 左スワイプ |
| **deleted** | 行が消える、3 秒間「元に戻す」inline toast | スワイプ削除実行 |
| **offline** | 上部に「オフラインのため最新ではない可能性があります」notice | ネット切断 |

**未読の管理：**
- Sheet を**開いた瞬間に**未読を既読化するのは禁止（誤タップで全消失）
- 画面に**表示された**通知は 2 秒後に既読化（IntersectionObserver で観測）
- 「すべて既読」ボタンで一括既読可能
- 既読化は楽観的更新（即時 UI 反映、失敗時はロールバック + トースト通知）

---

## 4. Behavior（振る舞い）

### 開閉

- **Trigger：** ヘッダーの Bell アイコン（未読数バッジ付き）
- **Open：** Bottom Sheet が下から `var(--motion-modal-enter)` でスライドイン
- **Dismiss：** ① drag handle を下にスワイプ ② 背景タップ ③ 戻るボタン ④ Escape キー
- **Fullscreen toggle：** Sheet を上端までドラッグで全画面、下にドラッグで 70% に戻る

### 通知タップ

- 通知本文タップで詳細画面 / 関連 deep link へ遷移
- 遷移時に該当通知を即既読化
- Sheet は閉じる（戻ってきたら閉じている状態）
- 「Trailing Action」が定義されている通知は、Action タップで Sheet を閉じずに即実行（例：「更新する」→ 定期券更新フロー）

### スワイプ操作

| 方向 | アクション |
|---|---|
| **左スワイプ** | 「既読にする」「削除」の 2 つの action revealed |
| **右スワイプ** | 「ピン留め」action revealed（任意機能） |
| **長押し** | コンテキストメニュー（既読、削除、通知設定へ） |

### 既読化

- IntersectionObserver で「2 秒以上連続表示」を観測 → 既読 API 呼び出し
- スクロール中に瞬間的に通った通知は既読化しない（誤検知防止）
- 「すべて既読」タップ時：確認ダイアログ**なし**、ただし 3 秒間「元に戻す」inline toast 表示

### Empty State

- 「新しい通知はありません」と Bell アイコン
- サブテキスト：「お気に入り路線の遅延や、定期券の更新時にお知らせします」
- 「通知設定」へのリンクを表示

### Pull-to-refresh

- Sheet 上部で下方向に引き下げ → ↻ アイコン → 離して更新
- 完了：軽い haptic + 「N 件の新着」inline toast

---

## 5. Motion（モーション）

| イベント | トークン | 備考 |
|---|---|---|
| Sheet 出現 | `var(--motion-modal-enter)` | 280ms / decelerate、下から上へ |
| Sheet 消滅 | `var(--motion-modal-exit)` | 240ms / accelerate、上から下へ |
| 通知行 出現（新着） | `var(--motion-enter)` でフェード + わずかな下からスライド | リスト先頭に追加時 |
| 既読化 | `bg` を unread → read に `var(--motion-tab-switch)` でクロスフェード | dot は同時にフェードアウト |
| Sheet ドラッグ | リアルタイム追従（transition なし）、リリース時に snap | snap は `var(--easing-decelerate)` |
| Swipe reveal | リアルタイム追従、リリースで snap | 50% 超で reveal 確定 |
| 削除 | 行を右にスライドアウト + `max-height: 0` 同時 | 240ms / accelerate |
| Pull-to-refresh | ↻ アイコン回転 | 1.2s linear loop |
| Bell バッジ更新 | 数値変化時のみ `scale(1.0 → 1.3 → 1.0)` 200ms | 増加時のみ。減少時は静的 |

**禁止モーション：**
- 通知リスト全体の自動スクロール（ユーザー操作を奪う）
- 派手な color flash（通知の真剣味が損なわれる）
- Bell バッジの無限振動（過剰刺激）

---

## 6. Accessibility

### 役割

- Sheet コンテナ：`role="dialog"` + `aria-modal="true"` + `aria-labelledby` で Title を参照
- 通知リスト：`role="list"` + 各行 `role="listitem"`
- Unread Dot：装飾扱いせず、`aria-label="未読"` を含めた集約 label を行全体に付与
- Section Header：`<h2>` または `role="heading" aria-level="2"`

### スクリーンリーダー

各行の読み上げ集約 label：

```
"未読、警告、205系統が遅延しています、14時23分発、あと5分、5分前、タップで詳細"
```

順序：未読 → category → Title → Body → Timestamp → Action ヒント

新着通知到着時：

- Sheet 開いてない時：Header の Bell バッジ更新を `aria-live="polite"` で「未読通知 3 件」
- Sheet 開いてる時：リスト先頭への追加を `aria-live="polite"` で読み上げ

### キーボード

- Bell アイコン Enter / Space で Sheet 開閉
- Sheet 内 Tab で Title Bar → リスト → Footer
- リスト内 ↑↓ で行移動（roving tabindex）
- Enter で通知タップ
- Delete キーで削除（macOS / Windows 共通）
- Escape で Sheet を閉じる
- フォーカス管理：Sheet 開いた時に最初の未読、なければ最新通知にフォーカス。閉じた時に Bell へ戻す

### フォーカストラップ

- Sheet 開いている間、フォーカスは Sheet 内に閉じ込める（背景にタブで出ない）
- 閉じた瞬間にトラップ解除

### コントラスト / 色覚

- Unread の brand-subtle 背景は標準背景と AA コントラストを満たす差を Semantic 層で保証
- Category Icon は色だけでなく**形状**で識別可能（critical=AlertOctagon、warning=AlertTriangle 等を必ず使い分け）

### Touch / 操作

- 各 Notification Row は最低 60px の touch target（44px だと密集時に誤タップ多発）
- Drag Handle は touch 領域 44×44 確保、視覚的には 32×4 のバー
- スワイプアクションは 50% 以上の引きで確定、それ未満はスナップバック

### 動き

- `prefers-reduced-motion: reduce` で Sheet スライドを瞬時化、Bell バッジの bounce 停止
- スワイプ削除のスライドアウトは即時 fade-out に置換

### Haptic

- 通知到達（バックグラウンド）：OS 標準の通知音/バイブに委譲、アプリ内では発火しない
- Sheet 内の操作（既読化、削除）：軽い 1 ノッチ haptic
- 「すべて既読」確定：中程度の 1 ノッチ + visual toast

---

## 採用判断

| 使うべき場面 | 使うべきでない場面 |
|---|---|
| アプリ内の通知履歴閲覧 | 緊急の運行情報 → delay-banner（画面常設） |
| 個別ユーザーへのリマインド（定期券更新等） | 全員向け告知 → delay-banner |
| 通知中心の操作（既読・削除・設定） | 単発の確認メッセージ → トースト |

## 実装現況

**未実装**（本パターンで予約）。実装時は `<NotificationSheet>` として、Header の Bell アイコンタップで開く Bottom Sheet を構築する。

---

## Experience Contract（Step 4）

このパターンに紐づく**時間 × 触覚 × 聴覚**の三位一体規約。意味的トークン（`semantic.css` §17–§20）を経由して、コンポーネント実装に体感バジェットを強制する。

### 体感バジェット

- シート登場は `--motion-experience-sheet-rise`（240ms — 例外帯）。高さがある＝焦点遷移のための猶予。
- シート退場（dismiss）は `--motion-experience-dismiss-quick`（150ms）。
- シート内アイテム操作（既読化、削除）は `--motion-experience-press-result`（150ms）。

### Feedback contract

| 操作 | motion | haptic | audio |
|---|---|---|---|
| シート登場 | `--motion-experience-sheet-rise` | `--haptic-medium` | none |
| シート退場 | `--motion-experience-dismiss-quick` | none | none |
| 個別通知タップ（既読化） | `--feedback-cta-fire-motion` | `--feedback-cta-fire-haptic` (light) | none |
| 「すべて既読」確定 | `--feedback-cta-success-motion` | `--feedback-cta-success-haptic` | `--audio-cue-confirm` （任意） |
| 削除（スワイプ確定） | `--motion-experience-press-result` | `--haptic-medium` | none |

### フォールバック契約

- **`prefers-reduced-motion: reduce`** : motion トークンが `0.01ms linear` に自動上書き、`--haptic-enabled: 0` で触覚も停止。視覚は静的状態だけ残す。
- **振動非対応端末** : `navigator.vibrate` が未定義の環境では `assets/js/feedback.js` が no-op。視覚 + 音声のみで等価情報量を担保。
- **音声 OFF** (`--audio-cue-enabled: 0`, 既定) : 音声チャネルだけ no-op。視覚 + 触覚で完結する設計を必須とする。

> パターン全体の規約は [`patterns/transition-budget.md`](./transition-budget.md) と [`patterns/feedback-contract.md`](./feedback-contract.md) を参照。
