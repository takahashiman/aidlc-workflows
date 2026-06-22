# Code Generation Plan — U2-4/U2-5 ポータル IA・操作完結（Part 1）

> 対象 repo: `aidlc-workflows/portal/`（本 repo 内・vanilla JS SPA）。brownfield in-place。
> 確定: PQ1-4／NQ1-3／IDQ45-1-3（全て前段で承認）。コミット/push はユーザー承認後。
> 検証: ローカル＝`npm test`（node）＋`npm run build`。VRT/a11y ベースラインは **CI(Linux) で初回生成**（IDQ45-2=A・ローカル生成しない）。

## 実装ステップ（10 step）

### S1 — router.js（新 kind home・DEFAULT_ROUTE）
- `KINDS` に `'home'` 追加。`parseRoute` は home を `{kind:'home', path, query, raw}` で返す（既存 generic 分岐で対応）。
- `DEFAULT_ROUTE = '#/home'` に変更。`createRouter().start()` の `location.replace(DEFAULT_ROUTE)` も home に。
- 既存の深いルートは parseRoute 不変＝後方互換（NRD45-REL-1）。

### S2 — content.js（役割入口・読む順番・余白定義 データ）
- `ROLE_ENTRIES`（役割→誘導先 固定定義・SP2）: 開発者/利用者/管理者。各 { id, label, desc, links:[{label,route}] }。
  管理者カードに権利者向け詳細操作は aidlc-docs 側である旨の注記（外部リンクでなく説明テキスト・NRD45-SEC-2）。
- `READING_ORDER`（はじめに読む順番・SP1）: ①Vision ②三層トークン/プロファイル ③シナリオ別ガイド ④主要操作。
- `HOME_QUICK_LINKS`（4操作クイックリンク）: 新製品セットアップ/移行/Core 昇格提案/バージョン参照→各 usage route。
- 余白ビューは overview 配下 `components/coverage` として扱う（renderOverview で分岐・S3）。

### S3 — views.js（renderHome / renderBrowseMargin / IALinking 注記）
- `renderHome(ctx)`: ROLE_ENTRIES 3カード（nav/landmark・見出し階層・キーボード可）＋READING_ORDER 番号リスト＋
  シナリオ入口（A★最優先/②）＋HOME_QUICK_LINKS。AC②-1 結線（4操作リンクを含む）。
- `renderBrowseMargin(ctx)`: `coreContent.PAGES` を走査し template∈{component,pattern} を抽出、`page.preview` 有無で
  整備済/未整備バッジ＋整備率（例 14/36）。coreContent 無し→「未収集」縮退（NRD45-REL-2）。esc() 徹底。
- `renderOverview` 内で `route.path = ['components','coverage']` を検出し `renderBrowseMargin(ctx)` を返す分岐を追加
  （既存 renderScopeView を壊さない・最小侵襲）。
- IALinking（SP5・軽量）: Developer ガイド描画（renderScopeView scope='developer'）末尾に運用ビュー（昇格/版管理）への
  相互リンク注記を1ブロック添える（本文は不変・注記のみ）。

### S4 — usage.js（シナリオ＋操作ガイド 5本追加・インデックス更新）
- GUIDES 追加（テンプレ 目的→前提→手順→確認・BR-PIA-4/10/11）:
  - `scenario-existing`（シナリオA・既存・★最優先・LLocana 実例リンク＝AC②-3）
  - `scenario-new`（シナリオ②・新規）
  - `new-product-setup`（新製品セットアップ）
  - `migration`（既存→Core 採用 移行）
  - `github-operations`（GitHub 操作・ツール非依存・US-X3）
- `usageIndex()` 更新: シナリオ2本を先頭・シナリオA に★最優先バッジ・「主要操作」グルーピング表示。
- 既存 `core-version`/`promotion` は据置（4操作の2つを充足）。

### S5 — portal.js（dispatch・titleFor・ロゴ・import）
- `renderView()` に `case 'home': return renderHome(ctx);`。`import { renderHome } ...`。
- `titleFor()` に `home: 'ホーム'`。
- ブランドロゴ `href` は既に `DEFAULT_ROUTE` 参照＝S1 で `#/home` に自動追従（変更不要・確認）。

### S6 — tests/ia.test.js（node 結線テスト・SP6/AC②-2）
- `parseRoute('#/home')` が home を返す／`DEFAULT_ROUTE==='#/home'`。
- GUIDES に5新規 key 存在＋`renderGuide()` が各 key を4節（目的/前提/手順/確認）で描画。
- `renderHome()` が3役割カード＋4クイックリンク（4操作 route）を含む。
- `renderBrowseMargin()` が coreContent モックで整備済/未整備を区別・整備率算出。
- **4操作セルフ検証結線**: 各操作（新製品セットアップ/移行/昇格提案/版参照）が Home/シナリオ導線→対応 GUIDES key→
  4節存在 まで到達できることをアサート（AC②-2）。
- `usageIndex()` がシナリオA を★先頭に出す。
- 既存 `nav.test.js`（上位4区分）は **不変で緑**（Home はナビ非追加・ロゴ遷移のみ）を確認。

### S7 — Playwright 新設（VRT＋a11y・IDQ45-1/2=B/A）
- `package.json`: devDependencies に `@playwright/test`・`@axe-core/playwright`。scripts に
  `test:vrt`（`playwright test tests/vrt`）・`test:a11y`（`playwright test tests/a11y`）。
- `scripts/serve-site.mjs`（新規・軽量静的サーバ＝`portal/site` 配信）。
- `playwright.config.js`: chromium・`webServer`=（build 済 site を serve-site で配信）・baseURL・
  `tests/vrt/__screenshots__/`・maxDiffPixelRatio 0.02。
- `tests/vrt/portal.spec.js`: Home `#/home`＋余白 `#/overview/components/coverage`＋使い方 `#/usage/portal-basics`
  を `toHaveScreenshot`（IDQ45-1=B）。
- `tests/a11y/portal.spec.js`: 上記＋主要新ビューで `@axe-core/playwright`・serious/critical 0（NRD45-A11Y-2）。
- `.gitignore`: Playwright 成果物（test-results/・playwright-report/）除外。`__screenshots__` は追跡（ベースライン）。

### S8 — portal-deploy.yml（quality job 追加・IDQ45-3=A）
- `build` job の後に `quality` job（needs: build・ubuntu・working-directory portal）追加:
  checkout（portal＋Core rolling）→setup-node 20→install→`npx playwright install --with-deps chromium`→
  `npm run build`→`npm run test:vrt`→`npm run test:a11y`→失敗時 artifact upload。
- `deploy` job の `needs` を `[build, quality]` に（品質ゲート通過時のみ deploy・fail-fast）。
- トリガ/権限は既存維持。

### S9 — 検証（ローカル）
- `npm test`（node 結線テスト＋既存緑）。`npm run build`（schema/integrity・site 生成成功）。
- VRT/a11y は **CI Linux で初回ベースライン生成・以後差分**（ローカルでは実行任意・ベースライン生成しない）。

### S10 — ドキュメント
- `construction/u2-4-5-portal-ia-ops/code/implementation-summary.md`。
- `dev-flow-journal.md` に Step（ポータル IA ブラッシュアップ・操作完結・VRT/a11y 新設）追記。
- state/audit 更新。

## スコープ境界（触らない）
- Core 本文 `portal-content.js` の組み替え（§4-4・将来 Core repo）。
- 22 件未収録 preview の作成（本サイクル スコープ外）。
- 認証/閲覧制限・シークレット管理（§4-3）。

## 影響ファイル一覧
- 変更: `portal/src/{router,content,views,usage,portal}.js`・`portal/package.json`・`.github/workflows/portal-deploy.yml`・`portal/.gitignore`。
- 新規: `portal/tests/ia.test.js`・`portal/playwright.config.js`・`portal/scripts/serve-site.mjs`・`portal/tests/vrt/portal.spec.js`・`portal/tests/a11y/portal.spec.js`・`portal/tests/vrt/__screenshots__/`（CI 生成）。

---

**承認後 Part 2（実装）着手。コミット/push はユーザー承認後。**
