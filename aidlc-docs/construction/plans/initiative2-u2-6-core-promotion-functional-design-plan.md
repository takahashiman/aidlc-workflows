# Functional Design Plan — U2-6 Core 昇格実行（ドメインパターン）

> 対象 Unit: **U2-6（Core 昇格実行・Critical Path）**。repo: **FIG-UDS Core（`../FIG-Universal-Design-System`）⇄ 製品（`../BusDelayAlerts`）跨ぎ**。
> component: C-Promo（＋C-Record 横断）。
> ストーリー: US-X1（運用→Core 昇格・S4=B）。AD2=C（Issue〔core-promotion〕导线＋preview/spec PR）。
> 完了条件: Core に新規コンポーネントが昇格・確認可能（画像03④）。他スタイル混入禁止。
> 前提: U2-3（製品スタイル蓄積＝semantic 化）完了済。Core push 済 v1.2.0/v1.2.1。

## 回答確定（2026-06-22・FD 質問ゲート）

- **FDQ6-1=A（昇格スコープ）**: **代表1パターンをフル実証**（end-to-end）。抽出→preview+spec→Issue/PR
  导线→昇格確認まで1パターンで完走し、dogfooding の「昇格フローが回る」ことを実証。残りは閲覧余白
  （U2-4/U2-5 で可視化済）として次段。
- **FDQ6-2=A（成果物形式）**: **`components/*.spec.md` ＋ `preview/*.html`**（Core 慣習通り）。Core は
  spec 駆動でコンポーネント実体コードを持たない。既存 spec と同一様式（目的/バリエーション/Props 契約/
  トークン参照/ルール/a11y/実装現況）。
- **FDQ6-3=A（GitHub 导线）**: **成果物生成＋导线を文書化**（実 push 無し）。Core 作業ブランチに spec/
  preview を配置し、Issue/PR 本文ドラフト（テンプレ・`core-promotion` ラベル）を成果物として用意。
  実 push/Issue/PR 作成はユーザー承認後（Q8=C セルフ運用・他 repo commit 承認制と整合）。
- **FDQ6-4=A（transport-domain-tokens）**: **昇格済として対象外**。Core preview に既存（`transport-domain-tokens.html`）。
  U2-6 は spec 未形式化の新規ドメインパターンに集中。

## 代表パターン選定 — `arrival-card`（到着予定カード）

選定根拠（FDQ6-1=A の「代表1」）:

1. **Core に等価物が存在しない真に新規のドメインパターン**。Core 既存の交通ドメイン資産＝`status-pill.spec.md`
   （運行状態）/ `card.spec.md` / `components-bus-card.html`・`components-pass-card.html` preview /
   `transport-domain-tokens.html`。**到着予定（arrival）コンポーネントは spec も preview も無い**。
2. **製品に濃いドメインデータモデルがある**（`arrivalData.ts` の `BusArrival`＝行先/発車予定/到着予定/
   遅延分/`stopsAway`〔N停留所先〕/`remainingMinutes`〔到着まで N分〕/`status`/`platform`/`scheduleTypes`〔平日・土曜・祝日ダイヤ〕）。
   spec 化の素材が豊富で、ドメイン固有の表示契約を明確に定義できる。
3. **既昇格プリミティブの合成として定義でき「他スタイル混入禁止」を体現**＝arrival-card = `card`（コンテナ）
   ＋ `status-pill`（運行状態）＋ ドメインフィールド（到着まで/停留所先/行先/ダイヤ種別）。昇格の理想形
   （製品ドメインパターンを Core 既存プリミティブ＋トークンで再構成）を実証する。
4. **不適候補の排除**: StatusBadge は Core 既存 `status-pill`（normal/possible/delay/suspended/passed の5状態）
   と重複＝既昇格の下流のため昇格させない（混入回避）。BusLineCard は `components-bus-card.html` preview と近接。
   route-selector/notification-sheet は Core 既存 `picker`/`bottom-sheet` の下流合成。

> 抽出元（製品）: `RouteCard.tsx`（getArrivals 消費・到着表示の主体）/ `BusLineCard.tsx`（行先・運行状態・
> 更新時刻の合成）/ `arrivalData.ts`（`BusArrival` ドメインモデル）。spec は Core のトークン/プリミティブで
> **理想形（生 HEX ゼロ・status-pill/card 合成）**を定義する（製品の現状 raw 値はそのまま持ち込まない）。

## 現状（実測）

- **Core 昇格先形式**: `components/<name>.spec.md` ＋ `preview/components-<name>.html`。実体コード無し（spec 駆動）。
  spec 冒頭は `design-system.md` の Design System Rules 参照を必須注記。
- **Core 既存ドメイン coverage**: spec＝status-pill のみがドメイン明示。preview＝bus-card/pass-card/
  status-pills/transport-domain-tokens。**arrival 系は spec/preview とも未整備（＝閲覧余白）**。
- **製品 BusArrival モデル**: 到着まで分・停留所先・行先・遅延分・ダイヤ種別・プラットフォーム・status 5値。
- **昇格导线**: AD2=C＝Issue（`core-promotion` ラベル）で提案 → PR で preview/spec 実体 → レビュー → マージ → 確認。
  ポータルには U2-4/U2-5 で `github-operations` ガイド＋`promotion` 使い方を整備済（导线の利用者向け案内は完了）。

## 生成する成果物（Part 2）

- [x] `construction/u2-6-core-promotion/functional-design/business-logic-model.md`（昇格パイプラインの振る舞い＋arrival-card ドメイン挙動）
- [x] `construction/u2-6-core-promotion/functional-design/business-rules.md`（BR-PROMO-*：パイプライン/混入禁止/AD2=C 导线／BR-ARR-*：arrival-card 契約）
- [x] `construction/u2-6-core-promotion/functional-design/promotion-target-spec.md`（arrival-card の Core spec 契約 FD＋Issue/PR ドラフト構成＝Code Gen で実体化）

---

## 質問（Part 1）— 回答済み

## Question FDQ6-1 — 昇格スコープ
A) **代表1パターンをフル実証（推奨）** / B) 中核2〜3 / C) RESUME POINT 全5 → **[Answer]: A**

## Question FDQ6-2 — 昇格成果物の形式
A) **spec.md＋preview.html（Core 慣習・推奨）** / B) spec.md のみ → **[Answer]: A**

## Question FDQ6-3 — GitHub 导线の実行レベル
A) **成果物生成＋导线を文書化（実 push 無し・推奨）** / B) 実 Issue＋PR を Core repo に作成 → **[Answer]: A**

## Question FDQ6-4 — 既存 transport-domain-tokens の扱い
A) **昇格済として対象外（推奨）** / B) spec.md で形式化 → **[Answer]: A**
