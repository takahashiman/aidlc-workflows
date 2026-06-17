# U2 Code Gen — Step3〜15 要約

> 生成先: `aidlc-workflows/portal/`（workspace root 直下サブツリー）。検証済み: `npm test`=16 pass / `node scripts/build.mjs`=成功。

## Step3 ビルドパイプライン（LC-B1〜7 / US-2.3）
- 作成: `portal/scripts/build.mjs`（Core 解決[pin しない]→tokens/components css を vendor/core へ無改変取込→registry/taxonomy を data/ へ→Prism 自己ホスト[将来]→JSON Schema 検証＋孤児/必須キー＋fail-fast→site/ 出力＋build-info.json）、`portal/scripts/dev-serve.mjs`（オフライン静的配信・SPA フォールバック）

## Step4 データ契約（FDQ6/NRQ9=A）
- 作成: `portal/schema/version-matrix.schema.json`・`portal/schema/showcase-index.schema.json`（VersionMatrixEntry/ShowcaseItem 準拠）
- 作成: `portal/data/{version-matrix,showcase-index,build-info}.json`（スタブ）＋ registry/taxonomy スナップショット

## Step5 IA 再編＋ルーター（FDQ2=A / PT-1,3）
- 作成: `portal/src/router.js`（parseRoute 純粋関数: overview/projects/ops/usage・view 既定 component・query 分離）、`portal/src/content.js`（概要/運用 静的 IA 4区分）、`portal/index.html`（CSP メタ・vendor/core 参照・module）、`portal/assets/portal-app.css`
- 旧 scope×section は概要配下へ写像、Extensions→プロジェクト集、昇格/版/CI→運用

## Step6 taxonomy 駆動サイドナビ（FDQ3=A / PT-2 / US-2.1）
- 作成: `portal/src/nav.js`（buildNav 純粋関数: 静的セクション ∪ taxonomy projects 枝・葉=直接リンク・名称昇順安定ソート・pending/temp-part badge）

## Step7 Project View 閲覧3形態（FDQ4=A / PT-4 / US-2.2）
- `portal/src/views.js` renderProjects: component/page/demo タブ・**sandbox iframe**＋profile/coreVersion query 伝播・demoUrl 不在/未登録時フォールバック・pending

## Step8 運用ビュー（FDQ6=A / PT-5,6）
- views.js renderVersionDashboard（table・status 可視化・空状態）/ renderShowcase（owner・種別明示・昇格提案導線・仮パーツ/Core昇格済み badge・空状態）

## Step9 使い方（FDQ8=A / PT-8 / US-2.7）
- 作成: `portal/src/usage.js`（GUIDES: portal-basics/view-modes/core-version/promotion/temp-part/feedback、目的→前提→手順→確認テンプレ、index＋個別描画）

## Step10 ドッグフーディング/仮パーツ（FDQ7=A / US-2.5）
- 仮パーツ badge・撤去判定（promotedToCore→撤去推奨）・昇格提案導線（views.js）
- 作成: `portal/.github/ISSUE_TEMPLATE/temp-part.md`・`core-promotion.md`（製品/template が採用する正典・自動起票は U5）

## Step11 UiState（FDQ9=A）
- 作成: `portal/src/state.js`（profile[既定admin]/coreVersionLabel を URL+localStorage 同期・解決順 URL>LS>既定・`.fig-profile-*` 付替・機密非保持）

## Step12 セキュリティ硬化（NRQ6/7=A / SEC-1〜6）
- index.html: CSP メタ＋referrer no-referrer / iframe sandbox+referrerpolicy（views.js）/ CDN 実行時依存排除（Prism は新 IA で不使用）/ URL/localStorage は UI 設定のみ

## Step13 テスト（NRQ8=A）
- 作成: `portal/tests/router.test.js`(9)・`portal/tests/nav.test.js`(7) = **16 pass**。parseRoute・buildNav の純粋関数を検証

## Step14 CI/CD（IDQ1/2/4=A / US-2.6）
- 作成: `.github/workflows/portal-deploy.yml`（triggers: push[portal/**]/repository_dispatch[core-released]/nightly/手動、build[validate→test→build→upload-pages-artifact]→deploy[deploy-pages]、build 失敗で deploy せず・concurrency pages）

## Step15 ドキュメント
- 作成: `portal/README.md`（構成/開発/rolling/IA/契約/セキュリティ）

## 移設チェック（infra deployment-architecture §7）消化
- [x] ポータル固有資産を portal/ へ移設（index.html/portal*.js/css は src・assets へ）
- [x] Core 実体は移設せずビルド時取込（vendor/core, BR-ROLL-3）
- [x] CDN 参照排除（Prism は新 IA で不使用・将来 vendor/prism+SRI）
- [x] schema/ に JSON Schema 追加
- [x] .github/workflows/portal-deploy.yml 追加
- [ ] **要ユーザー操作**: GitHub の Pages 設定を「GitHub Actions」ソースに切替／`CORE_DS_REPO`・`CORE_DS_REF` variables 設定／Core release workflow から `repository_dispatch(core-released)` 送信を配線

## ストーリー網羅（実装済み）
US-2.1(nav) / US-2.2(project view) / US-2.3(build rolling+CI) / US-2.4(IA4区分) / US-2.5(仮パーツ/Issue) / US-2.6(Pages workflow) / US-2.7(usage)
