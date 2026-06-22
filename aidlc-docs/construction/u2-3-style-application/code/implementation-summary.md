# Code Generation Summary — U2-3 スタイル適用

> 製品 repo: `BusDelayAlerts`（`feature/figuds-adoption`・brownfield・aidlc-workflows の外）。
> 確定: FDQ1-4 全A / NQ1=B・NQ2=A・NQ3=A / IDQ1=A・IDQ2=A・IDQ3=C。

## 成果（メトリクス）
| 指標 | before | after |
|---|---|---|
| `src/app` 生 HEX 合計 | 379 | **152**（残りは全て周辺画面・対象外＝FDQ3=A 次段） |
| `[#2C6B5E]` 出現 | 300 | **112**（同上・周辺） |
| **主要導線 生 HEX** | 多数 | **0**（`npm run check:rawhex` 緑） |
| `vite build` | PASS | **PASS**（2087 modules・2.48s） |
| CSS gzip | 29.93 kB（U2-2） | 30.23 kB（+0.30 kB＝status/primary 派生ユーティリティ分・NQ3=A 予算なし） |
| JS gzip | ~202 kB | 202.07 kB（実質不変） |

## 変更ファイル
### Modified（製品コード）
- `src/styles/figuds-bridge.css` — `@theme inline` に status 写像（`--color-success/-warning/-danger`＋`-foreground`→`var(--status-*-surface/-on)`）＋ブランド派生（`--color-primary-dark/-light`→`var(--signature-dark/-light)`）を追加（BR-STYLE-1/6）。
- `src/app/components/StatusBadge.tsx` — `bg-green-50 text-green-700`→`bg-success text-success-foreground`／amber→warning／red→danger ＋ `data-testid="status-badge-{status}"`（BR-STYLE-1/2）。
- `src/app/constants/statusConfigs.ts` — 5→3 写像コメント更新（深刻度差は文言/アイコンで＝BR-STYLE-3）。
- 主要導線 tsx（teal→primary 機械置換・非 teal hex を token 化）:
  `RouteCard.tsx`・`RouteDetailScreen.tsx`・`BusSelector.tsx`・`StopSelector.tsx`・`MapSearchScreen.tsx`・`pages/Home.tsx`・`pages/TicketPurchase.tsx`。
- `src/styles/index.css` — 旧 tokens 撤去完了のコメント更新。
- `package.json` — `check:rawhex`／`test:vrt` script・`@playwright/test` devDep 追加。
- `.github/workflows/figuds-build.yml` — raw-hex guard step ＋ VRT job 追加（1 workflow 集約）。
- `.gitignore` — VRT 実行成果物（test-results/playwright-report 等）を除外（ベースライン `__screenshots__` は repo 管理）。

### Created
- `scripts/check-raw-hex.mjs` — 主要導線スコープの生 HEX/`[#...]` 検出ガード（NQ2=A・NRD3-MNT-1）。
- `playwright.config.ts` — VRT 設定（chromium・`tests/vrt/__screenshots__` ベースライン・maxDiffPixelRatio 0.02・vite dev webServer）。
- `tests/vrt/main-routes.spec.ts` — ページ（Home/TicketPurchase/MapSearch）＋コンポーネント（StatusBadge 各状態・RouteCard）VRT（IDQ3=C）。

### Deleted
- `src/styles/tokens/primitives.css`・`src/styles/tokens/semantic.css`（@import は U2-2 で除去済・Core へ完全委譲・BR-STYLE-7）。

## 設計判断（記録）
- **状態色の写像はコンポーネント既存の色系統を尊重**: StatusBadge `delay`（既存 amber）→warning、RouteCard/RouteDetailScreen `delay`「遅延発生/遅延確定」（既存 red）→danger。色の意味（success/warning/danger）を Core status へ semantic 化しつつ、視覚回帰を最小化（VRT ベースラインを意味のあるものに）。「遅延の可能性」は warning（amber）。
- **teal 派生の hex**（#23584d/#34796A/#1F5347）は signature ramp 由来 → `primary-dark`/`primary-light` ユーティリティ（bridge @theme 追加）で表現。hover/グラデーションの濃淡を保持。
- **中立 slate hex**（#94a3b8/#cbd5e1/#f8fafc/#E9EBEA）→ Core 中立トークン（`--color-text-disabled`/`--color-border-strong`/`--color-surface-container-low`）または Tailwind `slate-200`（BR-STYLE-6）。
- **rgba シャドウ**（`shadow-[0_8px_30px_rgba(44,107,94,0.2)]` 等）は `#hex`/`[#` 非該当のためガード対象外。シャドウトークン化は次サイクル候補。

## 検証
- [x] `vite build` 成功（gen:tokens 連鎖込み）。
- [x] 主要導線 生 HEX 0（`check:rawhex` 緑・11 ファイル）。
- [x] built CSS で `bg-success`→`var(--status-success-surface)`・`text-success-foreground`→`var(--status-success-on)`・`bg-warning/danger` 同様・`hover:bg-primary-dark`→`var(--signature-dark)`・`via-primary-light`/`to-primary-dark` を確認。
- [x] status トークン値（`--status-success-surface:#edf8f4` 等）が built CSS に存在。
- [ ] **VRT ベースライン**は CI(Linux) で初回生成・承認（IDQ1=A・ローカル未生成）。
- [ ] before↔after diff（`feature/figuds-adoption` vs `feature/home-redesign`）はレビューで提示。

## 残（次段・スコープ外）
- 周辺画面（Profile/SettingsNotifications/Onboarding/RegionSettings）＋非主要コンポーネント（PaymentView/CommuterPassCard/DeviceIllustrationWithRipple/Sidebar/App）の生 HEX 152・teal 112。raw-hex ガードのスコープ拡大で段階対応。
- 製品 repo の commit/push は**ユーザー承認後**（U2-2 未コミット分と合わせて）。
