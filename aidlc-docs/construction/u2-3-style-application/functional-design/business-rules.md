# Business Rules — U2-3 スタイル適用

> 生 HEX 解消・状態色 semantic 化の正典。確定回答（FDQ1-4）に基づく。

## 状態色（US-D3 / AC①-2）

### BR-STYLE-1 — status は Tailwind @theme 経由（FDQ1=A）
- `--color-success/-warning/-danger`（＋`-foreground`）を `@theme` に定義し、値は Core `var(--status-*-surface)` / `var(--status-*-on)` 参照。
- これにより `bg-success` / `text-success-foreground` 等のユーティリティが Core 由来色で描画される。

### BR-STYLE-2 — 状態写像（FDQ4=A）
- onTime→success / delayRisk・delayed→warning / suspended→danger / passed→neutral(muted)。
- StatusBadge の 3 状態（normal/delay/suspended）＝success/warning/danger に対応。
- **配色は CSS（status トークン）、文言・アイコンは `statusConfigs.ts`**（既存方針を踏襲・1:1 対応）。

### BR-STYLE-3 — 状態の深刻度区別は非色手段で
- delayRisk と delayed はともに warning。深刻度差は**文言・アイコン**（statusConfigs）で表現（色の意味の普遍性を保つ）。

## ブランド色（teal）（US-D4 / AC①-3）

### BR-STYLE-4 — teal は primary ユーティリティへ機械置換（FDQ2=A）
- `text-[#2C6B5E]`→`text-primary` / `bg-[#2C6B5E]`→`bg-primary` / `…/10`→`…/10` / `border`/`ring` 同様。
- bridge（U2-2）で `--primary`=signature。**JSX 構造は変えず className のトークンだけ置換**。

### BR-STYLE-5 — 生 HEX 直書き禁止（主要画面で 0）
- 主要導線（Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase 等）の `src/app` で
  `#RRGGBB` 直書き・`[#...]` arbitrary を **0** にする（`var(--token)`／Tailwind ユーティリティへ）。
- 周辺画面（Profile/Settings/Onboarding 等）は次段許容（FDQ3=A）。

### BR-STYLE-6 — 非ブランド生 HEX の扱い
- teal 以外の生 HEX（slate 等の中立色）は、対応する Core semantic／既存 Tailwind スケールユーティリティへ寄せる。
  Core に対応が無い中立色は Tailwind 既定スケール（`slate-*` 等）を許容（生 HEX 直書きにしない）。

## 旧内蔵 DS（FDQ4=A）

### BR-STYLE-7 — 旧 tokens 撤去
- `src/styles/tokens/{primitives,semantic}.css` を**削除**し、`index.css` の参照を除去（U2-2 で Core へ委譲済）。
- 削除後も `vite build` 成功・主要画面非回帰であること（撤去の安全確認）。

## 検証（US-D7 / AC①-5）

### BR-STYLE-8 — before↔after 可視化
- `feature/figuds-adoption`（after）と `feature/home-redesign`（before）の diff で成果を提示。
- 主要画面の生 HEX 0・状態色が Core status・ブランドが signature を満たすことを自己ビジュアルで確認（U2-2 非回帰チェックリスト準拠）。

## トレーサビリティ
- AC①-2=BR-STYLE-1/2/3（US-D3）。AC①-3=BR-STYLE-4/5/6（US-D4）。AC①-5=BR-STYLE-8（US-D7）。旧 DS 撤去=BR-STYLE-7。
