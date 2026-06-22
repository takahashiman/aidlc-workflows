# Issue ドラフト — arrival-card preview 昇格（余白解消）

> ラベル: `core-promotion`, `temp-part`
> 起票先: FIG-UDS Core（`takahashiman/FIG-Universal-Design-System`）
> ⚠ 実起票はユーザー承認後（FDQ6-3=A）。本書はドラフト（LC-PromotionDraft）。

---

**Title**: [core-promotion] arrival-card のライブプレビュー整備（未整備「余白」の解消）

## 背景

製品（LLocana / BusDelayAlerts）で最重要のドメイン UX「到着予定カード（arrival-card）」は、Core に
**Pattern 仕様 `patterns/arrival-card.md` が既に存在**する。しかしポータルのカタログ上は
`core/patterns/arrival-card` の **`preview: null`**＝**ライブプレビュー未整備（未整備可視化「余白」ビューで赤判定）**
の状態だった。

運用→Core 昇格フロー（画像03③④）の実証として、この余白を埋める。

## 対象

- **arrival-card のライブプレビュー新規整備**（`preview/arrival-card.html`）。
- 仕様 `patterns/arrival-card.md` は既存・充実のため**無改変**（Core 正典尊重）。
- preview は **既昇格プリミティブの合成**で再構成: `card-fig`（コンテナ）＋ `status-pill`（運行状態・配色委譲）＋
  route-number badge ＋ arrival-time。状態サンプル＝normal / possible-delay / delayed / arriving / passed / suspended。

## 受け入れ観点

- [ ] preview は **生 HEX ゼロ**（`var(--...)` トークンのみ・他スタイル混入なし）
- [ ] 配色は `status-pill` の `--color-status-*` に委譲（arrival-card は独自配色を持たない）
- [ ] `portal-content.js` の `core/patterns/arrival-card` を `preview: null` → `preview: 'preview/arrival-card.html'`（余白→整備済）
- [ ] 三層 lint 緑 / VRT ベースライン生成 / a11y（axe serious・critical 0）
- [ ] 既存 spec・他 preview を無改変（後方互換・加算）

## スコープ外

- delay-banner / notification-sheet / route-selector / page-transition の preview（次段の余白として据置）。
- spec 本文の改変。22 件未収録ライブプレビュー（イニシアチブ スコープ外）。
