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
| B9 | Developer/Extensions スコープ未露出 | `SITEMAP` には `extensions`/`developer` スコープ（Core 自前サイトの Developer ガイド等）があるが、ポータルは概要=`core` のみ写像 | 「使い方」等へ Developer ガイドを取込む余地 |
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

## 関連
- 進捗の正典: `aidlc-docs/aidlc-state.md`
- 手動操作の進捗: `aidlc-docs/user-actions-checklist.md`（F-6 にシェル収斂/フォントの記録）
