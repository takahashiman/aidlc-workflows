# Pattern: Delay Banner

> 🛡️ 先に [`../design-system.md`](../design-system.md) と [`../component-contract.md`](../component-contract.md) を読むこと。

## 概要

運行状況の **広域的な異常**（路線全体の遅延、運休、災害、システム障害）を、画面の最上位帯域でユーザーに通知するパターン。
単一便の遅延は [`arrival-card.md`](./arrival-card.md) の状態で表現する。Banner は **「複数の便 / 路線にまたがる事象」** にのみ使う。

---

## 1. Structure（構造）

```
┌─────────────────────────────────────────────────┐
│ ⚠  3系統で遅延が発生しています          ▾ 詳細 │
│    積雪のため安全運行中・最大15分遅れ            │
└─────────────────────────────────────────────────┘
```

| Slot | 必須 | 内容 |
|---|---|---|
| **Severity Icon** | ✅ | lucide: `AlertTriangle` / `AlertOctagon` / `Info` / `CheckCircle2`。severity に対応 |
| **Title** | ✅ | 1 行、24 字以内。事象の要約。`var(--typography-body-strong)` |
| **Body** | ▲ | 1〜2 行、補足説明。`var(--typography-caption)` + `--color-text-muted` |
| **Expand / Dismiss** | ▲ | 詳細展開 or 閉じる。`<button>` で実装 |
| **Affected Routes** | ▲ | 展開時に表示される対象系統のチップ群 |

**配置：**
- 画面最上部、Header の直下、Tabs の上
- 複数 banner が同時発生する場合、最大 1 件のみ表示（severity が高い順）
- 残りは「他 N 件の運行情報」リンクで集約

**禁止構造：**
- 画面中央モーダルとして出す（モーダルは行動を要求する場面のみ）
- toast として一瞬で消える（重要情報を見逃させる）
- Banner 内に Primary Button を配置する（情報通知が CTA に変質する）

---

## 2. Priority（情報優先順位）

| Severity | トークン | 使う条件 | アイコン |
|---|---|---|---|
| **critical** | `--color-feedback-error-*` | 運休・災害・路線閉鎖 | AlertOctagon |
| **warning** | `--color-feedback-warning-*` | 遅延 5 分以上 / 複数系統に波及 | AlertTriangle |
| **info** | `--color-feedback-info-*` | ダイヤ改正告知 / 工事のお知らせ | Info |
| **success** | `--color-feedback-success-*` | 復旧通知（一過性、最大 10 秒） | CheckCircle2 |

**同時表示優先順位：** critical > warning > info > success。複数あれば最上位 1 件のみ表示。

**読み取り順：**
1. Icon の色とシェイプ（赤い八角形 = 即危険を瞬時に認知）
2. Title（事象が何か）
3. Body / 詳細展開（影響範囲・原因）

---

## 3. State（状態）

| 状態 | 視覚 | 条件 |
|---|---|---|
| **active** | 標準表示 | 異常イベント発生中 |
| **collapsed** | Title のみ表示、Body 非表示 | 既定（モバイル省スペース） |
| **expanded** | Title + Body + Affected Routes 全表示 | ユーザーが「詳細」をタップ |
| **dismissed** | 非表示 | ユーザーが × をタップ、または severity=success で 10s 経過 |
| **persistent** | × ボタンを表示しない | severity=critical かつ運休中（閉じさせない） |
| **resolved** | severity を success に切替、10 秒後 fade-out | バックエンドが復旧シグナル送出 |
| **stacked** | 「他 N 件の運行情報」リンクが Title 横に表示 | 複数 banner キューイング |

**Dismissed の永続化：**
- 同一 banner ID を `localStorage` に記録、再表示しない
- ただし severity が変化した場合（warning → critical）は再表示する

---

## 4. Behavior（振る舞い）

### 展開 / 折りたたみ

- Title 帯全体がタップ可能領域
- タップで `expanded ⇄ collapsed` トグル
- Body 部分は `max-height` トランジションで展開（`auto` への transition は不可、明示的な高さ計測）

### Dismiss

- × ボタンは `aria-label="この通知を閉じる"` 必須
- severity=critical の persistent では × を**出さない**
- dismissed 時は `var(--motion-modal-exit)` で fade + slide up

### 自動更新

- 30 秒ごとに severity / Title / Body を再フェッチ
- 内容変化時は `var(--motion-enter)` で **新旧クロスフェード**（Banner 自体は閉じずに更新）
- severity が下がる方向（warning → info）の変化は穏やかに、上がる方向（warning → critical）は haptic + assertive aria-live

### 詳細リンク

- 「詳細を見る」リンクで運行情報詳細画面へ遷移
- 遷移時、banner の dismissed フラグは立てない（戻ってきても同じ banner が見える）

### Affected Routes チップ

- 展開時のみ表示
- チップタップで該当系統の詳細画面へ
- チップは `<a>` で実装、Component Contract 第 4 条準拠（hit area 44×44）

---

## 5. Motion（モーション）

| イベント | トークン | 備考 |
|---|---|---|
| 出現 | `var(--motion-enter)` で `translateY(-100%) → 0` + fade | 上から降りてくる |
| 消滅 | `var(--motion-exit)` で逆 | |
| 展開 / 折りたたみ | `var(--motion-tab-switch)` で `max-height` | 280ms / standard |
| severity 切替 | `var(--motion-enter)` で背景色クロスフェード | 即座に hue ジャンプ禁止 |
| critical 出現時 | 出現後 1 度だけ、`scale(1.0 → 1.02 → 1.0)` の 240ms pulse | 注意喚起、`prefers-reduced-motion` で停止 |
| stacked リンク出現 | `var(--motion-enter)` でフェード | |

**禁止モーション：**
- 連続点滅・無限振動（パニックを誘発、認知負荷過剰）
- 横スライド（Banner は画面上端に固定される情報、左右運動は意味的に誤り）
- 透明度の無限 loop（critical でも 1 度の pulse のみ）

---

## 6. Accessibility

### 役割

```html
<div role="status" aria-live="assertive" aria-atomic="true">
  <span class="sr-only">運行情報の更新: </span>
  ...
</div>
```

- severity=critical / warning → `aria-live="assertive"`（即時読み上げ）
- severity=info / success → `aria-live="polite"`（次の節目で読み上げ）
- `aria-atomic="true"` で内容変化時に全文を再読み上げ

### スクリーンリーダー読み上げ順

1. Severity（「警告」「重要」「お知らせ」） — Icon の aria-label で表現
2. Title 全文
3. 折りたたみ状態であれば「詳細を見るには展開してください」
4. Affected Routes は展開時のみ読み上げ対象に含める

### キーボード

- Banner にフォーカス可能（`tabindex="0"`、`role="region"`）
- Enter / Space で展開トグル
- Escape で dismiss（×ボタン相当）
- Affected Routes チップ間は ←→ で移動

### コントラスト / 色覚

- すべての severity 配色は Semantic 層で **fg/bg コントラスト 4.5:1 以上**を保証
- 色だけで severity を判断させない：必ず Icon + Title 文言の双方で severity を伝える
- 取消線・色変化以外で「異常」を伝える文字情報（「遅延」「運休」）を必ず含む

### 触覚

- critical 出現時のみ haptic feedback（軽い 1 ノッチ）
- info / success では触覚なし（過剰刺激防止）

### 動き

- `prefers-reduced-motion: reduce` で出現・pulse・クロスフェードを瞬時化
- 展開 / 折りたたみは即時表示／非表示に置き換え

---

## 採用判断

| 使うべき場面 | 使うべきでない場面 |
|---|---|
| 路線全体に影響する遅延 | 単一便の遅延 → arrival-card の状態で表現 |
| 災害・路線閉鎖 | 個別停留所の臨時休止 → arrival-card の per-stop メッセージ |
| ダイヤ改正告知 | プロモーション・キャンペーン → 別 pattern（広告 banner） |
| サービス障害復旧通知 | 一般的なお知らせ → 設定画面のお知らせリストへ |

## 実装現況

**未実装**（本パターンで予約）。実装時は `<DelayBanner severity title body routes affected />` として、ホーム画面 Header 直下に配置。

---

## Experience Contract（Step 4）

このパターンに紐づく**時間 × 触覚 × 聴覚**の三位一体規約。意味的トークン（`semantic.css` §17–§20）を経由して、コンポーネント実装に体感バジェットを強制する。

### 体感バジェット

- バナー登場は `--motion-experience-navigation`（200ms）。常設情報のため例外帯は使わない。
- バナー退場（解消通知）は `--motion-experience-dismiss-quick`（150ms）。即時に画面を返す。
- 展開 / 折りたたみは `--motion-experience-reveal-quick`（180ms）。

### Feedback contract

| 操作 | motion | haptic | audio |
|---|---|---|---|
| バナー登場（重要度: 警告） | `--motion-experience-navigation` | `--haptic-warning` | `--audio-cue-warning` （任意） |
| バナー登場（重要度: 軽微） | `--motion-experience-reveal-quick` | none | none |
| 詳細展開タップ | `--feedback-select-motion` | `--feedback-select-haptic` | none |
| 解消通知の登場 | `--motion-experience-reveal-quick` | `--haptic-light` | `--audio-cue-success` （任意） |

### フォールバック契約

- **`prefers-reduced-motion: reduce`** : motion トークンが `0.01ms linear` に自動上書き、`--haptic-enabled: 0` で触覚も停止。視覚は静的状態だけ残す。
- **振動非対応端末** : `navigator.vibrate` が未定義の環境では `assets/js/feedback.js` が no-op。視覚 + 音声のみで等価情報量を担保。
- **音声 OFF** (`--audio-cue-enabled: 0`, 既定) : 音声チャネルだけ no-op。視覚 + 触覚で完結する設計を必須とする。

> パターン全体の規約は [`patterns/transition-budget.md`](./transition-budget.md) と [`patterns/feedback-contract.md`](./feedback-contract.md) を参照。
