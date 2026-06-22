# Functional Design Plan — U2-3 スタイル適用（Part 1）

> 対象 Unit: U2-3（BusDelayAlerts・状態色 semantic 化・生 HEX 解消）。component: C-Bridge 消費・semantic。
> ストーリー: US-D3（状態色 semantic 化）/ US-D4（生 HEX 解消）/ US-D7（before↔after 可視化）。
> 前提: U2-2 完了（Core submodule v1.2.1・bridge・signature/status 生成）。`[Answer]:` 記入後に Part 2 を生成。

## 回答確定（2026-06-22）
- **FDQ1=A**: 状態色は Tailwind `@theme` に status を追加→`bg-success`/`text-success` 等のユーティリティで適用。
- **FDQ2=A**: teal は `primary` ユーティリティ（`text-primary`/`bg-primary/10`/`border-primary/20`/`ring-primary/20`）へ機械置換。
- **FDQ3=A**: 主要導線（Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase 等）で生 HEX 0・周辺は次段許容。
- **FDQ4=A**: onTime→success / delayRisk・delayed→warning / suspended→danger / passed→neutral(muted)。旧 `src/styles/tokens/*` 撤去。

## 現状（実測・feature/figuds-adoption）
- **生 HEX 直書き**: src 配下 **283**（うち teal `#2C6B5E` = 230 行 / `[#2C6B5E]` 出現 **300**）。
- **teal の形**: ほぼ **arbitrary Tailwind クラス**＝`text-[#2C6B5E]` / `bg-[#2C6B5E]/10` / `border-[#2C6B5E]/20` / `ring-[#2C6B5E]/20`（opacity modifier 付き）。
- **状態色**: `StatusBadge.tsx` は Tailwind 既定 `bg-green-50 text-green-700`（normal）/ `amber`（delay）/ `red`（suspended）を直書き。
- **状態モデル**: `constants/statusConfigs.ts` が 5 状態（onTime/delayRisk/delayed/suspended/passed・label/icon 集中管理）を宣言。「配色は CSS 側 `--color-status-*` と 1:1」とコメント（旧内蔵 DS 由来）。
- **Core 供給**: 生成 `--signature-*`（teal）／`--status-{success,warning,danger}`(+surface/tint/on)。bridge で `--primary`→signature・`--destructive`→status-danger を対応済。

## 生成する成果物（Part 2）
- [ ] `construction/u2-3-style-application/functional-design/business-logic-model.md`（置換マッピングと適用フロー）
- [ ] `construction/u2-3-style-application/functional-design/business-rules.md`（BR-STYLE-*：teal置換／状態色対応／生HEX規約）
- [ ] `construction/u2-3-style-application/functional-design/frontend-components.md`（StatusBadge ほか対象・before↔after 検証）

---

## 質問（Part 1）

## Question FDQ1 — 状態色（normal/delay/suspended）の適用手段
StatusBadge 等の `green/amber/red` を Core status へどう寄せますか？

A) **Tailwind `@theme` に status を追加（bridge/theme で `--color-success: var(--status-success-surface)` 等）→ `bg-success text-success-foreground` 等のユーティリティで使う (推奨)** — teal 置換と同じ idiom・一括・コンポーネント書換最小。

B) **インライン `style` で `var(--status-*)` を直接参照** — 局所的・ユーティリティを増やさない。冗長。

C) **専用 util クラス（`.status-onTime` 等）を CSS に定義** — 中間。

[Answer]:

## Question FDQ2 — ブランド teal（`[#2C6B5E]` 300）の置換先
arbitrary クラス `text-[#2C6B5E]` / `bg-[#2C6B5E]/10` 等をどう置換しますか？

A) **Tailwind `primary` ユーティリティ（`text-primary` / `bg-primary/10` / `border-primary/20` / `ring-primary/20`）へ機械置換 (推奨)** — bridge で signature 解決・opacity modifier 維持・idiomatic・最小トークン。

B) **`var(--signature-base)` を直接参照（インライン/arbitrary）** — 明示的だが冗長・opacity 合成が手間。

[Answer]:

## Question FDQ3 — 「主要画面で生 HEX 0」の対象範囲（AC①-3）
どこまでを「主要画面で 0」の対象にしますか？

A) **主要導線（Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase 等の中核）で生 HEX 0・周辺（Profile/Settings/Onboarding 等）は次段許容 (推奨)** — AC①-3「主要画面で 0」に整合・回帰範囲を制御。

B) **src/app 全体で 0（全 283 を解消）** — 完全・dogfooding 最大成果だが大規模・回帰確認も増。

C) **状態色＋teal の中核のみ（数値目標は緩め）** — 最小。

[Answer]:

## Question FDQ4 — 5 状態（statusConfigs）→ Core status（3）対応 ＋ 旧 tokens 撤去
app の 5 状態を Core の success/warning/danger にどう写像し、旧内蔵 DS をどうしますか？

A) **onTime→success / delayRisk・delayed→warning / suspended→danger / passed→neutral(muted)。旧 `src/styles/tokens/{primitives,semantic}.css` は撤去（U2-2 で委譲済） (推奨)** — 意味の普遍性を保持・Core 改修不要・旧 DS を正式撤去。

B) **delayed は danger 寄りに（delayRisk→warning / delayed→danger）** — 遅延の深刻度を区別。

C) **5 状態維持のため Core に passed 等を増設（Core 改修）／旧 tokens 据え置き** — 表現は richest だが Core 改修・撤去先送り。

[Answer]:
