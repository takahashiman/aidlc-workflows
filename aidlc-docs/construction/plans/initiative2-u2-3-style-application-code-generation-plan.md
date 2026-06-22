# Code Generation Plan — U2-3 スタイル適用（単一の真実）

> 本プランは U2-3 Code Generation の唯一の真実源。承認後にこの順序で実装する。
> **Brownfield**: 既存ファイルは in-place 修正（コピー作成しない）。

## ユニット文脈
- **Workspace（製品 repo・マルチレポ・aidlc-workflows の外）**: `c:/work/AI-DLC/260618_DesignSystem/BusDelayAlerts`（branch `feature/figuds-adoption`）。
- **対象 story**: US-D3（状態色 semantic 化）/ US-D4（主要導線 生 HEX 0）/ US-D7（before↔after）。
- **依存（充足済）**: U2-1 Core C-Palette（status トークン）・U2-2 配布/ブリッジ（`figuds-bridge.css`・`--primary`=signature・`--destructive`=status-danger・Core pin v1.2.1）。
- **確定**: FDQ1-4 全A / NQ1=B(VRT)・NQ2=A(スコープ付き lint)・NQ3=A / IDQ1=A(CI Linux VRT)・IDQ2=A(CI raw-hex step)・IDQ3=C(VRT ページ＋コンポーネント)。

## 主要導線スコープ（FDQ3=A・本ユニットで 生 HEX 0）
- `src/app/components/StatusBadge.tsx`・`RouteCard.tsx`・`RouteDetailScreen.tsx`・`BusSelector.tsx`・`StopSelector.tsx`・`MapSearchScreen.tsx`
- `src/app/pages/Home.tsx`・`RouteDetail.tsx`・`MapSearch.tsx`・`TicketPurchase.tsx`
- `src/app/constants/statusConfigs.ts`（文言/アイコン・コメント）

## 周辺画面（次段許容・本ユニット対象外・raw-hex gate 除外）
- `src/app/pages/Profile.tsx`・`SettingsNotifications.tsx`・`Onboarding.tsx`・`RegionSettings.tsx`
- `src/app/components/PaymentView.tsx`・`CommuterPassCard.tsx`・`DeviceIllustrationWithRipple.tsx`・`Sidebar.tsx`・`RegionSelector.tsx`・`BusLineCard.tsx`・`figma/*`・`ui/*`
- `src/app/App.tsx`・`pages/Root.tsx`

## 実測ベースライン（生成前）
- `src/app` 生 HEX 計 **379**・`[#2C6B5E]` 出現 **300**。主要導線の非 teal hex＝teal 派生（#23584d/#1F5347/#34796A）・状態色（#D69E2E amber・#DC2626/#E53E3E/#EF4444 red・tinted #FFE8E8 等）・slate 中立（#94a3b8/#cbd5e1/#f8fafc/#E9EBEA）。

---

## 実装ステップ（番号順・各 [ ]）

### Step 1 — 状態色 @theme 写像（LC-StatusTheme・BR-STYLE-1）
- [ ] `src/styles/figuds-bridge.css` に `@theme inline` ブロックを追加（既存 `:root` は維持）:
  - `--color-success: var(--status-success-surface)` / `--color-success-foreground: var(--status-success-on)`
  - `--color-warning: var(--status-warning-surface)` / `--color-warning-foreground: var(--status-warning-on)`
  - `--color-danger:  var(--status-danger-surface)`  / `--color-danger-foreground:  var(--status-danger-on)`
- 効果: `bg-success`/`text-success-foreground` 等が Core status（AA 済み）で描画。status トークンは `src/styles/generated/status.css`（seed 生成）由来。
- story: US-D3。

### Step 2 — StatusBadge 状態色置換（LC-StatusMapping・BR-STYLE-1/2）
- [ ] `src/app/components/StatusBadge.tsx`:
  - normal: `bg-green-50 text-green-700` → `bg-success text-success-foreground`
  - delay: `bg-amber-50 text-amber-700` → `bg-warning text-warning-foreground`
  - suspended: `bg-red-50 text-red-700` → `bg-danger text-danger-foreground`
  - 各状態のルート要素に `data-testid`（`status-badge-{status}`）を付与（VRT/自動化用）。
- story: US-D3。

### Step 3 — statusConfigs 5→3 写像コメント（BR-STYLE-2/3）
- [ ] `src/app/constants/statusConfigs.ts`: 文言/アイコンは維持。コメントを Core status 写像（onTime→success・delayRisk/delayed→warning・suspended→danger・passed→neutral）に更新。深刻度差は文言/アイコンで表現する旨を明記。
- story: US-D3。

### Step 4 — teal→primary 機械置換（LC-BrandSubstitution・BR-STYLE-4）
- [ ] 主要導線スコープの全ファイルで `[#2C6B5E]` arbitrary を `primary` ユーティリティへ機械置換:
  - `text-[#2C6B5E]`→`text-primary` / `bg-[#2C6B5E]`→`bg-primary` / `border-[#2C6B5E]`→`border-primary` / `ring-[#2C6B5E]`→`ring-primary`
  - opacity modifier（`/10`・`/20` 等）は維持（Tailwind v4 color-mix）。JSX 構造は不変。
- story: US-D4。

### Step 5 — 主要導線の非 teal 生 HEX を token 化（BR-STYLE-5/6）
- [ ] teal 派生（#23584d/#1F5347/#34796A）→ `primary`（ブランド主色に集約）。
- [ ] 状態系 hex → status ユーティリティ: amber #D69E2E→`warning`系 / red #DC2626・#E53E3E・#EF4444→`danger`系 / tinted surface（#FFE8E8/#FFF5D1/#FFF8F8/#FFFCF2/#FFF0EB 等）→ `bg-{warning,danger,success}` の surface 相当。
- [ ] slate 中立（#94a3b8/#cbd5e1/#f8fafc/#E9EBEA）→ Tailwind 既定 slate スケールユーティリティ（`slate-400`/`slate-300`/`slate-50` 等・生 HEX 直書きにしない）。
- 目標: 主要導線スコープの `#RRGGBB` 直書き・`[#...]` arbitrary = **0**。
- story: US-D4。

### Step 6 — 生 HEX ガード script（LC-RawHexGuard・NRD3-MNT-1/2・IDQ2=A）
- [ ] `scripts/check-raw-hex.mjs` を新設: 主要導線 glob 限定で `#RRGGBB` / `[#...]` を検出しヒットで非0 exit（fail）。周辺画面は除外。
- [ ] `package.json` に `"check:rawhex": "node scripts/check-raw-hex.mjs"` を追加。
- story: US-D4。

### Step 7 — VRT 導入（LC-VRT・NRD3-VRT・IDQ1=A/IDQ3=C）
- [ ] `@playwright/test` を devDependency 追加・`playwright.config.ts` 新設（chromium・ベースライン dir `tests/vrt/__screenshots__`）。
- [ ] `package.json` に `"test:vrt": "playwright test"`（＋ベースライン更新は `--update-snapshots`）。
- [ ] `tests/vrt/` に spec 作成（IDQ3=C 両方）:
  - ページ: Home / RouteDetail（主要ルート遷移先）。
  - コンポーネント: StatusBadge（success/warning/danger 各）/ RouteCard / BusSelector。
- [ ] ベースライン画像は CI（Linux）で生成・repo 管理（IDQ1=A）。初回はローカル生成し CI で再生成/承認する旨をコメント。
- story: US-D7。

### Step 8 — 旧内蔵 DS 撤去（LC-LegacyRemoval・BR-STYLE-7）
- [ ] `src/styles/tokens/primitives.css`・`src/styles/tokens/semantic.css` を削除（`@import` は U2-2 で除去済＝コード参照なし・コメント1行のみ）。
- [ ] `src/styles/index.css` の「旧内蔵 DS（./tokens/*）…撤去は U2-3」コメントを撤去完了に更新。
- [ ] 削除後 `vite build` 成功・主要画面非回帰を Step 10 で確認。
- story: US-D4。

### Step 9 — CI 拡張（LC-Verify・IDQ1=A/IDQ2=A）
- [ ] `.github/workflows/figuds-build.yml` を拡張（1 workflow 集約）:
  - build job に **raw-hex guard step**（`npm run check:rawhex`・主要導線で fail）を追加。
  - **VRT job** 追加（`npx playwright install --with-deps chromium` → build/preview → `npm run test:vrt`・ベースライン差分で fail）。
- story: US-D4/US-D7。

### Step 10 — 検証・ドキュメント（BR-STYLE-8）
- [ ] `npm run gen:tokens` → `npm run build`（`vite build` 成功）。
- [ ] 主要導線スコープ 生 HEX 0（`npm run check:rawhex` 緑）。
- [ ] 状態色が Core status（success/warning/danger）・ブランドが signature（teal）で描画。
- [ ] CSS/JS gzip 増分を記録（旧 tokens 撤去で減方向見込み・NQ3=A）。
- [ ] `feature/figuds-adoption` vs `feature/home-redesign` の diff 観点を記録。
- [ ] `aidlc-docs/construction/u2-3-style-application/code/` に実装サマリ（modified/created 一覧・検証結果）を生成。
- [ ] `dev-flow-journal.md` に U2-3 知見（状態色 semantic 化・生 HEX 解消・VRT/lint 接続）を追記。

---

## 成果物（modified / created）
- **Modified**: `figuds-bridge.css`・`StatusBadge.tsx`・`statusConfigs.ts`・主要導線 tsx 群（teal/hex 置換）・`index.css`（コメント）・`package.json`（scripts/devDep）・`.github/workflows/figuds-build.yml`。
- **Created**: `scripts/check-raw-hex.mjs`・`playwright.config.ts`・`tests/vrt/**`・`tests/vrt/__screenshots__/**`。
- **Deleted**: `src/styles/tokens/{primitives,semantic}.css`。
- **Doc**: `aidlc-docs/construction/u2-3-style-application/code/implementation-summary.md`・`dev-flow-journal.md` 追記。

## 注意（commit/push）
- 製品 repo の commit/push は**ユーザー承認後**（U2-2 working tree 未コミット分と合わせて扱う）。生成物（`src/styles/generated/`）は gitignore 継続。
