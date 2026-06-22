# Tech Stack Decisions — U2-4/U2-5 ポータル IA・操作完結

> 確定 NQ1=B / NQ2=B / NQ3=A。初代ポータルの技術選定（vanilla JS SPA・hash router・軽量 Node ビルド・
> node:test・JSON Schema・GitHub Pages）を継承し、本ユニットの追加・変更のみ記す。

## 継承（変更なし）
- **ランタイム**: 依存ゼロの vanilla JS SPA（フレームワーク不採用）。hash router・純粋関数 render。
- **ビルド**: 軽量 Node（`scripts/build.mjs`）＝Core を rolling 取込し `data/*.json` 生成、静的サイト出力。
- **既存テスト**: `node --test`（純粋関数・現状 16+ 本）。
- **配布**: GitHub Pages（Actions artifact 直接デプロイ）。

## 本ユニットの追加・変更

### TSD45-1 — 新ランディング Home（vanilla 流儀）
- 新ルート kind `home`・`renderHome()` を既存 SPA 流儀（HTML 文字列を返す純粋関数）で実装。新依存なし。
- `DEFAULT_ROUTE='#/home'`。ブランドロゴ遷移先も Home。既存ルートは後方互換。

### TSD45-2 — シナリオ/操作ガイドは usage.js 流用
- シナリオA/②・新製品セットアップ・移行・GitHub 操作案内は `usage.js GUIDES` に追加し `renderGuide()` を流用。
  新ビュー・新依存なし。

### TSD45-3 — 未整備可視化ビュー（データ駆動）
- `renderBrowseMargin()` は `data/core-content.json` PAGES（template=component/pattern）と `page.preview`
  有無で整備済/未整備を判定。新規データ源・新依存なし（build が既に prune 済）。

### TSD45-4 — Playwright 新設（VRT＋a11y 一体・NQ1=B/NQ2=B）★ポータル初導入
- **`@playwright/test`** を portal の devDependency に追加（U2-3 製品側に続きポータルにも）。
- **VRT**: `toHaveScreenshot` で Home/ランディングを撮影・ベースライン CI(Linux) 管理。
- **a11y**: **`@axe-core/playwright`** を devDependency 追加し、同一 Playwright 実行で Home/主要新ビューに
  axe 検査（WCAG 2.1 AA 重大違反 0 を合否）。
- webServer: 既存 `scripts/dev-serve.mjs`（または build 出力の静的配信）を Playwright の webServer に接続。具体は Infra で確定。
- 代替案（不採用）: jsdom＋axe（ブラウザ無し・軽量）は VRT を兼ねられないため、VRT 採用に伴い Playwright へ一本化。
  Storybook+Chromatic（SaaS）は依存重・見送り（U2-3 と同判断）。

### TSD45-5 — CI 配線
- ポータル CI に VRT job ＋ a11y チェックを追加（Playwright install chromium・ベースライン Linux 真実源・
  失敗時 artifact upload）。既存 `node --test`／build／schema 検証は維持。workflow への集約方法（既存
  `portal-deploy.yml` 拡張 or 新規 CI workflow）は Infrastructure Design で確定。

### TSD45-6 — 性能（NQ3=A）
- 追加依存（Playwright/axe-core）はすべて devDependencies＝配布バンドル・Pages 成果物に非影響。
  初回 ≤2.5s/LH≧90 の既存目標を維持し監視のみ。

## 未確定（Infra へ送る）
- VRT 対象粒度（Home 必須＋余白/使い方インデックスの任意採否）。
- Playwright webServer の起動方式（dev-serve vs build 静的配信）。
- CI workflow の集約先（portal-deploy.yml 拡張 vs 新規）。
