# Infrastructure Design — U2-4/U2-5 ポータル IA・操作完結

> 確定 IDQ45-1=B / IDQ45-2=A / IDQ45-3=A。repo: `aidlc-workflows/portal/`。
> 既存 `portal-deploy.yml`（ubuntu・validate→npm test→build→Pages deploy・build 出力 `portal/site`）を拡張。
> Compute/Storage/Messaging/Networking N/A（静的 SPA・GitHub Pages）。

## 1. 論理コンポーネント → 実配置

| LC | 実ファイル（portal/） | 種別 |
|---|---|---|
| LC-Home | `src/views.js`（`renderHome`）＋`src/content.js`（`ROLE_ENTRIES` 等定数） | 既存拡張 |
| LC-RoleEntry | `src/content.js`（役割→誘導先 定数） | 既存拡張 |
| LC-ScenarioGuides | `src/usage.js`（GUIDES に `scenario-existing`/`scenario-new`） | 既存拡張 |
| LC-OpsGuides | `src/usage.js`（GUIDES に `new-product-setup`/`migration`/`github-operations`） | 既存拡張 |
| LC-CoverageView | `src/views.js`（`renderBrowseMargin`）＋`src/content.js`（余白ルート定義） | 既存拡張 |
| LC-Router | `src/router.js`（KINDS/parseRoute/DEFAULT_ROUTE）＋`src/portal.js`（renderView/titleFor/ロゴ href） | 既存拡張 |
| LC-IALinking | `src/views.js`（Developer 描画時の運用リンク注記）＋`src/usage.js`（相互リンク） | 既存拡張 |
| LC-Verify | `tests/*.test.js`（node）＋`playwright.config.js`＋`tests/vrt/*.spec.js`＋`tests/a11y/*.spec.js`＋`__screenshots__/` | 新設 |

## 2. ルート設計（確定）
- 新 kind `home`・`DEFAULT_ROUTE='#/home'`。ブランドロゴ→`#/home`。既存ルートは parseRoute で後方互換維持。
- 余白ビュー: `#/overview/components/coverage`（overview 配下の予約 item＝既存 renderScopeView を壊さず分岐）。
  ※実装時に独立ルートが綺麗なら Code Gen で再判断（FD/NFR で「Infra で確定」と明示済の軽微点）。

## 3. VRT＋a11y 基盤（Playwright 新設・IDQ45-1/2=B/A）

### 3.1 依存（devDependencies のみ）
- `@playwright/test`・`@axe-core/playwright` を `portal/package.json` の devDependencies に追加（配布非影響・NRD45-PERF-1）。
- npm scripts 追加例: `test:vrt`（playwright test）・`test:a11y`（同 config 内 project or 別 spec）。

### 3.2 webServer（IDQ45-2=A: build 出力静的配信）
- `playwright.config.js` の `webServer` で **`npm run build` 後の `portal/site` を静的配信**するコマンドを起動
  （例: `node scripts/serve-site.mjs`〔site 静的配信・新規軽量〕or 既存 dev-serve を site 指定で流用）。
  Pages artifact と同一出力＝本番同等の検査（NRD45-VRT-1）。
- baseURL を webServer に向け、`use: { ... }` chromium。

### 3.3 VRT 対象（IDQ45-1=B）
- `tests/vrt/portal.spec.js`: **Home`#/home`（必須）＋未整備可視化「余白」`#/overview/components/coverage`
  ＋使い方インデックス`#/usage/portal-basics`〔シナリオA★最優先表示〕** を `toHaveScreenshot`。
- ベースラインは **CI(Linux) で生成・repo 管理（`tests/vrt/__screenshots__/`）**（NRD45-VRT-3・OS 依存差回避）。
  ローカルは差分確認のみ。`maxDiffPixelRatio` 等しきい値は U2-3 同水準（0.02 目安）。

### 3.4 a11y 検査（IDQ45-2=A）
- `tests/a11y/portal.spec.js`: 同 webServer で Home/主要新ビューを開き `@axe-core/playwright` 実行。
  WCAG 2.1 AA 相当の **serious/critical 違反 0** を合否（NRD45-A11Y-2）。

### 3.5 node 結線テスト（SP6・AC②-2）
- `tests/ia.test.js`（node:test）: `parseRoute('#/home')`／GUIDES 5新規 key／`renderHome` 3役割＋4クイックリンク／
  `renderBrowseMargin` 整備区別／**4操作セルフ検証結線**（各操作: Home/シナリオ導線→GUIDES key→4節存在の到達）。
- 既存 `npm test`（`node --test tests/*.test.js`）に内包され緑を維持（後方互換）。

## 4. CI（IDQ45-3=A: portal-deploy.yml 拡張・1 workflow 集約）

既存 `portal-deploy.yml` に **品質 job を追加**し、build→品質ゲート→deploy の順に。VRT/a11y 失敗時は deploy しない（fail-fast）。

```
jobs:
  build:    （既存: validate→npm test→build→upload-pages-artifact）
  quality:  （新規）
    needs: build
    runs-on: ubuntu-latest      # Linux ベースライン真実源（NRD45-VRT-3）
    defaults: { run: { working-directory: portal } }
    steps:
      - checkout（portal＋Core rolling 取込：build job と同構成）
      - setup-node 20
      - npm ci || npm install
      - npx playwright install --with-deps chromium
      - npm run build           # portal/site 生成（webServer が配信）
      - npm run test:vrt        # Home＋余白＋使い方index VRT（ベースライン比較）
      - npm run test:a11y       # axe（AA serious/critical 0）
      - if failure: upload-artifact（diff スクショ／axe レポート）
  deploy:
    needs: [build, quality]     # 品質ゲート通過後のみ deploy（fail-fast）
```

- トリガは既存どおり（push/repository_dispatch core-released/nightly/手動）。
- 既存 build job の `npm test`（node 結線テスト内包）は維持。

## 5. ベースライン運用
- 初回 VRT ベースラインは **CI(Linux) で生成**しコミット（`tests/vrt/__screenshots__/`）。以後は差分検出。
- IA/見た目を意図的に変えた時はベースライン更新（`--update-snapshots`）を CI/承認フローで。

## 6. N/A
- Compute/Storage/Messaging/Networking／従来型基盤（queue/cache/CB/LB/DB）／Scalability/Availability＝N/A。
- Monitoring は CI 合否＋（任意）Lighthouse で十分（NRD45-PERF-1）。

## トレーサビリティ
- IDQ45-1=§3.3 / IDQ45-2=§3.2 / IDQ45-3=§4。NRD45-VRT/A11Y/MNT=§3。後方互換=§2/§3.5。
