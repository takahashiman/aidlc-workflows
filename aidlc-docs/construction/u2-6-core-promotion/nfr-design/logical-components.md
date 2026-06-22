# Logical Components — U2-6 Core 昇格実行（ドメインパターン）

> 代表昇格 `arrival-card` の論理コンポーネント。SP6-1〜6 を実体化する単位。
> VRT/a11y/CI の**物理配置・workflow 実装は Infrastructure Design で確定**（本書は責務と依存まで）。採番＝LC-*。

## コンポーネント一覧

### LC-ArrivalSpec — `components/arrival-card.spec.md`（契約）
- 責務: arrival-card の Props 契約・バリエーション・トークン参照・ルール・a11y を Core 慣習で定義。
- 委譲: 配色は status-pill、面は card（自前トークンを持たない）。
- 対応: SP6-2/SP6-3 / NRD6-MNT-1/2・A11Y-1/3。

### LC-ArrivalPreview — `preview/components-arrival-card.html`（視覚正典）
- 責務: Default / Delayed / Approaching / Passed の静的状態ギャラリー。Core トークン参照で描画（生 HEX0）。
- 依存: `../primitives.css`＋`../semantic.css`、lucide CDN（既存パターン継承・NQ6-2=A）。
- 対応: SP6-3/SP6-2 / NRD6-REL-2・SEC-1。

### LC-StatusMapping — 状態写像（extractPattern の中核）
- 責務: 製品 `BusArrival.status`（ontime/delay/approaching/possible_delay/passed）→ status-pill status（normal/delay/possible/passed＋approaching 強調）の写像を定義。
- 配置: spec 内の記述＋preview の状態サンプルに反映（独立コードではない）。
- 対応: SP6-2 / business-logic-model §2。

### LC-PromotionDraft — Issue/PR 导线ドラフト
- 責務: `core-promotion` ラベル Issue 本文＋PR 本文のドラフト生成（背景/対象/受け入れ観点/Closes 参照）。
- 制約: 実 push/起票/PR/タグは承認後（FDQ6-3=A）。
- 対応: SP6-4 / NRD6-SEC-3。

### LC-CICheck — 既存 CI 正典への組込（再利用）
- 責務: arrival-card を既存 三層 lint（`_shared-guardrail`）と VRT（`_shared-vrt`＝`preview/` 対象）の検査範囲に載せる。
- 制約: 二重実装しない（BR-CI-NODUP-1）。VRT ベースラインは CI Linux 真実源。
- 対応: SP6-5 / NRD6-MNT-3・VRT-1・REL-2。

### LC-A11yCheck — 自動 a11y 検査（新設・既存基盤再利用）
- 責務: preview を実ブラウザ（既存 `ci/vrt` の Playwright/chromium 再利用）で axe 検査し serious/critical 0 をゲート。
- 物理配置: **Infra で確定**（候補 a＝独立 `ci/a11y/a11y-runner.mjs`＋`_shared-a11y.yml` reusable／候補 b＝`ci/vrt` 同居）。`@axe-core/playwright` を追加（CI devtool のみ）。
- 対応: SP6-6 / NRD6-A11Y-2・PERF-1・SEC-1/2。

### LC-Confirm — 昇格確認チェックリスト（confirmPromotion）
- 責務: マージ後、components 索引/`_core-gallery` 掲載・lint 緑・VRT 緑・a11y serious/critical 0・preview 描画 を確認。
- 対応: SP6-1/SP6-5/SP6-6 / NRD6-REL-2・BR-PROMO-6。

### LC-Record — 横断記録（C-Record / US-X4）
- 責務: dev-flow-journal Step 7（運用→Core 昇格フロー実証）＋セルフ検証チェックリスト（Q9=C）を追記。
- 対応: BR-REC-1。

## 依存関係

```
LC-StatusMapping ─┐
LC-ArrivalSpec ───┼─→ LC-ArrivalPreview ─→ LC-CICheck ─→ LC-A11yCheck ─→ LC-Confirm ─→ LC-Record
                  └─→ LC-PromotionDraft（Issue→PR 本文・preview/spec を参照）
```
- LC-ArrivalSpec / LC-StatusMapping が契約の根。LC-ArrivalPreview が視覚正典。
- LC-CICheck（既存再利用）と LC-A11yCheck（新設）が品質ゲート。LC-Confirm が昇格成立判定。

## 読込/実行順（Code Gen 想定）
1. LC-StatusMapping 確定 → 2. LC-ArrivalSpec 生成 → 3. LC-ArrivalPreview 生成（トークン描画・生HEX0 自己確認）→
4. LC-A11yCheck 機構追加（既存 Playwright 再利用）→ 5. LC-CICheck 配線（lint/VRT に含める）→
6. LC-PromotionDraft 生成 → 7. LC-Confirm チェックリスト → 8. LC-Record 追記。

## 検証観点（Infra/Code Gen へ申し送り）
- a11y runner の物理配置（独立 reusable か vrt 同居か）＝**Infra で確定**。
- VRT/a11y ベースライン・初回生成は CI Linux 真実源（ローカル未生成可）。
- 既存 spec/preview の無改変（後方互換）を diff で確認。
- 生 HEX ゼロを三層 lint で確認。
