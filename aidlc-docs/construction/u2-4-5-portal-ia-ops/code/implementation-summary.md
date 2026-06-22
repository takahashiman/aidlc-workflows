# Implementation Summary — U2-4/U2-5 ポータル IA・操作完結

> repo: `aidlc-workflows/portal/`（本 repo 内）。brownfield in-place。2026-06-22 実装。
> 確定: PQ1-4／NQ1-3／IDQ45-1-3。10 step 完了・ローカル検証 PASS。コミット/push はユーザー承認後。

## 実装結果（10 step）

| Step | 内容 | 結果 |
|---|---|---|
| S1 | router.js: `home` kind 追加・`DEFAULT_ROUTE='#/home'`・余白ルート文法をコメント明記 | ✅ |
| S2 | content.js: `ROLE_ENTRIES`（3役割）/`READING_ORDER`/`HOME_QUICK_LINKS`（4操作） | ✅ |
| S3 | views.js: `renderHome`／`renderBrowseMargin`（整備済/未整備＋整備率）／renderOverview に coverage 分岐／renderDeveloper に運用相互リンク注記（`opsCrosslinkNote`） | ✅ |
| S4 | usage.js: GUIDES 5本追加（scenario-existing★/scenario-new/new-product-setup/migration/github-operations）＋`usageIndex` グループ表示・★最優先先頭 | ✅ |
| S5 | portal.js: `renderView` に `case 'home'`・`titleFor` に home・`renderHome` import（ロゴは DEFAULT_ROUTE 追従で変更不要） | ✅ |
| S6 | tests/ia.test.js: parseRoute home・GUIDES 5・renderHome 3役割+4クイックリンク・renderBrowseMargin 整備区別・**4操作セルフ検証結線**・usageIndex★ | ✅ |
| S7 | Playwright 新設: package.json devDeps（@playwright/test・@axe-core/playwright）＋scripts（serve:site/test:vrt/test:a11y）・`scripts/serve-site.mjs`・`playwright.config.js`・`tests/vrt/portal.spec.js`・`tests/a11y/portal.spec.js`・`.gitignore` | ✅ |
| S8 | portal-deploy.yml: `quality` job 追加（build→VRT＋a11y→deploy）・deploy `needs:[build,quality]`（fail-fast） | ✅ |
| S9 | 検証: `npm test`＝**42 pass / 0 fail**・`npm run build` PASS・新規 CSS バンドル確認 | ✅ |
| S10 | docs: 本書＋dev-flow-journal 追記＋state/audit | ✅ |

## 主要な実装判断
- **Home はサイドナビ最上位に出さない**＝ブランドロゴ＝Home（`DEFAULT_ROUTE` 追従）。`nav.test.js` の上位4区分
  （overview/projects/ops/usage）固定を不変に保ち、玄人の最小クリックを温存（BR-PIA-1）。
- **余白ビューは overview 配下** `#/overview/components/coverage`＝renderOverview で分岐（既存 renderScopeView を壊さない最小侵襲）。
- **getting-started 責務分離は本文不変**＝Developer ガイド末尾に運用ビューへの相互リンク注記を IA レベルで追加（§4-4）。
- **整備率**: 実 core-content.json で **9/36**（component/pattern のうち preview 実体ありが 9）。22 件 preview 自体は作らない（スコープ尊重）。

## 検証ログ（ローカル）
- `npm test`: tests 42 / pass 42 / fail 0（既存 16+ に ia.test.js 追加・router.test.js の KINDS 定数を home 込みへ更新）。
- `npm run build`: フルビルド成功（Core 73 pages 抽出・preview prune 22・site/ 出力）。新規 IA CSS が `site/assets/portal-app.css` に同梱。
- **VRT/a11y は CI(Linux) で初回ベースライン生成・実行**（IDQ45-2=A・ローカルではベースライン生成しない）。

## 受け入れ条件トレース
- **AC②-1（主要4操作ポータル完結）**: Home クイックリンク→使い方ガイド（new-product-setup/migration/promotion/core-version）が結線テストで到達確認。
- **AC②-2（セルフ検証）**: ia.test.js の「4操作 結線テスト」で機械検証。
- **AC②-3（LLocana 実例導線）**: scenario-existing ガイドが LLocana/BusDelayAlerts を実例として参照。

## ⚠ 要ユーザー操作 / 後続
- **コミット/push はユーザー承認後**（本 repo aidlc-workflows・portal 変更＋aidlc-docs）。
- 初回 push 時に portal-deploy.yml の `quality` job が走り **VRT ベースラインを CI Linux で生成**（`tests/vrt/__screenshots__/` をコミット要・初回は baseline 不在で生成 or 承認）。
- `package-lock.json` は Playwright 追加分を未反映＝CI の `npm ci || npm install` が `npm install` 側で reconcile（既存パターン）。ローカルで `npm install` 実行時に lock 更新される。

## 影響ファイル
- 変更: `portal/src/{router,content,views,usage,portal}.js`・`portal/assets/portal-app.css`・`portal/package.json`・`portal/tests/router.test.js`・`.github/workflows/portal-deploy.yml`。
- 新規: `portal/tests/ia.test.js`・`portal/playwright.config.js`・`portal/scripts/serve-site.mjs`・`portal/tests/vrt/portal.spec.js`・`portal/tests/a11y/portal.spec.js`・`portal/.gitignore`。
