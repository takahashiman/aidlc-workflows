# Pattern: Page Transition — 画面遷移の標準規約

> **Step 4 で導入**。Step 4 の体感バジェット契約（`transition-budget.md`）と feedback contract を、画面遷移という具体的シーンに適用する。

## 原則

画面遷移はユーザーの **「意思決定」と「結果の受領」** をつなぐ最も重要なフィードバック。

- **進む（forward）** / **戻る（back）** / **モーダル登場（modal-rise）** / **タブ切替（tab-switch）** の 4 種に分類し、それぞれにバジェットと feedback contract を割り当てる。
- ナビゲーションの「方向性」は視覚（スライド方向）で示し、「種類」は haptic で補強する。
- すべて 280ms 以内（最大例外帯）。

## 遷移 4 種

| 種類 | motion トークン | 視覚演出 | 推奨 feedback |
|---|---|---|---|
| **forward** | `--motion-experience-navigation` (200ms) | 右からスライドイン + 旧画面 −16px の depth | `select` (light haptic) |
| **back** | `--motion-experience-navigation` (200ms) | 左からスライドイン + 旧画面 +16px の depth | `select` (light haptic) |
| **tab-switch** | `--motion-experience-navigation` (200ms) | クロスフェード（slide なし） | `select` (light haptic) |
| **modal-rise** | `--motion-experience-modal-rise` (280ms) | 下から上昇 + 背景に scrim 0 → 0.6 | `cta-fire` (medium haptic) |
| **modal-dismiss** | `--motion-experience-dismiss-quick` (150ms) | 上から下へ退場 + scrim フェードアウト | none |
| **sheet-rise** | `--motion-experience-sheet-rise` (240ms) | 下からシート上昇 | `cta-fire` (medium haptic) |
| **sheet-dismiss** | `--motion-experience-dismiss-quick` (150ms) | 下へシート退場 | none |

## 視覚仕様（CSS スニペット）

```css
/* forward: 新画面が右から入る */
.page--enter-forward {
  transform: translateX(100%);
  animation: page-enter-forward var(--motion-experience-navigation) forwards;
}
@keyframes page-enter-forward {
  to { transform: translateX(0); }
}
.page--exit-forward {
  /* 旧画面は depth 表現（背景に沈む） */
  animation: page-exit-forward var(--motion-experience-navigation) forwards;
}
@keyframes page-exit-forward {
  to {
    transform: translateX(-16px);
    opacity: 0.6;
  }
}

/* back: forward と方向が逆 */
.page--enter-back  { animation: page-enter-back  var(--motion-experience-navigation) forwards; }
.page--exit-back   { animation: page-exit-back   var(--motion-experience-navigation) forwards; }
@keyframes page-enter-back { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes page-exit-back  { from { transform: translateX(0);     } to { transform: translateX(100%); } }

/* tab-switch: クロスフェードのみ */
.page--tab-enter { animation: tab-enter var(--motion-experience-navigation) forwards; }
@keyframes tab-enter { from { opacity: 0; } to { opacity: 1; } }

/* modal-rise: 下から上昇 + scrim */
.modal--enter {
  transform: translateY(24px);
  opacity: 0;
  animation: modal-rise var(--motion-experience-modal-rise) forwards;
}
@keyframes modal-rise { to { transform: translateY(0); opacity: 1; } }
.modal-scrim--enter { animation: scrim-fade-in var(--motion-experience-modal-rise) forwards; }
@keyframes scrim-fade-in { to { background: rgba(15, 23, 42, 0.6); } }
```

## 「方向性」の意味

| 方向 | 意味 | 例 |
|---|---|---|
| 右から → forward | 階層を深める／次の動作へ進む | 路線一覧 → 路線詳細 |
| 左から → back | 階層を戻る／前の状態へ | 路線詳細 → 路線一覧 |
| クロスフェード → tab-switch | 同階層内の平行移動 | ホーム ↔ 検索 ↔ マイページ |
| 下から → modal/sheet-rise | レイヤーを重ねる | フィルタ展開、確認ダイアログ |

ユーザーは **方向で意味を理解する**。スライド方向を逆にすると「戻ったつもりが進んでしまった」混乱を生む。

## Feedback Contract の適用

```html
<!-- ナビゲーション操作（list-item タップ → 詳細遷移） -->
<button class="list-item" data-feedback="select" onclick="navigateForward('route-detail')">
  系統 32
</button>

<!-- モーダルを開く CTA -->
<button class="btn btn--primary" data-feedback="cta-fire" onclick="openModal('confirm-purchase')">
  購入する
</button>
```

JS ヘルパー（`assets/js/feedback.js`）が `data-feedback` を読み、`fireFeedback()` で触覚を発火。

## アクセシビリティ要件

### `prefers-reduced-motion: reduce`

- スライド・上昇すべて `0.01ms linear` に上書き → **即時切替**
- ただし `opacity` の段階変化は維持（フォーカス追跡の補助）
- scrim は瞬時に 0 → 0.6 に変化

### フォーカス管理

| 遷移 | フォーカス先 |
|---|---|
| forward | 新画面の最初の見出し（`h1` / `[role="heading"][aria-level="1"]`） |
| back | 元の画面で最後にフォーカスされていた要素（履歴保持） |
| modal-rise | モーダル内の最初の操作可能要素（ボタン / 入力） |
| modal-dismiss | モーダルを開いた要素 |
| tab-switch | タブパネル内の最初の見出し |

### スクリーンリーダー通知

- forward / back は `aria-live="polite"` で新画面のタイトルを通知
- modal は `aria-modal="true"` + `role="dialog"`
- tab-switch は `role="tabpanel"` の切替で自動通知

## 実装現況

**未実装**（本パターンで予約）。次の実装候補：

1. ホーム ↔ 路線詳細：forward / back 遷移
2. ホーム ↔ 検索 ↔ マイページ：tab-switch
3. 通知一覧 → notification-sheet：sheet-rise
4. 定期券購入確認 → modal-rise

実装は React Router の `useTransition` か View Transitions API のいずれかで構築。motion トークンは CSS 側で消費。

---

## 関連

- [`patterns/transition-budget.md`](./transition-budget.md) — 200ms 体感バジェット規約
- [`patterns/feedback-contract.md`](./feedback-contract.md) — feedback contract
- [`patterns/notification-sheet.md`](./notification-sheet.md) — sheet-rise の実例
- `semantic.css` §17 — Experience Motion Contract
