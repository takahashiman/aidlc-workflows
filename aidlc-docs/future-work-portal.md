# ポータル 将来作業メモ（次回 AI-DLC 開発用バックログ）

> 本ファイルは「次回以降の AI-DLC 開発」で着手する候補のメモ。今回の開発（最大目的＝
> 本システムが**別開発に利活用可能か**の検証）では実施しない。FIG-UDS の思想に則った
> コンポーネント群整備とポータルのブラッシュアップを将来図るための覚書。
>
> 最終更新: 2026-06-17（F-6 シェル収斂・shell CSS rolling 化・フォント CSP の直後）

---

## 背景（現時点のポータルの仕組み・着手前に把握すべきこと）

ポータルは Core（`FIG-Universal-Design-System`）から **rolling 取込**して構築する静的 SPA。
`portal/scripts/build.mjs` が以下を毎ビルド再生成する（pin しない＝BR-ROLL-3）:

- `importCore()` … Core の `primitives/semantic/deprecated-aliases.css` ＋ `tokens/` ＋
  `preview/` ＋ **シェル CSS `assets/portal.css`** を `portal/vendor/core/` へ無改変取込。
- `extractCoreContent()` … Core の自前サイト正典 `assets/js/portal-content.js`
  （`window.PortalContent = { SITEMAP, PAGES }`）を `node:vm` で実行して抽出し
  `portal/data/core-content.json` へ。内部リンク `#/core/…`→`#/overview/…` 書換。
  **実体の無い `preview/*.html` 参照は prune**（404 回避＝「未収録」表示へ）。
- 概要（`#/overview/...`）は Core 本文（PAGES）を Core の DOM 規約で描画
  （`portal/src/views.js` `renderCorePage()`／`portal.js` のシェル）。profile 連動
  （availability バナー・コード・a11y・端末幅）は `body.fig-profile-*` の **CSS 駆動**。

→ **重要**: Core 側に実体（preview HTML 等）を足せば、ポータルの改修なしに自動で反映される
設計。下記「未収録プレビュー」は基本 **Core リポジトリ側で作る**のが筋。

---

## 1. 軽微な挙動の修正

| # | 項目 | 所在 / 内容 | メモ |
|---|------|------------|------|
| B1 | Spec リンクが 404 | `views.js` `specHref()` が `vendor/core/components/*.spec.md` を指すが、`importCore()` は `components/` を vendor していない（`preview/` のみ） | 対応案: (a) `components/` も vendor する (b) spec をリンクでなくミュート文字列にする |
| B2 | コードのシンタックスハイライト無し | Core は Prism を使うがポータルは未ロード。`code-blocks` は素の `<pre>` | Prism を自己ホスト（CSP `script-src 'self'`・SRI）で導入すると Core と同等に |
| B3 | プロファイル変更時の iframe 再ロード | `portal.js` `applyProfileToFrames()` がプロジェクトデモ iframe の `?profile=` を更新→再ロード（軽いちらつき） | Core プレビュー（same-origin）は `contentDocument` の body class で連動済。デモ側も CSS 駆動に寄せられないか検討 |
| B4 | サイドバーの多段折りたたみの見た目 | projects は3階層（category>subcategory>product）でネスト。`portal.js` `renderSection()` 再帰 | インデント/階層表現の微調整余地 |
| B5 | パンくずが非リンク | `views.js` `breadcrumbs()` はプレーン `span`。Core はリンク | 上位階層へのリンク化 |
| B6 | 静的 OVERVIEW フォールバックの整理 | `content.js` の静的 `OVERVIEW` は `core-content.json` 常設なら実質デッドコード | 整理 or フォールバック専用として明示 |
| B7 | shell CSS の drift 検査 | `portal/assets/portal.css` は削除し `vendor/core/portal.css` に rolling 化済 | Core と byte 同一を build で検査する gate を足すと安心（任意） |
| B8 | 検索インデックスの拡充 | `portal.js` `buildSearchIndex()` は nav リーフのみ | Core PAGES の `description` も索引に含めると命中精度向上 |
| B9 | ~~Developer スコープ未露出~~ → ✅ 解決（§4-1 で Developer ガイドを画面化・2026-06-17） | `extensions` は方針どおり非露出のまま（プロジェクト集と重複） | — |
| B10 | フォントの完全自己ホスト化（任意） | 現状は CSP 緩和で Google Fonts 依存（`index.html` の CSP） | 完全オフライン/CDN非依存にするなら woff2 自己ホスト（過去検討の方針B）へ切替 |

---

## 2. 未収録ライブプレビューの作成

Core の `PAGES` が参照するが **Core 側に実体が無い** preview（22件）。現状はビルド時に
prune され「プレビュー未収録」表示。**Core リポジトリ `FIG-UDS/preview/<name>.html` に実体を
作れば**、ポータルの改修なしに自動でライブ表示へ切り替わる。

### 作成時の規約（既存 preview に倣う）
- 置き場所: `FIG-Universal-Design-System/preview/<下表のファイル名>`
- 参照 CSS: `../primitives.css` / `../semantic.css` / `../tokens/*.css`（相対・vendor 後も解決）
- profile 連動: `body` 直下に依存スタイルを置く（ポータルが iframe の `body` へ
  `fig-profile-*` を付与する＝`applyProfileToFrames()`）。`device-profiles.html` が参考。
- 実装根拠: 各コンポーネントの spec（下表 spec 列）を Single Source of Truth とする。

### 未収録一覧（route / 表示名 / 期待ファイル名 / spec）

| route (overview 配下) | 表示名 | 期待ファイル名 | spec |
|---|---|---|---|
| components-navigation/header | Header / Footer | preview/components-header.html | components/header.spec.md |
| components-navigation/navigation-rail | Navigation Rail | preview/components-navigation-rail.html | components/navigation-rail.spec.md |
| components-navigation/navigation-bar | Navigation Bar | preview/components-navigation-bar.html | components/bottom-navigation.spec.md |
| components-navigation/side-sheet | Side Sheet | preview/components-side-sheet.html | components/side-sheet.spec.md |
| components-navigation/bottom-sheet | Bottom Sheet | preview/components-bottom-sheet.html | components/bottom-sheet.spec.md |
| components-navigation/breadcrumb | Breadcrumb | preview/components-breadcrumb.html | components/breadcrumb.spec.md |
| components-navigation/pagination | Pagination | preview/components-pagination.html | components/pagination.spec.md |
| components-actions/fab | FAB | preview/components-fab.html | components/fab.spec.md |
| components-actions/segmented-button | Segmented Button | preview/components-segmented-button.html | components/segmented-button.spec.md |
| components-actions/icon-button | Icon Button | preview/components-icon-button.html | components/icon-button.spec.md |
| components-inputs/toggle-switch | Toggle Switch | preview/components-toggle-switch.html | components/toggle-switch.spec.md |
| components-inputs/checkbox | Checkbox | preview/components-checkbox.html | components/checkbox.spec.md |
| components-inputs/radio-button | Radio Button | preview/components-radio-button.html | components/radio-button.spec.md |
| components-inputs/picker | Date / Time Picker | preview/components-picker.html | components/picker.spec.md |
| components-inputs/form-group | Form Group | preview/components-form-group.html | components/form-group.spec.md |
| components-data/table | Table | preview/components-table.html | components/table.spec.md |
| components-data/accordion | Accordion | preview/components-accordion.html | components/accordion.spec.md |
| components-data/alert | Alert / Banner | preview/components-alert.html | components/alert.spec.md |
| components-data/toast | Toast / Snackbar | preview/components-toast.html | components/toast.spec.md |
| components-data/modal | Modal / Dialog | preview/components-modal.html | components/modal.spec.md |
| components-data/badge | Badge | preview/components-badge.html | components/badge.spec.md |
| components-data/icon-bubble | Icon Bubble | preview/components-icon-bubble.html | components/icon-bubble.spec.md |

> 注: 一覧は `portal/data/core-content.json`（PAGES）と `vendor/core/preview/` の差分から
> 機械的に再生成可能。Core 側で preview を増やすたびに件数は減る。

---

## 3. 中長期（思想に則ったコンポーネント整備）

- FIG-UDS の三層トークン（primitive→semantic→component）と 3 プロファイル
  （admin/consumer/terminal）の整合を保ったまま、未充足コンポーネントを Core へ拡充。
- ポータル自身を自社資源として循環（**FR-4.10**）: ポータルで使って不足が見つかった
  パーツは Showcase→Core 昇格フローへ還元（`#/ops/promotion`／`temp-part`・`core-promotion` ラベル）。

---

## 4. Developer ガイドの画面化 と 公開範囲の分離

> ✅ **実装済み（2026-06-17）**: 4-1（Developer ガイド画面化）を実装し、4-2 の公開範囲方針を採用。
> 下表のとおり結線（`corePage` の scope はテスト後方互換のため**末尾オプション引数**として追加）。
> `npm test` 33 PASS（developer 用 +7）、build で developer 8 ページの描画例外0・Developer
> パンくず付与を確認。`extensions` スコープは方針どおり**取込まない**。内容精査=機微情報
> （シークレット/PAT/権利者専用 GitHub 操作）の混入なしを確認済（公開=開発者向けガイドとして適切）。

> ライブ目視（2026-06-17）で、Core 自前サイト(index.html)にある **Developer 向け導入・運用
> ガイドがポータルに出ていない**と判明。データは取り込み済み（`core-content.json` の
> `developer/*` PAGES）だが、ポータルが `core` スコープしか画面化していないため。B9 を具体化。

### 4-1. Developer ガイドの画面化（`core`→概要 のミラー）✅ 実装済み
Core の `developer` スコープ（`SITEMAP.developer`）= **Developer Guide / guide** に 8 ページ:
`getting-started` / `asset-reference` / `integration` / `version-management` /
`migration` / `project-duplication` / `contribution` / `ai-co-creation`（全て `principle`=散文）。
`renderCorePage()` は scope 非依存なので描画はそのまま流用でき、IA/ルーティングの結線だけ:

| ファイル | 変更 |
|---|---|
| `portal/src/content.js` | `coreOverviewSections(cc)` を `coreScopeSections(cc, scope='core')` へ一般化。`SECTIONS` に `{ id:'developer', label:'Developer', route:'#/developer/guide/getting-started' }` 追加 |
| `portal/src/router.js` | `KINDS` に `'developer'` 追加 |
| `portal/src/nav.js` | `buildNav` の `developer` 子を `coreScopeSections(cc,'developer')` から生成（`overviewChildren` 一般化） |
| `portal/src/views.js` | `corePage(cc, scope, section, item)` に scope 引数追加（現状 `core/` 固定）。`renderOverview` を scope 対応 or `renderDeveloper` 追加 |
| `portal/src/portal.js` | `renderView` に `case 'developer'`、`titleFor` に項目追加（検索 index は navTree 走査で自動対象化） |

- `extensions` スコープ（busapp 等）はポータルの「プロジェクト集」と重複するため**取込まない**。
- 公開前に各ガイドの**内容精査**が必要（権利者確認）。

### 4-2. 公開範囲の分離（権利者向け運用 vs 一般利用）✅ 方針採用（2026-06-17）
**前提（重要）**: GitHub Pages（静的サイト）は**ページ単位のアクセス制御を持たない**。
「別ページにする」だけでは見えにくいだけで閲覧制限は**強制されない**（security by obscurity）。

**採用した方針（ユーザー決定 2026-06-17）**: 権利者向け（非エンジニアの詳細 GitHub 操作＝
`user-actions-checklist.md` 相当）は**ポータルに載せず `aidlc-docs/` のリポジトリ内ドキュメントと
して分離**（現状維持＝既に aidlc-docs/ にある）。Developer ガイド 8 ページは公開ポータルへ画面化
（4-1）。`extensions` スコープは取込まない。真の閲覧制限が必要になったら 4-3 で別途設計。

想定構成:
- **公開（全社員・開発者）**: 概要 / プロジェクト集 / 運用 / 使い方（一般利用フロー）/ **Developer ガイド**。
- **権利者向け（非エンジニアの詳細 GitHub 操作＝`user-actions-checklist.md` 相当）**: ポータルには載せず
  **`aidlc-docs/` のリポジトリ内ドキュメントとして分離**（private repo なら collaborator のみ閲覧）。
  ポータルに置く場合も nav 非表示の別ルート止まりで、**制限は効かない**点に留意。
- **真の閲覧制限が必要になったら（要対応・未検討）**: 認証付きホスティング（社内 SSO 背後 /
  GitHub Enterprise の private Pages / 別の gated デプロイ）。下記シークレット管理と一体で検討。

### 4-3. 認証・シークレット/パスワード管理（将来・未検討）
- 公開ポータルと権利者向け運用ページの**閲覧範囲を技術的に強制**する手段（認証/認可）。
- パスワード・トークン等の**シークレット管理方針**（誰がどこで保管・ローテーション・最小権限）。
  現状は GitHub の Secret/Variable（PORTAL_COLLECT_TOKEN 等）を都度設定しているのみ。
- これらは本サイクルでは検討しない（FR スコープ外）。次回サイクルで設計する。

## 関連
- 進捗の正典: `aidlc-docs/aidlc-state.md`
- 手動操作の進捗: `aidlc-docs/user-actions-checklist.md`（F-6 にシェル収斂/フォントの記録）
